import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { ArticleCard, ProjectCard } from '@/components/cards'
import { CtaBand } from '@/components/CtaBand'
import { EvidenceSection } from '@/components/EvidenceList'
import { JsonLd } from '@/components/JsonLd'
import {
  ARTICLE_TYPE_LABEL,
  formatDate,
  getArticle,
  getArticles,
  getProject,
  relatedArticles,
} from '@/lib/content'
import { articleLd, breadcrumbLd, faqLd, graph } from '@/lib/jsonld'
import { pageMetadata } from '@/lib/seo'

type Props = { params: Promise<{ slug: string }> }

export const dynamicParams = false

export function generateStaticParams() {
  return getArticles().map((a) => ({ slug: a.slug }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const a = getArticle(slug)
  if (!a) return {}
  return pageMetadata({
    title: a.title,
    description: a.description,
    path: `/writing/${a.slug}`,
    ogKey: `writing/${a.slug}`,
    ...(a.heroImage ? { image: a.heroImage } : {}),
    type: 'article',
    publishedTime: a.date,
    modifiedTime: a.updated,
  })
}

export default async function ArticlePage({ params }: Props) {
  const { slug } = await params
  const all = getArticles()
  const a = all.find((x) => x.slug === slug)
  if (!a) notFound()
  const project = a.project ? getProject(a.project) : undefined
  const related = relatedArticles(a, all)
  const faq = faqLd(a)
  const crumbs = [
    { name: 'Home', path: '/' },
    { name: 'Writing', path: '/writing' },
    { name: a.title, path: `/writing/${a.slug}` },
  ]
  return (
    <article>
      <header className="rail max-w-3xl">
        <nav aria-label="Breadcrumb" className="text-sm text-ink-muted">
          <Link href="/writing" className="hover:text-ink">
            Writing
          </Link>{' '}
          / <span>{ARTICLE_TYPE_LABEL[a.type]}</span>
        </nav>
        <h1 className="mt-6 text-4xl font-semibold leading-[1.08] sm:text-5xl">{a.title}</h1>
        <p className="mt-4 text-sm text-ink-muted">
          By{' '}
          <Link href="/about" className="text-ink underline underline-offset-4">
            Nolan Grout
          </Link>{' '}
          · <time dateTime={a.date}>{formatDate(a.date)}</time>
          {a.updated !== a.date && (
            <>
              {' '}
              · Updated <time dateTime={a.updated}>{formatDate(a.updated)}</time>
            </>
          )}{' '}
          · {a.readingMinutes} min read
        </p>
        {a.answer && (
          <aside
            aria-label="Short answer"
            className="glass mt-8 rounded-[var(--radius-region)] p-6"
          >
            <p className="eyebrow">The short answer</p>
            <p className="mt-2 text-lg leading-relaxed">{a.answer}</p>
          </aside>
        )}
      </header>

      {a.heroImage && (
        <div className="rail mt-10 max-w-4xl">
          <Image
            src={a.heroImage}
            alt={a.heroAlt ?? ''}
            width={1600}
            height={900}
            priority
            sizes="(min-width: 1024px) 56rem, 100vw"
            className="h-auto w-full rounded-[var(--radius-card)]"
          />
        </div>
      )}

      <div className="rail mt-10 max-w-3xl">
        <div className="prose" dangerouslySetInnerHTML={{ __html: a.html }} />

        <EvidenceSection claims={a.claims} evidence={a.evidence} />

        {a.faq.length > 0 && (
          <section aria-labelledby="faq" className="mt-14">
            <h2 id="faq" className="text-2xl font-semibold">
              Frequently asked questions
            </h2>
            <div className="mt-5 space-y-3">
              {a.faq.map((f) => (
                <details key={f.q} className="surface-card group rounded-[var(--radius-panel)] p-5">
                  <summary className="flex items-start justify-between gap-4 font-medium">
                    <h3 className="text-base font-semibold">{f.q}</h3>
                    <span aria-hidden="true" className="text-action group-open:rotate-45">
                      +
                    </span>
                  </summary>
                  <p className="mt-3 text-ink-muted">{f.a}</p>
                </details>
              ))}
            </div>
          </section>
        )}
      </div>

      {(project !== undefined || related.length > 0) && (
        <section aria-labelledby="related" className="rail mt-20">
          <h2 id="related" className="text-2xl font-semibold">
            Keep reading
          </h2>
          <ul className="mt-6 grid gap-5 md:grid-cols-3">
            {project && (
              <li>
                <ProjectCard project={project} />
              </li>
            )}
            {related.slice(0, project ? 2 : 3).map((r) => (
              <li key={r.slug}>
                <ArticleCard article={r} />
              </li>
            ))}
          </ul>
        </section>
      )}

      <div className="rail mt-20">
        <CtaBand kind={a.cta} source={`writing-${a.slug}`} />
      </div>
      <JsonLd
        data={graph(
          articleLd(a, a.heroImage ?? `/og/writing/${a.slug}`),
          breadcrumbLd(crumbs),
          ...(faq ? [faq] : [])
        )}
      />
    </article>
  )
}
