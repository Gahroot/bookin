import { parse as parseYaml } from 'yaml'
import rehypeSlug from 'rehype-slug'
import rehypeStringify from 'rehype-stringify'
import remarkGfm from 'remark-gfm'
import remarkParse from 'remark-parse'
import remarkRehype from 'remark-rehype'
import { unified } from 'unified'
import { isCapability } from '@/lib/site'
import type {
  Article,
  ArticleType,
  Claim,
  ClaimKind,
  Evidence,
  EvidenceKind,
  Faq,
  Link,
  Project,
} from './types'

type Data = Record<string, unknown>
export type Parsed<T> = { ok: true; value: T } | { ok: false; reason: string }

export function splitFrontmatter(source: string): { data: Data; body: string } | null {
  const text = source.replace(/^\uFEFF/, '').replace(/\r\n/g, '\n')
  const lines = text.split('\n')
  let start = 0
  if (lines[0]?.trim() === '---') start = 1
  const end = lines.findIndex((line, i) => i >= start && line.trim() === '---')
  if (end === -1) return null
  const parsed: unknown = parseYaml(lines.slice(start, end).join('\n'))
  if (!isRecord(parsed)) return null
  return { data: parsed, body: lines.slice(end + 1).join('\n').trim() }
}

function isRecord(v: unknown): v is Data {
  return typeof v === 'object' && v !== null && !Array.isArray(v)
}
function str(v: unknown): string | undefined {
  if (typeof v === 'string') return v.trim() || undefined
  if (v instanceof Date) return v.toISOString().slice(0, 10)
  if (typeof v === 'number') return String(v)
  return undefined
}
function strList(v: unknown): string[] {
  return Array.isArray(v) ? v.map(str).filter((s): s is string => s !== undefined) : []
}
function records(v: unknown): Data[] {
  return Array.isArray(v) ? v.filter(isRecord) : []
}
function oneOf<T extends string>(v: unknown, allowed: readonly T[]): T | undefined {
  const s = str(v)
  return allowed.find((a) => a === s)
}

const EVIDENCE_KINDS = [
  'github-repo',
  'github-commit',
  'github-pr',
  'worklog',
  'owner-attested',
  'public-url',
] as const satisfies readonly EvidenceKind[]
const CLAIM_KINDS = ['outcome', 'metric', 'capability', 'time-saved'] as const satisfies readonly ClaimKind[]
const ARTICLE_TYPES = ['case-study', 'article', 'field-note'] as const satisfies readonly ArticleType[]

function safeUrl(v: unknown): string | undefined {
  const s = str(v)
  if (!s) return undefined
  try {
    const u = new URL(s)
    return u.protocol === 'https:' || u.protocol === 'http:' ? u.toString() : undefined
  } catch {
    return undefined
  }
}

function parseEvidence(v: unknown): Evidence[] {
  return records(v).flatMap((e): Evidence[] => {
    const id = str(e.id)
    const kind = oneOf(e.kind, EVIDENCE_KINDS)
    const title = str(e.title)
    if (!id || !kind || !title) return []
    const isPublic = e.public === true
    const url = isPublic ? safeUrl(e.url) : undefined
    return [
      {
        id,
        kind,
        title,
        date: str(e.date) ?? '',
        public: isPublic && url !== undefined,
        ref: str(e.ref) ?? '',
        ...(url ? { url } : {}),
      },
    ]
  })
}

function parseClaims(v: unknown): Claim[] {
  return records(v).flatMap((c): Claim[] => {
    const text = str(c.text)
    if (!text) return []
    return [{ text, kind: oneOf(c.kind, CLAIM_KINDS) ?? 'outcome', evidence: strList(c.evidence) }]
  })
}

const processor = unified()
  .use(remarkParse)
  .use(remarkGfm)
  .use(remarkRehype)
  .use(rehypeSlug)
  .use(rehypeStringify)

const MARKER = /\[\^([A-Za-z0-9_-]+)\]/g

/** Markdown to HTML. Raw HTML in the source is dropped; [^E1] markers link to the evidence list. */
export function renderMarkdown(body: string, evidenceIds: ReadonlySet<string>): string {
  // Protect markers from GFM footnote handling, then restore them as links after rendering.
  const protectedBody = body.replace(MARKER, (_m, id: string) => `EVREF${id}EVREF`)
  const html = String(processor.processSync(protectedBody))
  return html.replace(/EVREF([A-Za-z0-9_-]+)EVREF/g, (_m, id: string) =>
    evidenceIds.has(id)
      ? `<sup class="ev-ref"><a href="#evidence-${id}" aria-label="Evidence ${id}">${id}</a></sup>`
      : '',
  )
}

export function parseProject(source: string, fileSlug: string): Parsed<Project> {
  const fm = splitFrontmatter(source)
  if (!fm) return { ok: false, reason: 'missing frontmatter' }
  const d = fm.data
  const slug = str(d.slug)
  const title = str(d.title)
  const summary = str(d.summary)
  if (slug !== fileSlug) return { ok: false, reason: 'slug does not match filename' }
  if (!title || !summary) return { ok: false, reason: 'title and summary are required' }
  const evidence = parseEvidence(d.evidence)
  const clientUrl = safeUrl(d.client_url)
  const links: Link[] = records(d.links).flatMap((l) => {
    const label = str(l.label)
    const url = safeUrl(l.url)
    return label && url ? [{ label, url }] : []
  })
  return {
    ok: true,
    value: {
      slug,
      title,
      client: str(d.client) ?? 'Personal project',
      ...(clientUrl ? { clientUrl } : {}),
      status: oneOf(d.status, ['live', 'in-progress', 'archived'] as const) ?? 'live',
      started: str(d.started) ?? '',
      updated: str(d.updated) ?? str(d.started) ?? '',
      summary,
      problem: str(d.problem) ?? '',
      role: str(d.role) ?? '',
      capabilities: strList(d.capabilities).filter(isCapability),
      stack: strList(d.stack),
      links,
      outcomes: records(d.outcomes).flatMap((o) => {
        const text = str(o.text)
        return text ? [{ text, evidence: strList(o.evidence) }] : []
      }),
      evidence,
      featured: d.featured === true,
      order: typeof d.order === 'number' ? d.order : 999,
      html: fm.body ? renderMarkdown(fm.body, new Set(evidence.map((e) => e.id))) : '',
    },
  }
}

export function parseArticle(source: string, fileSlug: string): Parsed<Article> {
  const fm = splitFrontmatter(source)
  if (!fm) return { ok: false, reason: 'missing frontmatter' }
  const d = fm.data
  if (str(d.status) !== 'approved') return { ok: false, reason: 'not approved' }
  if (!str(d.approved_by)) return { ok: false, reason: 'approved without approved_by' }
  const slug = str(d.slug)
  const title = str(d.title)
  const description = str(d.description)
  const date = str(d.date)
  if (slug !== fileSlug) return { ok: false, reason: 'slug does not match filename' }
  if (!title || !description || !date) return { ok: false, reason: 'missing required fields' }
  const evidence = parseEvidence(d.evidence)
  const faq: Faq[] = records(d.faq).flatMap((f) => {
    const q = str(f.q)
    const a = str(f.a)
    return q && a ? [{ q, a }] : []
  })
  const project = str(d.project)
  const audience = str(d.audience)
  const primaryKeyword = str(d.primary_keyword)
  const answer = str(d.answer)
  const heroImage = str(d.hero_image)
  const heroAlt = str(d.hero_alt)
  const words = fm.body.split(/\s+/).filter(Boolean).length
  return {
    ok: true,
    value: {
      slug,
      title,
      type: oneOf(d.type, ARTICLE_TYPES) ?? 'article',
      description,
      date,
      updated: str(d.updated) ?? date,
      ...(project ? { project } : {}),
      ...(audience ? { audience } : {}),
      ...(primaryKeyword ? { primaryKeyword } : {}),
      secondaryKeywords: strList(d.secondary_keywords),
      ...(answer ? { answer } : {}),
      ...(heroImage?.startsWith('/') ? { heroImage } : {}),
      ...(heroAlt ? { heroAlt } : {}),
      faq,
      cta: str(d.cta) === 'prestyj' ? 'prestyj' : 'book',
      claims: parseClaims(d.claims),
      evidence,
      html: renderMarkdown(fm.body, new Set(evidence.map((e) => e.id))),
      markdown: fm.body.replace(MARKER, ''),
      readingMinutes: Math.max(1, Math.round(words / 230)),
    },
  }
}
