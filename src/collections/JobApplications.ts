import type { CollectionConfig } from 'payload'
import { authenticated } from '@/access/authenticated'

export const JobApplications: CollectionConfig = {
  slug: 'job-applications',
  labels: {
    singular: 'Job Application',
    plural: 'Job Applications',
  },
  admin: {
    useAsTitle: 'full_name',
    defaultColumns: ['full_name', 'position', 'createdAt'],
  },
  access: {
    read: authenticated,
    create: () => true,
    update: authenticated,
    delete: authenticated,
  },
  fields: [
    {
      name: 'full_name',
      type: 'text',
      required: true,
      localized: true,
    },
    {
      name: 'email',
      type: 'email',
      required: true,
      localized: true,
    },
    {
      name: 'phone_number',
      type: 'text',
      required: true,
    },
    {
      name: 'country',
      type: 'text',
      required: true,
      localized: true,
    },
    {
      name: 'position',
      type: 'text',
      required: true,
      localized: true,
    },
    {
      name: 'years_of_experience',
      type: 'number',
      required: true,
      min: 0,
    },
    {
      name: 'gulf_experience',
      type: 'textarea',
      required: true,
      localized: true,
    },
    {
      name: 'availability',
      type: 'text',
      required: true,
      localized: true,
    },
    {
      name: 'cv',
      type: 'upload',
      relationTo: 'media',
      required: true,
    },
    {
      name: 'portfolio',
      type: 'upload',
      relationTo: 'media',
      required: false,
    },
  ],
}
