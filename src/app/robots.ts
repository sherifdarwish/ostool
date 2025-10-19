import type { MetadataRoute } from 'next'

import { getServerSideURL } from '@/utilities/getURL'

export default function robots(): MetadataRoute.Robots {
  const siteUrl = getServerSideURL().replace(/\/$/, '')
  const host = new URL(siteUrl).host

  return {
    rules: [
      {
        userAgent: '*',
        disallow: ['/admin', '/admin/*'],
      },
    ],
    sitemap: [`${siteUrl}/sitemap.xml`],
    host,
  }
}
