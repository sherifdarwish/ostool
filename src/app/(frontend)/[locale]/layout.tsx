import Footer from '@/components/shared/Footer'
import Navbar from '@/components/shared/Navbar'
import config from '@payload-config'
import { getPayload } from 'payload'

export const revalidate = 0
export const dynamic = 'force-dynamic'

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params // Await the params Promise
  const typedLocale = locale as 'en' | 'ar' | 'all' | undefined
  const payload = await getPayload({ config })
  const navbar = await payload.findGlobal({
    slug: 'navbar' as any,
    locale: typedLocale,
    fallbackLocale: 'en',
    depth: 2,
  })
  const footer = await payload.findGlobal({
    slug: 'footer',
    locale: typedLocale,
    fallbackLocale: 'en',
    depth: 2,
  })

  return (
    <div dir={locale === 'ar' ? 'rtl' : 'ltr'}>
      <Navbar locale={locale} navbar={navbar} />
      {children}
      <Footer footer={footer} />
    </div>
  )
}
