import { BookingFlow } from '@/components/book/BookingFlow'
import { JsonLd } from '@/components/JsonLd'
import { PageHeader } from '@/components/Section'
import { breadcrumbLd, graph } from '@/lib/jsonld'
import { pageMetadata } from '@/lib/seo'
import { OWNER_EMAIL } from '@/lib/site'

export const metadata = pageMetadata({
  title: 'Book a call with Nolan Grout',
  description:
    'Book a focused 30-minute call with Nolan Grout to scope an AI agent, MCP server, data platform or automation for your business. Six quick questions, then pick a time.',
  path: '/book',
  ogKey: 'page/book',
})

const POINTS = [
  { t: '30 minutes', d: 'A focused conversation about one problem.' },
  { t: 'Direct', d: 'You talk to Nolan, the person who builds it.' },
  { t: 'Clear next step', d: 'What to build first and what it would take.' },
]

export default function BookPage() {
  return (
    <>
      <PageHeader
        eyebrow="Book a call"
        title="Let’s scope your system"
        intro="Answer six quick questions so the call is useful from the first minute, then pick a time."
      />
      <div className="rail mt-10 grid max-w-5xl gap-8 lg:grid-cols-[1fr_16rem]">
        <BookingFlow />
        <aside className="space-y-3">
          {POINTS.map((p) => (
            <div key={p.t} className="glass rounded-[var(--radius-region)] p-5">
              <p className="font-semibold">{p.t}</p>
              <p className="mt-1 text-sm text-ink-muted">{p.d}</p>
            </div>
          ))}
          <p className="px-1 text-sm text-ink-muted">
            Prefer email?{' '}
            <a href={`mailto:${OWNER_EMAIL}`} className="text-action">
              {OWNER_EMAIL}
            </a>
          </p>
        </aside>
      </div>
      <JsonLd
        data={graph(
          breadcrumbLd([
            { name: 'Home', path: '/' },
            { name: 'Book a call', path: '/book' },
          ])
        )}
      />
    </>
  )
}
