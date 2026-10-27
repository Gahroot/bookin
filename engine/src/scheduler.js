// Minimal scheduler: hour-granular slots in America/New_York, job_runs bookkeeping,
// retry with backoff, catch-up of missed slots on boot, and an overlap lock.


export const TZ = 'America/New_York';
const HOUR = 3_600_000;

export function zonedParts(date, tz = TZ) {
  const f = new Intl.DateTimeFormat('en-US', { timeZone: tz, weekday: 'short', hour: 'numeric', hourCycle: 'h23' });
  const p = Object.fromEntries(f.formatToParts(date).map((x) => [x.type, x.value]));
  return { dow: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].indexOf(p.weekday), hour: Number(p.hour) };
}

/**
 * Most recent slot at or before `now` for a schedule.
 * schedule: { hourly: true } | { hour: 7, days?: [0..6] }  (days omitted = every day)
 */
export function lastSlot(schedule, now = new Date(), tz = TZ) {
  let t = Math.floor(now.getTime() / HOUR) * HOUR; // NY offsets are whole hours
  if (schedule.hourly) return new Date(t);
  for (let i = 0; i < 24 * 8; i++, t -= HOUR) {
    const { dow, hour } = zonedParts(new Date(t), tz);
    if (hour === schedule.hour && (!schedule.days || schedule.days.includes(dow))) return new Date(t);
  }
  return null;
}

export async function withRetry(fn, { tries = 3, baseMs = 30_000, sleep = (ms) => new Promise((r) => setTimeout(r, ms)), onAttempt = () => {} } = {}) {
  let lastErr;
  for (let attempt = 1; attempt <= tries; attempt++) {
    await onAttempt(attempt);
    try {
      return { result: await fn(attempt), attempts: attempt };
    } catch (e) {
      lastErr = e;
      // Never retry HTTP 400/401/403/404; a bad JSON reply gets at most one retry (maxAttempts 2).
      const limit = e && e.maxAttempts ? Math.min(tries, e.maxAttempts) : tries;
      if ((e && (e.retryable === false || e.budget)) || attempt >= limit) {
        throw Object.assign(e instanceof Error ? e : new Error(String(e)), { attempts: attempt });
      }
      await sleep(baseMs * 2 ** (attempt - 1));
    }
  }
  throw Object.assign(lastErr instanceof Error ? lastErr : new Error(String(lastErr)), { attempts: tries });
}

export function createScheduler({ db, jobs, ctx = {}, now = () => new Date(), retry = {}, onFailure = async () => {}, log = console, maxCatchUpHours = 24 * 8 }) {
  const running = new Set();
  let timer = null;

  // A slot is due if it never ran, or its latest run was deferred (Codex unavailable) over an hour ago.
  async function isDue(name, slot, n = now()) {
    const { rows } = await db.query("SELECT status, finished_at FROM job_runs WHERE job = $1 AND slot = $2 AND status <> 'abandoned' ORDER BY id DESC LIMIT 1", [name, slot]);
    if (!rows.length) return true;
    const r = rows[0];
    return r.status === 'deferred' && r.finished_at && n - new Date(r.finished_at) >= HOUR;
  }

  async function runJob(name, slot) {
    if (running.has(name)) return { skipped: 'locked' };
    running.add(name);
    let id;
    try {
      const ins = await db.query("INSERT INTO job_runs (job, slot, status, attempts) VALUES ($1,$2,'running',0) RETURNING id", [name, slot]);
      id = ins.rows[0].id;
      const { result, attempts } = await withRetry((attempt) => jobs[name].run({ ...ctx, db, attempt, slot, log }), {
        ...retry,
        onAttempt: (a) => db.query('UPDATE job_runs SET attempts = $2 WHERE id = $1', [id, a])
      });
      const status = result && result.skipped ? 'skipped' : 'ok';
      await db.query('UPDATE job_runs SET status = $2, finished_at = now(), result = $3, attempts = $4 WHERE id = $1', [id, status, JSON.stringify(result ?? null), attempts]);
      log.log(`[job] ${name} ${status}`);
      return { status, result };
    } catch (e) {
      if (e && e.defer) { // Codex temporarily unavailable: not a failure; the slot is retried in an hour (no alert)
        const result = { deferred: String(e.message).slice(0, 500) };
        if (id) await db.query("UPDATE job_runs SET status = 'deferred', finished_at = $3, result = $2 WHERE id = $1", [id, JSON.stringify(result), now()]);
        log.log(`[job] ${name} deferred: ${result.deferred}`);
        return { status: 'deferred', result };
      }
      if (e && e.budget) { // over the AI budget mid-run: a skip, not a failure (no alert, no retry)
        const result = { skipped: 'budget', reason: 'budget', detail: e.message };
        if (id) await db.query("UPDATE job_runs SET status = 'skipped', finished_at = now(), result = $2 WHERE id = $1", [id, JSON.stringify(result)]);
        log.log(`[job] ${name} skipped (budget)`);
        return { status: 'skipped', result };
      }
      const msg = String((e && e.message) || e).slice(0, 4000);
      if (id) await db.query("UPDATE job_runs SET status = 'failed', finished_at = now(), error = $2 WHERE id = $1", [id, msg]);
      log.error(`[job] ${name} failed: ${msg}`);
      try { await onFailure(name, msg); } catch (ae) { log.error('[alert] failed', ae.message); }
      return { status: 'failed', error: msg };
    } finally {
      running.delete(name);
    }
  }

  async function tick() {
    const n = now();
    const out = [];
    for (const [name, job] of Object.entries(jobs)) {
      if (!job.schedule) continue;
      const slot = lastSlot(job.schedule, n);
      if (!slot || n - slot > maxCatchUpHours * HOUR) continue;
      if (running.has(name) || !(await isDue(name, slot, n))) continue;
      out.push(name);
      await runJob(name, slot); // sequential: one job at a time keeps resource use low
    }
    return out;
  }

  return {
    jobs,
    has: (name) => Object.hasOwn(jobs, name),
    runJob,
    tick,
    trigger(name) {
      if (running.has(name)) return false;
      runJob(name, now()).catch((e) => log.error(e));
      return true;
    },
    async start(intervalMs = 60_000) {
      // Runs left 'running' by a crashed/redeployed process are marked abandoned so their slot is retried.
      await db.query("UPDATE job_runs SET status = 'abandoned', finished_at = now() WHERE status = 'running'");
      const loop = async () => { try { await tick(); } catch (e) { log.error('[scheduler] tick', e.message); } };
      timer = setInterval(loop, intervalMs);
      loop(); // catch up any missed slot right away
    },
    stop() { if (timer) clearInterval(timer); },
    async status() {
      const { rows } = await db.query(
        `SELECT DISTINCT ON (job) job, slot, status, attempts, started_at, finished_at, error FROM job_runs ORDER BY job, started_at DESC`
      );
      return {
        running: [...running],
        jobs: Object.fromEntries(Object.entries(jobs).map(([k, j]) => [k, { schedule: j.schedule, last: rows.find((r) => r.job === k) || null }]))
      };
    }
  };
}
