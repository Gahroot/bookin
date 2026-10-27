import test from 'node:test';
import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';
import path from 'node:path';
import * as draft from '../src/jobs/draft.js';
import { insertEvidence } from '../src/evidence.js';
import { WRITER_SYSTEM } from '../src/article.js';
import { memDb } from './helpers.js';
import { fixtureRepo, realContentCheck } from './fixture.js';

const quiet = { log() {}, error() {} };
const env = { GITHUB_TOKEN: 't', GITHUB_REPO: 'Gahroot/bookin', AUTO_PUBLISH: 'true' };
const para = 'Executives at Triten needed portfolio answers without waiting on a weekly report, and the team needed one governed source instead of several spreadsheets that disagreed.';
const good = {
  title: 'Governed portfolio answers for Triten executives', type: 'case-study',
  description: 'How Triten executives moved from waiting on weekly spreadsheet reports to asking governed portfolio questions directly, with answers traced to source data.',
  audience: 'COOs of real estate funds', primary_keyword: 'governed portfolio data', secondary_keywords: ['AI for real estate funds'],
  answer: 'Triten executives now ask portfolio questions in ChatGPT and get answers drawn from one governed data platform instead of waiting for a weekly spreadsheet report. The change came from connecting the platform to ChatGPT through a controlled interface that only exposes approved, traceable portfolio data to the people allowed to see it.',
  faq: [{ q: 'Does this replace reports?', a: 'It replaces waiting for them.' }], hero_alt: 'Abstract navy glass', cta: 'book',
  claims: [{ text: 'Executives query governed portfolio data from ChatGPT.', kind: 'capability', evidence: ['E1', 'E2'] }],
  body: `## What was the problem?\n\n${Array(6).fill(para).join(' ')}\n\n## What changed?\n\nExecutives query governed portfolio data from ChatGPT.[^E1][^E2] ${Array(6).fill(para).join(' ')}\n\n## What does it mean for you?\n\n${Array(4).fill(para).join(' ')}`,
  linkedin: { hook: 'Weekly reports were the bottleneck.', body: Array(3).fill(para).join('\n\n') },
  youtube: { hook: 'One question, one governed answer.', body: Array(3).fill(para).join('\n\n') }
};

async function seed() {
  const db = await memDb();
  await insertEvidence(db, [
    { id: 'wl-2026-10-27-triten-os-1', source_id: 'worklog', kind: 'worklog', project: 'triten-os', client: 'Triten', text: 'Executives query governed portfolio data from ChatGPT via MCP.', ref: 'wl-2026-10-27-triten-os-1', date: '2026-10-27' },
    { id: 'gh:Gahroot/triten-os:commit:abc', source_id: 'triten-os', kind: 'github-commit', project: 'triten-os', client: 'Triten', text: 'Add MCP server exposing governed portfolio views', ref: 'triten-os@abc123def456', date: '2026-10-26' }
  ]);
  await db.query(`INSERT INTO accomplishments (fingerprint, project, client, title, problem, outcome, evidence_ids, score) VALUES ('fp','triten-os','Triten','Portfolio Q&A','slow reports','ChatGPT answers',$1,90)`,
    [JSON.stringify(['wl-2026-10-27-triten-os-1', 'gh:Gahroot/triten-os:commit:abc'])]);
  return db;
}
function deps(fx, raw, calls) {
  return {
    completeJson: async () => { calls.push('codex'); return raw; },
    generateHero: async () => Buffer.from('RIFFwebp'),
    existingContent: async () => ({ articles: [], projects: [{ slug: 'triten-os' }] }),
    withCheckout: async (fn) => { calls.push('checkout'); return fn(fx.dir); },
    contentCheck: realContentCheck,
    commitAndPush: async (dir, branch) => { calls.push(`push ${branch}`); return true; },
    gh: async (m, route) => { calls.push(`${m} ${route}`); return { number: 12, html_url: 'https://github.com/Gahroot/bookin/pull/12' }; },
    gate: async () => { calls.push('gate'); return { outcome: 'merged' }; }
  };
}

test('writer prompt forbids presenting worklog minutes as hours worked', () => assert.match(WRITER_SYSTEM, /unattended/));

test('draft: lint failure -> self-revised, then dropped; nothing is checked out or pushed', async () => {
  const db = await seed();
  const fx = await fixtureRepo();
  try {
    const calls = [];
    const leaky = { ...good, body: `${good.body}\n\nWe touched apps/api/src/portfolio.ts and token ghp_${'a'.repeat(30)}.` };
    const r = await draft.run({ db, env, log: quiet, deps: deps(fx, leaky, calls) });
    assert.ok(r.dropped, JSON.stringify(r));
    assert.ok(!calls.some((c) => c === 'checkout' || c.startsWith('push') || c.startsWith('POST')));
    assert.equal(calls.filter((c) => c === 'codex').length, 1 + draft.LOCAL_ROUNDS, 'write + revisions');
    assert.equal((await db.query('SELECT status FROM accomplishments')).rows[0].status, 'dropped');
  } finally { await fx.cleanup(); }
});

test('draft: clean draft -> real content-check passes -> branch pushed, PR opened, gate run', async () => {
  const db = await seed();
  const fx = await fixtureRepo();
  try {
    const calls = [];
    const r = await draft.run({ db, env, log: quiet, deps: deps(fx, good, calls) });
    assert.equal(r.pr, 12, JSON.stringify(r));
    const slug = r.slug;
    assert.ok(calls.includes(`push engine/${slug}`));
    assert.ok(calls.includes('POST /repos/Gahroot/bookin/pulls'));
    assert.ok(calls.includes('gate'));
    for (const f of [`content/articles/${slug}.md`, `content/social/${slug}/linkedin.md`, `content/social/${slug}/youtube.md`, `public/images/articles/${slug}.webp`]) assert.ok(existsSync(path.join(fx.dir, f)), f);
    const art = readFileSync(path.join(fx.dir, `content/articles/${slug}.md`), 'utf8');
    assert.match(art, /status: draft/);
    assert.ok(!art.includes('Gahroot/triten-os'), 'private repo name never published');
    assert.equal((await db.query('SELECT status, pr_number FROM articles')).rows[0].pr_number, 12);
  } finally { await fx.cleanup(); }
});
