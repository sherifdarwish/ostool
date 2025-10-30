import type { Config } from 'src/payload-types'

import { unstable_cache } from 'next/cache'
import configPromise from '@payload-config'
import { getPayload } from 'payload'

type Global = keyof Config['globals']

type LocaleCode = Config['locale']

type LocaleOption = LocaleCode | 'all'

type NormalizedGlobalOptions = {
  depth: number
  locale?: LocaleOption
  fallbackLocale?: LocaleCode
  draft?: boolean
}

type GlobalOptions =
  | number
  | {
      depth?: number
      locale?: LocaleOption
      fallbackLocale?: LocaleCode
      draft?: boolean
    }

const normalizeOptions = (options?: GlobalOptions): NormalizedGlobalOptions => {
  if (typeof options === 'number') {
    return {
      depth: options,
    }
  }

  return {
    depth: options?.depth ?? 0,
    locale: options?.locale,
    fallbackLocale: options?.fallbackLocale,
    draft: options?.draft,
  }
}

async function getGlobal(slug: Global, options?: GlobalOptions) {
  const payload = await getPayload({ config: configPromise })
  const { depth, locale, fallbackLocale, draft } = normalizeOptions(options)

  return payload.findGlobal({
    slug,
    depth,
    locale,
    fallbackLocale,
    draft,
  })
}

/**
 * Returns an unstable_cache function mapped with the cache tag for the slug.
 * Passing the locale (or other options) ensures cached entries are scoped correctly.
 */
export const getCachedGlobal = (slug: Global, options?: GlobalOptions) => {
  const normalized = normalizeOptions(options)

  const cacheKey = [
    slug,
    normalized.depth,
    normalized.locale ?? 'no-locale',
    normalized.fallbackLocale ?? 'no-fallback',
    normalized.draft ? 'draft' : 'published',
  ].join(':')

  return unstable_cache(
    () => getGlobal(slug, normalized),
    [cacheKey],
    {
      tags: [`global_${slug}`],
    },
  )
}
