import type { Article, Project } from './content'
import { CAPABILITIES, CLIENTS, SITE_DESCRIPTION, SITE_NAME, SITE_URL, absoluteUrl } from './site'

export function llmsTxt(projects: Project[], articles: Article[]): string {
  const lines = [
    `# ${SITE_NAME}`,
    '',
    `> ${SITE_DESCRIPTION}`,
    '',
    `Clients: ${CLIENTS.map((c) => (c.url ? `${c.name} (${c.url})` : c.name)).join(', ')}.`,
    `Book a call: ${absoluteUrl('/book')}`,
    '',
    '## Writing',
    ...articles.map(
      (a) => `- [${a.title}](${absoluteUrl(`/writing/${a.slug}`)}): ${a.description}`
    ),
    '',
    '## Work',
    ...projects.map((p) => `- [${p.title}](${absoluteUrl(`/work/${p.slug}`)}): ${p.summary}`),
    '',
    '## Pages',
    `- [About](${absoluteUrl('/about')}): Who Nolan Grout is and how he works`,
    `- [Portfolio risk demo](${absoluteUrl('/demos/portfolio-risk')}): Interactive demo on synthetic data`,
    `- [Full text for LLMs](${absoluteUrl('/llms-full.txt')})`,
    '',
  ]
  return lines.join('\n')
}

export function llmsFullTxt(projects: Project[], articles: Article[]): string {
  const parts = [llmsTxt(projects, articles), '---', '']
  for (const a of articles) {
    parts.push(
      `# ${a.title}`,
      '',
      `URL: ${absoluteUrl(`/writing/${a.slug}`)}`,
      `Published: ${a.date}${a.updated !== a.date ? ` (updated ${a.updated})` : ''}`,
      '',
      ...(a.answer ? [`Short answer: ${a.answer}`, ''] : []),
      a.markdown,
      '',
      ...(a.claims.length
        ? ['## Claims and evidence', ...a.claims.map((c) => `- ${c.text}`), '']
        : []),
      ...(a.faq.length
        ? ['## FAQ', ...a.faq.flatMap((f) => [`Q: ${f.q}`, `A: ${f.a}`, '']), '']
        : []),
      '---',
      ''
    )
  }
  for (const p of projects) {
    parts.push(
      `# ${p.title} (${p.client})`,
      '',
      `URL: ${absoluteUrl(`/work/${p.slug}`)}`,
      `Capabilities: ${p.capabilities.map((c) => CAPABILITIES[c].label).join(', ')}`,
      '',
      p.summary,
      '',
      ...(p.problem ? [`Problem: ${p.problem}`, ''] : []),
      ...(p.role ? [`Role: ${p.role}`, ''] : []),
      ...(p.outcomes.length ? ['Outcomes:', ...p.outcomes.map((o) => `- ${o.text}`), ''] : []),
      '---',
      ''
    )
  }
  return parts.join('\n')
}

const esc = (s: string): string =>
  s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')

export function rssXml(articles: Article[]): string {
  const items = articles
    .map((a) => {
      const url = absoluteUrl(`/writing/${a.slug}`)
      return `    <item>
      <title>${esc(a.title)}</title>
      <link>${url}</link>
      <guid isPermaLink="true">${url}</guid>
      <pubDate>${new Date(`${a.date}T12:00:00Z`).toUTCString()}</pubDate>
      <description>${esc(a.description)}</description>
      <content:encoded><![CDATA[${a.html.replaceAll(']]>', ']]]]><![CDATA[>')}]]></content:encoded>
    </item>`
    })
    .join('\n')
  const latest = articles[0]
  return `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom" xmlns:content="http://purl.org/rss/1.0/modules/content/">
  <channel>
    <title>${esc(SITE_NAME)}: Writing</title>
    <link>${SITE_URL}/writing</link>
    <description>${esc(SITE_DESCRIPTION)}</description>
    <language>en-us</language>
    <atom:link href="${SITE_URL}/feed.xml" rel="self" type="application/rss+xml"/>
${latest ? `    <lastBuildDate>${new Date(`${latest.updated}T12:00:00Z`).toUTCString()}</lastBuildDate>\n` : ''}${items}
  </channel>
</rss>
`
}
