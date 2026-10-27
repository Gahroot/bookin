import test from 'node:test';
import assert from 'node:assert/strict';
import http from 'node:http';
import { createHandler } from '../src/api.js';
import { qualify, lowerBound } from '../src/qualify.js';
import { memDb } from './helpers.js';

const quiet = { log() {}, error() {} };
async function serve(opts) {
  const server = http.createServer(createHandler({ log: quiet, adminToken: 'admintok', siteSecret: 'sitesecret', codexStatus: async () => ({ loggedIn: false }), env: {}, ...opts }));
  await new Promise((r) => server.listen(0, r));
  const base = `http://127.0.0.1:${server.address().port}`;
  return { base, close: () => new Promise((r) => server.close(r)) };
}
const post = (url, body, headers = {}) => fetch(url, { method: 'POST', headers: { 'content-type': 'application/json', ...headers }, body: JSON.stringify(body) });
const lead = (over = {}) => ({ firstName: 'Ann', lastName: 'Lee', email: 'Ann@Example.com', phone: '555', businessType: 'real-estate', revenue: '1m-5m', projectType: 'ai-agents', timeline: '1-month', budget: '10k-25k', page: '/book',
  attribution: { first: { source: 'linkedin', medium: 'social', landing: '/work/triten-os?x=1', ts: '2026-10-01' }, last: { source: 'google', referrer: 'https://www.google.com/search?q=x' } }, ...over });

test('health, event 204 + CORS, bad event, unknown origin', async () => {
  const db = await memDb();
  const s = await serve({ db });
  try {
    assert.deepEqual(await (await fetch(`${s.base}/api/health`)).json(), { ok: true });
    const r = await post(`${s.base}/api/event`, { type: 'pageview', path: '/work?utm=1', utm_source: 'linkedin', referrer: 'https://x.com/a' }, { origin: 'https://nolangrout.com' });
    assert.equal(r.status, 204);
    assert.equal(r.headers.get('access-control-allow-origin'), 'https://nolangrout.com');
    await post(`${s.base}/api/event`, { type: 'pageview', path: '/work', utm_source: 'linkedin', referrer: 'https://x.com/b' }, { origin: 'https://preview-1.vercel.app' });
    const rows = (await db.query('SELECT path, utm_source, referrer_host, count FROM events')).rows;
    assert.deepEqual(rows, [{ path: '/work', utm_source: 'linkedin', referrer_host: 'x.com', count: 2 }]);
    for (const t of ['cta_click', 'form_start', 'form_submit', 'demo_run', 'outbound_prestyj', 'cta_view']) assert.equal((await post(`${s.base}/api/event`, { type: t, path: '/' })).status, 204);
    assert.equal((await post(`${s.base}/api/event`, { type: 'hack', path: '/' })).status, 400);
    assert.equal((await post(`${s.base}/api/event`, { type: 'pageview', path: '/' }, { origin: 'https://evil.com' })).status, 403);
    const pre = await fetch(`${s.base}/api/event`, { method: 'OPTIONS', headers: { origin: 'http://localhost:3000' } });
    assert.equal(pre.status, 204);
  } finally { await s.close(); }
});

test('lead: secret required, stores attribution, qualified, dedupe by email, honeypot', async () => {
  const db = await memDb();
  const logs = [];
  const s = await serve({ db, log: { log: (...a) => logs.push(a.join(' ')), error: (...a) => logs.push(a.join(' ')) } });
  try {
    assert.equal((await post(`${s.base}/api/lead`, lead())).status, 401);
    assert.equal((await post(`${s.base}/api/lead`, lead(), { 'x-site-secret': 'wrong' })).status, 401);
    const r = await post(`${s.base}/api/lead`, lead(), { 'x-site-secret': 'sitesecret' });
    assert.deepEqual(await r.json(), { ok: true, qualified: true });
    await post(`${s.base}/api/lead`, lead({ budget: 'under-1k', attribution: { first: { source: 'bing' } } }), { 'x-site-secret': 'sitesecret' });
    const rows = (await db.query('SELECT email, qualified, first_source, first_page, submissions, budget FROM leads')).rows;
    assert.deepEqual(rows, [{ email: 'ann@example.com', qualified: false, first_source: 'linkedin', first_page: '/work/triten-os', submissions: 2, budget: 'under-1k' }]);
    assert.equal((await (await post(`${s.base}/api/lead`, lead({ email: 'bot@x.com', website: 'spam' }), { 'x-site-secret': 'sitesecret' })).json()).ok, true);
    assert.equal((await db.query('SELECT COUNT(*)::int AS n FROM leads')).rows[0].n, 1);
    assert.equal((await post(`${s.base}/api/lead`, lead({ email: 'nope' }), { 'x-site-secret': 'sitesecret' })).status, 400);
    assert.ok(!logs.join('\n').includes('example.com'), 'no PII in logs');
  } finally { await s.close(); }
});

test('admin endpoints need the token', async () => {
  const db = await memDb();
  const triggered = [];
  const scheduler = { status: async () => ({ jobs: {} }), has: (j) => j === 'ingest', trigger: (j) => { triggered.push(j); return true; } };
  const s = await serve({ db, scheduler });
  try {
    assert.equal((await fetch(`${s.base}/api/admin/status`)).status, 401);
    const st = await (await fetch(`${s.base}/api/admin/status`, { headers: { authorization: 'Bearer admintok' } })).json();
    assert.equal(st.codex.loggedIn, false);
    assert.equal(st.counts.leads.total, 0);
    assert.equal((await fetch(`${s.base}/api/admin/run/ingest`, { method: 'POST', headers: { authorization: 'Bearer admintok' } })).status, 202);
    assert.equal((await fetch(`${s.base}/api/admin/run/nope`, { headers: { authorization: 'Bearer admintok' } })).status, 404);
    assert.deepEqual(triggered, ['ingest']);
  } finally { await s.close(); }
});

test('qualification rule', () => {
  assert.equal(lowerBound('25k+'), 25000);
  assert.equal(lowerBound('$5,000 - $10,000'), 5000);
  assert.equal(lowerBound('under-1k'), 0);
  assert.equal(lowerBound('not-sure'), null);
  const ok = { budget: '5k-10k', revenue: '100k-500k', timeline: '1-3-months', projectType: 'automation' };
  assert.equal(qualify(ok).qualified, true);
  assert.equal(qualify({ ...ok, revenue: 'pre-revenue' }).qualified, false);
  assert.equal(qualify({ ...ok, timeline: 'exploring' }).qualified, false);
  assert.equal(qualify({ ...ok, projectType: 'consulting' }).qualified, false);
  assert.equal(qualify({ ...ok, projectType: 'consulting', budget: '10k-25k' }).qualified, true);
});
