import { GlobalConfig } from 'payload'

import { revalidateNavbar } from '@/blocks/hooks/revalidateNavbar'

export const Navbar: GlobalConfig = {
  slug: 'navbar',
  label: 'Navbar',
  access: {
    read: () => true, // public
  },
  fields: [
    {
      name: 'logo',
      type: 'upload',
      label: 'Logo Image',
      relationTo: 'media', // assumes you have a media collection
      required: true,
      localized: true,
    },
    {
      name: 'navLinks',
      type: 'array',
      label: 'Navigation Links',
      minRows: 1,
      localized: true,
      fields: [
        {
          name: 'label',
          type: 'text',
          required: true,
        },
        {
          name: 'href',
          type: 'text',
          required: true,
        },
      ],
    },
    {
      name: 'buttons',
      type: 'array',
      label: 'Right Side Buttons',
      minRows: 1,
      maxRows: 2,
      localized: true,
      fields: [
        {
          name: 'label',
          type: 'text',
          required: true,
        },
        {
          name: 'href',
          type: 'text',
          required: true,
        },
        {
          name: 'variant',
          type: 'select',
          options: [
            { label: 'Primary (Teal)', value: 'primary' },
            { label: 'Outline', value: 'outline' },
          ],
          defaultValue: 'primary',
        },
      ],
    },
  ],
  hooks: {
    afterChange: [revalidateNavbar],
  },
}
