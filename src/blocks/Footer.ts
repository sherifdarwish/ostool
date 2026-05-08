import { GlobalConfig } from 'payload'
import { revalidateFooter } from '@/Footer/hooks/revalidateFooter'

const Footer: GlobalConfig = {
  slug: 'footer',
  label: 'Footer',
  access: {
    read: () => true,
  },
  fields: [
    {
      name: 'logo',
      type: 'upload',
      relationTo: 'media',
      label: 'Footer Logo',
      localized: true,
      required: false,
    },
    {
      name: 'highlightImage',
      type: 'upload',
      relationTo: 'media',
      label: 'Footer Highlight',
      localized: true,
      required: false,
    },
    {
      name: 'links',
      type: 'array',
      label: 'Footer Links',
      fields: [
        {
          name: 'label',
          type: 'text',
          required: true,
          localized: true,
        },
        {
          name: 'url',
          type: 'text',
          required: true,
          localized: true,
        },
      ],
    },
    {
      name: 'socials',
      type: 'array',
      label: 'Social Links',
      localized: true,
      fields: [
        {
          name: 'platform',
          type: 'select',
          options: [
            { label: 'Facebook', value: 'facebook' },
            { label: 'Instagram', value: 'instagram' },
            { label: 'Twitter', value: 'twitter' },
            { label: 'LinkedIn', value: 'linkedin' },
            { label: 'Email', value: 'email' },
            { label: 'Phone', value: 'phone' },
          ],
          required: true,
        },
        {
          name: 'url',
          type: 'text',
          required: true,
        },
        {
          name: 'icon',
          type: 'upload',
          relationTo: 'media',
          label: 'Social Icon',
          required: true,
        },
      ],
    },
    {
      name: 'legalLinks',
      type: 'array',
      label: 'Legal Links',
      localized: true,
      fields: [
        {
          name: 'label',
          type: 'text',
          required: true,
        },
        {
          name: 'url',
          type: 'text',
          required: true,
        },
      ],
    },
    {
      name: 'footerNote',
      type: 'text',
      label: 'Footer Note',
      localized: true,
      defaultValue: 'Nafes 2025 ©',
    },
  ],
  hooks: {
    afterChange: [revalidateFooter],
  },
}

export default Footer
