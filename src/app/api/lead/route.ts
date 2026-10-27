import 'server-only'
import { crmPayload, validateLead, type Lead } from '@/lib/lead/validate'

const DEFAULT_CRM = 'https://voice-noob-production.up.railway.app/webhooks/leads/website'

async function post(url: string, body: unknown, headers: Record<string, string>): Promise<boolean> {
  try {
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'content-type': 'application/json', ...headers },
      body: JSON.stringify(body),
      signal: AbortSignal.timeout(8000),
      cache: 'no-store',
    })
    return res.ok
  } catch {
    return false
  }
}

function forwards(lead: Lead): Promise<boolean>[] {
  const jobs: Promise<boolean>[] = []
  const crmKey = process.env.CRM_API_KEY
  if (crmKey) {
    const url = new URL(process.env.CRM_WEBHOOK_URL ?? DEFAULT_CRM)
    url.searchParams.set('api_key', crmKey)
    jobs.push(post(url.toString(), crmPayload(lead), { 'x-api-key': crmKey }))
  }
  const engine = process.env.ENGINE_URL?.replace(/\/+$/, '')
  const secret = process.env.SITE_INGEST_SECRET
  if (engine && secret) {
    jobs.push(post(`${engine}/api/lead`, lead, { 'x-site-secret': secret }))
  }
  return jobs
}

export async function POST(request: Request): Promise<Response> {
  let body: unknown
  try {
    body = await request.json()
  } catch {
    return Response.json({ ok: false, error: 'invalid_json' }, { status: 400 })
  }
  const result = validateLead(body)
  if (result.kind === 'spam') return Response.json({ ok: true })
  if (result.kind === 'invalid') {
    return Response.json({ ok: false, error: 'invalid', field: result.field }, { status: 400 })
  }
  const jobs = forwards(result.lead)
  const delivered = await Promise.all(jobs)
  // Log only outcome counts: never PII, URLs with keys, or secrets.
  if (jobs.length === 0) console.warn('[lead] no forward destinations configured')
  else if (!delivered.some(Boolean)) {
    console.error(`[lead] all ${jobs.length} forwards failed`)
    return Response.json({ ok: false, error: 'forward_failed' }, { status: 502 })
  }
  return Response.json({ ok: true })
}
