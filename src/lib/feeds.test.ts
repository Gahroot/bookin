import path from 'node:path'
import { describe, expect, it } from 'vitest'
import { getArticles, getProjects } from './content'
import { llmsFullTxt, llmsTxt, rssXml } from './feeds'

const root = path.join(__dirname, '../test/fixtures/content')

describe('feeds', () => {
  const projects = getProjects(root)
  const articles = getArticles(root)
  it('llms.txt lists articles and projects with absolute urls', () => {
    const t = llmsTxt(projects, articles)
    expect(t).toContain('https://nolangrout.com/writing/sample-case-study')
    expect(t).toContain('https://nolangrout.com/work/sample-ops-agent')
  })
  it('llms-full.txt includes body text without evidence markers', () => {
    const t = llmsFullTxt(projects, articles)
    expect(t).toContain('The review now takes about ten minutes.')
    expect(t).not.toContain('[^E1]')
  })
  it('rss is well formed for empty and full lists', () => {
    expect(rssXml([])).toContain('<channel>')
    expect(rssXml(articles)).toContain(
      '<guid isPermaLink="true">https://nolangrout.com/writing/sample-case-study</guid>'
    )
  })
})
