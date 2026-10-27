// Automated approval gate (owner chose FULL AUTO publishing). Hourly + right after draft/portfolio open a PR.
// For each open engine/* PR not yet gated at its head sha:
//   1. confidentiality/secret lint  2. content-check (with status approved)  3. independent fresh Codex fact-check of
//   every claim against the stored evidence text (only all-`supported` passes)  4. CI checks green.
// Pass -> push approval, wait for CI, squash-merge, delete branch. Fail -> self-revise (content problems only, up to
// GATE_MAX_REVISIONS rounds, each revision re-linted locally before it is pushed) -> else hold: `needs-review` label,
// comment, and an issue assigned to the owner. Nothing failing is ever merged.
import { readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import * as GH from '../github.js';
import { complete, extractJson, BRAND } from '../llm.js';
import { parseDoc, setApproved, setDraft, AUTO_APPROVER } from '../content.js';
import { confidentialityLint } from '../lint.js';
import { evidenceByRefs } from '../evidence.js';
import { evidenceEntries, reviseArticle, buildFiles, localCheck, rawFromFiles } from '../article.js';
import { readRepoFile } from '../existing.js';
import { todayNY } from '../db.js';

export const autoPublish = (env = process.env) => String(env.AUTO_PUBLISH ?? 'true').toLowerCase() !== 'false';
export const maxRevisions = (env) => Math.max(0, Number(env.GATE_MAX_REVISIONS ?? 3));
const CONTENT_FILE = /^content\/(articles|projects)\/[a-z0-9-]+\.md$|^content\/social\/[a-z0-9-]+\/(linkedin|youtube)\.md$/;

export const FACT_SYSTEM = `You are a skeptical, independent fact-checker. You did not write this content and have no stake in it being published.
For each numbered claim, judge it ONLY against the evidence text given for it, not your own knowledge.
- "supported": the evidence directly backs the claim, with no larger magnitude, broader scope, stronger certainty or extra outcome than the evidence shows.
- "overstated": the evidence backs only a weaker or narrower version.
- "unsupported": the evidence does not back it or is too thin.
Then read the full text (body, answer, FAQ, social posts) and list every factual statement about outcomes, metrics, time saved, capabilities delivered, clients or results that is NOT covered by a listed claim. Do not list opinions, framing, questions, general context about the industry, calls to action, or restatements of a listed claim.
Also list any detail that looks like confidential client data (asset or property names, dollar figures, internal system names, people other than Nolan) that is not present in a PUBLIC evidence item.
Reply with JSON only: {"verdicts":[{"index":0,"verdict":"supported|overstated|unsupported","reason":"short"}],"unlisted":["..."],"confidential":["..."]}
Editorial rules for context:
${BRAND}`;

/** claims: [{text, evidence:[eid]}]; evidence: frontmatter entries; rows: DB evidence by ref. */
export async function factCheck({ claims, evidence, rows, fullText }, { env, db, log, completeImpl = complete }) {
  const byRef = new Map(rows.map((r) => [r.ref, r]));
  const verdicts = [];
  const items = [];
  claims.forEach((c, i) => {
    const ev = (c.evidence || []).map((id) => evidence.find((e) => String(e.id) === String(id))).filter(Boolean);
    const texts = ev.map((e) => byRef.get(String(e.ref))).filter(Boolean);
    const row = { claim: c.text, evidence: (c.evidence || []).join(','), verdict: 'unsupported', reason: '' };
    verdicts.push(row);
    if (!texts.length) { row.reason = 'cited evidence not found in the engine evidence store'; return; }
    items.push({ index: i, claim: c.text, evidence: texts.map((t) => `[${t.public ? 'public' : 'private'}] ${String(t.text).slice(0, 1500)}`) });
  });
  let unlisted = [], confidential = [];
  if (items.length) {
    const prompt = `Claims with their evidence:\n${JSON.stringify(items, null, 1)}\n\nAll listed claims:\n${JSON.stringify(claims.map((c) => c.text))}\n\nFull text to read:\n"""\n${String(fullText).slice(0, 24000)}\n"""`;
    const out = extractJson(await completeImpl(`${FACT_SYSTEM}`, prompt, { db, env, job: 'gate', log }));
    const by = new Map((out.verdicts || []).map((v) => [Number(v.index), v]));
    for (const it of items) {
      const v = by.get(it.index);
      const verdict = v && ['supported', 'overstated', 'unsupported'].includes(String(v.verdict).toLowerCase()) ? String(v.verdict).toLowerCase() : 'unsupported';
      verdicts[it.index].verdict = verdict;
      verdicts[it.index].reason = v ? String(v.reason || '') : 'no verdict returned';
    }
    unlisted = (out.unlisted || []).map(String).filter((s) => s.trim());
    confidential = (out.confidential || []).map(String).filter((s) => s.trim());
  }
  const ok = claims.length > 0 && verdicts.every((v) => v.verdict === 'supported') && !unlisted.length && !confidential.length;
  return { ok, verdicts, unlisted, confidential };
}

const cell = (s) => String(s ?? '').replace(/\|/g, '\\|').replace(/\s+/g, ' ').slice(0, 220);
export function gateReport(g) {
  return [
    ...g.checks.map((c) => `- ${c.ok ? '✅' : '❌'} **${c.name}**: ${cell(c.detail)}`),
    '', '### Fact-check verdicts',
    g.verdicts.length ? ['| # | Claim | Evidence | Verdict | Reason |', '|---|---|---|---|---|', ...g.verdicts.map((v, i) => `| ${i + 1} | ${cell(v.claim)} | ${cell(v.evidence)} | ${v.verdict === 'supported' ? '✅' : '❌'} ${v.verdict} | ${cell(v.reason)} |`)].join('\n') : '_No claims checked._',
    ...(g.unlisted.length ? ['', '**Statements not covered by a claim:**', ...g.unlisted.map((s) => `- ${cell(s)}`)] : []),
    ...(g.confidential.length ? ['', '**Possible confidential details:**', ...g.confidential.map((s) => `- ${cell(s)}`)] : [])
  ].join('\n');
}

const defaultDeps = () => ({ gh: GH.gh, withCheckout: GH.withCheckout, contentCheck: GH.contentCheck, commitAndPush: GH.commitAndPush, headSha: GH.headSha,
  upsertIssue: GH.upsertIssue, complete, readRepoFile, sleep: (ms) => new Promise((r) => setTimeout(r, ms)), now: () => Date.now() });

async function prFiles(pr, env, deps) {
  const files = await deps.gh('GET', `/repos/${GH.repoName(env)}/pulls/${pr.number}/files?per_page=100`, null, env);
  return files.filter((f) => f.status !== 'removed').map((f) => f.filename).filter((f) => CONTENT_FILE.test(f));
}

/** Runs checks 1-3 in the checkout. Leaves files approved on disk (caller pushes only on pass). */
export async function runChecks(dir, rels, { env, deps, db, log }) {
  const checks = [], verdicts = [], unlisted = [], confidential = [];
  const add = (name, ok, detail) => checks.push({ name, ok, detail });
  const files = {};
  for (const rel of rels) files[rel] = await readFile(path.join(dir, rel), 'utf8');
  const allEvidence = [];
  const docs = {};
  for (const rel of rels) {
    try { docs[rel] = parseDoc(files[rel]); } catch (e) { add(`parse (${rel})`, false, e.message); }
  }
  // Social files use their source article's evidence.
  for (const rel of rels) if (docs[rel] && Array.isArray(docs[rel].data.evidence)) allEvidence.push(...docs[rel].data.evidence);
  const rows = await evidenceByRefs(db, [...new Set(allEvidence.map((e) => String(e.ref)))]);
  const lint = confidentialityLint(files, { evidence: rows });
  add('confidentiality lint', lint.length === 0, lint.length ? lint.join('; ') : 'clean');

  for (const rel of rels.filter((r) => /^content\/(articles|projects)\//.test(r))) {
    const doc = docs[rel];
    if (!doc) continue;
    const slug = path.basename(rel, '.md');
    let claims = doc.data.claims || doc.data.outcomes || [];
    if (rel.startsWith('content/projects/')) {
      // Only outcomes this PR adds are fact-checked; existing ones were reviewed before.
      let base = null;
      try { base = await deps.readRepoFile(rel, { env }); } catch {}
      const old = base ? new Set((parseDoc(base).data.outcomes || []).map((o) => o.text)) : new Set();
      claims = (doc.data.outcomes || []).filter((o) => !old.has(o.text));
      if (!claims.length) { add(`fact-check (${slug})`, true, 'no new outcomes'); continue; }
    }
    const social = rels.filter((r) => r.startsWith(`content/social/${slug}/`)).map((r) => `--- ${r} ---\n${docs[r] ? `${docs[r].data.hook || ''}\n${docs[r].body}` : ''}`).join('\n');
    const d = doc.data;
    const fullText = [d.title, d.description, d.answer, d.summary, ...(d.faq || []).map((f) => `Q: ${f.q}\nA: ${f.a}`), doc.body, social].filter(Boolean).join('\n\n');
    let fc;
    try { fc = await factCheck({ claims, evidence: d.evidence || [], rows, fullText }, { env, db, log, completeImpl: deps.complete }); }
    catch (e) {
      if (e && e.defer) throw e; // Codex unavailable: re-gate later, never hold for that
      fc = { ok: false, verdicts: [], unlisted: [`fact-check error: ${e.message}`], confidential: [] };
    }
    verdicts.push(...fc.verdicts.map((v) => ({ ...v, slug })));
    unlisted.push(...fc.unlisted);
    confidential.push(...fc.confidential);
    const bad = fc.verdicts.filter((v) => v.verdict !== 'supported').length;
    add(`fact-check (${slug})`, fc.ok, fc.ok ? `${fc.verdicts.length}/${fc.verdicts.length} claims supported` : `${bad} of ${fc.verdicts.length} claims not supported; ${fc.unlisted.length} uncovered statement(s); ${fc.confidential.length} confidential flag(s)`);
  }
  const today = todayNY();
  for (const rel of rels.filter((r) => r.startsWith('content/articles/'))) await writeFile(path.join(dir, rel), setApproved(files[rel], today));
  const cc = await deps.contentCheck(dir);
  add('content-check', cc.ok, cc.detail);
  return { pass: rels.length > 0 && checks.every((c) => c.ok), checks, verdicts, unlisted, confidential, rows, files };
}

export async function waitForChecks(sha, { env, deps }) {
  const repo = GH.repoName(env);
  const timeout = Number(env.GATE_CI_TIMEOUT_MS || 20 * 60_000);
  const every = Number(env.GATE_CI_POLL_MS || 30_000);
  const start = deps.now();
  for (;;) {
    const r = await deps.gh('GET', `/repos/${repo}/commits/${sha}/check-runs?per_page=100`, null, env);
    const runs = (r && r.check_runs) || [];
    const bad = runs.filter((c) => c.status === 'completed' && !['success', 'neutral', 'skipped'].includes(c.conclusion));
    if (bad.length) return { state: 'failure', detail: bad.map((c) => `${c.name}: ${c.conclusion}`).join(', ') };
    if (runs.length && runs.every((c) => c.status === 'completed')) return { state: 'success', detail: runs.map((c) => c.name).join(', ') };
    if (deps.now() - start >= timeout) return { state: 'timeout', detail: runs.length ? 'checks still running' : 'no checks reported yet' };
    await deps.sleep(every);
  }
}

async function record(db, pr, { slugs = [], sha, outcome, checks = null, verdicts = null, detail = '' }) {
  await db.query('INSERT INTO gate_results (pr_number, slugs, head_sha, outcome, checks, verdicts, detail) VALUES ($1,$2,$3,$4,$5,$6,$7)',
    [pr.number, slugs.join(','), sha || null, outcome, checks ? JSON.stringify(checks) : null, verdicts ? JSON.stringify(verdicts) : null, String(detail).slice(0, 4000)]);
}

async function hold(db, pr, { env, deps, slugs, sha, why, report = '', checks, verdicts }) {
  const repo = GH.repoName(env);
  const owner = repo.split('/')[0];
  try { await deps.gh('POST', `/repos/${repo}/labels`, { name: 'needs-review', color: 'd73a4a' }, env); } catch {}
  await deps.gh('POST', `/repos/${repo}/issues/${pr.number}/labels`, { labels: ['needs-review'] }, env);
  await deps.gh('POST', `/repos/${repo}/issues/${pr.number}/comments`, { body: `**Held by the automated gate — not merged.** ${why}\n\n${report}\n\nPush a fix to the branch (the gate re-runs after a new commit) or close the PR.` }, env);
  await deps.upsertIssue({ title: `Engine PR #${pr.number} held for review`, label: 'needs-review', assignees: [owner],
    body: `@${owner} PR ${pr.html_url || '#' + pr.number} (${slugs.join(', ')}) was held by the automated gate.\n\n${why}\n\n${report}` }, env);
  await record(db, pr, { slugs, sha, outcome: 'held', checks, verdicts, detail: why });
  for (const s of slugs) await db.query("UPDATE articles SET status = 'held', updated_at = now() WHERE slug = $1 AND status <> 'published'", [s]);
  return { pr: pr.number, outcome: 'held', why };
}

async function finish(db, pr, { env, deps, sha, slugs }) {
  const repo = GH.repoName(env);
  const ci = await waitForChecks(sha, { env, deps });
  if (ci.state === 'timeout') return { pr: pr.number, outcome: 'approved', pending: `CI ${ci.detail}; retry next hourly run` };
  if (ci.state === 'failure') return hold(db, pr, { env, deps, slugs, sha, why: `CI checks failed: ${ci.detail}.` });
  try { await deps.gh('PUT', `/repos/${repo}/pulls/${pr.number}/merge`, { merge_method: 'squash', sha, commit_title: `${pr.title} (#${pr.number})` }, env); }
  catch (e) { return hold(db, pr, { env, deps, slugs, sha, why: `Merge failed: ${e.message.slice(0, 300)}` }); }
  try { await deps.gh('DELETE', `/repos/${repo}/git/refs/heads/${pr.head.ref}`, null, env); } catch {}
  for (const s of slugs) await db.query("UPDATE articles SET status = 'published', updated_at = now() WHERE slug = $1", [s]);
  for (const s of slugs) await db.query("UPDATE accomplishments SET status = 'published', updated_at = now() WHERE article_slug = $1", [s]);
  await record(db, pr, { slugs, sha, outcome: 'merged', detail: `CI green (${ci.detail}); squash-merged` });
  try {
    const open = await deps.gh('GET', `/repos/${repo}/issues?state=open&labels=needs-review&per_page=100`, null, env);
    const iss = (open || []).find((i) => i.title === `Engine PR #${pr.number} held for review` && !i.pull_request);
    if (iss) await deps.gh('PATCH', `/repos/${repo}/issues/${iss.number}`, { state: 'closed' }, env);
  } catch {}
  return { pr: pr.number, outcome: 'merged' };
}

const CONTENT_CHECKS = /^(confidentiality lint|fact-check \(|content-check)/;
export function revisable(g) {
  const failing = g.checks.filter((c) => !c.ok);
  if (!failing.length || failing.some((c) => !CONTENT_CHECKS.test(c.name))) return false;
  if (failing.some((c) => c.name === 'content-check' && /not present|npm ci failed/.test(c.detail))) return false; // infra, not content
  return !g.unlisted.some((u) => /^fact-check error:/.test(u));
}

/** Rewrites each article in the PR from the gate's feedback; returns null when the revision fails local lint. */
async function reviseInCheckout(dir, rels, g, { env, deps, db, log, round, branch }) {
  const articles = rels.filter((r) => r.startsWith('content/articles/'));
  if (!articles.length) return null;
  const today = todayNY();
  for (const rel of articles) {
    const slug = path.basename(rel, '.md');
    const files = {};
    for (const r of rels.filter((x) => x === rel || x.startsWith(`content/social/${slug}/`))) files[r] = setDraft(await readFile(path.join(dir, r), 'utf8'));
    const raw = rawFromFiles(files, slug);
    const evidence = raw.evidence || [];
    const rows = evidence.map((e) => g.rows.find((r) => r.ref === String(e.ref))).filter(Boolean);
    if (rows.length !== evidence.length) return null;
    const entries = evidenceEntries(rows);
    const feedback = [
      ...g.checks.filter((c) => !c.ok).map((c) => `${c.name}: ${c.detail}`),
      ...g.verdicts.filter((v) => v.slug === slug && v.verdict !== 'supported').map((v) => `claim "${v.claim}" is ${v.verdict}: ${v.reason}`),
      ...g.unlisted.map((u) => `statement not covered by a claim: ${u}`), ...g.confidential.map((u) => `possible confidential detail: ${u}`)
    ];
    const next = await reviseArticle({ raw, entries, feedback, db, env, log, job: 'gate', completeImpl: (s, p, o) => deps.complete(s + '\nReply with JSON only.', p, o).then(extractJson) });
    const built = buildFiles(next, { slug, entries, project: raw.project, today: raw.date || today, ...(raw.hero_image ? { heroImage: raw.hero_image } : {}) });
    const issues = localCheck(built.files, rows);
    if (issues.length) { log.log(`[gate] revision of ${slug} failed local lint; not pushed`); return { lintFailed: issues }; }
    for (const [r, t] of Object.entries(built.files)) await writeFile(path.join(dir, r), t);
    await db.query('UPDATE articles SET files = $2, updated_at = now() WHERE slug = $1', [slug, JSON.stringify(built.files)]);
  }
  await deps.commitAndPush(dir, branch, `Auto-revise from gate feedback (round ${round}/${maxRevisions(env)})`);
  return { sha: await deps.headSha(dir) };
}

export async function processPr(db, pr, { env = process.env, deps: d = {}, log = console } = {}) {
  const deps = { ...defaultDeps(), ...d };
  const repo = GH.repoName(env);
  const last = (await db.query('SELECT * FROM gate_results WHERE pr_number = $1 ORDER BY id DESC LIMIT 1', [pr.number])).rows[0];
  if (last && last.outcome === 'merged') return null;
  if (last && last.outcome === 'approved' && last.head_sha === pr.head.sha) return finish(db, pr, { env, deps, sha: last.head_sha, slugs: String(last.slugs || '').split(',').filter(Boolean) });
  if (last && last.outcome === 'held' && last.head_sha === pr.head.sha) return null; // waits for a new commit
  if (!autoPublish(env)) return null;
  const rounds = Number((await db.query("SELECT COUNT(*)::int AS n FROM gate_results WHERE pr_number = $1 AND outcome = 'revised'", [pr.number])).rows[0].n);
  const rels = await prFiles(pr, env, deps);
  const res = await deps.withCheckout(async (dir) => {
    const g = await runChecks(dir, rels, { env, deps, db, log });
    if (g.pass) {
      await deps.commitAndPush(dir, pr.head.ref, 'Auto-approve (gate passed)');
      return { ...g, sha: await deps.headSha(dir) };
    }
    if (rounds < maxRevisions(env) && revisable(g)) {
      try {
        const rv = await reviseInCheckout(dir, rels, g, { env, deps, db, log, round: rounds + 1, branch: pr.head.ref });
        if (rv && rv.sha) return { ...g, sha: rv.sha, revised: true };
        if (rv && rv.lintFailed) return { ...g, sha: pr.head.sha, reviseError: `revision failed local lint (${rv.lintFailed.slice(0, 3).join('; ')}); not pushed` };
      } catch (e) {
        if (e && e.defer) throw e;
        return { ...g, sha: pr.head.sha, reviseError: e.message.slice(0, 300) };
      }
    }
    return { ...g, sha: pr.head.sha };
  }, { branch: pr.head.ref, env });
  const slugs = [...new Set(rels.map((r) => r.startsWith('content/social/') ? r.split('/')[2] : path.basename(r, '.md')))];
  const report = gateReport(res);
  if (res.revised) {
    const failing = res.checks.filter((x) => !x.ok).map((x) => x.name).join(', ');
    await record(db, pr, { slugs, sha: res.sha, outcome: 'revised', checks: res.checks, verdicts: res.verdicts, detail: `round ${rounds + 1}: ${failing}` });
    await deps.gh('POST', `/repos/${repo}/issues/${pr.number}/comments`, { body: `**Auto-revising (round ${rounds + 1}/${maxRevisions(env)}).** Failing: ${failing}. The revision passed the local confidentiality lint before being pushed; re-checking now.\n\n<details><summary>What the gate found</summary>\n\n${report}\n</details>` }, env);
    const fresh = await deps.gh('GET', `/repos/${repo}/pulls/${pr.number}`, null, env);
    return processPr(db, fresh || { ...pr, head: { ...pr.head, sha: res.sha } }, { env, deps: d, log });
  }
  if (!res.pass) {
    return hold(db, pr, { env, deps, slugs, sha: pr.head.sha, report, checks: res.checks, verdicts: res.verdicts,
      why: `Failing: ${res.checks.filter((x) => !x.ok).map((x) => x.detail).join(' | ').slice(0, 600)} -- ${res.checks.filter((x) => !x.ok).map((x) => x.name).join(', ') || 'no content files in PR'}.${rounds ? ` Still failing after ${rounds} revision round(s).` : ''}${res.reviseError ? ` Auto-revision: ${res.reviseError}` : ''}` });
  }
  await deps.gh('POST', `/repos/${repo}/issues/${pr.number}/comments`, { body: `Approved by engine (automated gate passed): \`status: approved\`, \`approved_by: ${AUTO_APPROVER}\`. Merging once CI is green.\n\n${report}` }, env);
  await record(db, pr, { slugs, sha: res.sha, outcome: 'approved', checks: res.checks, verdicts: res.verdicts, detail: 'all gate checks passed' });
  return finish(db, pr, { env, deps, sha: res.sha, slugs });
}

export async function gateOne({ db, env = process.env, log = console, number, deps = {} }) {
  const gh = deps.gh || GH.gh;
  const pr = await gh('GET', `/repos/${GH.repoName(env)}/pulls/${number}`, null, env);
  return processPr(db, pr, { env, deps, log });
}

export async function run({ db, env = process.env, log = console, deps: d = {} }) {
  if (!GH.githubConfigured(env)) return { skipped: 'not configured: GITHUB_TOKEN' };
  if (!autoPublish(env)) return { skipped: 'AUTO_PUBLISH=false (engine PRs wait for a human)' };
  const deps = { ...defaultDeps(), ...d };
  const repo = GH.repoName(env);
  const prs = (await deps.gh('GET', `/repos/${repo}/pulls?state=open&per_page=100`, null, env)).filter((p) => p.head.ref.startsWith('engine/') && p.head.repo && p.head.repo.full_name === repo);
  const results = [], errors = [];
  let deferred = null;
  for (const pr of prs) {
    try { const r = await processPr(db, pr, { env, deps, log }); if (r) results.push(r); }
    catch (e) {
      if (e && e.defer) { deferred = e; results.push({ pr: pr.number, outcome: 'deferred', reason: e.message.slice(0, 200) }); continue; }
      errors.push(`PR #${pr.number}: ${e.message}`);
    }
  }
  if (errors.length) throw new Error(errors.join(' | '));
  if (deferred && !results.some((r) => r.outcome !== 'deferred')) throw deferred;
  return prs.length ? { checked: prs.length, results } : { skipped: 'no open engine PRs' };
}
