import type { Metadata, Viewport } from 'next'
import { Instrument_Sans } from 'next/font/google'
import type { ReactNode } from 'react'
import { Analytics } from '@/components/Analytics'
import { JsonLd } from '@/components/JsonLd'
import { SiteFooter } from '@/components/SiteFooter'
import { SiteHeader } from '@/components/SiteHeader'
import { themeScript } from '@/components/ThemeToggle'
import { graph, personLd, websiteLd } from '@/lib/jsonld'
import { SITE_DESCRIPTION, SITE_NAME, SITE_TITLE, SITE_URL } from '@/lib/site'
import './globals.css'

const instrument = Instrument_Sans({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-instrument',
})

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: { default: SITE_TITLE, template: `%s | ${SITE_NAME}` },
  description: SITE_DESCRIPTION,
  applicationName: SITE_NAME,
  authors: [{ name: SITE_NAME, url: SITE_URL }],
  creator: SITE_NAME,
  icons: { icon: '/ng.png', apple: '/ng.png' },
  alternates: {
    canonical: SITE_URL,
    types: { 'application/rss+xml': [{ url: '/feed.xml', title: 'Nolan Grout: Writing' }] },
  },
  robots: { index: true, follow: true },
}

export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#f3f6f9' },
    { media: '(prefers-color-scheme: dark)', color: '#0b1117' },
  ],
  width: 'device-width',
  initialScale: 1,
}

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className={instrument.variable} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body className="atmosphere">
        <a href="#main" className="skip-link">
          Skip to content
        </a>
        <SiteHeader />
        <main id="main" className="pt-10 sm:pt-16">
          {children}
        </main>
        <SiteFooter />
        <JsonLd data={graph(personLd(), websiteLd())} />
        <Analytics />
      </body>
    </html>
  )
}
