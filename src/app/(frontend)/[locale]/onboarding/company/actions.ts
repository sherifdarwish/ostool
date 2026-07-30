'use server'

import { auth } from '@/auth'
import config from '@payload-config'
import { redirect } from 'next/navigation'
import { getPayload } from 'payload'
import { z } from 'zod'

const companySchema = z.object({
  businessType: z.string().trim().min(1),
  country: z.string().trim().min(1),
  fleetSize: z.enum(['1-10', '11-50', '51-200', '200+']),
  name: z.string().trim().min(1),
  phone: z.string().trim().min(1),
})

export async function saveCompanyProfile(locale: string, formData: FormData) {
  const session = await auth()

  if (!session?.user?.email) {
    redirect(`/${locale}/login`)
  }

  const parsed = companySchema.parse({
    businessType: formData.get('businessType'),
    country: formData.get('country'),
    fleetSize: formData.get('fleetSize'),
    name: formData.get('name'),
    phone: formData.get('phone'),
  })

  const payload = await getPayload({ config })
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

  if (!user) {
    redirect(`/${locale}/login`)
  }

  const company = await payload.create({
    collection: 'companies',
    overrideAccess: true,
    data: {
      ...parsed,
      owner: user.id,
    },
  })

  await payload.update({
    collection: 'users',
    id: user.id,
    overrideAccess: true,
    data: {
      company: company.id,
      onboardingStatus: 'app-selection-required',
    },
  })

  redirect(`/${locale}/apps`)
}
