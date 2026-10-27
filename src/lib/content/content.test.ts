import path from 'node:path'
import { describe, expect, it } from 'vitest'
import { getArticles, getProjects, relatedArticles } from './index'
import { parseArticle } from './parse'

const root = path.join(__dirname, '../../test/fixtures/content')

describe('content loading', () => {
  it('loads projects and drops unknown capability tags', () => {
    const [p] = getProjects(root)
    expect(p?.slug).toBe('sample-ops-agent')
    expect(p?.capabilities).toEqual(['ai-agents', 'mcp'])
  })

  it('renders only approved articles', () => {
    const articles = getArticles(root)
    expect(articles.map((a) => a.slug)).toEqual(['sample-case-study'])
  })

  it('links evidence markers and strips raw html', () => {
    const a = getArticles(root)[0]
    expect(a?.html).toContain('href="#evidence-E1"')
    expect(a?.html).not.toContain('<script')
    expect(a?.html).toContain('id="what-changed"')
    expect(a?.evidence.find((e) => e.id === 'E1')?.public).toBe(false)
  })

  it('handles a missing content directory', () => {
    expect(getProjects('/nonexistent')).toEqual([])
    expect(getArticles('/nonexistent')).toEqual([])
  })

  it('rejects approved articles without approved_by', () => {
    const r = parseArticle('---\nslug: x\nstatus: approved\n---\nbody', 'x')
    expect(r.ok).toBe(false)
  })

  it('related articles excludes itself', () => {
    const all = getArticles(root)
    const first = all[0]
    expect(first && relatedArticles(first, all)).toEqual([])
  })
})
