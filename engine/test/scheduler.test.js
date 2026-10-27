import test from 'node:test';
import assert from 'node:assert/strict';
import { lastSlot, withRetry, createScheduler, zonedParts } from '../src/scheduler.js';
import { memDb } from './helpers.js';

const quiet = { log() {}, error() {} };

test('lastSlot in America/New_York', () => {
  // Mon 2026-10-26 15:30 UTC = 11:30 EDT
  const now = new Date('2026-10-26T15:30:00Z');
  assert.equal(lastSlot({ hour: 9, days: [1, 4] }, now).toISOString(), '2026-10-26T13:00:00.000Z');
  assert.equal(lastSlot({ hour: 7, days: [0] }, now).toISOString(), '2026-10-25T11:00:00.000Z');
  assert.equal(lastSlot({ hourly: true }, now).toISOString(), '2026-10-26T15:00:00.000Z');
  // after DST ends (Nov 2): 9:00 EST = 14:00 UTC
  assert.equal(lastSlot({ hour: 9, days: [4] }, new Date('2026-11-05T20:00:00Z')).toISOString(), '2026-11-05T14:00:00.000Z');
  assert.deepEqual(zonedParts(new Date('2026-10-26T13:00:00Z')), { dow: 1, hour: 9 });
});

test('withRetry retries with backoff then succeeds / fails', async () => {
  const waits = [];
  let n = 0;
  const r = await withRetry(async () => { if (++n < 3) throw new Error('x'); return 'ok'; }, { baseMs: 10, sleep: async (ms) => waits.push(ms) });
  assert.deepEqual(r, { result: 'ok', attempts: 3 });
  assert.deepEqual(waits, [10, 20]);
  await assert.rejects(withRetry(async () => { throw new Error('boom'); }, { sleep: async () => {} }), /boom/);
});

test('catch-up runs missed slot once; failure records + alerts; lock prevents overlap', async () => {
  const db = await memDb();
  let now = new Date('2026-10-26T15:30:00Z');
  const calls = { a: 0, b: 0 };
  const alerts = [];
  const jobs = {
    a: { schedule: { hour: 9, days: [1] }, run: async () => { calls.a++; return { done: 1 }; } },
    b: { schedule: { hour: 7, days: [0] }, run: async () => { calls.b++; throw new Error('nope'); } }
  };
  const s = createScheduler({ db, jobs, now: () => now, retry: { sleep: async () => {} }, onFailure: async (j, m) => alerts.push([j, m]), log: quiet });
  assert.deepEqual(await s.tick(), ['a', 'b']);
  assert.equal(calls.a, 1);
  assert.equal(calls.b, 3, '3 tries');
  assert.deepEqual(alerts, [['b', 'nope']]);
  assert.deepEqual(await s.tick(), [], 'not re-run in same slot');
  const rows = (await db.query('SELECT job, status, attempts FROM job_runs ORDER BY job')).rows;
  assert.deepEqual(rows, [{ job: 'a', status: 'ok', attempts: 1 }, { job: 'b', status: 'failed', attempts: 3 }]);
  now = new Date('2026-11-02T15:30:00Z');
  assert.deepEqual(await s.tick(), ['a', 'b'], 'next week runs again');

  let release;
  const slow = createScheduler({ db, jobs: { c: { run: () => new Promise((r) => { release = r; }) } }, log: quiet });
  const p = slow.runJob('c', new Date());
  assert.deepEqual(await slow.runJob('c', new Date()), { skipped: 'locked' });
  assert.equal(slow.trigger('c'), false);
  for (let i = 0; i < 500 && !release; i++) await new Promise((r) => setTimeout(r, 10)); // wait for the job to start (slow under parallel test load)
  release({});
  await p;
});
