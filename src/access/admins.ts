import type { AccessArgs } from 'payload'

import type { User } from '@/payload-types'

type AdminAccess = (args: AccessArgs<User>) => boolean

export const admins: AdminAccess = ({ req: { user } }) => {
  if (!user) return false

  return user.role === 'admin'
}
