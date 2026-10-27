'use client'

import { useState } from 'react'
import { readAttribution } from '@/lib/analytics/attribution'
import { track } from '@/lib/analytics/track'
import { CAL_URL, OWNER_EMAIL } from '@/lib/site'
import { QualificationForm, type QualificationData } from './QualificationForm'

export async function submitLead(data: QualificationData, website: string): Promise<boolean> {
  let attribution = null
  try {
    attribution = readAttribution(window.localStorage)
  } catch {
    attribution = null
  }
  try {
    const res = await fetch('/api/lead', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ ...data, website, attribution, page: window.location.pathname }),
    })
    return res.ok
  } catch {
    return false
  }
}

export function BookingFlow() {
  const [lead, setLead] = useState<QualificationData | null>(null)

  if (lead) {
    return (
      <div>
        <div className="glass rounded-[var(--radius-region)] p-6">
          <p className="eyebrow">You’re booked in</p>
          <h2 className="mt-2 text-2xl font-semibold" tabIndex={-1} ref={(el) => el?.focus()}>
            Thanks, {lead.firstName}. Pick a time that works.
          </h2>
          <p className="mt-2 text-ink-muted">
            Questions first?{' '}
            <a href={`mailto:${OWNER_EMAIL}`} className="text-action">
              {OWNER_EMAIL}
            </a>
          </p>
        </div>
        <div className="surface-card mt-6 overflow-hidden rounded-[var(--radius-card)]">
          <iframe
            src={CAL_URL}
            title="Schedule a 30-minute call with Nolan Grout"
            loading="lazy"
            className="block h-[720px] w-full border-0"
          />
        </div>
      </div>
    )
  }

  return (
    <div className="surface-card rounded-[var(--radius-card)] p-6 sm:p-10">
      <QualificationForm
        onStart={() => {
          track('form_start', { source: 'book' })
        }}
        onSubmit={async (data, website) => {
          const ok = await submitLead(data, website)
          if (ok) {
            track('form_submit', { source: 'book' })
            setLead(data)
          }
          return ok
        }}
      />
    </div>
  )
}
