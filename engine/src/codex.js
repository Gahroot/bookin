// OpenAI Codex CLI provider: runs `codex exec` on the owner's ChatGPT subscription ($0 marginal cost).
// This engine is Codex-only (no paid API exists in it): if Codex is unavailable the job is deferred and retried hourly.
// ChatGPT-managed auth lives in $CODEX_HOME/auth.json on the persistent volume; Codex refreshes and rewrites it itself.
// The engine only READS auth_mode / last_refresh from it and never logs, copies or overwrites it.
import { spawn as nodeSpawn } from 'node:child_process';
import { mkdtemp, readFile, rm, access, constants } from 'node:fs/promises';
import { tmpdir, homedir } from 'node:os';
import path from 'node:path';
import { githubConfigured, upsertIssue } from './github.js';
import { recordUsage } from './db.js';

const DAY = 86_400_000;
// High reasoning on long articles can take a while; Codex-only mode allows 25 minutes by default.
export const timeoutMs = (env = process.env) => Number(env.CODEX_TIMEOUT_MS) || 25 * 60_000;

// Test seam: replace spawn / availability / alert sink.
export const codexDeps = { spawn: nodeSpawn, available: null, notify: null };

export const codexHome = (env = process.env) => env.CODEX_HOME || path.join(homedir(), '.codex');

async function binaryPresent(env) {
  for (const dir of String(env.PATH || '').split(path.delimiter)) {
    if (!dir) continue;
    try { await access(path.join(dir, 'codex'), constants.X_OK); return true; } catch {}
  }
  return false;
}

/** Reads auth.json without ever returning tokens. */
export async function authInfo(env = process.env) {
  try {
    const j = JSON.parse(await readFile(path.join(codexHome(env), 'auth.json'), 'utf8'));
    return { exists: true, chatgpt: j.auth_mode === 'chatgpt', lastRefresh: typeof j.last_refresh === 'string' ? j.last_refresh : null };
  } catch { return { exists: false, chatgpt: false, lastRefresh: null }; }
}

/** binary on PATH AND auth.json exists with auth_mode 'chatgpt'. */
export async function codexAvailable(env = process.env) {
  if (codexDeps.available) return codexDeps.available(env);
  const [bin, a] = await Promise.all([binaryPresent(env), authInfo(env)]);
  return bin && a.chatgpt;
}

// ---------- state (table codex_state) ----------
export async function getState(db, key) {
  if (!db) return null;
  const r = await db.query('SELECT value FROM codex_state WHERE key = $1', [key]);
  return r.rows.length ? r.rows[0].value : null;
}
export async function setState(db, key, value) {
  if (!db) return;
  await db.query(`INSERT INTO codex_state (key, value, updated_at) VALUES ($1,$2,now())
    ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value, updated_at = now()`, [key, value]);
}

// Runaway guard: a normal week is ~2 drafts (+ revisions), daily discover, fact-checks and one audit.
export const weeklyCap = (env = process.env) => {
  const n = Number(env.CODEX_MAX_CALLS_PER_WEEK ?? 80);
  return Number.isFinite(n) && n >= 0 ? n : 80;
};

export async function codexCallsLastWeek(db, now = new Date()) {
  if (!db) return 0;
  const r = await db.query("SELECT COUNT(*)::int AS n FROM ai_usage WHERE provider = 'codex' AND job <> 'codex_keepalive' AND created_at > $1", [new Date(now.getTime() - 7 * DAY)]);
  return r.rows[0].n;
}

/** Why codex may not be used for this call right now (null = go). */
export async function codexBlock(db, { env = process.env, now = new Date() } = {}) {
  if (!(await codexAvailable(env))) return 'not available (codex not installed or not logged in: run `codex login --device-auth` via railway ssh)';
  const until = await getState(db, 'backoff_until');
  if (until && new Date(until).getTime() > now.getTime()) return `backing off until ${until}`;
  if ((await codexCallsLastWeek(db, now)) >= weeklyCap(env)) return 'weekly cap reached';
  return null;
}

/** 'auth' | 'usage' | 'other' */
export function classifyError(text) {
  const s = String(text);
  if (/usage limit|rate.?limit|\b429\b|quota|too many requests|try again (in|at|later)/i.test(s)) return 'usage';
  if (/\b401\b|unauthori[sz]ed|not logged in|login|log in|\bauth|token.*(expired|invalid|revoked)|refresh.?token/i.test(s)) return 'auth';
  return 'other';
}

// One codex process at a time (one auth.json per machine).
let chain = Promise.resolve();
const serial = (fn) => { const p = chain.then(fn, fn); chain = p.catch(() => {}); return p; };

export function codexArgs(env, outFile, cwd, { search = false } = {}) {
  const effort = String(env.CODEX_REASONING_EFFORT || '').trim();
  return ['exec', '--skip-git-repo-check', '--ephemeral', '--sandbox', 'read-only', '-c', 'approval_policy="never"',
    ...(effort && /^[a-z]+$/.test(effort) ? ['-c', `model_reasoning_effort="${effort}"`] : []),
    ...(search ? ['-c', 'web_search="live"'] : []),
    '--cd', cwd, '--json', '--output-last-message', outFile, ...(env.CODEX_MODEL ? ['-m', env.CODEX_MODEL] : []), '-'];
}

/** Runs codex exec; resolves { text, usage }, rejects with { kind } on failure. Prompt goes on stdin. */
export function runCodex(prompt, { env = process.env, timeoutMs: limitMs = timeoutMs(env), search = false } = {}) {
  return serial(async () => {
    const cwd = await mkdtemp(path.join(tmpdir(), 'codex-cwd-'));
    const outDir = await mkdtemp(path.join(tmpdir(), 'codex-out-'));
    const outFile = path.join(outDir, 'last.txt');
    try {
      const childEnv = { PATH: env.PATH || process.env.PATH, HOME: env.HOME || process.env.HOME, CODEX_HOME: codexHome(env) };
      const { code, stdout, stderr, timedOut } = await new Promise((resolve, reject) => {
        const child = codexDeps.spawn('codex', codexArgs(env, outFile, cwd, { search }), { cwd, env: childEnv, stdio: ['pipe', 'pipe', 'pipe'] });
        let out = '', err = '', timedOut = false;
        const t = setTimeout(() => { timedOut = true; child.kill('SIGKILL'); }, limitMs);
        child.stdout.on('data', (d) => { if (out.length < 2e6) out += d; });
        child.stderr.on('data', (d) => { if (err.length < 2e5) err += d; });
        child.on('error', (e) => { clearTimeout(t); reject(e); });
        child.on('close', (c) => { clearTimeout(t); resolve({ code: c, stdout: out, stderr: err, timedOut }); });
        child.stdin.on('error', () => {});
        child.stdin.end(prompt);
      });
      const usage = { inputTokens: 0, outputTokens: 0, cacheReadTokens: 0 };
      const urls = [];
      let eventError = '';
      for (const line of stdout.split('\n')) {
        let ev; try { ev = JSON.parse(line); } catch { continue; }
        if (ev && ev.usage) {
          usage.inputTokens += (ev.usage.input_tokens || 0) - (ev.usage.cached_input_tokens || 0);
          usage.cacheReadTokens += ev.usage.cached_input_tokens || 0;
          usage.outputTokens += ev.usage.output_tokens || 0;
        }
        const it = ev && ev.item;
        if (ev && ev.type === 'item.completed' && it && it.type === 'web_search') {
          for (const r of it.results || []) if (r && r.url) urls.push(r.url);
          const a = it.action || {};
          if (a.url) urls.push(a.url);
        }
        if (ev && (ev.type === 'error' || ev.type === 'turn.failed')) eventError += ' ' + JSON.stringify(ev.error || ev.message || ev).slice(0, 300);
      }
      let text = '';
      try { text = (await readFile(outFile, 'utf8')).trim(); } catch {}
      if (timedOut || code !== 0 || eventError || !text) {
        const msg = (timedOut ? `timeout after ${Math.round(limitMs / 60000)} min` : `exit ${code}`) + `: ${eventError} ${stderr}`.replace(/\s+/g, ' ').slice(0, 400);
        throw Object.assign(new Error(`codex ${msg}`), { kind: classifyError(eventError + ' ' + stderr), retryable: true });
      }
      return { text, usage, urls: [...new Set(urls)] };
    } finally {
      await rm(cwd, { recursive: true, force: true });
      await rm(outDir, { recursive: true, force: true });
    }
  });
}

export const RESEED = `Reseed the Codex login (separate device login on the server; your Mac stays signed in):
1. From engine/: \`railway ssh --service engine\`
2. In the container: \`codex login --device-auth\` and finish the sign-in in a browser (ChatGPT settings > Security may need "device code login" enabled for Codex).
3. Check \`/api/admin/status\` shows \`codex.loggedIn: true\`.
AI jobs wait and retry hourly until the login works again (there is no paid fallback).`;

const defaultNotify = async ({ title, body }, env) => { if (githubConfigured(env)) await upsertIssue({ title, body, label: 'engine-alert' }, env); };

/** Records a codex failure: auth -> one alert per 7 days; usage -> 24h back-off, no alert (shown in weekly report). */
export async function handleFailure(db, err, { env = process.env, now = new Date() } = {}) {
  const kind = err.kind || 'other';
  await setState(db, 'last_error', JSON.stringify({ at: now.toISOString(), kind, message: String(err.message).slice(0, 300) }));
  if (kind === 'usage') {
    await setState(db, 'backoff_until', new Date(now.getTime() + DAY).toISOString());
    await setState(db, 'usage_limit_at', now.toISOString());
    return { alerted: false, kind };
  }
  if (kind !== 'auth') return { alerted: false, kind };
  const last = await getState(db, 'alert_auth_at');
  if (last && now.getTime() - new Date(last).getTime() < 7 * DAY) return { alerted: false, kind };
  await setState(db, 'alert_auth_at', now.toISOString());
  const notify = codexDeps.notify || defaultNotify;
  try { await notify({ title: 'Codex login needs renewing', body: `The engine's Codex CLI call failed with an auth error (${now.toISOString()}). AI jobs are paused (retrying hourly) until it is fixed.\n\n${RESEED}` }, env); }
  catch (e) { console.error('[codex] alert failed', e.message); }
  return { alerted: true, kind };
}

export async function recordSuccess(db, now = new Date()) { await setState(db, 'last_success', now.toISOString()); }

export async function codexStatus(db, env = process.env) {
  const [installed, a] = await Promise.all([binaryPresent(env), authInfo(env)]);
  const le = await getState(db, 'last_error').catch(() => null);
  let lastError = null; try { lastError = le ? JSON.parse(le) : null; } catch {}
  return { installed, loggedIn: a.chatgpt, lastRefresh: a.lastRefresh, lastSuccess: await getState(db, 'last_success').catch(() => null),
    lastError, backoffUntil: await getState(db, 'backoff_until').catch(() => null), callsLast7Days: await codexCallsLastWeek(db).catch(() => null), weeklyCap: weeklyCap(env) };
}

export const KEEPALIVE_SCHEDULE = { hour: 6, days: [6] }; // Sat 6:00 NY 

/** Weekly keep-alive so Codex refreshes auth.json even in quiet weeks. */
export async function keepalive({ db, env = process.env, log = console }) {
  if (!(await codexAvailable(env))) return { skipped: 'codex not available' };
  try {
    const r = await runCodex('Reply with OK', { env });
    await recordUsage(db, { job: 'codex_keepalive', provider: 'codex', model: env.CODEX_MODEL || 'codex-default', ...r.usage });
    await recordSuccess(db);
    return { ok: true };
  } catch (e) {
    const h = await handleFailure(db, e, { env });
    log.error(`[codex] keepalive failed (${h.kind})`);
    return { skipped: `codex failed (${h.kind})` };
  }
}
