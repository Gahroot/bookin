export const SITE_URL = 'https://nolangrout.com'
export const SITE_NAME = 'Nolan Grout'
export const SITE_TITLE = 'Nolan Grout: AI business systems and AI agents for enterprises'
export const SITE_DESCRIPTION =
  'Nolan Grout builds AI-powered business systems and AI agents for real estate funds, operators and enterprise teams: governed data, agents executives can query, and automation that holds up.'
export const OWNER_EMAIL = 'SOLD@NolanGrout.com'
export const CAL_URL = 'https://cal.com/nolan-grout-nolan-grout-real-estate-y2trgn/30min'
export const PRESTYJ_URL = 'https://prestyj.com'

export const SAME_AS = ['https://github.com/Gahroot', 'https://prestyj.com'] as const

export interface Client {
  name: string
  url?: string
  note: string
}

export const CLIENTS: readonly Client[] = [
  { name: 'Triten', url: 'https://tritenre.com', note: 'Real estate investment' },
  { name: 'Black Mountain Fund', url: 'https://easefolio.com', note: 'Real estate fund' },
  { name: 'Anchor Mill Group', url: 'https://anchormillgroup.com', note: 'Real estate operator' },
  { name: 'Back2SleepNow', url: 'https://back2sleepnow.com', note: 'Consumer health' },
  { name: 'Prestyj', url: 'https://prestyj.com', note: 'AI voice agents' },
  { name: 'EZ Coder', note: 'AI coding agents' },
]

export const CAPABILITIES = {
  'ai-agents': {
    label: 'AI agents',
    blurb: 'Agents that do real work inside your systems, with guardrails and an audit trail.',
  },
  mcp: {
    label: 'MCP servers',
    blurb: 'Your governed data exposed to ChatGPT and Claude through the Model Context Protocol.',
  },
  'data-platform': {
    label: 'Data platforms',
    blurb: 'One trusted model of assets, people and money that every tool reads from.',
  },
  automation: {
    label: 'Automation',
    blurb: 'Recurring manual work replaced by pipelines that run, retry and report.',
  },
  'content-engine': {
    label: 'Content engines',
    blurb: 'Evidence-backed publishing systems that turn real work into public proof.',
  },
  'internal-tools': {
    label: 'Internal tools',
    blurb: 'Focused operator software for the jobs spreadsheets keep failing at.',
  },
  'voice-ai': {
    label: 'Voice AI',
    blurb: 'Voice agents that answer, qualify and book, around the clock.',
  },
  analytics: {
    label: 'Analytics',
    blurb: 'Reporting executives trust because every number traces back to its source.',
  },
} as const satisfies Record<string, { label: string; blurb: string }>

export type Capability = keyof typeof CAPABILITIES

export function isCapability(value: string): value is Capability {
  return Object.hasOwn(CAPABILITIES, value)
}

export function absoluteUrl(path: string): string {
  if (path === '/' || path === '') return SITE_URL
  return `${SITE_URL}${path.startsWith('/') ? path : `/${path}`}`.replace(/\/+$/, '')
}

/** Prestyj link with referral UTM params; campaign is the page it was clicked from. */
export function prestyjUrl(campaign: string): string {
  const url = new URL(PRESTYJ_URL)
  url.searchParams.set('utm_source', 'nolangrout.com')
  url.searchParams.set('utm_medium', 'referral')
  url.searchParams.set('utm_campaign', campaign)
  return url.toString()
}
