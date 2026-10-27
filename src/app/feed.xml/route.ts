import { getArticles } from '@/lib/content'
import { rssXml } from '@/lib/feeds'

export const dynamic = 'force-static'

export function GET(): Response {
  return new Response(rssXml(getArticles()), {
    headers: { 'content-type': 'application/rss+xml; charset=utf-8' },
  })
}
