'use server'

import { signOut } from '@/auth'

export async function logout(locale: string) {
  await signOut({ redirectTo: `/${locale}/login` })
}
