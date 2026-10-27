import { EmptyState, ProjectCard } from '@/components/cards'
import { CtaBand } from '@/components/CtaBand'
import { PageHeader } from '@/components/Section'
import { TagFilter } from '@/components/TagFilter'
import { JsonLd } from '@/components/JsonLd'
import { getProjects } from '@/lib/content'
import { breadcrumbLd, graph } from '@/lib/jsonld'
import { pageMetadata } from '@/lib/seo'
import { CAPABILITIES, isCapability } from '@/lib/site'

export const metadata = pageMetadata({
  title: 'Work: AI systems in production',
  description:
    'Portfolio of AI agents, MCP servers, data platforms and automation Nolan Grout has built for real estate funds, operators and growing businesses.',
  path: '/work',
  ogKey: 'page/work',
})

export default function WorkPage() {
  const projects = getProjects()
  const used = [...new Set(projects.flatMap((p) => p.capabilities))].filter(isCapability).sort()
  return (
    <>
      <PageHeader
        eyebrow="Work"
        title="Systems in production"
        intro="Platforms, agents and automation built for real clients. Each record lists what I did and the evidence behind every outcome."
      />
      <div className="rail mt-12">
        {projects.length === 0 ? (
          <EmptyState>Project write-ups are on their way.</EmptyState>
        ) : (
          <TagFilter
            label="Filter by capability"
            options={used.map((c) => ({ value: c, label: CAPABILITIES[c].label }))}
          >
            <ul className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
              {projects.map((p) => (
                <li key={p.slug} data-item data-tags={p.capabilities.join(' ')}>
                  <ProjectCard project={p} headingLevel={2} />
                </li>
              ))}
            </ul>
          </TagFilter>
        )}
      </div>
      <div className="rail mt-24">
        <CtaBand source="work" />
      </div>
      <JsonLd
        data={graph(
          breadcrumbLd([
            { name: 'Home', path: '/' },
            { name: 'Work', path: '/work' },
          ])
        )}
      />
    </>
  )
}
