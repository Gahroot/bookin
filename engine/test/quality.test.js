import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import * as discover from '../src/jobs/discover.js';
import * as draft from '../src/jobs/draft.js';
import { styleIssues, stripFootnoteDefs, WRITER_SYSTEM, exemplarBlock } from '../src/article.js';
import { parseDoc } from '../src/content.js';
import { insertEvidence } from '../src/evidence.js';
import { memDb } from './helpers.js';

const quiet = { log() {}, error() {} };
const ev = (id, date, kind = 'github-commit', ref = id) => ({ id, source_id: 's', kind, project: 'ez-coder', client: 'EZ Coder', text: `text ${id}`, ref, date, public: true, url: 'https://github.com/x' });

test('adjustScore: 1-10 clamp, single item capped at 6, single day loses 1, multi-day clusters keep score', () => {
  assert.equal(discover.adjustScore(9, [ev('a', '2026-10-01')]).score, 6);
  assert.equal(discover.adjustScore(9, [ev('a', '2026-10-01'), ev('b', '2026-10-01')]).score, 8);
  assert.equal(discover.adjustScore(9, [ev('a', '2026-10-01'), ev('b', '2026-10-01', 'worklog')]).score, 9);
  assert.equal(discover.adjustScore(9, [ev('a', '2026-10-01'), ev('b', '2026-10-05')]).score, 9);
  assert.equal(discover.adjustScore(80, [ev('a', '2026-10-01'), ev('b', '2026-10-05')]).score, 8, 'a 0-100 reply is rescaled');
  assert.equal(discover.adjustScore('x', []).score, 1);
});

test('discover: stores 1-10 score + rationale, skips anything an existing (draft) article already covers', async () => {
  const db = await memDb();
  await insertEvidence(db, [ev('e1', '2026-10-01', 'github-commit', 'Gahroot/ezcoder@aaa'), ev('e2', '2026-10-03', 'github-commit', 'Gahroot/ezcoder@bbb'), ev('e3', '2026-10-04'), ev('e4', '2026-10-09'), ev('e5', '2026-10-09')]);
  let prompt = '';
  const out = await discover.run({ db, env: {}, log: quiet, deps: {
    existingContent: async () => ({ articles: [{ slug: 'a-paid-ai-tier', title: 'A paid AI tier should never become an automatic fallback', status: 'draft', refs: ['Gahroot/ezcoder@aaa', 'Gahroot/ezcoder@bbb'] }], projects: [] }),
    completeJson: async (sys, p) => { prompt = sys; return { accomplishments: [
      { project: 'ez-coder', title: 'Paid model confirmation', evidence: ['e1', 'e2'], score: 9, rationale: 'x' },
      { project: 'ez-coder', title: 'Unattended agents ship client work overnight with review', problem: 'p', outcome: 'o', evidence: ['e3', 'e4'], score: 8, rationale: 'Operators care about throughput.' },
      { project: 'ez-coder', title: 'Settings toggle', evidence: ['e5'], score: 9, rationale: 'y' }] }; }
  } });
  assert.match(prompt, /1-3: tool-internal configuration/);
  assert.equal(out.duplicates[0].title, 'Paid model confirmation');
  assert.match(out.duplicates[0].duplicateOf, /a-paid-ai-tier/);
  const rows = (await db.query('SELECT title, exec_score, score_rationale FROM accomplishments ORDER BY id')).rows;
  assert.deepEqual(rows.map((r) => [r.title, r.exec_score]), [['Unattended agents ship client work overnight with review', 8], ['Settings toggle', 6]]);
  assert.match(rows[1].score_rationale, /capped at 6/);
  assert.equal(out.draftable, 1);
});

test('draft: nothing below 7 is drafted; covered accomplishments are skipped; exemplar is passed to the writer', async () => {
  const db = await memDb();
  await insertEvidence(db, [ev('e1', '2026-10-01', 'github-commit', 'Gahroot/ezcoder@aaa'), ev('e2', '2026-10-03')]);
  await db.query(`INSERT INTO accomplishments (fingerprint, title, evidence_ids, exec_score, score) VALUES ('low','Minor toggle','["e2"]',6,60), ('cov','Paid tier fallback','["e1"]',9,90)`);
  const calls = [];
  const r = await draft.run({ db, env: { GITHUB_TOKEN: 't' }, log: quiet, deps: {
    existingContent: async () => ({ articles: [{ slug: 'a-paid-ai-tier', title: 'Something else', refs: ['Gahroot/ezcoder@aaa'] }], projects: [] }),
    completeJson: async () => { calls.push('codex'); return {}; }, readExemplar: async () => 'X'
  } });
  assert.match(r.skipped, /no open accomplishment scores >= 7/);
  assert.deepEqual(r.covered, [{ id: 2, by: 'a-paid-ai-tier' }]);
  assert.deepEqual(calls, []);
  assert.equal((await db.query("SELECT status FROM accomplishments WHERE fingerprint = 'cov'")).rows[0].status, 'covered');
  assert.match(exemplarBlock('SEED'), /STYLE EXEMPLAR[\s\S]*SEED/);
  assert.equal(draft.EXEMPLAR, 'content/articles/portfolio-risk-review-in-minutes-with-chatgpt.md');
});

test('writer prompt sets the bar: arc, state once, no hedging, no footnote definitions', () => {
  for (const re of [/What it means for you/, /state each claim ONCE/, /No hedging chains/, /Do NOT write footnote definitions/, /unattended/]) assert.match(WRITER_SYSTEM, re);
});

test('style checks catch the unpublished field note and pass the seed articles', () => {
  const bad = parseDoc(readFileSync(new URL('../../content/articles/a-paid-ai-tier-should-never-become-an-automatic-fallback.md', import.meta.url), 'utf8'));
  const issues = styleIssues(bad.data, bad.body);
  assert.ok(issues.some((i) => /answer\/FAQ copies body/.test(i)), issues.join('\n'));
  assert.ok(issues.some((i) => /hedging/.test(i)));
  assert.ok(issues.some((i) => /footnote definitions/.test(i)));
  for (const f of ['portfolio-risk-review-in-minutes-with-chatgpt', 'shipping-business-software-with-ai-agents', 'autonomous-content-engine-fact-check-gate']) {
    const d = parseDoc(readFileSync(new URL(`../../content/articles/${f}.md`, import.meta.url), 'utf8'));
    assert.deepEqual(styleIssues(d.data, d.body), [], f);
  }
  assert.equal(stripFootnoteDefs('Text.[^E1]\n\n[^E1]: Supplied public commit evidence.\n[^E2]: x'), 'Text.[^E1]');
});
