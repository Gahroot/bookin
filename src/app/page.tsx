import Link from 'next/link'
import { ArticleCard, ProjectCard } from '@/components/cards'
import { CtaBand } from '@/components/CtaBand'
import { BookLink } from '@/components/links'
import { Section } from '@/components/Section'
import { getArticles, getProjects } from '@/lib/content'
import { pageMetadata } from '@/lib/seo'
import { CAPABILITIES, CLIENTS, SITE_DESCRIPTION, SITE_TITLE, type Capability } from '@/lib/site'

export const metadata = pageMetadata({
  title: SITE_TITLE,
  description: SITE_DESCRIPTION,
  path: '/',
  ogKey: 'page/home',
})

const FOCUS: Capability[] = [
  'ai-agents',
  'mcp',
  'data-platform',
  'automation',
  'content-engine',
  'voice-ai',
]

const STEPS = [
  {
    title: 'Start from the decision',
    body: 'We pick one question an executive needs answered, or one job a team repeats, and define what a trustworthy answer looks like.',
  },
  {
    title: 'Govern the data first',
    body: 'Your systems of record stay in place. I build a governed layer that keeps evidence, permissions and lineage on every fact.',
  },
  {
    title: 'Put agents on top',
    body: 'Agents and ChatGPT or Claude connections read from that layer, read-only by default, with sources cited in every answer.',
  },
  {
    title: 'Ship, measure, hand over',
    body: 'Production from the first weeks, checks in CI, and documentation your team can own. No black boxes.',
  },
]

export default function HomePage() {
  const projects = getProjects()
  const featured = projects.filter((p) => p.featured).slice(0, 3)
  const shown = featured.length > 0 ? featured : projects.slice(0, 3)
  const articles = getArticles().slice(0, 3)

  return (
    <>
      <section className="rail" aria-labelledby="hero-title">
        <div className="max-w-3xl">
          <p className="eyebrow">
            AI systems for real estate funds, operators and enterprise teams
          </p>
          <h1
            id="hero-title"
            className="mt-4 text-[2.6rem] font-semibold leading-[1.04] sm:text-6xl"
          >
            I build the AI systems your executives can actually trust.
          </h1>
          <p className="mt-6 max-w-2xl text-lg text-ink-muted sm:text-xl">
            Governed data platforms, MCP servers and AI agents that answer real business questions
            from your own systems, with the source behind every answer.
          </p>
          <div className="mt-8 flex flex-wrap gap-3" data-cta-view="hero">
            <BookLink source="hero">Book a call</BookLink>
            <Link href="/demos/portfolio-risk" className="btn btn-quiet">
              Try the portfolio risk demo
            </Link>
          </div>
        </div>
      </section>

      <section aria-labelledby="clients" className="rail mt-16 sm:mt-20">
        <h2 id="clients" className="text-sm font-medium text-ink-muted">
          Systems built for and with
        </h2>
        <ul className="glass mt-4 grid grid-cols-2 gap-px overflow-hidden rounded-[var(--radius-region)] sm:grid-cols-3 lg:grid-cols-6">
          {CLIENTS.map((c) => (
            <li key={c.name} className="px-5 py-4">
              {c.url ? (
                <a
                  href={c.url}
                  rel="noopener"
                  target="_blank"
                  className="font-semibold text-ink no-underline hover:text-action"
                >
                  {c.name}
                  <span className="sr-only"> (opens in a new tab)</span>
                </a>
              ) : (
                <span className="font-semibold">{c.name}</span>
              )}
              <span className="block text-xs text-ink-muted">{c.note}</span>
            </li>
          ))}
        </ul>
      </section>

      {shown.length > 0 && (
        <Section
          id="featured"
          eyebrow="Selected work"
          title="Systems in production"
          intro="Every outcome on this site links to a build record or public evidence."
          action={
            <Link href="/work" className="btn btn-quiet">
              All work
            </Link>
          }
        >
          <ul className="grid gap-5 md:grid-cols-3">
            {shown.map((p) => (
              <li key={p.slug}>
                <ProjectCard project={p} />
              </li>
            ))}
          </ul>
        </Section>
      )}

      <Section id="capabilities" eyebrow="Capabilities" title="What I build">
        <ul className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {FOCUS.map((c) => (
            <li key={c} className="surface-card rounded-[var(--radius-card)] p-6">
              <h3 className="text-lg font-semibold">{CAPABILITIES[c].label}</h3>
              <p className="mt-2 text-ink-muted">{CAPABILITIES[c].blurb}</p>
            </li>
          ))}
        </ul>
      </Section>

      <Section
        id="how"
        eyebrow="How I work"
        title="Small team, direct access, production from the start"
      >
        <ol className="grid gap-5 md:grid-cols-2 lg:grid-cols-4">
          {STEPS.map((s, i) => (
            <li key={s.title} className="surface-card rounded-[var(--radius-card)] p-6">
              <span className="text-sm font-semibold text-action" aria-hidden="true">
                {String(i + 1).padStart(2, '0')}
              </span>
              <h3 className="mt-2 text-lg font-semibold">{s.title}</h3>
              <p className="mt-2 text-ink-muted">{s.body}</p>
            </li>
          ))}
        </ol>
      </Section>

      {articles.length > 0 && (
        <Section
          id="writing"
          eyebrow="Writing"
          title="Latest case studies and notes"
          action={
            <Link href="/writing" className="btn btn-quiet">
              All writing
            </Link>
          }
        >
          <ul className="grid gap-5 md:grid-cols-3">
            {articles.map((a) => (
              <li key={a.slug}>
                <ArticleCard article={a} />
              </li>
            ))}
          </ul>
        </Section>
      )}

      <div className="rail mt-24 sm:mt-32">
        <CtaBand source="home" />
      </div>
    </>
  )
}
