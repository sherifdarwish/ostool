import Footer from '@/components/shared/Footer'
import Navbar from '@/components/shared/Navbar'
import { getCachedGlobal } from '@/utilities/getGlobals'
import { auth } from '@/auth'

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
  const session = await auth()
  const typedLocale = locale as 'en' | 'ar' | 'all' | undefined
  const navbar = await getCachedGlobal('navbar', {
    depth: 2,
    locale: typedLocale,
    fallbackLocale: 'en',
  })()
  const footer = await getCachedGlobal('footer', {
    depth: 2,
    locale: typedLocale,
    fallbackLocale: 'en',
  })()

  return (
    <div dir={locale === 'ar' ? 'rtl' : 'ltr'}>
      <Navbar
        accountUser={session?.user ? { image: session.user.image, name: session.user.name } : null}
        authenticated={Boolean(session?.user)}
        locale={locale}
        navbar={navbar}
      />
      {children}
      <Footer footer={footer} />
    </div>
  )
}
