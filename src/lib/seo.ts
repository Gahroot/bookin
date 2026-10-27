import type { Metadata } from 'next'
import { SITE_NAME, absoluteUrl } from './site'

interface PageMeta {
  title: string
  description: string
  path: string
  /** Absolute path of an image, or omitted to use the generated glass OG image. */
  image?: string
  ogKey?: string
  type?: 'website' | 'article' | 'profile'
  publishedTime?: string
  modifiedTime?: string
}

export function pageMetadata(m: PageMeta): Metadata {
  const image = m.image ?? `/og/${m.ogKey ?? 'page/home'}`
  const url = absoluteUrl(m.path)
  const og = {
    title: m.title,
    description: m.description,
    url,
    siteName: SITE_NAME,
    locale: 'en_US',
    images: [{ url: image, width: 1200, height: 630, alt: m.title }],
  }
  return {
    title: m.title,
    description: m.description,
    alternates: { canonical: url },
    openGraph:
      m.type === 'article'
        ? {
            ...og,
            type: 'article',
            authors: [SITE_NAME],
            ...(m.publishedTime ? { publishedTime: m.publishedTime } : {}),
            ...(m.modifiedTime ? { modifiedTime: m.modifiedTime } : {}),
          }
        : { ...og, type: m.type === 'profile' ? 'profile' : 'website' },
    twitter: {
      card: 'summary_large_image',
      title: m.title,
      description: m.description,
      images: [image],
    },
  }
}
