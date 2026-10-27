import type { Article, Project } from './content'
import {
  CLIENTS,
  OWNER_EMAIL,
  SAME_AS,
  SITE_DESCRIPTION,
  SITE_NAME,
  SITE_URL,
  absoluteUrl,
} from './site'

export const PERSON_ID = `${SITE_URL}/#person`
export const WEBSITE_ID = `${SITE_URL}/#website`

export function personLd(): Record<string, unknown> {
  return {
    '@type': 'Person',
    '@id': PERSON_ID,
    name: SITE_NAME,
    url: SITE_URL,
    image: absoluteUrl('/ng.png'),
    email: `mailto:${OWNER_EMAIL}`,
    jobTitle: 'Builder of AI business systems and AI agents',
    description: SITE_DESCRIPTION,
    sameAs: [...SAME_AS],
    knowsAbout: [
      'AI agents',
      'Model Context Protocol',
      'Enterprise data platforms',
      'Business automation',
      'Real estate operations',
    ],
  }
}

export function websiteLd(): Record<string, unknown> {
  return {
    '@type': 'WebSite',
    '@id': WEBSITE_ID,
    url: SITE_URL,
    name: SITE_NAME,
    description: SITE_DESCRIPTION,
    publisher: { '@id': PERSON_ID },
    inLanguage: 'en-US',
  }
}

export function graph(...nodes: Record<string, unknown>[]): Record<string, unknown> {
  return { '@context': 'https://schema.org', '@graph': nodes }
}

export function breadcrumbLd(items: { name: string; path: string }[]): Record<string, unknown> {
  return {
    '@type': 'BreadcrumbList',
    itemListElement: items.map((it, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: it.name,
      item: absoluteUrl(it.path),
    })),
  }
}

export function articleLd(a: Article, image: string): Record<string, unknown> {
  const url = absoluteUrl(`/writing/${a.slug}`)
  return {
    '@type': a.type === 'article' ? 'Article' : 'BlogPosting',
    '@id': `${url}#article`,
    headline: a.title,
    description: a.description,
    datePublished: a.date,
    dateModified: a.updated,
    author: { '@id': PERSON_ID },
    publisher: { '@id': PERSON_ID },
    mainEntityOfPage: url,
    image: absoluteUrl(image),
    url,
    ...(a.primaryKeyword
      ? { keywords: [a.primaryKeyword, ...a.secondaryKeywords].join(', ') }
      : {}),
    ...(a.audience ? { audience: { '@type': 'Audience', audienceType: a.audience } } : {}),
    ...(a.project ? { about: { '@id': `${absoluteUrl(`/work/${a.project}`)}#work` } } : {}),
  }
}

export function faqLd(a: Article): Record<string, unknown> | null {
  if (a.faq.length === 0) return null
  return {
    '@type': 'FAQPage',
    mainEntity: a.faq.map((f) => ({
      '@type': 'Question',
      name: f.q,
      acceptedAnswer: { '@type': 'Answer', text: f.a },
    })),
  }
}

export function projectLd(p: Project): Record<string, unknown> {
  const url = absoluteUrl(`/work/${p.slug}`)
  const client = CLIENTS.find((c) => c.name === p.client)
  const clientUrl = p.clientUrl ?? client?.url
  return {
    '@type': 'CreativeWork',
    '@id': `${url}#work`,
    name: p.title,
    description: p.summary,
    url,
    creator: { '@id': PERSON_ID },
    dateCreated: p.started,
    dateModified: p.updated,
    keywords: p.capabilities.join(', '),
    ...(p.client !== 'Personal project'
      ? {
          sourceOrganization: {
            '@type': 'Organization',
            name: p.client,
            ...(clientUrl ? { url: clientUrl } : {}),
          },
        }
      : {}),
  }
}
