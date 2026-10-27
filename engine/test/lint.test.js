import test from 'node:test';
import assert from 'node:assert/strict';
import { confidentialityLint, uncoveredNumbers } from '../src/lint.js';

const doc = (body, fm = 'title: T') => `---\n${fm}\n---\n\n${body}\n`;
const lint = (body, evidence = [], fm) => confidentialityLint({ 'content/articles/a.md': doc(body, fm) }, { evidence });

test('clean executive prose passes', () => {
  assert.deepEqual(lint('Triten needed faster portfolio answers. Executives now ask ChatGPT directly.', [{ public: false, text: 'Triten MCP server shipped' }]), []);
});

test('secrets fail', () => {
  for (const s of ['ghp_' + 'a'.repeat(30), 'github_pat_' + 'B'.repeat(30), 'sk-ant-' + 'x'.repeat(20), 'AKIA' + 'ABCDEFGHIJKLMNOP', '-----BEGIN PRIVATE KEY-----', 'password=hunter22', 'eyJabcdefghij.abcdefghijk', 'a1b2c3d4'.repeat(5)]) {
    assert.ok(lint(`Here: ${s}`).length > 0, s);
  }
});

test('internal hosts fail', () => {
  for (const s of ['db.railway.internal', 'http://localhost:3000/x', '10.0.0.4', '192.168.1.20']) assert.ok(lint(`See ${s} now.`).some((i) => /host|localhost|IP/.test(i)), s);
});

test('code blocks and file paths fail', () => {
  assert.ok(lint('Intro.\n\n```js\nconst a = 1\n```').some((i) => /fenced code/.test(i)));
  assert.ok(lint('We changed src/lib/portfolio.ts last week.').some((i) => /file path/.test(i)));
});

test('private names and dollar figures only allowed when public', () => {
  const priv = [{ public: false, text: 'Refinanced Sunset Plaza for $4.2M' }];
  const issues = lint('The team reviewed Sunset Plaza and moved $4.2M faster.', priv);
  assert.ok(issues.some((i) => /Sunset Plaza/.test(i)));
  assert.ok(issues.some((i) => /\$4\.2M/.test(i)));
  assert.deepEqual(lint('The team reviewed Sunset Plaza and moved $4.2M faster.', [{ public: true, url: 'https://x', text: 'Sunset Plaza $4.2M' }]), []);
});

test('markers must resolve; private evidence never linked', () => {
  const fm = 'title: T\nclaims:\n  - text: x\n    evidence: [E2]\nevidence:\n  - id: E1\n    public: false\n    ref: triten-os@abc\n    url: https://github.com/x';
  const issues = lint('Done.[^E9]', [], fm);
  assert.ok(issues.some((i) => /\[\^E9\]/.test(i)));
  assert.ok(issues.some((i) => /missing evidence E2/.test(i)));
  assert.ok(issues.some((i) => /has a url/.test(i)));
});

test('uncovered numbers', () => {
  const data = { claims: [{ text: 'Review dropped from 8 hours to about 10 minutes.' }] };
  assert.deepEqual(uncoveredNumbers(data, 'It took 8 hours, now 10 minutes. In 2026 we shipped.\n1. First step'), []);
  assert.deepEqual(uncoveredNumbers(data, 'We saved 40% and 3 days.'), ['40%', '3 days']);
});
