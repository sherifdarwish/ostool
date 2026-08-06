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
      localized: true,
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
      localized: true,
    },
    {
      name: 'media',
      type: 'upload',
      label: 'Product image or video',
      relationTo: 'media',
    },
    {
      name: 'videoUrl',
      type: 'text',
      label: 'Video URL',
      admin: {
        description:
          'YouTube link or direct MP4/WebM URL. Used when no uploaded media is selected.',
      },
    },
    {
      name: 'applicationUrl',
      type: 'text',
      label: 'Application URL',
      admin: {
        description: 'Where enabled customers launch this application.',
      },
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
