import { auth } from '@/auth'
import { RenderBlocks } from '@/blocks/RenderBlocks'
import config from '@payload-config'
import { notFound, redirect } from 'next/navigation'
import { getPayload } from 'payload'

export default async function OnboardingPage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  const session = await auth()

  if (!session?.user) redirect(`/${locale}/login`)

  const payload = await getPayload({ config })
  const pages = await payload.find({
    collection: 'pages',
    draft: false,
    fallbackLocale: 'en',
    limit: 1,
    locale: locale as 'en' | 'ar',
    overrideAccess: true,
    where: {
      slug: {
        equals: 'join-waiting-list',
      },
    },
  })
  const page = pages.docs[0]

  if (!page) notFound()

  return (
    <main>
      <RenderBlocks blocks={page.layout || []} locale={locale} />
    </main>
  )
}
