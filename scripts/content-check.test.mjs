import { test } from 'node:test'
import assert from 'node:assert/strict'
import { mkdtempSync, mkdirSync, writeFileSync, rmSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join, dirname } from 'node:path'
import { spawnSync } from 'node:child_process'
import { fileURLToPath } from 'node:url'
import { checkContent, bodyNumbers } from './content-check.mjs'

const SCRIPT = join(dirname(fileURLToPath(import.meta.url)), 'content-check.mjs')

const project = (over = '') => `---
slug: demo-project
title: Demo Project
client: Personal project
status: live
started: 2026-06-01
updated: 2026-10-27
summary: Teams answer questions in minutes.
problem: Data was scattered.
role: Built it.
capabilities: [ai-agents, mcp]
stack: [TypeScript]
links: [{label: Site, url: https://example.com}]
outcomes:
  - text: Exposes 22 read-only tools.
    evidence: [E1]
evidence:
  - id: E1
    kind: github-commit
    title: Commit adding tools
    date: 2026-10-20
    public: false
    ref: demo@abc1234
featured: true
order: 1
${over}---
It has 22 tools.[^E1]
`

const ANSWER =
  'A demo answer that is long enough to satisfy the answer engine box rule because it needs at least forty words and no more than sixty words in total, so this sentence keeps going with plain words until it reaches the required count for the validator to accept it here.'

const article = ({ body = 'Review took 8+ hours and now about 10 minutes.[^E1]\n', fm = '' } = {}) => `---
title: Demo
slug: demo-article
type: case-study
description: ${'d'.repeat(155)}
date: 2026-10-27
updated: 2026-10-27
status: approved
approved_by: auto-review (test)
project: demo-project
audience: COOs
primary_keyword: demo
secondary_keywords: [a, b]
answer: ${ANSWER}
faq: [{q: Why?, a: Because.}]
cta: book
claims:
  - text: An 8+ hours review now takes about 10 minutes.
    kind: time-saved
    evidence: [E1]
evidence:
  - id: E1
    kind: owner-attested
    title: Owner statement
    date: 2026-10-27
    public: false
    ref: owner-statement-2026-10-27
${fm}---
${body}`

const social = (body = 'From 8 hours to 10 minutes.\n') => `---
source_article: demo-article
status: draft
hook: A day became minutes.
---
${body}`

function fixture(files) {
  const root = mkdtempSync(join(tmpdir(), 'content-check-'))
  for (const [rel, text] of Object.entries(files)) {
    const p = join(root, rel)
    mkdirSync(dirname(p), { recursive: true })
    writeFileSync(p, text)
  }
  return root
}

function good(extra = {}) {
  return {
    'content/projects/demo-project.md': project(),
    'content/articles/demo-article.md': article(),
    'content/social/demo-article/linkedin.md': social(),
    ...extra,
  }
}

function reasons(files) {
  const root = fixture(files)
  try {
    return checkContent(root).errors.map((e) => `${e.file}: ${e.reason}`)
  } finally {
    rmSync(root, { recursive: true, force: true })
  }
}

test('good fixture passes', () => {
  assert.deepEqual(reasons(good()), [])
})

test('CLI exit codes and --json', () => {
  const ok = fixture(good())
  const bad = fixture(good({ 'content/articles/demo-article.md': article({ fm: 'status: nope\n' }) }))
  try {
    const r1 = spawnSync(process.execPath, [SCRIPT, '--json', '--root', ok], { encoding: 'utf8' })
    assert.equal(r1.status, 0)
    assert.equal(JSON.parse(r1.stdout).ok, true)
    const r2 = spawnSync(process.execPath, [SCRIPT, '--json', '--root', bad], { encoding: 'utf8' })
    assert.equal(r2.status, 1)
    const out = JSON.parse(r2.stdout)
    assert.equal(out.ok, false)
    assert.ok(out.errors.length > 0 && out.errors[0].file)
    const r3 = spawnSync(process.execPath, [SCRIPT, '--root', bad], { encoding: 'utf8' })
    assert.equal(r3.status, 1)
    assert.match(r3.stderr, /demo-article\.md/)
  } finally {
    rmSync(ok, { recursive: true, force: true })
    rmSync(bad, { recursive: true, force: true })
  }
})

const cases = [
  ['schema invalid', { 'content/projects/demo-project.md': project().replace('status: live', 'status: done') }, /status must be/],
  ['bad capability', { 'content/projects/demo-project.md': project().replace('[ai-agents, mcp]', '[magic]') }, /unknown capability/],
  ['slug != filename', { 'content/projects/other.md': project() }, /slug "demo-project" != filename "other"/],
  ['approved without approved_by', { 'content/articles/demo-article.md': article().replace(/approved_by:.*\n/, '') }, /approved without approved_by/],
  ['marker without evidence', { 'content/articles/demo-article.md': article({ body: 'Text.[^E9]\n' }) }, /\[\^E9\] has no matching evidence/],
  ['claim cites missing evidence', { 'content/articles/demo-article.md': article().replace('evidence: [E1]', 'evidence: [E7]') }, /cites missing evidence id E7/],
  ['public evidence without url', { 'content/articles/demo-article.md': article().replace('public: false', 'public: true') }, /public but has no valid url/],
  ['unknown project', { 'content/articles/demo-article.md': article().replace('project: demo-project', 'project: nope') }, /not a known project slug/],
  ['GitHub token', { 'content/articles/demo-article.md': article({ body: 'token ghp_abcdefghijklmnopqrstuvwx1234\n' }) }, /secret pattern found: GitHub token/],
  ['Anthropic key', { 'content/articles/demo-article.md': article({ body: 'k sk-ant-abc123def456\n' }) }, /Anthropic key/],
  ['AWS key', { 'content/articles/demo-article.md': article({ body: 'AKIAABCDEFGHIJKLMNOP\n' }) }, /AWS access key/],
  ['private key', { 'content/articles/demo-article.md': article({ body: '-----BEGIN PRIVATE KEY-----\n' }) }, /private key block/],
  ['Bearer', { 'content/articles/demo-article.md': article({ body: 'Authorization: Bearer abcdefghijklmnopqrstuv\n' }) }, /Bearer token/],
  ['password=', { 'content/articles/demo-article.md': article({ body: 'password=hunter22\n' }) }, /password assignment/],
  ['JWT', { 'content/articles/demo-article.md': article({ body: 'eyJhbGciOiJIUzI1.eyJzdWIiOiIxMjM0\n' }) }, /JWT/],
  ['hex token', { 'content/articles/demo-article.md': article({ body: 'abcdef0123456789abcdef0123456789ab\n' }) }, /hex token/],
  ['Railway internal', { 'content/articles/demo-article.md': article({ body: 'see api.railway.internal\n' }) }, /Railway internal host/],
  ['localhost', { 'content/articles/demo-article.md': article({ body: 'open http://localhost:3000\n' }) }, /localhost URL/],
  ['private IP', { 'content/articles/demo-article.md': article({ body: 'host 192.168.1.20\n' }) }, /192\.168/],
  ['long code block', { 'content/articles/demo-article.md': article({ body: '```\n' + 'x\n'.repeat(16) + '```\n' }) }, /longer than 15 lines/],
  ['uncovered number', { 'content/articles/demo-article.md': article({ body: 'We saved 40% and $5,000 in 3 hours.\n' }) }, /not covered by any claim: 40%, \$5,000, 3/],
  ['social uncovered number', { 'content/social/demo-article/linkedin.md': social('Saved 99 hours.\n') }, /not covered by any claim: 99/],
  ['social unknown article', { 'content/social/demo-article/linkedin.md': social().replace('source_article: demo-article', 'source_article: x') }, /source_article "x"/],
  ['missing frontmatter', { 'content/projects/demo-project.md': 'no frontmatter' }, /missing YAML frontmatter/],
  ['description length', { 'content/articles/demo-article.md': article().replace(/description: d+/, 'description: short') }, /150-160 chars/],
]

for (const [name, override, re] of cases) {
  test(`fails: ${name}`, () => {
    const r = reasons(good(override))
    assert.ok(r.some((x) => re.test(x)), `expected ${re} in:\n${r.join('\n')}`)
  })
}

test('number heuristic ignores dates, ordinals, links and markers', () => {
  const text = `1. First step on 2026-10-27, 27 Oct 2026 and October 2026.[^E12]
2. At 0:30-1:45 see [work](/work/triten-os) and https://example.com/a1/22.
## 3. Heading`
  assert.deepEqual(bodyNumbers(text), [])
  assert.deepEqual(bodyNumbers('About 10 minutes, 8+ hours, 22 tools, $1.5M and 40%.'), ['10', '8+', '22', '$1.5M', '40%'])
})

test('words like risk-ranked are not secrets', () => {
  assert.deepEqual(reasons(good({ 'content/articles/demo-article.md': article({ body: 'A risk-ranked list for every asset-manager.\n' }) })), [])
})
