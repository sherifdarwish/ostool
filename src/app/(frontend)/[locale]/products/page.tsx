import React from 'react'
import { getPayload } from 'payload'
import configPromise from '@payload-config'
import { notFound } from 'next/navigation'
import { localeLang } from '@/utilities/locale'
import { ProductCard } from '@/components/Products/ProductCard'
import { ProductFilters } from '@/components/Products/ProductFilters'
import { Container } from '@/components/shared/Container'
import type { Where } from 'payload'

export default async function ProductsPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
  const { locale } = await params
  const { brand } = await searchParams

  const supportedLocale = localeLang.find((lang) => lang.code === locale)
  if (!supportedLocale) {
    return notFound()
  }

  const payload = await getPayload({ config: configPromise })

  // Fetch all brands for the filter
  const brands = await payload.find({
    collection: 'brands',
    sort: 'name',
    limit: 100,
  })

  // Build query for products
  const where: Where = {
    status: {
      equals: 'published',
    },
  }

  if (brand && typeof brand === 'string') {
    where['brand.slug'] = {
      equals: brand,
    }
  }

  // Fetch products
  const products = await payload.find({
    collection: 'products',
    where,
    sort: '-updatedAt',
    locale: locale as 'en' | 'ar',
    depth: 2,
  })

  return (
    <div className="py-12 bg-background min-h-screen">
      <Container>
        <div className="mb-12 text-center md:text-left">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Product Catalog</h1>
          <p className="text-xl text-muted-foreground max-w-2xl">
            Explore our range of high-performance B2B solutions tailored for your business needs.
          </p>
        </div>

        <ProductFilters brands={brands.docs} />

        {products.docs.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {products.docs.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="text-center py-20 bg-card rounded-xl border border-dashed">
            <h2 className="text-2xl font-semibold mb-2">No products found</h2>
            <p className="text-muted-foreground">
              Try adjusting your filters or check back later.
            </p>
          </div>
        )}
      </Container>
    </div>
  )
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  await params
  return {
    title: `Products | Ostool`,
    description: 'Browse our complete catalog of professional B2B products.',
  }
}
