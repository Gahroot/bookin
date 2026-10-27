import Link from 'next/link'
import { ARTICLE_TYPE_LABEL, formatDate, type Article, type Project } from '@/lib/content'
import { CAPABILITIES } from '@/lib/site'

export function ProjectCard({
  project,
  headingLevel = 3,
}: {
  project: Project
  headingLevel?: 2 | 3
}) {
  const H = headingLevel === 2 ? 'h2' : 'h3'
  return (
    <Link
      href={`/work/${project.slug}`}
      className="card-link surface-card flex h-full flex-col rounded-[var(--radius-card)] p-6"
    >
      <p className="text-sm text-ink-muted">{project.client}</p>
      <H className="mt-1 text-xl font-semibold">{project.title}</H>
      <p className="mt-3 text-ink-muted">{project.summary}</p>
      <ul className="mt-auto flex flex-wrap gap-1.5 pt-5" aria-label="Capabilities">
        {project.capabilities.map((c) => (
          <li
            key={c}
            className="rounded-full bg-surface-muted px-2.5 py-1 text-xs font-medium text-ink-muted"
          >
            {CAPABILITIES[c].label}
          </li>
        ))}
      </ul>
    </Link>
  )
}

export function ArticleCard({
  article,
  headingLevel = 3,
}: {
  article: Article
  headingLevel?: 2 | 3
}) {
  const H = headingLevel === 2 ? 'h2' : 'h3'
  return (
    <Link
      href={`/writing/${article.slug}`}
      className="card-link surface-card flex h-full flex-col rounded-[var(--radius-card)] p-6"
    >
      <p className="eyebrow">{ARTICLE_TYPE_LABEL[article.type]}</p>
      <H className="mt-2 text-lg font-semibold leading-snug">{article.title}</H>
      <p className="mt-2 text-ink-muted">{article.description}</p>
      <p className="mt-auto pt-5 text-sm text-ink-muted">
        <time dateTime={article.date}>{formatDate(article.date)}</time> · {article.readingMinutes}{' '}
        min read
      </p>
    </Link>
  )
}

export function EmptyState({ children }: { children: React.ReactNode }) {
  return (
    <div className="surface-card rounded-[var(--radius-card)] p-8 text-center text-ink-muted">
      {children}
    </div>
  )
}
