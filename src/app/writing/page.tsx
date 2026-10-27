import { ArticleCard, EmptyState } from '@/components/cards'
import { CtaBand } from '@/components/CtaBand'
import { JsonLd } from '@/components/JsonLd'
import { PageHeader } from '@/components/Section'
import { TagFilter } from '@/components/TagFilter'
import { ARTICLE_TYPE_LABEL, getArticles, type ArticleType } from '@/lib/content'
import { breadcrumbLd, graph } from '@/lib/jsonld'
import { pageMetadata } from '@/lib/seo'

export const metadata = pageMetadata({
  title: 'Writing: case studies and field notes on enterprise AI',
  description:
    'Evidence-backed case studies, articles and field notes on AI agents, MCP servers and governed data for real estate and enterprise operators.',
  path: '/writing',
  ogKey: 'page/writing',
})

const ORDER: ArticleType[] = ['case-study', 'article', 'field-note']

export default function WritingPage() {
  const articles = getArticles()
  const types = ORDER.filter((t) => articles.some((a) => a.type === t))
  return (
    <>
      <PageHeader
        eyebrow="Writing"
        title="Case studies and field notes"
        intro="What changed for the business, and the evidence behind it. Written for executives deciding where AI is worth it."
      />
      <div className="rail mt-12">
        {articles.length === 0 ? (
          <EmptyState>The first case studies are being reviewed. Check back soon.</EmptyState>
        ) : (
          <TagFilter
            label="Filter by type"
            options={types.map((t) => ({ value: t, label: ARTICLE_TYPE_LABEL[t] }))}
          >
            <ul className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
              {articles.map((a) => (
                <li key={a.slug} data-item data-tags={a.type}>
                  <ArticleCard article={a} headingLevel={2} />
                </li>
              ))}
            </ul>
          </TagFilter>
        )}
      </div>
      <div className="rail mt-24">
        <CtaBand source="writing" />
      </div>
      <JsonLd
        data={graph(
          breadcrumbLd([
            { name: 'Home', path: '/' },
            { name: 'Writing', path: '/writing' },
          ])
        )}
      />
    </>
  )
}
