'use server'

import { signIn } from '@/auth'

export async function loginWithPassword(locale: string, formData: FormData) {
  await signIn('credentials', {
    email: formData.get('email'),
    password: formData.get('password'),
    redirectTo: `/${locale}/auth/continue`,
  })
}
