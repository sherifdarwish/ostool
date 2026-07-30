import type { CollectionConfig } from 'payload'

import { admins } from '../../access/admins'
import { authenticated } from '../../access/authenticated'

export const Users: CollectionConfig = {
  slug: 'users',
  access: {
    admin: admins,
    create: authenticated,
    delete: admins,
    read: ({ req: { user } }) => {
      if (!user) return false
      if (user.role === 'admin' || !user.role) return true

      return {
        id: {
          equals: user.id,
        },
      }
    },
    update: ({ req: { user } }) => {
      if (!user) return false
      if (user.role === 'admin' || !user.role) return true

      return {
        id: {
          equals: user.id,
        },
      }
    },
  },
  admin: {
    defaultColumns: ['name', 'email', 'role', 'onboardingStatus'],
    useAsTitle: 'name',
  },
  auth: true,
  fields: [
    {
      name: 'name',
      type: 'text',
    },
    {
      name: 'role',
      type: 'select',
      defaultValue: 'customer',
      options: [
        { label: 'Admin', value: 'admin' },
        { label: 'Customer', value: 'customer' },
      ],
      required: true,
    },
    {
      name: 'authProvider',
      type: 'select',
      options: [
        { label: 'Email', value: 'email' },
        { label: 'Google', value: 'google' },
        { label: 'LinkedIn', value: 'linkedin' },
      ],
    },
    {
      name: 'providerAccountId',
      type: 'text',
      index: true,
    },
    {
      name: 'avatarUrl',
      type: 'text',
    },
    {
      name: 'company',
      type: 'relationship',
      relationTo: 'companies',
    },
    {
      name: 'enabledApps',
      type: 'relationship',
      hasMany: true,
      relationTo: 'applications',
    },
    {
      name: 'onboardingStatus',
      type: 'select',
      defaultValue: 'company-required',
      options: [
        { label: 'Company Required', value: 'company-required' },
        { label: 'App Selection Required', value: 'app-selection-required' },
        { label: 'Complete', value: 'complete' },
      ],
      required: true,
    },
  ],
  timestamps: true,
}
