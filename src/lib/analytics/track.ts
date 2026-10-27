import { readAttribution } from './attribution'

export type EventType =
  | 'pageview'
  | 'cta_view'
  | 'cta_click'
  | 'form_start'
  | 'form_submit'
  | 'demo_run'
  | 'outbound_prestyj'

export interface EventBody {
  type: EventType
  path: string
  referrer?: string
  source?: string
  utm_source?: string
  utm_medium?: string
  utm_campaign?: string
}

/** Cookieless event via sendBeacon (fetch keepalive as fallback). Never throws. */
export function track(type: EventType, extra: { source?: string } = {}): void {
  if (typeof window === 'undefined') return
  try {
    const last = readAttribution(window.localStorage)?.last
    const body: EventBody = {
      type,
      path: window.location.pathname,
      ...(document.referrer ? { referrer: document.referrer } : {}),
      ...(extra.source ? { source: extra.source } : {}),
      ...(last?.source ? { utm_source: last.source } : {}),
      ...(last?.medium ? { utm_medium: last.medium } : {}),
      ...(last?.campaign ? { utm_campaign: last.campaign } : {}),
    }
    const payload = JSON.stringify(body)
    const blob = new Blob([payload], { type: 'application/json' })
    if (navigator.sendBeacon('/api/event', blob)) return
    void fetch('/api/event', {
      method: 'POST',
      body: payload,
      keepalive: true,
      headers: { 'content-type': 'application/json' },
    }).catch(() => undefined)
  } catch {
    // Analytics must never break the page.
  }
}
