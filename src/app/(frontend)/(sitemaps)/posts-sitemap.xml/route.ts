import { getServerSideSitemap } from 'next-sitemap'
import { getPayload } from 'payload'
import config from '@payload-config'
import { unstable_cache } from 'next/cache'

const getPostsSitemap = unstable_cache(
  async () => {
    let results: any = { docs: [] }
    const dateFallback = new Date().toISOString()
    const SITE_URL =
      process.env.NEXT_PUBLIC_SERVER_URL ||
      process.env.VERCEL_PROJECT_PRODUCTION_URL ||
      'https://example.com'

    try {
      const payload = await getPayload({ config })

      results = await payload.find({
        collection: 'posts',
        overrideAccess: false,
        draft: false,
        depth: 0,
        limit: 1000,
        pagination: false,
        where: {
          _status: {
            equals: 'published',
          },
        },
        select: {
          slug: true,
          updatedAt: true,
        },
      })
    } catch (err) {
      console.error('Failed to fetch posts for sitemap (likely due to missing DB during build):', err)
      return []
    }

    const sitemap = results.docs
      ? results.docs
          .filter((post: any) => Boolean(post?.slug))
          .map((post: any) => ({
            loc: `${SITE_URL}/posts/${post?.slug}`,
            lastmod: post.updatedAt || dateFallback,
          }))
      : []

    return sitemap
  },
  ['posts-sitemap'],
  {
    tags: ['posts-sitemap'],
  },
)

export async function GET() {
  // Skip database connection during build
  if (process.env.SKIP_DB_FOR_BUILD === 'true') {
    return new Response('<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"></urlset>', {
      headers: { 'Content-Type': 'application/xml' },
    })
  }

  const sitemap = await getPostsSitemap()

  return getServerSideSitemap(sitemap)
}
