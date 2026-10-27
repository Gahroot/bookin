// Weekly: re-check claims of published engine articles (not audited in AUDIT_EVERY_DAYS, default 30) against the
// stored evidence with a fresh Codex fact-check. A failure opens a needs-review issue (the live page stays up).
import * as GH from '../github.js';
import { parseDoc } from '../content.js';
import { evidenceByRefs } from '../evidence.js';
import { readRepoFile } from '../existing.js';
import { factCheck } from './gate.js';

export async function run({ db, env = process.env, log = console, deps = {} }) {
  if (!GH.githubConfigured(env)) return { skipped: 'not configured: GITHUB_TOKEN' };
  const days = Number(env.AUDIT_EVERY_DAYS || 30), max = Number(env.AUDIT_MAX_PER_RUN || 2);
  const due = (await db.query(`SELECT slug FROM articles WHERE status = 'published' AND (audited_at IS NULL OR audited_at < now() - interval '${days} days') ORDER BY audited_at NULLS FIRST, slug LIMIT ${max}`)).rows;
  if (!due.length) return { skipped: 'no published articles due for audit' };
  const read = deps.readRepoFile || readRepoFile;
  const results = [];
  for (const { slug } of due) {
    const text = await read(`content/articles/${slug}.md`, { env });
    if (!text) { results.push({ slug, ok: false, reason: 'file not found on base branch' }); await db.query("UPDATE articles SET audited_at = now() WHERE slug = $1", [slug]); continue; }
    const { data, body } = parseDoc(text);
    const rows = await evidenceByRefs(db, (data.evidence || []).map((e) => String(e.ref)));
    const fc = await factCheck({ claims: data.claims || [], evidence: data.evidence || [], rows, fullText: [data.title, data.answer, ...(data.faq || []).map((f) => `${f.q}\n${f.a}`), body].join('\n\n') }, { env, db, log, ...(deps.complete ? { completeImpl: deps.complete } : {}) });
    await db.query('INSERT INTO claim_audits (slug, ok, detail) VALUES ($1,$2,$3)', [slug, fc.ok, JSON.stringify(fc).slice(0, 4000)]);
    await db.query('UPDATE articles SET audited_at = now() WHERE slug = $1', [slug]);
    if (!fc.ok) {
      const owner = GH.repoName(env).split('/')[0];
      const bad = fc.verdicts.filter((v) => v.verdict !== 'supported').map((v) => `- ${v.verdict}: ${v.claim} (${v.reason})`);
      await (deps.upsertIssue || GH.upsertIssue)({ title: `Audit: published article ${slug} needs review`, label: 'needs-review', assignees: [owner],
        body: `@${owner} the weekly audit re-checked \`content/articles/${slug}.md\` against its stored evidence and it no longer fully passes.\n\n${bad.join('\n')}${fc.unlisted.length ? `\n\nUncovered statements:\n${fc.unlisted.map((u) => `- ${u}`).join('\n')}` : ''}` }, env);
    }
    results.push({ slug, ok: fc.ok });
  }
  return { audited: results.length, results };
}
