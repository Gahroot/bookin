import test from 'node:test';
import assert from 'node:assert/strict';
import * as github from '../src/sources/github.js';
import * as worklog from '../src/sources/worklog.js';
import { loadAdapters, loadSources } from '../src/sources/index.js';
import * as ingest from '../src/jobs/ingest.js';
import { memDb } from './helpers.js';

const json = (b) => ({ ok: true, status: 200, json: async () => b, text: async () => (typeof b === 'string' ? b : JSON.stringify(b)) });
const nf = { ok: false, status: 404, json: async () => ({}), text: async () => '' };
function ghMock(routes, seen = []) {
  return async (url) => {
    const u = new URL(url);
    seen.push(u.pathname);
    for (const [re, body] of routes) if (re.test(u.pathname)) return body === 404 ? nf : json(body);
    return nf;
  };
}

const ghRoutes = [
  [/\/commits$/, [{ sha: 'a'.repeat(40), html_url: 'https://github.com/Gahroot/ezcoder/commit/aaa', commit: { message: 'Add goal runner\n\nkey ghp_' + 'x'.repeat(30) + ' leaked\n```\ncode\n```', author: { date: '2026-10-20T00:00:00Z' } } },
    { sha: 'b'.repeat(40), html_url: 'u', commit: { message: 'Merge pull request #3', author: { date: '2026-10-20T00:00:00Z' } } }]],
  [/\/pulls$/, [{ number: 7, merged_at: '2026-10-21T00:00:00Z', title: 'Ship image tool', body: 'Adds images', html_url: 'https://github.com/Gahroot/ezcoder/pull/7' }]],
  [/\/releases$/, []],
  [/\/readme$/, '# EZ Coder\nAn AI coding agent.']
];

test('github adapter: commits/PRs/README only, redacted; private repos get opaque refs and no url', async () => {
  const seen = [];
  const pub = await github.collect({ config: { id: 'ezcoder', repo: 'Gahroot/ezcoder', project: 'ez-coder', client: 'EZ Coder', public: true }, env: { GITHUB_TOKEN: 't' }, fetchImpl: ghMock(ghRoutes, seen) });
  assert.deepEqual(pub.map((i) => i.kind), ['github-commit', 'github-pr', 'github-repo']);
  assert.ok(!pub[0].text.includes('ghp_') && !pub[0].text.includes('code'));
  assert.equal(pub[1].url, 'https://github.com/Gahroot/ezcoder/pull/7');
  assert.ok(!seen.some((p) => /\/contents\//.test(p)), 'never reads file contents');
  const priv = await github.collect({ config: { id: 't', repo: 'Gahroot/triten-os', public: false }, env: { GITHUB_TOKEN: 't' }, fetchImpl: ghMock(ghRoutes) });
  assert.ok(priv.every((i) => i.url === null && !i.public && !i.ref.includes('Gahroot')));
  await assert.rejects(github.collect({ config: { repo: 'a/b' }, env: {} }), (e) => e.skip);
});

const report = { date: '2026-10-27', projects: [{ project: 'triten-os', client: 'Triten', sessions: 4, activeMinutes: 180, items: [
  { id: 'wl-2026-10-27-triten-os-1', kind: 'outcome', text: 'Portfolio Q&A tool live', ts: '2026-10-27T10:00:00Z', ref: 's1' },
  { id: 'bad id', kind: 'outcome', text: 'x' }], goals: [{ id: 'g1', name: 'MCP', status: 'done', done: ['Shipped MCP server'] }] }] };

test('worklog adapter + ingest dedupe on item ids', async () => {
  const fetchImpl = ghMock([[/\/contents\/reports\/2026$/, [{ name: '2026-10-27.json' }, { name: 'README.md' }]], [/\/contents\/reports\/2026\/2026-10-27\.json$/, JSON.stringify(report)]]);
  const config = { id: 'worklog', kind: 'worklog', repo: 'Gahroot/nolan-worklog', projectMap: { 'triten-os': 'triten-os' } };
  const items = await worklog.collect({ since: '2026-10-26', config, env: { GITHUB_TOKEN: 't' }, fetchImpl });
  assert.deepEqual(items.map((i) => i.id), ['wl-2026-10-27-triten-os-1', 'wl-2026-10-27-g1-done-1']);
  assert.ok(items.every((i) => !i.public && !/minute|180/.test(i.text)));
  const db = await memDb();
  const deps = { adapters: { worklog }, sources: [config], fetchImpl };
  const env = { GITHUB_TOKEN: 't' };
  const quiet = { log() {}, error() {} };
  assert.equal((await ingest.run({ db, env, log: quiet, deps })).results.worklog.added, 2);
  assert.equal((await ingest.run({ db, env, log: quiet, deps })).results.worklog.added, 0);
  assert.equal((await db.query('SELECT COUNT(*)::int AS n FROM evidence')).rows[0].n, 2);
  assert.ok((await ingest.run({ db, env: {}, log: quiet, deps })).skipped);
});

test('adapters load from the directory; config has every source kind covered', async () => {
  const a = await loadAdapters();
  const s = await loadSources();
  assert.deepEqual(Object.keys(a).sort(), ['github', 'worklog']);
  assert.ok(s.every((x) => a[x.kind]));
  assert.equal(s.length, 9);
});
