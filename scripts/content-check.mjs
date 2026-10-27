#!/usr/bin/env node
// Validates content/projects, content/articles and content/social against CONTRACT.md section 1-2.
// Usage: node scripts/content-check.mjs [--json] [--root <dir>]
import { readdirSync, readFileSync, existsSync, statSync } from 'node:fs'
import { join, basename, relative, resolve } from 'node:path'
import { pathToFileURL } from 'node:url'
import { parse } from 'yaml'

const CAPABILITIES = [
  'ai-agents',
  'mcp',
  'data-platform',
  'automation',
  'content-engine',
  'internal-tools',
  'voice-ai',
  'analytics',
]
const EVIDENCE_KINDS = ['github-repo', 'github-commit', 'github-pr', 'worklog', 'owner-attested', 'public-url']
const CLAIM_KINDS = ['outcome', 'metric', 'capability', 'time-saved']
const SLUG_RE = /^[a-z0-9]+(?:-[a-z0-9]+)*$/
const DATE_RE = /^\d{4}-\d{2}-\d{2}$/

export const SECRET_PATTERNS = [
  ['GitHub token', /\b(?:ghp|gho|ghu|ghs|ghr)_[A-Za-z0-9]{16,}/],
  ['GitHub fine-grained token', /\bgithub_pat_[A-Za-z0-9_]{16,}/],
  ['Anthropic key', /\bsk-ant-[A-Za-z0-9_-]{8,}/],
  ['API key (sk-)', /\bsk-[A-Za-z0-9_-]{16,}/],
  ['Resend key', /\bre_[A-Za-z0-9_]{16,}/],
  ['Cal.com key', /\bcal_live_[A-Za-z0-9_]{8,}/],
  ['AWS access key', /\bAKIA[0-9A-Z]{16}\b/],
  ['private key block', /-----BEGIN[A-Z ]*-----/],
  ['Bearer token', /\bBearer\s+[A-Za-z0-9._~+/=-]{16,}/],
  ['api_key assignment', /\bapi[_-]?key\s*[=:]\s*['"]?[^\s'"]{4,}/i],
  ['password assignment', /\bpassword\s*[=:]\s*['"]?[^\s'"]{4,}/i],
  ['JWT', /\beyJ[A-Za-z0-9_-]{8,}\.[A-Za-z0-9_-]{8,}/],
  ['hex token (32+)', /\b(?=[a-f0-9]*\d)(?=[a-f0-9]*[a-f])[a-f0-9]{32,}\b/i],
  ['base64 token (32+)', /(?<![A-Za-z0-9+/_-])(?=[A-Za-z0-9+/]*\d)(?=[A-Za-z0-9+/]*[a-z])(?=[A-Za-z0-9+/]*[A-Z])[A-Za-z0-9+/]{32,}={0,2}(?![A-Za-z0-9+/_-])/],
]
export const INTERNAL_HOST_PATTERNS = [
  ['Railway internal host', /\b[\w.-]+\.railway\.internal\b/i],
  ['localhost URL', /\bhttps?:\/\/(?:localhost|127\.0\.0\.1|0\.0\.0\.0)(?::\d+)?/i],
  ['private IP (10.x)', /(?<![\d.])10\.\d{1,3}\.\d{1,3}\.\d{1,3}(?![\d.])/],
  ['private IP (192.168.x)', /(?<![\d.])192\.168\.\d{1,3}\.\d{1,3}(?![\d.])/],
]

const MONTHS =
  '(?:Jan(?:uary)?|Feb(?:ruary)?|Mar(?:ch)?|Apr(?:il)?|May|Jun(?:e)?|Jul(?:y)?|Aug(?:ust)?|Sep(?:t(?:ember)?)?|Oct(?:ober)?|Nov(?:ember)?|Dec(?:ember)?)'

export function splitFrontmatter(raw) {
  const text = raw.replace(/^\uFEFF/, '').replace(/\r\n/g, '\n')
  if (!text.startsWith('---\n')) return { error: 'missing YAML frontmatter (file must start with ---)' }
  const end = text.indexOf('\n---', 4)
  if (end === -1) return { error: 'unterminated YAML frontmatter' }
  const after = text.slice(end + 4)
  if (after.length > 0 && !after.startsWith('\n')) return { error: 'frontmatter closing --- must be on its own line' }
  let data
  try {
    data = parse(text.slice(4, end))
  } catch (e) {
    return { error: `YAML parse error: ${e instanceof Error ? e.message.split('\n')[0] : String(e)}` }
  }
  if (data === null || typeof data !== 'object' || Array.isArray(data)) {
    return { error: 'frontmatter must be a YAML mapping' }
  }
  return { data, body: after.replace(/^\n/, '') }
}

const isStr = (v) => typeof v === 'string' && v.trim().length > 0
const isDate = (v) => (typeof v === 'string' && DATE_RE.test(v)) || (v instanceof Date && !isNaN(v))
const isUrl = (v) => {
  if (typeof v !== 'string') return false
  try {
    const u = new URL(v)
    return u.protocol === 'https:' || u.protocol === 'http:'
  } catch {
    return false
  }
}
const words = (s) => s.trim().split(/\s+/).filter(Boolean).length

function checkEvidence(list, err) {
  const ids = new Set()
  if (!Array.isArray(list) || list.length === 0) {
    err('evidence must be a non-empty list')
    return ids
  }
  list.forEach((e, i) => {
    const at = `evidence[${i}]`
    if (!e || typeof e !== 'object') return err(`${at} must be a mapping`)
    if (!isStr(e.id) || !/^E\d+$/.test(e.id)) err(`${at}.id must look like E1`)
    else if (ids.has(e.id)) err(`${at}.id ${e.id} is duplicated`)
    else ids.add(e.id)
    if (!EVIDENCE_KINDS.includes(e.kind)) err(`${at}.kind must be one of ${EVIDENCE_KINDS.join(', ')}`)
    if (!isStr(e.title)) err(`${at}.title is required`)
    if (!isDate(e.date)) err(`${at}.date must be YYYY-MM-DD`)
    if (typeof e.public !== 'boolean') err(`${at}.public must be true or false`)
    if (!isStr(e.ref)) err(`${at}.ref is required`)
    if (e.public === true && !isUrl(e.url)) err(`${at} (${e.id}) is public but has no valid url`)
    if (e.public === false && e.url !== undefined) err(`${at} (${e.id}) is private and must not have a url`)
    if ((e.kind === 'github-commit' || e.kind === 'github-repo') && isStr(e.ref) && !/^[\w.-]+\/[\w.-]+(@[0-9a-f]{7,40})?$|^[\w.-]+@[0-9a-f]{7,40}$/.test(e.ref)) {
      err(`${at}.ref must be owner/repo@sha or repo@sha`)
    }
  })
  return ids
}

function checkEvidenceRefs(refs, ids, at, err) {
  if (!Array.isArray(refs) || refs.length === 0) return err(`${at}.evidence must list evidence ids`)
  for (const r of refs) if (!ids.has(r)) err(`${at} cites missing evidence id ${String(r)}`)
}

function checkMarkers(body, ids, err) {
  for (const m of body.matchAll(/\[\^([^\]\s]+)\]/g)) {
    if (!ids.has(m[1])) err(`marker [^${m[1]}] has no matching evidence`)
  }
}

/** Remove code, URLs, markers, dates and list ordinals, then return the numeric tokens left. */
export function bodyNumbers(text) {
  let t = text
    .replace(/```[\s\S]*?```/g, ' ')
    .replace(/`[^`\n]*`/g, ' ')
    .replace(/\[\^[^\]]+\]:?/g, ' ')
    .replace(/\]\([^)]*\)/g, '] ')
    .replace(/<?https?:\/\/[^\s)>]+>?/g, ' ')
    .replace(/(?<![\w-])\/[\w/-]*[\w-]/g, ' ')
    .replace(/\b\d{4}-\d{2}-\d{2}\b/g, ' ')
    .replace(/\b\d{1,2}:\d{2}(?::\d{2})?\b/g, ' ')
    .replace(new RegExp(`\\b${MONTHS}\\.?\\s+\\d{1,2}(?:st|nd|rd|th)?(?:,?\\s+\\d{4})?\\b`, 'g'), ' ')
    .replace(new RegExp(`\\b\\d{1,2}(?:st|nd|rd|th)?\\s+${MONTHS}\\.?(?:,?\\s+\\d{4})?\\b`, 'g'), ' ')
    .replace(new RegExp(`\\b${MONTHS}\\s+\\d{4}\\b`, 'g'), ' ')
    .replace(/(?<![\w$])(?:19|20)\d{2}(?![\w%])/g, ' ')
    .replace(/^\s*\d+[.)]\s/gm, ' ')
    .replace(/^#{1,6}\s+\d+[.)]?\s/gm, ' ')
  const out = []
  for (const m of t.matchAll(/(?<![\w.-])\$?\d[\d,]*(?:\.\d+)?(?:%|\+|[kKmMbB](?![a-zA-Z]))?(?![\w-]|\.\d)/g)) out.push(m[0])
  return out
}

const normNum = (s) => s.replace(/[$,+%]/g, '').replace(/[kKmMbB]$/, '').replace(/\.0+$/, '')

export function uncoveredNumbers(text, claimTexts) {
  const covered = new Set()
  for (const c of claimTexts) for (const n of bodyNumbers(c)) covered.add(normNum(n))
  // also allow numbers spelled in claims next to words (e.g. "8+ hours")
  for (const c of claimTexts) for (const m of c.matchAll(/\d[\d,]*(?:\.\d+)?/g)) covered.add(normNum(m[0]))
  return [...new Set(bodyNumbers(text).filter((n) => !covered.has(normNum(n))))]
}

function scanSafety(raw, body, err) {
  // Long-token heuristics skip URLs (commit links, paths); every other pattern scans the raw file.
  const noUrls = raw.replace(/https?:\/\/[^\s)>\]]+/g, ' ')
  for (const [name, re] of SECRET_PATTERNS) {
    const target = name.endsWith('token (32+)') ? noUrls : raw
    if (re.test(target)) err(`secret pattern found: ${name}`)
  }
  for (const [name, re] of INTERNAL_HOST_PATTERNS) if (re.test(raw)) err(`internal host found: ${name}`)
  const lines = body.split('\n')
  let start = -1
  lines.forEach((l, i) => {
    if (/^\s*(```|~~~)/.test(l)) {
      if (start === -1) start = i
      else {
        if (i - start - 1 > 15) err(`fenced code block at body line ${start + 1} is longer than 15 lines`)
        start = -1
      }
    }
  })
  if (start !== -1) err(`unterminated fenced code block at body line ${start + 1}`)
}

function checkNumbers(text, claims, where, err) {
  const missing = uncoveredNumbers(text, claims)
  if (missing.length) err(`${where} has numbers not covered by any claim: ${missing.join(', ')}`)
}

function checkProject(d, body, raw, slug, err) {
  if (d.slug !== slug) err(`slug "${String(d.slug)}" != filename "${slug}"`)
  if (!SLUG_RE.test(slug)) err('filename must be lowercase-hyphen')
  for (const k of ['title', 'client', 'summary', 'problem', 'role']) if (!isStr(d[k])) err(`${k} is required`)
  if (d.client_url !== undefined && !isUrl(d.client_url)) err('client_url must be a URL')
  if (!['live', 'in-progress', 'archived'].includes(d.status)) err('status must be live | in-progress | archived')
  if (!isDate(d.started)) err('started must be YYYY-MM-DD')
  if (!isDate(d.updated)) err('updated must be YYYY-MM-DD')
  if (!Array.isArray(d.capabilities) || d.capabilities.length === 0) err('capabilities must be a non-empty list')
  else for (const c of d.capabilities) if (!CAPABILITIES.includes(c)) err(`unknown capability "${String(c)}"`)
  if (!Array.isArray(d.stack) || !d.stack.every(isStr)) err('stack must be a list of strings')
  if (d.links !== undefined) {
    if (!Array.isArray(d.links)) err('links must be a list')
    else d.links.forEach((l, i) => {
      if (!l || !isStr(l.label) || !isUrl(l.url)) err(`links[${i}] needs label and url`)
    })
  }
  if (d.featured !== undefined && typeof d.featured !== 'boolean') err('featured must be boolean')
  if (d.order !== undefined && !Number.isInteger(d.order)) err('order must be an integer')
  const ids = checkEvidence(d.evidence, err)
  const texts = []
  if (!Array.isArray(d.outcomes) || d.outcomes.length === 0) err('outcomes must be a non-empty list')
  else d.outcomes.forEach((o, i) => {
    if (!o || !isStr(o.text)) return err(`outcomes[${i}].text is required`)
    texts.push(o.text)
    checkEvidenceRefs(o.evidence, ids, `outcomes[${i}]`, err)
  })
  checkMarkers(body, ids, err)
  for (const k of ['summary', 'problem', 'role']) if (isStr(d[k])) checkNumbers(d[k], texts, k, err)
  checkNumbers(body, texts, 'body', err)
  scanSafety(raw, body, err)
}

function checkArticle(d, body, raw, slug, projects, err) {
  if (d.slug !== slug) err(`slug "${String(d.slug)}" != filename "${slug}"`)
  if (!SLUG_RE.test(slug)) err('filename must be lowercase-hyphen')
  for (const k of ['title', 'description', 'audience', 'primary_keyword', 'answer']) if (!isStr(d[k])) err(`${k} is required`)
  if (!['case-study', 'article', 'field-note'].includes(d.type)) err('type must be case-study | article | field-note')
  if (isStr(d.description) && (d.description.length < 150 || d.description.length > 160)) {
    err(`description must be 150-160 chars (is ${d.description.length})`)
  }
  if (isStr(d.answer) && (words(d.answer) < 40 || words(d.answer) > 60)) err(`answer must be 40-60 words (is ${words(d.answer)})`)
  if (!isDate(d.date)) err('date must be YYYY-MM-DD')
  if (!isDate(d.updated)) err('updated must be YYYY-MM-DD')
  if (!['draft', 'approved'].includes(d.status)) err('status must be draft | approved')
  if (d.status === 'approved' && !isStr(d.approved_by)) err('approved without approved_by')
  if (d.project !== undefined && !projects.has(d.project)) err(`project "${String(d.project)}" is not a known project slug`)
  if (d.secondary_keywords !== undefined && (!Array.isArray(d.secondary_keywords) || !d.secondary_keywords.every(isStr))) {
    err('secondary_keywords must be a list of strings')
  }
  if (d.hero_image !== undefined && !isStr(d.hero_image)) err('hero_image must be a path')
  if (!Array.isArray(d.faq)) err('faq must be a list')
  else d.faq.forEach((f, i) => {
    if (!f || !isStr(f.q) || !isStr(f.a)) err(`faq[${i}] needs q and a`)
  })
  if (!['book', 'prestyj'].includes(d.cta)) err('cta must be book | prestyj')
  const ids = checkEvidence(d.evidence, err)
  const texts = []
  if (!Array.isArray(d.claims) || d.claims.length === 0) err('claims must be a non-empty list')
  else d.claims.forEach((c, i) => {
    if (!c || !isStr(c.text)) return err(`claims[${i}].text is required`)
    texts.push(c.text)
    if (!CLAIM_KINDS.includes(c.kind)) err(`claims[${i}].kind must be one of ${CLAIM_KINDS.join(', ')}`)
    checkEvidenceRefs(c.evidence, ids, `claims[${i}]`, err)
  })
  checkMarkers(body, ids, err)
  checkNumbers(body, texts, 'body', err)
  if (isStr(d.answer)) checkNumbers(d.answer, texts, 'answer', err)
  if (Array.isArray(d.faq)) d.faq.forEach((f, i) => f && isStr(f.a) && checkNumbers(f.a, texts, `faq[${i}].a`, err))
  scanSafety(raw, body, err)
  return texts
}

function checkSocial(d, body, raw, dirSlug, articleClaims, err) {
  if (d.source_article !== dirSlug) err(`source_article "${String(d.source_article)}" != folder "${dirSlug}"`)
  const claims = articleClaims.get(d.source_article)
  if (!claims) err(`source_article "${String(d.source_article)}" is not a known article`)
  if (!['draft', 'ready'].includes(d.status)) err('status must be draft | ready')
  if (!isStr(d.hook)) err('hook is required')
  if (!body.trim()) err('body is empty')
  checkNumbers(`${isStr(d.hook) ? d.hook : ''}\n${body}`, claims ?? [], 'body', err)
  scanSafety(raw, body, err)
}

const mdFiles = (dir) =>
  existsSync(dir) ? readdirSync(dir).filter((f) => f.endsWith('.md')).sort() : []

export function checkContent(root) {
  const contentDir = join(root, 'content')
  const results = []
  const record = (file) => {
    const r = { file: relative(root, file), errors: [] }
    results.push(r)
    return (reason) => r.errors.push(reason)
  }
  const load = (file, err) => {
    const raw = readFileSync(file, 'utf8')
    const fm = splitFrontmatter(raw)
    if (fm.error) {
      err(fm.error)
      return null
    }
    return { raw, ...fm }
  }

  const projects = new Set()
  const projectDir = join(contentDir, 'projects')
  for (const f of mdFiles(projectDir)) {
    const file = join(projectDir, f)
    const err = record(file)
    const slug = basename(f, '.md')
    const doc = load(file, err)
    if (!doc) continue
    projects.add(slug)
    checkProject(doc.data, doc.body, doc.raw, slug, err)
  }

  const articleClaims = new Map()
  const articleDir = join(contentDir, 'articles')
  for (const f of mdFiles(articleDir)) {
    const file = join(articleDir, f)
    const err = record(file)
    const slug = basename(f, '.md')
    const doc = load(file, err)
    if (!doc) continue
    articleClaims.set(slug, checkArticle(doc.data, doc.body, doc.raw, slug, projects, err))
  }

  const socialDir = join(contentDir, 'social')
  if (existsSync(socialDir)) {
    for (const d of readdirSync(socialDir).sort()) {
      const dir = join(socialDir, d)
      if (!statSync(dir).isDirectory()) continue
      for (const f of mdFiles(dir)) {
        const file = join(dir, f)
        const err = record(file)
        if (!['linkedin.md', 'youtube.md'].includes(f)) err('social files must be linkedin.md or youtube.md')
        const doc = load(file, err)
        if (!doc) continue
        checkSocial(doc.data, doc.body, doc.raw, d, articleClaims, err)
      }
    }
  }

  const errors = results.flatMap((r) => r.errors.map((reason) => ({ file: r.file, reason })))
  return { ok: errors.length === 0, checked: results.length, errors, files: results }
}

function main(argv) {
  const json = argv.includes('--json')
  const i = argv.indexOf('--root')
  const root = i !== -1 && argv[i + 1] ? argv[i + 1] : process.cwd()
  const res = checkContent(root)
  if (json) {
    process.stdout.write(`${JSON.stringify(res, null, 2)}\n`)
  } else if (res.ok) {
    console.log(`content-check: ${res.checked} files OK`)
  } else {
    for (const e of res.errors) console.error(`${e.file}: ${e.reason}`)
    console.error(`content-check: ${res.errors.length} problem(s) in ${res.checked} files`)
  }
  return res.ok ? 0 : 1
}

if (process.argv[1] && import.meta.url === pathToFileURL(resolve(process.argv[1])).href) process.exitCode = main(process.argv.slice(2))
