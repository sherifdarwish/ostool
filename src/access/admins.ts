import type { AccessArgs } from 'payload'

import type { User } from '@/payload-types'

type AdminAccess = (args: AccessArgs<User>) => boolean

export const admins: AdminAccess = ({ req: { user } }) => {
  if (!user) return false

  // Existing CMS users were created before roles existed. Keep them admin-capable until migrated.
  return user.role === 'admin' || !user.role
}
