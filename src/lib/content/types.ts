import type { Capability } from '@/lib/site'

export type EvidenceKind =
  | 'github-repo'
  | 'github-commit'
  | 'github-pr'
  | 'worklog'
  | 'owner-attested'
  | 'public-url'

export interface Evidence {
  id: string
  kind: EvidenceKind
  title: string
  date: string
  public: boolean
  ref: string
  url?: string
}

export type ClaimKind = 'outcome' | 'metric' | 'capability' | 'time-saved'

export interface Claim {
  text: string
  kind: ClaimKind
  evidence: string[]
}

export interface Faq {
  q: string
  a: string
}

export interface Link {
  label: string
  url: string
}

export interface Project {
  slug: string
  title: string
  client: string
  clientUrl?: string
  status: 'live' | 'in-progress' | 'archived'
  started: string
  updated: string
  summary: string
  problem: string
  role: string
  capabilities: Capability[]
  stack: string[]
  links: Link[]
  outcomes: { text: string; evidence: string[] }[]
  evidence: Evidence[]
  featured: boolean
  order: number
  html: string
}

export type ArticleType = 'case-study' | 'article' | 'field-note'

export interface Article {
  slug: string
  title: string
  type: ArticleType
  description: string
  date: string
  updated: string
  project?: string
  audience?: string
  primaryKeyword?: string
  secondaryKeywords: string[]
  answer?: string
  heroImage?: string
  heroAlt?: string
  faq: Faq[]
  cta: 'book' | 'prestyj'
  claims: Claim[]
  evidence: Evidence[]
  html: string
  /** Body as plain markdown (evidence markers removed), for llms-full.txt. */
  markdown: string
  readingMinutes: number
}

export const ARTICLE_TYPE_LABEL: Record<ArticleType, string> = {
  'case-study': 'Case study',
  article: 'Article',
  'field-note': 'Field note',
}
