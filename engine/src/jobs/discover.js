// Daily: Codex clusters new evidence into accomplishments (business problem solved + supported outcome + evidence ids
// + project + executive-interest score). Deduped against existing accomplishments and existing site content
// (evidence fingerprint + Jaccard on titles).
import { createHash } from 'node:crypto';
import { completeJson, BRAND } from '../llm.js';
import { jaccard } from '../content.js';
import { existingContent } from '../existing.js';

export const fingerprint = (ids) => createHash('sha256').update([...ids].sort().join('\n')).digest('hex').slice(0, 32);
const MAX_ITEMS = 150;

const SYSTEM = `${BRAND}
You are an editor finding stories worth telling executives. Group the evidence items into ACCOMPLISHMENTS: a concrete business problem that was solved, what changed, and an outcome that the evidence text actually supports. Skip routine maintenance (dependency bumps, typos, refactors, CI tweaks) unless they add up to a business outcome.
For each accomplishment return: project (exactly as given), title (plain, specific, <= 90 chars, no hype), problem (1-2 sentences), outcome (1-2 sentences, only what the evidence supports, no invented numbers), evidence (array of evidence ids it rests on, at least 2 where possible), score (0-100: how interesting and credible this is to an executive buyer of AI systems; penalise thin evidence).
Do not return anything that duplicates an existing accomplishment or article listed.
Return {"accomplishments":[...]} (may be empty).`;

export function isDuplicate(acc, existing, threshold = 0.6) {
  for (const e of existing) {
    for (const k of [e.title, e.primary_keyword, e.problem].filter(Boolean)) {
      if (jaccard(acc.title, k) >= threshold) return e.title;
    }
  }
  return null;
}

export async function run({ db, env = process.env, log = console, deps = {} }) {
  const rows = (await db.query(`SELECT id, project, client, kind, title, text, date, public FROM evidence WHERE discovered_at IS NULL ORDER BY date NULLS LAST, id LIMIT ${MAX_ITEMS}`)).rows;
  if (!rows.length) return { skipped: 'no new evidence' };
  const accs = (await db.query('SELECT title, problem, fingerprint FROM accomplishments')).rows;
  let content = { articles: [], projects: [] };
  try { content = await (deps.existingContent || existingContent)({ env }); } catch (e) { log.error('[discover] existing content', e.message); }
  const existing = [...accs, ...content.articles];
  const prompt = `Existing accomplishments and articles (do not duplicate):\n${JSON.stringify(existing.map((e) => e.title))}\n\nNew evidence items:\n${JSON.stringify(rows.map((r) => ({ id: r.id, project: r.project, client: r.client, kind: r.kind, date: r.date instanceof Date ? r.date.toISOString().slice(0, 10) : r.date, text: String(r.text).slice(0, 500) })), null, 0)}`;
  const out = await (deps.completeJson || completeJson)(SYSTEM, prompt, { db, env, job: 'discover', log });
  const known = new Map(rows.map((r) => [r.id, r]));
  const added = [], dupes = [];
  for (const a of Array.isArray(out && out.accomplishments) ? out.accomplishments : []) {
    const ids = [...new Set((a.evidence || []).map(String))].filter((id) => known.has(id));
    if (!a.title || !ids.length) continue;
    const projects = new Set(ids.map((id) => known.get(id).project));
    const project = projects.has(a.project) ? a.project : [...projects][0];
    const fp = fingerprint(ids);
    const dup = accs.some((x) => x.fingerprint === fp) ? 'same evidence' : isDuplicate(a, existing);
    if (dup) { dupes.push({ title: a.title, duplicateOf: dup }); continue; }
    const client = known.get(ids.find((id) => known.get(id).project === project)).client;
    await db.query(`INSERT INTO accomplishments (fingerprint, project, client, title, problem, outcome, evidence_ids, score)
      VALUES ($1,$2,$3,$4,$5,$6,$7,$8) ON CONFLICT (fingerprint) DO NOTHING`,
    [fp, project, client, String(a.title).slice(0, 200), String(a.problem || '').slice(0, 1000), String(a.outcome || '').slice(0, 1000), JSON.stringify(ids), Math.max(0, Math.min(100, Number(a.score) || 0))]);
    existing.push({ title: a.title, problem: a.problem });
    accs.push({ fingerprint: fp });
    added.push(a.title);
  }
  const ids = rows.map((r) => r.id);
  await db.query(`UPDATE evidence SET discovered_at = now() WHERE id IN (${ids.map((_, i) => `$${i + 1}`).join(',')})`, ids);
  return { evidence: rows.length, added: added.length, titles: added, duplicates: dupes };
}
