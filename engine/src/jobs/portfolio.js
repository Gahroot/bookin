// Weekly: refresh content/projects/<slug>.md — bump `updated` where there is new evidence and append outcomes from
// published (already gate-verified) accomplishments, with their evidence entries. Goes through the same
// lint -> content-check -> PR -> gate path. Never creates project files (the site owns those).
import { readFile, writeFile, access } from 'node:fs/promises';
import path from 'node:path';
import * as GH from '../github.js';
import { todayNY } from '../db.js';
import { parseDoc, serializeDoc } from '../content.js';
import { evidenceByIds, dateStr } from '../evidence.js';
import { evidenceEntries } from '../article.js';
import { confidentialityLint } from '../lint.js';
import { autoPublish, gateOne } from './gate.js';

const defaultDeps = () => ({ withCheckout: GH.withCheckout, contentCheck: GH.contentCheck, commitAndPush: GH.commitAndPush, gh: GH.gh, gate: gateOne });
const exists = (p) => access(p).then(() => true, () => false);

/** Adds an outcome + its evidence (renumbered after the file's existing E ids) to a project doc. */
export function addOutcome(data, text, rows) {
  const ev = Array.isArray(data.evidence) ? [...data.evidence] : [];
  let n = ev.reduce((m, e) => Math.max(m, Number(String(e.id).replace(/\D/g, '')) || 0), 0);
  const ids = [];
  for (const { entry } of evidenceEntries(rows)) {
    const same = ev.find((e) => e.ref === entry.ref);
    if (same) { ids.push(same.id); continue; }
    n++;
    ev.push({ ...entry, id: `E${n}` });
    ids.push(`E${n}`);
  }
  return { ...data, outcomes: [...(data.outcomes || []), { text, evidence: ids }], evidence: ev };
}

export async function run({ db, env = process.env, log = console, deps: d = {} }) {
  if (!GH.githubConfigured(env)) return { skipped: 'not configured: GITHUB_TOKEN' };
  const deps = { ...defaultDeps(), ...d };
  const today = todayNY();
  const accs = (await db.query(`SELECT a.* FROM accomplishments a WHERE a.status = 'published' AND a.project IS NOT NULL
    AND NOT EXISTS (SELECT 1 FROM portfolio_outcomes p WHERE p.project = a.project AND p.accomplishment_id = a.id) ORDER BY a.id`)).rows;
  const fresh = (await db.query("SELECT DISTINCT project FROM evidence WHERE project IS NOT NULL AND fetched_at > now() - interval '7 days'")).rows.map((r) => r.project);
  const projects = [...new Set([...accs.map((a) => a.project), ...fresh])].sort();
  if (!projects.length) return { skipped: 'no new evidence or published accomplishments' };
  const branch = `engine/portfolio-${today}`;
  const out = await deps.withCheckout(async (dir) => {
    const changed = [], added = [], evidenceRows = [];
    for (const project of projects) {
      const rel = `content/projects/${project}.md`;
      if (!(await exists(path.join(dir, rel)))) continue;
      const { data, body } = parseDoc(await readFile(path.join(dir, rel), 'utf8'));
      let next = { ...data, updated: today };
      for (const a of accs.filter((x) => x.project === project)) {
        const rows = await evidenceByIds(db, typeof a.evidence_ids === 'string' ? JSON.parse(a.evidence_ids) : a.evidence_ids);
        if (!rows.length || !a.outcome) continue;
        next = addOutcome(next, String(a.outcome).trim(), rows);
        evidenceRows.push(...rows);
        added.push({ project, id: a.id });
      }
      if (dateStr(data.updated) === today && !added.some((x) => x.project === project)) continue;
      await writeFile(path.join(dir, rel), serializeDoc(next, body));
      changed.push(rel);
    }
    if (!changed.length) return { changed };
    const files = {};
    for (const rel of changed) files[rel] = await readFile(path.join(dir, rel), 'utf8');
    const lint = confidentialityLint(files, { evidence: evidenceRows });
    if (lint.length) return { changed, blocked: `local lint failed: ${lint.join('; ')}` };
    const cc = await deps.contentCheck(dir);
    if (!cc.ok) return { changed, blocked: cc.detail };
    await deps.commitAndPush(dir, branch, `Portfolio refresh ${today}`);
    return { changed, added, pushed: true };
  }, { env });
  if (!out.changed.length) return { skipped: 'no project files to update' };
  if (!out.pushed) { log.error(`[portfolio] not pushed: ${out.blocked}`); return { skipped: `not pushed: ${String(out.blocked).slice(0, 400)}` }; }
  const pr = await deps.gh('POST', `/repos/${GH.repoName(env)}/pulls`, { title: `Portfolio refresh ${today}`, head: branch, base: GH.BASE_BRANCH(env),
    body: `Engine portfolio refresh: ${out.changed.join(', ')}.\n\nNew outcomes come from published, gate-verified accomplishments. The gate fact-checks every new outcome against its evidence before merging.` }, env);
  for (const a of out.added) await db.query('INSERT INTO portfolio_outcomes (project, accomplishment_id, pr_number) VALUES ($1,$2,$3) ON CONFLICT DO NOTHING', [a.project, a.id, pr.number]);
  const r = { pr: pr.number, files: out.changed, outcomes: out.added.length };
  if (autoPublish(env)) {
    try { r.gate = await deps.gate({ db, env, log, number: pr.number }); }
    catch (e) { r.gate = e && e.defer ? { deferred: e.message } : { error: e.message.slice(0, 300) }; }
  }
  return r;
}
