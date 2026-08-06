'use server'

import { auth } from '@/auth'
import config from '@payload-config'
import { redirect } from 'next/navigation'
import { getPayload } from 'payload'
import { initialApplications } from './applicationData'

export async function ensureInitialApplications() {
  const payload = await getPayload({ config })

  for (const application of initialApplications) {
    const existing = await payload.find({
      collection: 'applications',
      limit: 1,
      overrideAccess: true,
      where: {
        slug: {
          equals: application.slug,
        },
      },
    })

    if (!existing.docs[0]) {
      await payload.create({
        collection: 'applications',
        overrideAccess: true,
        data: {
          ...application,
          status: 'active',
        },
      })
    }
  }
}

export async function selectApplication(locale: string, formData: FormData) {
  const slug = String(formData.get('application') || '')
  const session = await auth()

  if (!session?.user?.email) {
    redirect(`/${locale}/login`)
  }

  const payload = await getPayload({ config })
  const users = await payload.find({
    collection: 'users',
    depth: 1,
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

  if (user.onboardingStatus === 'company-required') {
    redirect(`/${locale}/onboarding`)
  }

  const applications = await payload.find({
    collection: 'applications',
    limit: 1,
    overrideAccess: true,
    where: {
      slug: {
        equals: slug,
      },
    },
  })

  const application = applications.docs[0]

  if (!application) {
    redirect(`/${locale}/apps`)
  }

  const enabledAppIds = (user.enabledApps || []).map((app) =>
    typeof app === 'number' ? app : app.id,
  )
  const nextEnabledAppIds = Array.from(new Set([...enabledAppIds, application.id]))

  await payload.update({
    collection: 'users',
    id: user.id,
    overrideAccess: true,
    data: {
      enabledApps: nextEnabledAppIds,
      onboardingStatus: 'complete',
    },
  })

  redirect(`/${locale}/apps?selected=${application.slug}`)
}
