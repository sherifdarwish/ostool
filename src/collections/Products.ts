import type { CollectionConfig } from 'payload'
import { authenticated } from '../access/authenticated'
import { anyone } from '../access/anyone'

export const Products: CollectionConfig = {
  slug: 'products',
  access: {
    create: authenticated,
    delete: authenticated,
    read: anyone,
    update: authenticated,
  },
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'brand', 'status', 'updatedAt'],
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
      admin: {
        position: 'sidebar',
      },
      hooks: {
        beforeValidate: [
          ({ value, data }) => {
            if (value) return value
            return data?.name
              ?.toLowerCase()
              .replace(/[^a-z0-9]+/g, '-')
              .replace(/(^-|-$)/g, '')
          },
        ],
      },
    },
    {
      name: 'status',
      type: 'select',
      defaultValue: 'draft',
      options: [
        { label: 'Draft', value: 'draft' },
        { label: 'Published', value: 'published' },
      ],
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: 'brand',
      type: 'relationship',
      relationTo: 'brands',
      required: true,
    },
    {
      name: 'mainImage',
      type: 'upload',
      relationTo: 'media',
      required: true,
    },
    {
      name: 'description',
      type: 'richText',
      required: true,
    },
    {
      name: 'tags',
      type: 'array',
      fields: [
        {
          name: 'tag',
          type: 'text',
        },
      ],
    },
    {
      name: 'shortFeatures',
      type: 'array',
      maxRows: 3,
      fields: [
        {
          name: 'feature',
          type: 'text',
        },
      ],
    },
    {
      name: 'sectors',
      type: 'array',
      fields: [
        {
          name: 'sectorName',
          type: 'text',
          required: true,
        },
      ],
    },
    {
      name: 'technicalSpecs',
      type: 'array',
      fields: [
        {
          type: 'row',
          fields: [
            {
              name: 'key',
              type: 'text',
              required: true,
            },
            {
              name: 'value',
              type: 'text',
              required: true,
            },
          ],
        },
      ],
    },
    {
      name: 'faqs',
      type: 'array',
      fields: [
        {
          name: 'question',
          type: 'text',
          required: true,
        },
        {
          name: 'answer',
          type: 'richText',
          required: true,
        },
      ],
    },
  ],
  timestamps: true,
}
