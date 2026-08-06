'use server'

import { auth } from '@/auth'
import config from '@payload-config'
import { getPayload } from 'payload'

type WaitingListData = {
  business_type?: string
  challenge?: string
  company_name?: string
  email?: string
  fleet?: string
  full_name?: string
  manage_operation?: string
  mobile?: string
}

export async function saveWaitingListOnboarding(data: WaitingListData) {
  const session = await auth()
  const payload = await getPayload({ config })
  const email = (session?.user?.email || data.email || '').trim().toLowerCase()

  if (!email) throw new Error('An email address is required')

  const submission = {
    business_type: data.business_type,
    challenge: data.challenge,
    company_name: data.company_name,
    email,
    fleet: data.fleet,
    full_name: data.full_name || session?.user?.name || undefined,
    manage_operation: data.manage_operation,
    mobile: data.mobile,
  }
  const existingSubmissions = await payload.find({
    collection: 'waiting-form-submissions',
    limit: 1,
    overrideAccess: true,
    where: {
      email: {
        equals: email,
      },
    },
  })

  if (existingSubmissions.docs[0]) {
    await payload.update({
      collection: 'waiting-form-submissions',
      id: existingSubmissions.docs[0].id,
      overrideAccess: true,
      data: submission,
    })
  } else {
    await payload.create({
      collection: 'waiting-form-submissions',
      overrideAccess: true,
      data: submission,
    })
  }

  if (!session?.user?.email) return

  const users = await payload.find({
    collection: 'users',
    limit: 1,
    overrideAccess: true,
    where: {
      email: {
        equals: session.user.email,
      },
    },
  })
  const user = users.docs[0]

  if (!user || user.onboardingStatus !== 'company-required') return

  await payload.update({
    collection: 'users',
    id: user.id,
    overrideAccess: true,
    data: {
      onboardingStatus: 'app-selection-required',
    },
  })
}
