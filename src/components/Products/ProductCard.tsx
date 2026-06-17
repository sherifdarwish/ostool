'use client'
import React from 'react'
import Link from 'next/link'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Media } from '@/components/Media'
import type { Product, Brand } from '@/payload-types'
import { cn } from '@/utilities/ui'

export const ProductCard: React.FC<{
  product: Product
  className?: string
}> = ({ product, className }) => {
  const { name, slug, brand, mainImage, tags, shortFeatures } = product
  const brandData = brand as Brand

  return (
    <Card className={cn('overflow-hidden flex flex-col h-full bg-card transition-all hover:shadow-lg', className)}>
      <div className="relative aspect-square w-full overflow-hidden">
        {mainImage && typeof mainImage !== 'string' && (
          <Media
            resource={mainImage}
            size="33vw"
            className="object-cover w-full h-full transition-transform hover:scale-105"
          />
        )}
      </div>
      <CardHeader className="p-4 pb-2">
        <div className="flex justify-between items-start gap-2 mb-2">
          <div className="flex flex-wrap gap-1">
            {tags?.map((tagItem, index) => (
              <span
                key={index}
                className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-primary/10 text-primary"
              >
                {tagItem.tag}
              </span>
            ))}
          </div>
          {brandData?.logo && typeof brandData.logo !== 'string' && (
            <div className="h-6 w-auto shrink-0">
              <Media resource={brandData.logo} className="h-full w-auto object-contain" />
            </div>
          )}
        </div>
        <CardTitle className="text-xl font-bold line-clamp-1">{name}</CardTitle>
        <p className="text-sm text-muted-foreground">{brandData?.name}</p>
      </CardHeader>
      <CardContent className="p-4 pt-0 flex-grow">
        <ul className="mt-4 space-y-2">
          {shortFeatures?.map((featureItem, index) => (
            <li key={index} className="flex items-center text-sm text-foreground/80">
              <span className="mr-2 h-1.5 w-1.5 rounded-full bg-primary shrink-0" />
              {featureItem.feature}
            </li>
          ))}
        </ul>
      </CardContent>
      <CardFooter className="p-4 pt-0">
        <Button asChild className="w-full">
          <Link href={`/en/products/${slug}`}>View Details</Link>
        </Button>
      </CardFooter>
    </Card>
  )
}
