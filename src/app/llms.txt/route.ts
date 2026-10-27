import { getArticles, getProjects } from '@/lib/content'
import { llmsTxt } from '@/lib/feeds'

export const dynamic = 'force-static'

export function GET(): Response {
  return new Response(llmsTxt(getProjects(), getArticles()), {
    headers: { 'content-type': 'text/plain; charset=utf-8' },
  })
}
