import Link from 'next/link'
import { RiskDemo } from '@/components/demo/RiskDemo'
import { JsonLd } from '@/components/JsonLd'
import { BookLink } from '@/components/links'
import { PageHeader } from '@/components/Section'
import { breadcrumbLd, graph } from '@/lib/jsonld'
import { pageMetadata } from '@/lib/seo'

export const metadata = pageMetadata({
  title: 'Demo: rank my top 20 riskiest assets',
  description:
    'Interactive demo on synthetic data: ask for the 20 riskiest assets in a real estate portfolio and see each risk driver, the reason and who manages the asset.',
  path: '/demos/portfolio-risk',
  ogKey: 'page/demo',
})

const CASE = '/writing/portfolio-risk-review-in-minutes-with-chatgpt'

export default function RiskDemoPage() {
  return (
    <>
      <PageHeader
        eyebrow="Interactive demo"
        title="Rank my top 20 riskiest assets"
        intro="This mimics an asset manager asking ChatGPT a question that a read-only MCP server answers from governed portfolio data. Every asset, person and number below is invented."
      />
      <div className="rail mt-10 max-w-6xl">
        <RiskDemo />
        <div
          className="glass mt-8 flex flex-col gap-4 rounded-[var(--radius-region)] p-6 sm:flex-row sm:items-center sm:justify-between"
          data-cta-view="demo"
        >
          <p className="max-w-xl">
            See how this works on real, governed data in the{' '}
            <Link href={CASE} className="text-action underline underline-offset-4">
              Triten case study
            </Link>
            .
          </p>
          <BookLink source="demo">Book a call about your portfolio</BookLink>
        </div>
      </div>
      <JsonLd
        data={graph(
          breadcrumbLd([
            { name: 'Home', path: '/' },
            { name: 'Portfolio risk demo', path: '/demos/portfolio-risk' },
          ])
        )}
      />
    </>
  )
}
