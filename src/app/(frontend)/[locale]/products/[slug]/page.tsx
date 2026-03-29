import React from 'react'
import { getPayload } from 'payload'
import configPromise from '@payload-config'
import { notFound } from 'next/navigation'
import { localeLang } from '@/utilities/locale'
import { Media } from '@/components/Media'
import { Container } from '@/components/shared/Container'
import { RichText, defaultJSXConverters } from '@payloadcms/richtext-lexical/react'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'
import { LeadFormModal } from '@/components/Products/LeadFormModal'
import type { Brand, Product } from '@/payload-types'
import { CheckCircle2 } from 'lucide-react'

export default async function ProductDetailPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>
}) {
  const { locale, slug } = await params

  const supportedLocale = localeLang.find((lang) => lang.code === locale)
  if (!supportedLocale) {
    return notFound()
  }

  const payload = await getPayload({ config: configPromise })

  const result = await payload.find({
    collection: 'products',
    where: {
      slug: { equals: slug },
      status: { equals: 'published' },
    },
    locale: locale as 'en' | 'ar',
    depth: 2,
    limit: 1,
  })

  const product = result.docs[0] as Product
  if (!product) return notFound()

  const brand = product.brand as Brand

  return (
    <article className="pb-20">
      {/* Hero Section */}
      <section className="bg-card py-12 md:py-20 border-b">
        <Container>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="relative aspect-square bg-background rounded-2xl overflow-hidden border">
              {product.mainImage && typeof product.mainImage !== 'string' && (
                <Media
                  resource={product.mainImage}
                  className="object-contain w-full h-full p-8"
                />
              )}
            </div>
            
            <div className="space-y-6">
              <div className="flex items-center gap-4">
                {brand?.logo && typeof brand.logo !== 'string' && (
                  <div className="h-10 w-auto">
                    <Media resource={brand.logo} className="h-full w-auto object-contain" />
                  </div>
                )}
                <span className="text-lg font-medium text-muted-foreground">{brand?.name}</span>
              </div>
              
              <h1 className="text-4xl md:text-6xl font-bold tracking-tight">{product.name}</h1>
              
              <div className="flex flex-wrap gap-2">
                {product.tags?.map((tagItem, i) => (
                  <span key={i} className="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm font-medium">
                    {tagItem.tag}
                  </span>
                ))}
              </div>

              <div className="pt-6">
                <LeadFormModal 
                  productId={product.id} 
                  productName={product.name}
                  className="px-12 py-6 text-xl h-auto"
                />
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* Description & Sectors */}
      <section className="py-16">
        <Container>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-16">
            <div className="lg:col-span-2 prose prose-lg max-w-none">
              <h2 className="text-3xl font-bold mb-6">Product Description</h2>
              <RichText
                converters={{
                  ...defaultJSXConverters,
                }}
                data={product.description}
              />
            </div>
            
            <div className="space-y-8">
              <div className="bg-card p-8 rounded-2xl border">
                <h3 className="text-xl font-bold mb-4">Target Sectors</h3>
                <ul className="space-y-3">
                  {product.sectors?.map((sector, i) => (
                    <li key={i} className="flex items-center gap-3">
                      <CheckCircle2 className="h-5 w-5 text-primary shrink-0" />
                      <span className="font-medium">{sector.sectorName}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* Technical Specs */}
      {product.technicalSpecs && product.technicalSpecs.length > 0 && (
        <section className="py-16 bg-muted/30">
          <Container>
            <h2 className="text-3xl font-bold mb-8 text-center md:text-left">Technical Specifications</h2>
            <div className="bg-background rounded-2xl border overflow-hidden">
              <table className="w-full border-collapse">
                <tbody>
                  {product.technicalSpecs.map((spec, i) => (
                    <tr key={i} className="border-b last:border-0 hover:bg-muted/50 transition-colors">
                      <td className="px-6 py-4 font-bold text-muted-foreground w-1/3 border-r bg-muted/20">
                        {spec.key}
                      </td>
                      <td className="px-6 py-4">
                        {spec.value}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Container>
        </section>
      )}

      {/* FAQs */}
      {product.faqs && product.faqs.length > 0 && (
        <section className="py-16">
          <Container>
            <div className="max-w-3xl mx-auto">
              <h2 className="text-3xl font-bold mb-8 text-center">Frequently Asked Questions</h2>
              <Accordion type="single" collapsible className="w-full space-y-4">
                {product.faqs.map((faq, i) => (
                  <AccordionItem key={i} value={`faq-${i}`} className="border rounded-xl px-4 bg-card">
                    <AccordionTrigger className="text-lg font-semibold hover:no-underline py-4">
                      {faq.question}
                    </AccordionTrigger>
                    <AccordionContent className="prose prose-sm pb-4">
                      <RichText
                        converters={{ ...defaultJSXConverters }}
                        data={faq.answer}
                      />
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </div>
          </Container>
        </section>
      )}
    </article>
  )
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string; slug: string }> }) {
  const { locale, slug } = await params
  const payload = await getPayload({ config: configPromise })

  const result = await payload.find({
    collection: 'products',
    where: { slug: { equals: slug } },
    locale: locale as 'en' | 'ar',
    limit: 1,
  })

  const product = result.docs[0]
  if (!product) return {}

  return {
    title: `${product.name} | Ostool`,
    description: `Learn more about ${product.name}. High-quality B2B solutions for your organization.`,
  }
}
