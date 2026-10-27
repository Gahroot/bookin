import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { ArticleCard } from '@/components/cards'
import { CtaBand } from '@/components/CtaBand'
import { EvidenceSection } from '@/components/EvidenceList'
import { JsonLd } from '@/components/JsonLd'
import { articlesForProject, formatDate, getArticles, getProject, getProjects } from '@/lib/content'
import { breadcrumbLd, graph, projectLd } from '@/lib/jsonld'
import { pageMetadata } from '@/lib/seo'
import { CAPABILITIES } from '@/lib/site'

type Props = { params: Promise<{ slug: string }> }

export const dynamicParams = false

export function generateStaticParams() {
  return getProjects().map((p) => ({ slug: p.slug }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const p = getProject(slug)
  if (!p) return {}
  return pageMetadata({
    title: `${p.title}${p.client !== 'Personal project' ? ` for ${p.client}` : ''}`,
    description: p.summary,
    path: `/work/${p.slug}`,
    ogKey: `work/${p.slug}`,
  })
}

const STATUS = { live: 'Live', 'in-progress': 'In progress', archived: 'Archived' } as const

export default async function ProjectPage({ params }: Props) {
  const { slug } = await params
  const p = getProject(slug)
  if (!p) notFound()
  const related = articlesForProject(p.slug, getArticles())
  return (
    <article>
      <header className="rail max-w-3xl">
        <nav aria-label="Breadcrumb" className="text-sm text-ink-muted">
          <Link href="/work" className="hover:text-ink">
            Work
          </Link>{' '}
          / <span>{p.title}</span>
        </nav>
        <p className="eyebrow mt-6">
          {p.clientUrl ? (
            <a href={p.clientUrl} rel="noopener" target="_blank" className="no-underline">
              {p.client}
            </a>
          ) : (
            p.client
          )}
        </p>
        <h1 className="mt-3 text-4xl font-semibold leading-[1.08] sm:text-5xl">{p.title}</h1>
        <p className="mt-5 text-lg text-ink-muted sm:text-xl">{p.summary}</p>
      </header>

      <div className="rail mt-12 grid max-w-5xl gap-10 lg:grid-cols-[1fr_18rem]">
        <div className="min-w-0">
          {p.problem && (
            <section aria-labelledby="problem">
              <h2 id="problem" className="text-2xl font-semibold">
                The problem
              </h2>
              <p className="mt-3 text-lg">{p.problem}</p>
            </section>
          )}
          {p.role && (
            <section aria-labelledby="role" className="mt-10">
              <h2 id="role" className="text-2xl font-semibold">
                What I did
              </h2>
              <p className="mt-3 text-lg">{p.role}</p>
            </section>
          )}
          {p.html && <div className="prose mt-10" dangerouslySetInnerHTML={{ __html: p.html }} />}
          {p.outcomes.length > 0 && (
            <EvidenceSection claims={p.outcomes} evidence={p.evidence} headingId="outcomes" />
          )}
        </div>
        <aside className="glass h-fit rounded-[var(--radius-region)] p-6 text-sm lg:sticky lg:top-28">
          <dl className="space-y-4">
            <div>
              <dt className="text-ink-muted">Status</dt>
              <dd className="font-medium">{STATUS[p.status]}</dd>
            </div>
            {p.started && (
              <div>
                <dt className="text-ink-muted">Started</dt>
                <dd className="font-medium">{formatDate(p.started)}</dd>
              </div>
            )}
            <div>
              <dt className="text-ink-muted">Capabilities</dt>
              <dd className="font-medium">
                {p.capabilities.map((c) => CAPABILITIES[c].label).join(', ')}
              </dd>
            </div>
            {p.stack.length > 0 && (
              <div>
                <dt className="text-ink-muted">Stack</dt>
                <dd className="font-medium">{p.stack.join(', ')}</dd>
              </div>
            )}
            {p.links.length > 0 && (
              <div>
                <dt className="text-ink-muted">Links</dt>
                {p.links.map((l) => (
                  <dd key={l.url}>
                    <a href={l.url} rel="noopener" target="_blank" className="text-action">
                      {l.label}
                    </a>
                  </dd>
                ))}
              </div>
            )}
          </dl>
        </aside>
      </div>

      {related.length > 0 && (
        <section aria-labelledby="related" className="rail mt-20">
          <h2 id="related" className="text-2xl font-semibold">
            Writing about this project
          </h2>
          <ul className="mt-6 grid gap-5 md:grid-cols-3">
            {related.map((a) => (
              <li key={a.slug}>
                <ArticleCard article={a} />
              </li>
            ))}
          </ul>
        </section>
      )}
      <div className="rail mt-20">
        <CtaBand source={`work-${p.slug}`} />
      </div>
      <JsonLd
        data={graph(
          projectLd(p),
          breadcrumbLd([
            { name: 'Home', path: '/' },
            { name: 'Work', path: '/work' },
            { name: p.title, path: `/work/${p.slug}` },
          ])
        )}
      />
    </article>
  )
}
