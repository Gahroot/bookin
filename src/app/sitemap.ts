import type { MetadataRoute } from 'next'
import { getArticles, getProjects } from '@/lib/content'
import { absoluteUrl } from '@/lib/site'

export const dynamic = 'force-static'

export default function sitemap(): MetadataRoute.Sitemap {
  const articles = getArticles()
  const latest = articles[0]?.updated
  const pages = ['/', '/work', '/writing', '/demos/portfolio-risk', '/about', '/book', '/privacy']
  return [
    ...pages.map((p) => ({
      url: absoluteUrl(p),
      ...(latest && (p === '/' || p === '/writing') ? { lastModified: latest } : {}),
    })),
    ...getProjects().map((p) => ({
      url: absoluteUrl(`/work/${p.slug}`),
      ...(p.updated ? { lastModified: p.updated } : {}),
    })),
    ...articles.map((a) => ({ url: absoluteUrl(`/writing/${a.slug}`), lastModified: a.updated })),
  ]
}
