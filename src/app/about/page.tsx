import Image from 'next/image'
import Link from 'next/link'
import { CtaBand } from '@/components/CtaBand'
import { JsonLd } from '@/components/JsonLd'
import { PrestyjLink } from '@/components/links'
import { getProjects } from '@/lib/content'
import { PERSON_ID, breadcrumbLd, graph } from '@/lib/jsonld'
import { pageMetadata } from '@/lib/seo'
import { CLIENTS, absoluteUrl } from '@/lib/site'

export const metadata = pageMetadata({
  title: 'About Nolan Grout',
  description:
    'Nolan Grout builds AI-powered business systems and AI agents for real estate funds, operators and enterprise teams. Background, approach and clients.',
  path: '/about',
  ogKey: 'page/about',
  type: 'profile',
})

export default function AboutPage() {
  const projects = getProjects()
  return (
    <>
      <div className="rail grid max-w-5xl items-start gap-10 md:grid-cols-[1fr_14rem]">
        <header>
          <p className="eyebrow">About</p>
          <h1 className="mt-3 text-4xl font-semibold leading-[1.08] sm:text-5xl">
            I build AI systems that hold up in front of executives.
          </h1>
          <p className="mt-5 text-lg text-ink-muted sm:text-xl">
            I’m Nolan Grout. I design and build AI-powered business systems and AI agents for real
            estate funds, operators and enterprise teams, from the governed data layer up to the
            agent your COO talks to.
          </p>
        </header>
        <Image
          src="/ng.png"
          alt="Nolan Grout"
          width={224}
          height={224}
          priority
          className="surface-card hidden rounded-[var(--radius-card)] md:block"
        />
      </div>

      <div className="rail mt-14 max-w-3xl space-y-10 text-lg">
        <section aria-labelledby="believe">
          <h2 id="believe" className="text-2xl font-semibold">
            What I believe about enterprise AI
          </h2>
          <p className="mt-3">
            AI is only as useful as the data it can trust. Most failed AI projects skip the boring
            part: a governed model of the business with permissions, lineage and evidence on every
            fact. I build that first, then put agents and ChatGPT or Claude connections on top, read
            only by default, citing their sources.
          </p>
        </section>
        <section aria-labelledby="work-with">
          <h2 id="work-with" className="text-2xl font-semibold">
            Who I work with
          </h2>
          <p className="mt-3">
            Asset managers, COOs and owners who need answers across Yardi, Monday.com, SharePoint,
            CRMs and spreadsheets without hiring a data team. Clients include{' '}
            {CLIENTS.map((c, i) => (
              <span key={c.name}>
                {i > 0 && (i === CLIENTS.length - 1 ? ' and ' : ', ')}
                {c.url ? (
                  <a href={c.url} rel="noopener" target="_blank" className="text-action">
                    {c.name}
                  </a>
                ) : (
                  c.name
                )}
              </span>
            ))}
            .
          </p>
        </section>
        <section aria-labelledby="how">
          <h2 id="how" className="text-2xl font-semibold">
            How engagements run
          </h2>
          <p className="mt-3">
            You work with me directly. We start from one decision or one repeated job, ship to
            production early, and keep checks in CI so the system stays honest. I also build{' '}
            <PrestyjLink campaign="about" className="text-action underline">
              Prestyj
            </PrestyjLink>
            , AI voice agents for businesses that live on the phone.
          </p>
        </section>
        {projects.length > 0 && (
          <section aria-labelledby="selected">
            <h2 id="selected" className="text-2xl font-semibold">
              Selected work
            </h2>
            <ul className="mt-3 list-disc space-y-1 pl-6">
              {projects.map((p) => (
                <li key={p.slug}>
                  <Link href={`/work/${p.slug}`} className="text-action">
                    {p.title}
                  </Link>
                  <span className="text-ink-muted">, {p.client}</span>
                </li>
              ))}
            </ul>
          </section>
        )}
      </div>

      <div className="rail mt-24">
        <CtaBand source="about" />
      </div>
      <JsonLd
        data={graph(
          {
            '@type': 'ProfilePage',
            '@id': `${absoluteUrl('/about')}#profile`,
            url: absoluteUrl('/about'),
            name: 'About Nolan Grout',
            mainEntity: { '@id': PERSON_ID },
          },
          breadcrumbLd([
            { name: 'Home', path: '/' },
            { name: 'About', path: '/about' },
          ])
        )}
      />
    </>
  )
}
