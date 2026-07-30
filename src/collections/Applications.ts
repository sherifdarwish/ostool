import type { CollectionConfig } from 'payload'

import { authenticated } from '@/access/authenticated'
import { admins } from '@/access/admins'

export const Applications: CollectionConfig = {
  slug: 'applications',
  admin: {
    defaultColumns: ['name', 'slug', 'status'],
    useAsTitle: 'name',
  },
  access: {
    create: admins,
    delete: admins,
    read: authenticated,
    update: admins,
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
    },
    {
      name: 'slug',
      type: 'text',
      required: true,
      unique: true,
      index: true,
    },
    {
      name: 'description',
      type: 'textarea',
    },
    {
      name: 'status',
      type: 'select',
      defaultValue: 'active',
      options: [
        { label: 'Active', value: 'active' },
        { label: 'Coming Soon', value: 'coming-soon' },
      ],
      required: true,
    },
  ],
}
