import type { MetadataRoute } from 'next'

import { getPayload } from '@/lib/payload'
import { localeLang } from '@/utilities/locale'
import { getServerSideURL } from '@/utilities/getURL'
import type { Page, Post } from '@/payload-types'

type LocaleCode = (typeof localeLang)[number]['code']

const toLocaleSlug = (slug: string) => slug.replace(/^\/+/, '')

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const siteUrl = getServerSideURL().replace(/\/$/, '')

  // Skip database connection during build
  if (process.env.SKIP_DB_FOR_BUILD === 'true') {
    return [
      {
        url: siteUrl,
        changeFrequency: 'weekly',
        priority: 1,
      },
    ]
  }

  try {
    const payload = await getPayload()
    const locales = localeLang.map(({ code }) => code as LocaleCode)

    const [pagesPerLocale, postsPerLocale] = await Promise.all([
      Promise.all(
        locales.map(async (locale) => {
          const result = await payload.find({
            collection: 'pages',
            locale: locale as 'en' | 'ar' | 'all' | undefined,
            depth: 0,
            limit: 1000,
            where: {
              slug: { not_equals: 'blogs' },
              _status: { equals: 'published' },
            },
            select: {
              slug: true,
              updatedAt: true,
              publishedAt: true,
            },
          })

          return {
            locale,
            docs: result.docs as Pick<Page, 'slug' | 'updatedAt' | 'publishedAt'>[],
          }
        }),
      ),
      Promise.all(
        locales.map(async (locale) => {
          const result = await payload.find({
            collection: 'posts',
            locale: locale as 'en' | 'ar' | 'all' | undefined,
            depth: 0,
            limit: 1000,
            where: {
              publishedAt: { not_equals: null },
            },
            select: {
              slug: true,
              updatedAt: true,
              publishedAt: true,
            },
            sort: '-publishedAt',
          })

          return {
            locale,
            docs: result.docs as Pick<Post, 'slug' | 'updatedAt' | 'publishedAt'>[],
          }
        }),
      ),
    ])

    const entries: MetadataRoute.Sitemap = []

    for (const { locale, docs } of pagesPerLocale) {
      const homeDoc = docs.find((doc) => doc.slug === '/')

      entries.push({
        url: `${siteUrl}/${locale}`,
        changeFrequency: 'weekly',
        priority: 1,
        lastModified: homeDoc?.updatedAt ? new Date(homeDoc.updatedAt) : undefined,
      })

      docs
        .filter((doc) => doc.slug && doc.slug !== '/')
        .forEach((doc) => {
          const cleanedSlug = toLocaleSlug(doc.slug)
          if (!cleanedSlug) return

          entries.push({
            url: `${siteUrl}/${locale}/${cleanedSlug}`,
            changeFrequency: 'weekly',
            priority: 0.8,
            lastModified: doc.updatedAt ? new Date(doc.updatedAt) : undefined,
          })
        })
    }

    for (const { locale, docs } of postsPerLocale) {
      const newestPostTimestamp = docs[0]?.updatedAt || docs[0]?.publishedAt

      entries.push({
        url: `${siteUrl}/${locale}/blogs`,
        changeFrequency: 'weekly',
        priority: 0.7,
        lastModified: newestPostTimestamp ? new Date(newestPostTimestamp) : undefined,
      })

      docs.forEach((doc) => {
        if (!doc.slug) return

        const publishedAt = doc.publishedAt ? new Date(doc.publishedAt) : undefined
        const updatedAt = doc.updatedAt ? new Date(doc.updatedAt) : undefined

        entries.push({
          url: `${siteUrl}/${locale}/blogs/${doc.slug}`,
          changeFrequency: 'weekly',
          priority: 0.6,
          lastModified: updatedAt || publishedAt,
        })
      })
    }

    entries.push({
      url: siteUrl,
      changeFrequency: 'weekly',
      priority: 0.5,
    })

    const seen = new Set<string>()
    const deduped: MetadataRoute.Sitemap = []

    for (const entry of entries) {
      if (seen.has(entry.url)) continue
      seen.add(entry.url)
      deduped.push(entry)
    }

    deduped.sort((a, b) => a.url.localeCompare(b.url))

    return deduped
  } catch (err) {
    console.error('Failed to resolve sitemap (likely due to missing DB during build):', err)
    return [
      {
        url: siteUrl,
        changeFrequency: 'weekly',
        priority: 1,
      },
    ]
  }
}
