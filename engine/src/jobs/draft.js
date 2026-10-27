// Mon + Thu: top unwritten accomplishment -> article + LinkedIn + YouTube files + hero image.
// Confidentiality lint + content checks run LOCALLY first; then content-check in a checkout; only a clean draft is
// ever pushed to the public repo. A draft that keeps failing is dropped (never pushed).
import { mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';
import * as GH from '../github.js';
import { todayNY } from '../db.js';
import { evidenceByIds } from '../evidence.js';
import { evidenceEntries, writeArticle, reviseArticle, buildFiles, localCheck } from '../article.js';
import { completeJson } from '../llm.js';
import { generateHero } from '../image.js';
import { existingContent } from '../existing.js';
import { autoPublish, gateOne } from './gate.js';

export const LOCAL_ROUNDS = 2;
const B64 = 'base64:';

export async function writeFilesTo(dir, files) {
  for (const [rel, content] of Object.entries(files)) {
    const p = path.join(dir, rel);
    await mkdir(path.dirname(p), { recursive: true });
    await writeFile(p, content.startsWith(B64) ? Buffer.from(content.slice(B64.length), 'base64') : content);
  }
}

/** Writes + locally self-revises. Returns { ok, raw, built, issues }. */
export async function produce({ acc, entries, rows, project, today, slug, raw: start, feedback = [], db, env, log, completeImpl, rounds = LOCAL_ROUNDS }) {
  let raw = start || await writeArticle({ acc, entries, db, env, log, completeImpl });
  let issues = feedback;
  for (let round = 0; ; round++) {
    if (issues.length) {
      if (round > rounds) break;
      raw = await reviseArticle({ raw, entries, feedback: issues, db, env, log, completeImpl });
    }
    const built = buildFiles(raw, { slug, entries, project, today });
    issues = localCheck(built.files, rows);
    slug = slug || built.slug;
    if (!issues.length) return { ok: true, raw, built, issues };
    if (round >= rounds) return { ok: false, raw, built, issues };
  }
  return { ok: false, raw, built: null, issues };
}

const defaultDeps = () => ({ withCheckout: GH.withCheckout, contentCheck: GH.contentCheck, commitAndPush: GH.commitAndPush, gh: GH.gh,
  completeJson, generateHero, existingContent, gate: gateOne });

export async function run({ db, env = process.env, log = console, deps: d = {} }) {
  if (!GH.githubConfigured(env)) return { skipped: 'not configured: GITHUB_TOKEN (needed to open the article PR)' };
  const deps = { ...defaultDeps(), ...d };
  const today = todayNY();
  // Reuse a draft produced by an earlier attempt (no double Codex spend), else write a new one.
  let art = (await db.query("SELECT * FROM articles WHERE status IN ('pending','blocked') AND kind = 'article' ORDER BY created_at LIMIT 1")).rows[0];
  let content = { articles: [], projects: [] };
  try { content = await deps.existingContent({ env }); } catch (e) { log.error('[draft] existing content', e.message); }
  const projectSlugs = new Set(content.projects.map((p) => p.slug));
  let acc;
  if (!art) {
    acc = (await db.query("SELECT * FROM accomplishments WHERE status = 'open' ORDER BY score DESC, id LIMIT 1")).rows[0];
    if (!acc) return { skipped: 'no open accomplishments (discover has nothing new)' };
    const ids = typeof acc.evidence_ids === 'string' ? JSON.parse(acc.evidence_ids) : acc.evidence_ids;
    const rows = await evidenceByIds(db, ids);
    if (!rows.length) { await db.query("UPDATE accomplishments SET status = 'dropped', status_reason = 'evidence missing', updated_at = now() WHERE id = $1", [acc.id]); return { skipped: 'accomplishment evidence missing' }; }
    const entries = evidenceEntries(rows);
    const res = await produce({ acc, entries, rows, project: projectSlugs.has(acc.project) ? acc.project : null, today, db, env, log, completeImpl: deps.completeJson });
    if (!res.ok) {
      await db.query("UPDATE accomplishments SET status = 'dropped', status_reason = $2, updated_at = now() WHERE id = $1", [acc.id, `local lint failed: ${res.issues.join('; ').slice(0, 900)}`]);
      log.log(`[draft] dropped accomplishment ${acc.id}: local lint failed`);
      return { dropped: acc.id, reason: 'failed local confidentiality/content lint after self-revision; nothing pushed', issues: res.issues.slice(0, 10) };
    }
    let slug = res.built.slug;
    if ((await db.query('SELECT 1 FROM articles WHERE slug = $1', [slug])).rows.length || content.articles.some((a) => a.slug === slug)) slug = `${slug}-${today.replace(/-/g, '')}`;
    let files = buildFiles(res.raw, { slug, entries, project: projectSlugs.has(acc.project) ? acc.project : null, today }).files;
    // Hero image (optional per contract; the site falls back to a generated OG image).
    let heroNote = 'hero image added';
    try {
      const webp = await deps.generateHero({ title: res.raw.title, theme: acc.problem }, { env, db });
      files = buildFiles(res.raw, { slug, entries, project: projectSlugs.has(acc.project) ? acc.project : null, today, heroImage: `/images/articles/${slug}.webp` }).files;
      files[`public/images/articles/${slug}.webp`] = B64 + webp.toString('base64');
    } catch (e) { heroNote = `no hero image (${String(e.message).slice(0, 120)})`; log.error(`[draft] hero image: ${e.message}`); }
    await db.query(`INSERT INTO articles (slug, accomplishment_id, title, kind, status, files, evidence_map, status_reason) VALUES ($1,$2,$3,'article','pending',$4,$5,$6)`,
      [slug, acc.id, res.raw.title, JSON.stringify(files), JSON.stringify({ raw: res.raw, ids }), heroNote]);
    await db.query("UPDATE accomplishments SET status = 'drafted', article_slug = $2, updated_at = now() WHERE id = $1", [acc.id, slug]);
    art = (await db.query('SELECT * FROM articles WHERE slug = $1', [slug])).rows[0];
  }
  return publishDraft(art, { db, env, log, deps, today, projectSlugs });
}

const asObj = (v) => (typeof v === 'string' ? JSON.parse(v) : v);

/** content-check in a checkout of the base branch; push + PR only when it passes. */
export async function publishDraft(art, { db, env, log, deps, today, projectSlugs }) {
  let files = asObj(art.files);
  const map = asObj(art.evidence_map) || {};
  const slug = art.slug;
  const branch = `engine/${slug}`;
  const acc = (await db.query('SELECT * FROM accomplishments WHERE id = $1', [art.accomplishment_id])).rows[0];
  const rows = await evidenceByIds(db, map.ids || []);
  const entries = evidenceEntries(rows);
  // Last line of defence: re-lint exactly what would be pushed.
  const textFiles = Object.fromEntries(Object.entries(files).filter(([, v]) => !v.startsWith(B64)));
  const pre = localCheck(textFiles, rows);
  if (pre.length) {
    await db.query("UPDATE articles SET status = 'dropped', status_reason = $2, updated_at = now() WHERE slug = $1", [slug, pre.join('; ').slice(0, 1000)]);
    return { dropped: slug, reason: 'local lint failed; nothing pushed', issues: pre.slice(0, 10) };
  }
  const out = await deps.withCheckout(async (dir) => {
    await writeFilesTo(dir, files);
    let cc = await deps.contentCheck(dir);
    if (!cc.ok && cc.errors.length && acc && map.raw) {
      // One Codex revision from the validator's own errors, then re-lint locally before anything is pushed.
      const res = await produce({ acc, entries, rows, slug, project: projectSlugs.has(acc.project) ? acc.project : null, today, raw: map.raw, feedback: cc.errors, db, env, log, completeImpl: deps.completeJson, rounds: 1 });
      if (!res.ok) return { pushed: false, drop: true, detail: `content-check: ${cc.detail}; revision failed local lint: ${res.issues.join('; ')}` };
      const hero = Object.keys(files).find((k) => k.endsWith('.webp'));
      files = { ...res.built.files, ...(hero ? { [hero]: files[hero] } : {}) };
      if (hero) files = { ...buildFiles(res.raw, { slug, entries, project: projectSlugs.has(acc.project) ? acc.project : null, today, heroImage: `/images/articles/${slug}.webp` }).files, [hero]: files[hero] };
      await writeFilesTo(dir, files);
      cc = await deps.contentCheck(dir);
      await db.query('UPDATE articles SET files = $2, evidence_map = $3, updated_at = now() WHERE slug = $1', [slug, JSON.stringify(files), JSON.stringify({ ...map, raw: res.raw })]);
    }
    if (!cc.ok) return { pushed: false, drop: cc.errors.length > 0, detail: cc.detail };
    const pushed = await deps.commitAndPush(dir, branch, `Draft: ${art.title}`);
    return { pushed, detail: cc.detail };
  }, { env });
  if (!out.pushed) {
    const status = out.drop ? 'dropped' : 'blocked';
    await db.query('UPDATE articles SET status = $2, status_reason = $3, updated_at = now() WHERE slug = $1', [slug, status, String(out.detail).slice(0, 1000)]);
    if (out.drop && acc) await db.query("UPDATE accomplishments SET status = 'dropped', status_reason = 'content-check failed', updated_at = now() WHERE id = $1", [acc.id]);
    log.log(`[draft] ${slug} ${status}: ${String(out.detail).slice(0, 200)}`);
    return { [status]: slug, reason: `${out.detail} (nothing pushed)` };
  }
  const repo = GH.repoName(env);
  const claims = (map.raw && map.raw.claims) || [];
  const pr = await deps.gh('POST', `/repos/${repo}/pulls`, { title: `Article: ${art.title}`, head: branch, base: GH.BASE_BRANCH(env),
    body: `Engine draft from accomplishment #${art.accomplishment_id}.\n\n- Local confidentiality/secret lint: passed\n- content-check: passed\n\n### Claims\n${claims.map((c) => `- ${c.text} (${(c.evidence || []).join(', ')})`).join('\n')}\n\nThe automated gate fact-checks every claim against the stored evidence text, then merges on pass (AUTO_PUBLISH).` }, env);
  await db.query("UPDATE articles SET status = 'draft', pr_number = $2, pr_url = $3, branch = $4, updated_at = now() WHERE slug = $1", [slug, pr.number, pr.html_url, branch]);
  const r = { slug, pr: pr.number, url: pr.html_url };
  if (autoPublish(env)) {
    try { r.gate = await deps.gate({ db, env, log, number: pr.number }); }
    catch (e) { if (e && e.defer) r.gate = { deferred: e.message }; else { r.gate = { error: e.message.slice(0, 300), retry: 'next hourly gate run' }; log.error(`[gate] PR #${pr.number}: ${e.message}`); } }
  }
  return r;
}
