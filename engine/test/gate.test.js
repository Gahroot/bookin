import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { processPr } from '../src/jobs/gate.js';
import { insertEvidence } from '../src/evidence.js';
import { parseDoc } from '../src/content.js';
import { memDb } from './helpers.js';
import { fixtureRepo, realContentCheck } from './fixture.js';

const quiet = { log() {}, error() {} };
const SLUG = 'shipping-business-software-with-ai-agents';
const REL = `content/articles/${SLUG}.md`;
const env = { GITHUB_TOKEN: 't', GITHUB_REPO: 'Gahroot/bookin', GATE_CI_POLL_MS: '1', GATE_MAX_REVISIONS: '0' };
const pr = { number: 9, title: 'Article', html_url: 'u', head: { ref: `engine/${SLUG}`, sha: 'sha1' } };

async function setup(fx) {
  const db = await memDb();
  const { data } = parseDoc(await readFile(path.join(fx.dir, REL), 'utf8'));
  await insertEvidence(db, data.evidence.map((e) => ({ id: e.ref, source_id: 's', kind: e.kind, text: `${e.title}. Evidence for the claims.`, ref: e.ref, public: e.public, url: e.url })));
  return { db, claims: data.claims };
}
function deps(fx, { verdict = 'supported', calls }) {
  return {
    withCheckout: (fn) => fn(fx.dir),
    contentCheck: realContentCheck,
    commitAndPush: async (dir, branch, msg) => { calls.push(['push', msg]); return true; },
    headSha: async () => 'sha2',
    upsertIssue: async (i) => { calls.push(['issue', i.label]); },
    sleep: async () => {}, now: () => 0,
    complete: async (s, p) => JSON.stringify({ verdicts: JSON.parse(p.split('Claims with their evidence:\n')[1].split('\n\nAll listed')[0]).map((it) => ({ index: it.index, verdict, reason: 'r' })), unlisted: [], confidential: [] }),
    gh: async (method, route, body) => {
      calls.push([method, route.replace('/repos/Gahroot/bookin', '')]);
      if (route.endsWith('/files?per_page=100')) return [{ filename: REL, status: 'added' }];
      if (route.includes('/check-runs')) return { check_runs: [{ name: 'ci', status: 'completed', conclusion: 'success' }] };
      if (route.includes('/issues?')) return [];
      return {};
    }
  };
}

test('gate: all claims supported + real content-check + CI green -> approved and squash-merged', async () => {
  const fx = await fixtureRepo();
  try {
    const { db } = await setup(fx);
    const calls = [];
    const r = await processPr(db, pr, { env, deps: deps(fx, { calls }), log: quiet });
    assert.equal(r.outcome, 'merged', r.why);
    assert.ok(calls.some((c) => c[0] === 'PUT' && c[1] === '/pulls/9/merge'));
    assert.ok(calls.some((c) => c[0] === 'push' && /Auto-approve/.test(c[1])));
    const out = parseDoc(await readFile(path.join(fx.dir, REL), 'utf8')).data;
    assert.equal(out.approved_by, 'auto-review (nolangrout engine)');
    const g = (await db.query('SELECT outcome FROM gate_results ORDER BY id')).rows.map((x) => x.outcome);
    assert.deepEqual(g, ['approved', 'merged']);
  } finally { await fx.cleanup(); }
});

test('gate: an unsupported claim -> needs-review, no merge', async () => {
  const fx = await fixtureRepo();
  try {
    const { db } = await setup(fx);
    const calls = [];
    const r = await processPr(db, pr, { env, deps: deps(fx, { verdict: 'unsupported', calls }), log: quiet });
    assert.equal(r.outcome, 'held');
    assert.ok(!calls.some((c) => c[0] === 'PUT'));
    assert.ok(!calls.some((c) => c[0] === 'push'));
    assert.ok(calls.some((c) => c[0] === 'issue' && c[1] === 'needs-review'));
    assert.ok(calls.some((c) => c[0] === 'POST' && c[1] === '/issues/9/labels'));
    assert.equal(await processPr(db, pr, { env, deps: deps(fx, { calls: [] }), log: quiet }), null, 'not re-gated without a new commit');
  } finally { await fx.cleanup(); }
});

test('gate: content-check script missing -> fails closed (held, no merge)', async () => {
  const fx = await fixtureRepo({ script: false });
  try {
    const { db } = await setup(fx);
    const calls = [];
    const r = await processPr(db, pr, { env: { ...env, GATE_MAX_REVISIONS: '3' }, deps: deps(fx, { calls }), log: quiet });
    assert.equal(r.outcome, 'held');
    assert.match(r.why, /content-check/);
    assert.ok(!calls.some((c) => c[0] === 'PUT' || c[0] === 'push'));
  } finally { await fx.cleanup(); }
});
