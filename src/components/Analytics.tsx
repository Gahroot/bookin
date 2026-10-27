'use client'

import { usePathname } from 'next/navigation'
import { useEffect } from 'react'
import { recordTouch } from '@/lib/analytics/attribution'
import { track, type EventType } from '@/lib/analytics/track'

/**
 * Cookieless analytics: a pageview per route, attribution in localStorage, and delegated events
 * for any element carrying data-event (cta_click, outbound_prestyj) or data-cta-view.
 */
export function Analytics() {
  const pathname = usePathname()

  useEffect(() => {
    try {
      recordTouch(window.localStorage, window.location.href, document.referrer, new Date())
    } catch {
      // Storage blocked.
    }
    track('pageview')

    const seen = new Set<Element>()
    const io =
      'IntersectionObserver' in window
        ? new IntersectionObserver(
            (entries) => {
              for (const e of entries) {
                if (e.isIntersecting && !seen.has(e.target)) {
                  seen.add(e.target)
                  const source = e.target.getAttribute('data-cta-view') ?? ''
                  track('cta_view', source ? { source } : {})
                  io?.unobserve(e.target)
                }
              }
            },
            { threshold: 0.5 }
          )
        : null
    document.querySelectorAll('[data-cta-view]').forEach((el) => io?.observe(el))
    return () => io?.disconnect()
  }, [pathname])

  useEffect(() => {
    function onClick(e: MouseEvent) {
      const target = e.target instanceof Element ? e.target.closest('[data-event]') : null
      if (!target) return
      const type = target.getAttribute('data-event')
      if (type !== 'cta_click' && type !== 'outbound_prestyj') return
      const source = target.getAttribute('data-source') ?? ''
      track(type satisfies EventType, source ? { source } : {})
    }
    document.addEventListener('click', onClick)
    return () => {
      document.removeEventListener('click', onClick)
    }
  }, [])

  return null
}
