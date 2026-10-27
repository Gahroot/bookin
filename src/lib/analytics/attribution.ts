export interface Touch {
  source: string
  medium: string
  campaign: string
  content: string
  term: string
  referrer: string
  landing: string
  ts: string
}

export interface Attribution {
  first: Touch
  last: Touch
}

export const ATTR_KEY = 'ng_attr'

function externalReferrer(referrer: string, host: string): string {
  if (!referrer) return ''
  try {
    return new URL(referrer).host === host ? '' : referrer
  } catch {
    return ''
  }
}

/** The touch this visit represents, or null when it is internal navigation with no campaign. */
export function touchFrom(href: string, referrer: string, now: Date): Touch | null {
  const url = new URL(href)
  const p = url.searchParams
  const ref = externalReferrer(referrer, url.host)
  const source = p.get('utm_source') ?? ''
  if (!source && !ref) return null
  let refHost = ''
  try {
    refHost = ref ? new URL(ref).hostname : ''
  } catch {
    refHost = ''
  }
  return {
    source: source || refHost,
    medium: p.get('utm_medium') ?? (source ? '' : 'referral'),
    campaign: p.get('utm_campaign') ?? '',
    content: p.get('utm_content') ?? '',
    term: p.get('utm_term') ?? '',
    referrer: ref,
    landing: url.pathname,
    ts: now.toISOString(),
  }
}

export function directTouch(href: string, now: Date): Touch {
  return {
    source: '(direct)',
    medium: '(none)',
    campaign: '',
    content: '',
    term: '',
    referrer: '',
    landing: new URL(href).pathname,
    ts: now.toISOString(),
  }
}

function isTouch(v: unknown): v is Touch {
  if (typeof v !== 'object' || v === null) return false
  const keys = ['source', 'medium', 'campaign', 'content', 'term', 'referrer', 'landing', 'ts']
  return keys.every((k) => typeof (v as Record<string, unknown>)[k] === 'string')
}

export function readAttribution(storage: Pick<Storage, 'getItem'>): Attribution | null {
  try {
    const raw = storage.getItem(ATTR_KEY)
    if (!raw) return null
    const v: unknown = JSON.parse(raw)
    if (typeof v !== 'object' || v === null) return null
    const { first, last } = v as Record<string, unknown>
    return isTouch(first) && isTouch(last) ? { first, last } : null
  } catch {
    return null
  }
}

/** First touch is kept forever; last touch moves on every campaign or external referral. */
export function recordTouch(
  storage: Pick<Storage, 'getItem' | 'setItem'>,
  href: string,
  referrer: string,
  now: Date
): Attribution {
  const existing = readAttribution(storage)
  const touch = touchFrom(href, referrer, now)
  const next: Attribution = existing
    ? { first: existing.first, last: touch ?? existing.last }
    : { first: touch ?? directTouch(href, now), last: touch ?? directTouch(href, now) }
  try {
    storage.setItem(ATTR_KEY, JSON.stringify(next))
  } catch {
    // Storage full or blocked: attribution is best effort.
  }
  return next
}
