import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

vi.mock('server-only', () => ({}))

const valid = {
  firstName: 'Ada',
  lastName: 'Lovelace',
  email: 'ada@example.com',
  phone: '+1 555 010 0000',
  businessType: 'real-estate',
  revenue: '5m+',
  projectType: 'ai-agents',
  timeline: '1-month',
  budget: '25k+',
  website: '',
  attribution: {
    first: {
      source: 'google',
      medium: 'organic',
      campaign: '',
      content: '',
      term: '',
      referrer: '',
      landing: '/',
      ts: 't',
    },
    last: {
      source: 'linkedin',
      medium: 'social',
      campaign: 'x',
      content: '',
      term: '',
      referrer: '',
      landing: '/book',
      ts: 't',
    },
  },
  page: '/book',
}

function req(body: unknown): Request {
  return new Request('http://localhost/api/lead', { method: 'POST', body: JSON.stringify(body) })
}

describe('POST /api/lead', () => {
  const fetchMock = vi.fn<typeof fetch>()
  const logs = vi.fn()
  beforeEach(() => {
    vi.stubGlobal('fetch', fetchMock)
    fetchMock.mockResolvedValue(new Response('ok'))
    vi.spyOn(console, 'log').mockImplementation(logs)
    vi.spyOn(console, 'warn').mockImplementation(logs)
    vi.spyOn(console, 'error').mockImplementation(logs)
    vi.stubEnv('CRM_API_KEY', 'crm-secret-key')
    vi.stubEnv('CRM_WEBHOOK_URL', 'https://crm.example.com/hook')
    vi.stubEnv('ENGINE_URL', 'https://engine.example.com/')
    vi.stubEnv('SITE_INGEST_SECRET', 'ingest-secret')
  })
  afterEach(() => {
    vi.unstubAllEnvs()
    vi.unstubAllGlobals()
    vi.restoreAllMocks()
    fetchMock.mockReset()
    logs.mockReset()
  })

  it('forwards to the CRM and engine and never logs PII or keys', async () => {
    const { POST } = await import('./route')
    const res = await POST(req(valid))
    expect(await res.json()).toEqual({ ok: true })
    expect(fetchMock).toHaveBeenCalledTimes(2)
    const urls = fetchMock.mock.calls.map((c) => (typeof c[0] === 'string' ? c[0] : ''))
    expect(urls[0]).toContain('https://crm.example.com/hook')
    expect(urls[1]).toBe('https://engine.example.com/api/lead')
    const engineInit = fetchMock.mock.calls[1]?.[1]
    expect(engineInit?.headers).toMatchObject({ 'x-site-secret': 'ingest-secret' })
    const logged = JSON.stringify(logs.mock.calls)
    expect(logged).not.toContain('ada@example.com')
    expect(logged).not.toContain('crm-secret-key')
  })

  it('honeypot returns ok without forwarding', async () => {
    const { POST } = await import('./route')
    const res = await POST(req({ ...valid, website: 'http://spam' }))
    expect(res.status).toBe(200)
    expect(fetchMock).not.toHaveBeenCalled()
  })

  it('rejects invalid email', async () => {
    const { POST } = await import('./route')
    const res = await POST(req({ ...valid, email: 'nope' }))
    expect(res.status).toBe(400)
  })

  it('502 when every forward fails', async () => {
    fetchMock.mockResolvedValue(new Response('no', { status: 500 }))
    const { POST } = await import('./route')
    const res = await POST(req(valid))
    expect(res.status).toBe(502)
  })
})
