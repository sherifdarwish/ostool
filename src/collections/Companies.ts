import type { CollectionConfig } from 'payload'

import { admins } from '@/access/admins'
import { authenticated } from '@/access/authenticated'

export const Companies: CollectionConfig = {
  slug: 'companies',
  admin: {
    defaultColumns: ['name', 'businessType', 'fleetSize', 'owner'],
    useAsTitle: 'name',
  },
  access: {
    create: authenticated,
    delete: admins,
    read: ({ req: { user } }) => {
      if (!user) return false
      if (user.role === 'admin' || !user.role) return true

      return {
        owner: {
          equals: user.id,
        },
      }
    },
    update: ({ req: { user } }) => {
      if (!user) return false
      if (user.role === 'admin' || !user.role) return true

      return {
        owner: {
          equals: user.id,
        },
      }
    },
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
    },
    {
      name: 'businessType',
      type: 'text',
      required: true,
    },
    {
      name: 'fleetSize',
      type: 'select',
      options: [
        { label: '1-10 vehicles', value: '1-10' },
        { label: '11-50 vehicles', value: '11-50' },
        { label: '51-200 vehicles', value: '51-200' },
        { label: '200+ vehicles', value: '200+' },
      ],
      required: true,
    },
    {
      name: 'phone',
      type: 'text',
      required: true,
    },
    {
      name: 'country',
      type: 'text',
      required: true,
    },
    {
      name: 'owner',
      type: 'relationship',
      relationTo: 'users',
      required: true,
      index: true,
    },
  ],
}
