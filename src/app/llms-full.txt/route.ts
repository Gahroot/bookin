import { getArticles, getProjects } from '@/lib/content'
import { llmsFullTxt } from '@/lib/feeds'

export const dynamic = 'force-static'

export function GET(): Response {
  return new Response(llmsFullTxt(getProjects(), getArticles()), {
    headers: { 'content-type': 'text/plain; charset=utf-8' },
  })
}
