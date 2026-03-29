import type { CollectionConfig } from 'payload'
import { authenticated } from '../access/authenticated'
import { anyone } from '../access/anyone'

export const Leads: CollectionConfig = {
  slug: 'leads',
  access: {
    create: anyone,
    read: authenticated,
    update: authenticated,
    delete: authenticated,
  },
  admin: {
    useAsTitle: 'organizationName',
    defaultColumns: ['organizationName', 'customerName', 'status', 'createdAt'],
  },
  fields: [
    {
      name: 'customerName',
      type: 'text',
      required: true,
    },
    {
      name: 'phoneNumber',
      type: 'text',
      required: true,
    },
    {
      name: 'organizationName',
      type: 'text',
      required: true,
    },
    {
      name: 'businessBrief',
      type: 'textarea',
      required: true,
    },
    {
      name: 'status',
      type: 'select',
      defaultValue: 'new',
      options: [
        { label: 'New', value: 'new' },
        { label: 'Contacted', value: 'contacted' },
        { label: 'Qualified', value: 'qualified' },
        { label: 'Closed', value: 'closed' },
      ],
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: 'referencedProduct',
      type: 'relationship',
      relationTo: 'products',
      required: true,
    },
  ],
  timestamps: true,
}
