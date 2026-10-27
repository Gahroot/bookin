import { readdirSync, readFileSync } from 'node:fs'
import path from 'node:path'
import { parseArticle, parseProject, type Parsed } from './parse'
import type { Article, Project } from './types'

export * from './types'

/** content/ at the repo root; CONTENT_DIR overrides it (tests, fixture builds). */
export function contentDir(): string {
  return process.env.CONTENT_DIR ?? path.join(process.cwd(), 'content')
}

function readCollection<T>(
  dir: string,
  parse: (source: string, slug: string) => Parsed<T>,
  warnOn: (reason: string) => boolean,
): T[] {
  let files: string[]
  try {
    files = readdirSync(dir).filter((f) => f.endsWith('.md'))
  } catch {
    return []
  }
  return files.sort().flatMap((file) => {
    const slug = file.slice(0, -3)
    const result = parse(readFileSync(path.join(dir, file), 'utf8'), slug)
    if (result.ok) return [result.value]
    if (warnOn(result.reason)) console.warn(`[content] skipped ${file}: ${result.reason}`)
    return []
  })
}

export function getProjects(root = contentDir()): Project[] {
  return readCollection(path.join(root, 'projects'), parseProject, () => true).sort(
    (a, b) => a.order - b.order || a.title.localeCompare(b.title),
  )
}

export function getArticles(root = contentDir()): Article[] {
  const projectSlugs = new Set(getProjects(root).map((p) => p.slug))
  return readCollection(
    path.join(root, 'articles'),
    parseArticle,
    (reason) => reason !== 'not approved',
  )
    .map((a) => {
      if (!a.project || projectSlugs.has(a.project)) return a
      const rest: Article = { ...a }
      delete rest.project
      return rest
    })
    .sort((a, b) => b.date.localeCompare(a.date) || a.slug.localeCompare(b.slug))
}

export function getProject(slug: string, root = contentDir()): Project | undefined {
  return getProjects(root).find((p) => p.slug === slug)
}

export function getArticle(slug: string, root = contentDir()): Article | undefined {
  return getArticles(root).find((a) => a.slug === slug)
}

/** Same project first, then shared keywords, then most recent. */
export function relatedArticles(article: Article, all: Article[], limit = 3): Article[] {
  const words = new Set(
    [article.primaryKeyword, ...article.secondaryKeywords]
      .filter((w): w is string => !!w)
      .map((w) => w.toLowerCase()),
  )
  const score = (a: Article): number =>
    (article.project && a.project === article.project ? 10 : 0) +
    [a.primaryKeyword, ...a.secondaryKeywords].filter(
      (w) => w !== undefined && words.has(w.toLowerCase()),
    ).length
  return all
    .filter((a) => a.slug !== article.slug)
    .map((a) => ({ a, s: score(a) }))
    .sort((x, y) => y.s - x.s || y.a.date.localeCompare(x.a.date))
    .slice(0, limit)
    .map((x) => x.a)
}

export function articlesForProject(slug: string, all: Article[]): Article[] {
  return all.filter((a) => a.project === slug)
}

export function formatDate(iso: string): string {
  const d = new Date(`${iso}T00:00:00Z`)
  if (Number.isNaN(d.getTime())) return iso
  return d.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    timeZone: 'UTC',
  })
}
