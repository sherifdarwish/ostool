'use client'
import React from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import type { Brand } from '@/payload-types'

export const ProductFilters: React.FC<{
  brands: Brand[]
}> = ({ brands }) => {
  const router = useRouter()
  const searchParams = useSearchParams()
  const currentBrand = searchParams.get('brand') || 'all'

  const handleBrandChange = (value: string) => {
    const params = new URLSearchParams(searchParams.toString())
    if (value === 'all') {
      params.delete('brand')
    } else {
      params.set('brand', value)
    }
    router.push(`/en/products?${params.toString()}`)
  }

  return (
    <div className="flex flex-col sm:flex-row items-center gap-4 mb-8">
      <div className="w-full sm:w-64">
        <label htmlFor="brand-filter" className="block text-sm font-medium text-foreground mb-1">
          Filter by Brand
        </label>
        <Select value={currentBrand} onValueChange={handleBrandChange}>
          <SelectTrigger id="brand-filter">
            <SelectValue placeholder="All Brands" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Brands</SelectItem>
            {brands.map((brand) => (
              <SelectItem key={brand.id} value={brand.slug}>
                {brand.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  )
}
