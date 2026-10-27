// Codex-only LLM access. Every AI call runs `codex exec` on the owner's ChatGPT subscription. There is no paid
// fallback: when Codex is logged out, at its usage limit, or over the weekly runaway cap, a DeferError is thrown and
// the scheduler retries the slot hourly. Transient errors are retryable (scheduler backoff, then engine-alert).
import { codexBlock, runCodex, handleFailure, recordSuccess } from './codex.js';
import { recordUsage } from './db.js';
import { DeferError } from './mode.js';

export async function complete(system, prompt, { db, env = process.env, job = 'adhoc', now = new Date(), log = console } = {}) {
  const block = await codexBlock(db, { env, now });
  if (block) throw new DeferError(`codex unavailable: ${block}`);
  try {
    const r = await runCodex(system ? `${system}\n\n---\n\n${prompt}` : prompt, { env });
    await recordUsage(db, { job, provider: 'codex', model: env.CODEX_MODEL || 'codex-default', ...r.usage });
    await recordSuccess(db);
    return r.text;
  } catch (e) {
    const h = await handleFailure(db, e, { env, now });
    log.error(`[codex] ${job} failed (${h.kind})`);
    if (h.kind === 'usage' || h.kind === 'auth') throw new DeferError(`codex ${h.kind === 'usage' ? 'usage limit' : 'login'} problem: ${String(e.message).slice(0, 200)}`);
    throw Object.assign(new Error(String(e.message).slice(0, 400)), { retryable: true });
  }
}

export function extractJson(text) {
  try {
    const fenced = String(text).match(/```(?:json)?\s*([\s\S]*?)```/);
    const raw = fenced ? fenced[1] : String(text);
    const start = raw.search(/[[{]/);
    const end = Math.max(raw.lastIndexOf('}'), raw.lastIndexOf(']'));
    if (start < 0 || end < start) throw new Error('LLM did not return JSON');
    return JSON.parse(raw.slice(start, end + 1));
  } catch (e) {
    throw Object.assign(e instanceof Error ? e : new Error(String(e)), { maxAttempts: 2 }); // one retry for a bad reply
  }
}

export async function completeJson(system, prompt, opts) {
  return extractJson(await complete(`${system}\nReply with JSON only.`, prompt, opts));
}

export const BRAND = `Context: nolangrout.com is the site of Nolan Grout, who builds AI-powered business systems and AI agents for enterprises (real estate funds, operators). Readers are executives: asset managers, COOs, founders, operators. Public client names you may use: Triten, Black Mountain Fund, Anchor Mill Group, Back2SleepNow, Prestyj, EZ Coder. Write as Nolan (first person is fine).
Hard rules:
- Executive focus: business problem -> what changed -> outcome -> what it means for the reader. No tutorials, no how-to code, no generic AI commentary or hype.
- Every outcome, metric, time saved or capability statement must be a listed claim citing evidence ids, and must be supported by that evidence text. Never invent numbers, clients, people, quotes or results.
- CONFIDENTIAL: never include source code, file paths, repository internals, secrets, internal hostnames/URLs, client asset/property names, dollar figures, financials, or names of people other than Nolan, unless the exact detail appears in an evidence item marked public. Describe private systems at the level of business capability.
- Worklog session counts and active minutes include unattended AI agent runs: never present them as hours Nolan worked, as effort, or as time saved.
- No fenced code blocks. No URLs except public evidence URLs and the public client sites.`;
