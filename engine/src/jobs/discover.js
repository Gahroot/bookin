// Daily: Codex clusters new evidence into accomplishments: a real business problem solved + an outcome the evidence
// supports + evidence ids + project + an executive-relevance score 1-10 with rationale (rubric below). Only score >= 7
// is ever drafted. Clusters spanning several evidence items and days are preferred over single commits; tool-internal
// configuration and minor features score low. Deduped against existing accomplishments and every existing
// content/articles file (any status, drafts included) by evidence overlap and title similarity.
import { createHash } from 'node:crypto';
import { completeJson, BRAND } from '../llm.js';
import { jaccard } from '../content.js';
import { existingContent, coveredBy } from '../existing.js';
import { dateStr } from '../evidence.js';

export const fingerprint = (ids) => createHash('sha256').update([...ids].sort().join('\n')).digest('hex').slice(0, 32);
export const MIN_DRAFT_SCORE = 7;
const BATCH = 120;
const MAX_BATCHES = 3;

export const RUBRIC = `Executive-relevance score (integer 1-10). Imagine a COO, fund executive or operator reading the headline:
- 9-10: a costly operating problem solved for a business (decisions, risk, revenue, customer or investor experience, senior people's time), with a visible, evidenced outcome, built up across several evidence items and days.
- 7-8: a clear business problem and outcome such an executive would recognise in their own organisation, with solid evidence.
- 4-6: real but narrow work, mostly interesting to engineers or to users of one tool.
- 1-3: tool-internal configuration, billing/model/provider toggles, settings, refactors, dependency/CI/test work, copy tweaks, minor features or bug fixes.
Penalise thin evidence (a single commit) and anything whose only audience is developers.`;

const SYSTEM = `${BRAND}
You are an editor looking for stories worth telling executives. Group the evidence items into ACCOMPLISHMENTS: a concrete business problem that was solved, what changed, and an outcome that the evidence actually supports. Prefer clusters that span several evidence items and days (worklog outcomes plus the commits/PRs behind them) over single commits. Leave out routine maintenance and tool-internal details entirely unless they add up to a business outcome.
${RUBRIC}
For each accomplishment return: project (exactly as given), title (plain, specific, <= 90 chars, framed as the business problem or outcome, no product jargon), problem (1-2 sentences in business terms), outcome (1-2 sentences, only what the evidence supports, no invented numbers), evidence (array of evidence ids, at least 2 where possible), score (1-10 per the rubric), rationale (one sentence: why this score, naming who cares and why).
Do not return anything that duplicates an existing accomplishment or article listed. Returning nothing is fine.
Return {"accomplishments":[...]}.`;

/** Score from the model, adjusted in code: single-item clusters cap at 6, single-day clusters lose 1. */
export function adjustScore(raw, rows) {
  let s = Math.round(Number(raw));
  if (!Number.isFinite(s)) s = 1;
  if (s > 10) s = Math.round(s / 10); // a 0-100 reply
  s = Math.max(1, Math.min(10, s));
  const notes = [];
  if (rows.length < 2) { if (s > 6) notes.push('capped at 6: single evidence item'); s = Math.min(s, 6); }
  else if (new Set(rows.map((r) => dateStr(r.date))).size < 2 && !rows.some((r) => r.kind === 'worklog')) { s = Math.max(1, s - 1); notes.push('-1: single day, no worklog outcome'); }
  return { score: s, notes };
}

export function isDuplicate(acc, existing, threshold = 0.6) {
  for (const e of existing) for (const k of [e.title, e.primary_keyword, e.problem].filter(Boolean)) if (jaccard(acc.title, k) >= threshold) return e.title;
  return null;
}

async function batch({ db, env, log, deps, rows, accs, existing, articles }) {
  const prompt = `Existing accomplishments and articles (do not duplicate):\n${JSON.stringify(existing.map((e) => e.title))}\n\nNew evidence items:\n${JSON.stringify(rows.map((r) => ({ id: r.id, project: r.project, client: r.client, kind: r.kind, date: dateStr(r.date), text: String(r.text).slice(0, 500) })))}`;
  const out = await (deps.completeJson || completeJson)(SYSTEM, prompt, { db, env, job: 'discover', log });
  const known = new Map(rows.map((r) => [r.id, r]));
  const added = [], dupes = [];
  for (const a of Array.isArray(out && out.accomplishments) ? out.accomplishments : []) {
    const ids = [...new Set((a.evidence || []).map(String))].filter((id) => known.has(id));
    if (!a.title || !ids.length) continue;
    const ev = ids.map((id) => known.get(id));
    const projects = new Set(ev.map((r) => r.project));
    const project = projects.has(a.project) ? a.project : [...projects][0];
    const fp = fingerprint(ids);
    const covered = coveredBy(a, ev.map((r) => r.ref), articles, { jaccard });
    const dup = accs.some((x) => x.fingerprint === fp) ? 'same evidence' : covered ? `article ${covered.slug} (${covered.why})` : isDuplicate(a, existing);
    if (dup) { dupes.push({ title: a.title, duplicateOf: dup }); continue; }
    const { score, notes } = adjustScore(a.score, ev);
    const rationale = [String(a.rationale || '').trim(), ...notes].filter(Boolean).join(' | ').slice(0, 1000);
    const client = (ev.find((r) => r.project === project) || ev[0]).client;
    await db.query(`INSERT INTO accomplishments (fingerprint, project, client, title, problem, outcome, evidence_ids, score, exec_score, score_rationale)
      VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10) ON CONFLICT (fingerprint) DO NOTHING`,
    [fp, project, client, String(a.title).slice(0, 200), String(a.problem || '').slice(0, 1000), String(a.outcome || '').slice(0, 1000), JSON.stringify(ids), score * 10, score, rationale]);
    existing.push({ title: a.title, problem: a.problem });
    accs.push({ fingerprint: fp });
    added.push({ title: a.title, score });
  }
  const ids = rows.map((r) => r.id);
  await db.query(`UPDATE evidence SET discovered_at = now() WHERE id IN (${ids.map((_, i) => `$${i + 1}`).join(',')})`, ids);
  return { added, dupes };
}

export async function run({ db, env = process.env, log = console, deps = {} }) {
  const accs = (await db.query('SELECT title, problem, fingerprint FROM accomplishments')).rows;
  let content = { articles: [], projects: [] };
  try { content = await (deps.existingContent || existingContent)({ env }); } catch (e) { log.error('[discover] existing content', e.message); }
  const existing = [...accs, ...content.articles];
  const added = [], dupes = [];
  let seen = 0;
  for (let b = 0; b < MAX_BATCHES; b++) {
    const rows = (await db.query(`SELECT id, project, client, kind, title, text, date, ref, public FROM evidence WHERE discovered_at IS NULL ORDER BY project NULLS LAST, date NULLS LAST, id LIMIT ${BATCH}`)).rows;
    if (!rows.length) break;
    seen += rows.length;
    const r = await batch({ db, env, log, deps, rows, accs, existing, articles: content.articles });
    added.push(...r.added); dupes.push(...r.dupes);
  }
  if (!seen) return { skipped: 'no new evidence' };
  return { evidence: seen, added: added.length, draftable: added.filter((a) => a.score >= MIN_DRAFT_SCORE).length, accomplishments: added, duplicates: dupes };
}
