import Link from 'next/link'
import type { ReactNode } from 'react'
import { prestyjUrl } from '@/lib/site'

export function BookLink({
  source,
  children = 'Book a call',
  className = 'btn btn-primary',
}: {
  source: string
  children?: ReactNode
  className?: string
}) {
  return (
    <Link href="/book" className={className} data-event="cta_click" data-source={source}>
      {children}
    </Link>
  )
}

export function PrestyjLink({
  campaign,
  children = 'Explore Prestyj',
  className = 'btn btn-quiet',
}: {
  campaign: string
  children?: ReactNode
  className?: string
}) {
  return (
    <a
      href={prestyjUrl(campaign)}
      className={className}
      data-event="outbound_prestyj"
      data-source={campaign}
      target="_blank"
      rel="noopener"
    >
      {children}
      <span className="sr-only"> (opens in a new tab)</span>
    </a>
  )
}
