import type { Attribution, Touch } from '@/lib/analytics/attribution'

export interface Lead {
  firstName: string
  lastName: string
  email: string
  phone: string
  businessType: string
  revenue: string
  projectType: string
  timeline: string
  budget: string
  companyName: string
  projectDetails: string
  attribution: Attribution | null
  page: string
}

export type LeadResult =
  | { kind: 'lead'; lead: Lead }
  | { kind: 'spam' }
  | { kind: 'invalid'; field: string }

const REQUIRED = [
  'firstName',
  'lastName',
  'email',
  'phone',
  'businessType',
  'revenue',
  'projectType',
  'timeline',
  'budget',
] as const

const TOUCH_KEYS = [
  'source',
  'medium',
  'campaign',
  'content',
  'term',
  'referrer',
  'landing',
  'ts',
] as const

function clip(v: unknown, max: number): string {
  return typeof v === 'string' ? v.trim().slice(0, max) : ''
}

function touch(v: unknown): Touch | null {
  if (typeof v !== 'object' || v === null) return null
  const r = v as Record<string, unknown>
  const out = {} as Record<(typeof TOUCH_KEYS)[number], string>
  for (const k of TOUCH_KEYS) out[k] = clip(r[k], 500)
  return out
}

export function validateLead(body: unknown): LeadResult {
  if (typeof body !== 'object' || body === null) return { kind: 'invalid', field: 'body' }
  const b = body as Record<string, unknown>
  if (clip(b.website, 200) !== '') return { kind: 'spam' }
  for (const f of REQUIRED) {
    if (!clip(b[f], 200)) return { kind: 'invalid', field: f }
  }
  const email = clip(b.email, 200)
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return { kind: 'invalid', field: 'email' }
  const phone = clip(b.phone, 40)
  if (phone.replace(/\D/g, '').length < 7) return { kind: 'invalid', field: 'phone' }
  const a = typeof b.attribution === 'object' && b.attribution !== null ? b.attribution : null
  const first = a ? touch((a as Record<string, unknown>).first) : null
  const last = a ? touch((a as Record<string, unknown>).last) : null
  return {
    kind: 'lead',
    lead: {
      firstName: clip(b.firstName, 100),
      lastName: clip(b.lastName, 100),
      email,
      phone,
      businessType: clip(b.businessType, 100),
      revenue: clip(b.revenue, 100),
      projectType: clip(b.projectType, 100),
      timeline: clip(b.timeline, 100),
      budget: clip(b.budget, 100),
      companyName: clip(b.companyName, 200),
      projectDetails: clip(b.projectDetails, 4000),
      attribution: first && last ? { first, last } : null,
      page: clip(b.page, 300) || '/book',
    },
  }
}

/** Payload shape the CRM webhook already accepts. */
export function crmPayload(lead: Lead): Record<string, string> {
  const notes = [
    `Business Type: ${lead.businessType}`,
    `Revenue: ${lead.revenue}`,
    `Project Type: ${lead.projectType}`,
    `Timeline: ${lead.timeline}`,
    `Budget: ${lead.budget}`,
    lead.companyName ? `Company: ${lead.companyName}` : '',
    lead.projectDetails ? `Project Details: ${lead.projectDetails}` : '',
    lead.attribution
      ? `First touch: ${lead.attribution.first.source}/${lead.attribution.first.medium} ${lead.attribution.first.campaign}`.trim()
      : '',
    lead.attribution
      ? `Last touch: ${lead.attribution.last.source}/${lead.attribution.last.medium} ${lead.attribution.last.campaign}`.trim()
      : '',
  ]
    .filter(Boolean)
    .join('\n')
  return {
    first_name: lead.firstName,
    last_name: lead.lastName,
    email: lead.email,
    phone_number: lead.phone,
    notes,
    source: 'website-qualification-form',
  }
}
