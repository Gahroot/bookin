import { ImageResponse } from 'next/og'
import { ARTICLE_TYPE_LABEL, getArticles, getProjects } from '@/lib/content'
import { SITE_DESCRIPTION } from '@/lib/site'

export const dynamic = 'force-static'

const PAGES: Record<string, { eyebrow: string; title: string }> = {
  home: { eyebrow: 'nolangrout.com', title: 'AI business systems and AI agents for enterprises' },
  work: { eyebrow: 'Work', title: 'Systems in production for real estate funds and operators' },
  writing: { eyebrow: 'Writing', title: 'Case studies and field notes on enterprise AI' },
  about: { eyebrow: 'About', title: 'Nolan Grout builds AI systems executives can trust' },
  book: { eyebrow: 'Book a call', title: 'Scope your AI system in 30 minutes' },
  demo: { eyebrow: 'Interactive demo', title: 'Rank my top 20 riskiest assets' },
  privacy: { eyebrow: 'Privacy', title: 'Cookieless analytics and lead handling' },
}

export function generateStaticParams(): { key: string[] }[] {
  return [
    ...Object.keys(PAGES).map((k) => ({ key: ['page', k] })),
    ...getArticles().map((a) => ({ key: ['writing', a.slug] })),
    ...getProjects().map((p) => ({ key: ['work', p.slug] })),
  ]
}

function resolve(key: string[]): { eyebrow: string; title: string } | null {
  const [kind, slug] = key
  if (!slug) return null
  if (kind === 'page') return PAGES[slug] ?? null
  if (kind === 'writing') {
    const a = getArticles().find((x) => x.slug === slug)
    return a ? { eyebrow: ARTICLE_TYPE_LABEL[a.type], title: a.title } : null
  }
  if (kind === 'work') {
    const p = getProjects().find((x) => x.slug === slug)
    return p ? { eyebrow: p.client, title: p.title } : null
  }
  return null
}

export async function GET(_req: Request, ctx: { params: Promise<{ key: string[] }> }) {
  const { key } = await ctx.params
  const page = resolve(key)
  if (!page) return new Response('Not found', { status: 404 })
  return new ImageResponse(
    <div
      style={{
        width: '100%',
        height: '100%',
        display: 'flex',
        padding: 64,
        background:
          'radial-gradient(70% 70% at 95% 0%, rgba(54,128,186,0.55), transparent 70%), radial-gradient(60% 60% at 0% 100%, rgba(45,108,149,0.4), transparent 70%), #0b1117',
        color: '#e6edf1',
        fontFamily: 'sans-serif',
      }}
    >
      <div
        style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          padding: 56,
          borderRadius: 40,
          background: 'rgba(20,30,38,0.62)',
          border: '1px solid rgba(255,255,255,0.12)',
          boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.12)',
        }}
      >
        <div
          style={{ fontSize: 28, color: '#7cb8e4', textTransform: 'uppercase', letterSpacing: 3 }}
        >
          {page.eyebrow}
        </div>
        <div
          style={{
            fontSize: page.title.length > 60 ? 54 : 66,
            fontWeight: 700,
            lineHeight: 1.1,
            letterSpacing: -1.5,
          }}
        >
          {page.title}
        </div>
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            fontSize: 26,
            color: '#9badb8',
          }}
        >
          <span>Nolan Grout</span>
          <span>{SITE_DESCRIPTION.length > 0 ? 'nolangrout.com' : ''}</span>
        </div>
      </div>
    </div>,
    { width: 1200, height: 630 }
  )
}
