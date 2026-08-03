'use server'

import { signIn } from '@/auth'
import config from '@payload-config'
import { getPayload } from 'payload'
import { z } from 'zod'

const registerSchema = z.object({
  email: z.string().trim().email(),
  name: z.string().trim().min(1),
  password: z.string().min(8),
})

export async function registerWithPassword(locale: string, formData: FormData) {
  const data = registerSchema.parse({
    email: formData.get('email'),
    name: formData.get('name'),
    password: formData.get('password'),
  })

  const payload = await getPayload({ config })
  const existing = await payload.find({
    collection: 'users',
    limit: 1,
    overrideAccess: true,
    where: {
      email: {
        equals: data.email,
      },
    },
  })

  if (!existing.docs[0]) {
    await payload.create({
      collection: 'users',
      overrideAccess: true,
      data: {
        authProvider: 'email',
        email: data.email,
        name: data.name,
        onboardingStatus: 'company-required',
        password: data.password,
        role: 'customer',
      },
    })
  }

  await signIn('credentials', {
    email: data.email,
    password: data.password,
    redirectTo: `/${locale}/auth/continue`,
  })
}
