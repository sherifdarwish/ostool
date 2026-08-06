import { auth } from '@/auth'
import config from '@payload-config'
import { redirect } from 'next/navigation'
import { getPayload } from 'payload'

export async function getCurrentCustomer({
  locale,
  requireCompany = false,
}: {
  locale: string
  requireCompany?: boolean
}) {
  const session = await auth()

  if (!session?.user?.email) {
    redirect(`/${locale}/login`)
  }

  const payload = await getPayload({ config })
  const users = await payload.find({
    collection: 'users',
    depth: 2,
    limit: 1,
    overrideAccess: true,
    where: {
      email: {
        equals: session.user.email,
      },
    },
  })

  const user = users.docs[0]

  if (!user) {
    redirect(`/${locale}/login`)
  }

  if (requireCompany && user.onboardingStatus === 'company-required') {
    redirect(`/${locale}/onboarding`)
  }

  return {
    session,
    user,
  }
}
