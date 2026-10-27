// GitHub REST (fetch) + git CLI helpers. The token is only ever passed via env/URL to git, never logged.
import { execFile } from 'node:child_process';
import { mkdtemp, rm, access } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { promisify } from 'node:util';

const run = promisify(execFile);

export const repoName = (env = process.env) => env.GITHUB_REPO || 'Gahroot/bookin';
export const githubConfigured = (env = process.env) => Boolean(env.GITHUB_TOKEN);

export async function gh(method, route, body, env = process.env) {
  const res = await fetch(`https://api.github.com${route}`, {
    method,
    headers: { authorization: `Bearer ${env.GITHUB_TOKEN}`, accept: 'application/vnd.github+json', 'x-github-api-version': '2022-11-28', 'user-agent': 'nolangrout-engine', ...(body ? { 'content-type': 'application/json' } : {}) },
    body: body ? JSON.stringify(body) : undefined,
    signal: AbortSignal.timeout(60_000)
  });
  if (res.status === 204) return null;
  const text = await res.text();
  if (!res.ok) throw new Error(`GitHub ${method} ${route} -> ${res.status}: ${text.slice(0, 300)}`);
  return text ? JSON.parse(text) : null;
}

const scrub = (s, env) => String(s).split(env.GITHUB_TOKEN || '\u0000').join('***');

export async function git(cwd, args, env = process.env) {
  try {
    const { stdout } = await run('git', args, { cwd, env: { ...process.env, GIT_TERMINAL_PROMPT: '0' }, maxBuffer: 20 * 1024 * 1024 });
    return stdout.trim();
  } catch (e) {
    throw new Error(`git ${args[0]} failed: ${scrub(e.stderr || e.message, env).slice(0, 500)}`);
  }
}

/** Shallow-clones the repo into a temp dir; calls fn(dir); always cleans up. */
export async function withCheckout(fn, { branch, env = process.env } = {}) {
  const dir = await mkdtemp(path.join(tmpdir(), 'ng-'));
  try {
    const url = `https://x-access-token:${env.GITHUB_TOKEN}@github.com/${repoName(env)}.git`;
    const args = ['clone', '--depth', '20', ...(branch ? ['--branch', branch] : []), url, dir];
    await git(tmpdir(), args, env);
    await git(dir, ['config', 'user.name', env.GIT_AUTHOR_NAME || 'nolangrout-engine']);
    await git(dir, ['config', 'user.email', env.GIT_AUTHOR_EMAIL || 'engine@nolangrout.com']);
    return await fn(dir);
  } finally {
    await rm(dir, { recursive: true, force: true });
  }
}

export const BASE_BRANCH = (env = process.env) => env.GITHUB_BASE_BRANCH || 'master';

/**
 * Contract validator in the checkout: `npm ci --ignore-scripts` then `node scripts/content-check.mjs --json`.
 * Fails closed: a missing script, a failed install or a crash all count as a failure.
 */
export async function contentCheck(dir, { exec = run } = {}) {
  try { await access(path.join(dir, 'scripts/content-check.mjs')); } catch { return { ok: false, detail: 'scripts/content-check.mjs not present (failing closed)', errors: [] }; }
  try {
    await exec('npm', ['ci', '--ignore-scripts', '--no-audit', '--no-fund'], { cwd: dir, maxBuffer: 50 * 1024 * 1024, timeout: 15 * 60_000, env: { ...process.env, NODE_ENV: 'development' } });
  } catch (e) {
    return { ok: false, detail: `npm ci failed: ${String(e.stderr || e.message).slice(-500)}`, errors: [] };
  }
  let out;
  try {
    const r = await exec(process.execPath, ['scripts/content-check.mjs', '--json'], { cwd: dir, maxBuffer: 20 * 1024 * 1024, timeout: 5 * 60_000 });
    out = { ok: true, stdout: r.stdout };
  } catch (e) {
    out = { ok: false, stdout: e.stdout || '', stderr: e.stderr || e.message };
  }
  let parsed = null;
  try { parsed = JSON.parse(String(out.stdout).trim() || 'null'); } catch {}
  const errors = parsed ? collectErrors(parsed) : [];
  if (out.ok && !errors.length) return { ok: true, detail: 'content-check passed', errors: [] };
  return { ok: false, detail: errors.length ? errors.slice(0, 20).join('; ') : `content-check failed: ${String(out.stderr || out.stdout).slice(0, 800)}`, errors };
}

/** Accepts the likely --json shapes: {errors:[...]}, {files:[{file, errors}]}, [{file, reason}]. */
export function collectErrors(j) {
  const out = [];
  const one = (e, file) => out.push(typeof e === 'string' ? (file ? `${file}: ${e}` : e) : `${e.file || file || ''}${e.file || file ? ': ' : ''}${e.reason || e.message || e.error || JSON.stringify(e)}`);
  const walk = (x, file) => {
    if (!x) return;
    if (Array.isArray(x)) { for (const e of x) (e && typeof e === 'object' && (e.errors || e.problems)) ? walk(e.errors || e.problems, e.file || file) : one(e, file); return; }
    if (typeof x === 'object') {
      if (x.errors || x.problems) walk(x.errors || x.problems, x.file || file);
      if (x.files && !x.errors) walk(x.files.filter((f) => f && (f.errors || f.problems || f.ok === false)), file);
      if (x.results) walk(x.results.filter((f) => f && (f.ok === false || (f.errors && f.errors.length))), file);
    }
  };
  walk(j);
  return [...new Set(out)];
}

export const headSha = (dir) => git(dir, ['rev-parse', 'HEAD']);

export async function commitAndPush(dir, branch, message) {
  await git(dir, ['add', '-A']);
  const status = await git(dir, ['status', '--porcelain']);
  if (!status) return false;
  await git(dir, ['commit', '-m', message]);
  await git(dir, ['push', 'origin', `HEAD:refs/heads/${branch}`]);
  return true;
}

/** Opens or updates (comments on) a GitHub issue with the given label + exact title. */
export async function upsertIssue({ title, body, label, assignees }, env = process.env) {
  const repo = repoName(env);
  try { await gh('POST', `/repos/${repo}/labels`, { name: label, color: label === 'engine-alert' || label === 'needs-review' ? 'd73a4a' : '0e8a16' }, env); } catch {}
  const open = await gh('GET', `/repos/${repo}/issues?state=open&labels=${encodeURIComponent(label)}&per_page=100`, null, env);
  const existing = open.find((i) => i.title === title && !i.pull_request);
  if (existing) {
    await gh('POST', `/repos/${repo}/issues/${existing.number}/comments`, { body }, env);
    return existing.html_url;
  }
  const created = await gh('POST', `/repos/${repo}/issues`, { title, body, labels: [label], ...(assignees ? { assignees } : {}) }, env);
  return created.html_url;
}
