import type { Block } from 'payload'

export const JobApplicationForm: Block = {
  slug: 'jobApplicationForm',
  labels: {
    singular: 'Job Application Form',
    plural: 'Job Application Forms',
  },
  fields: [
    {
      name: 'heading',
      type: 'text',
      required: true,
      localized: true,
      defaultValue: 'Please fill out the form below carefully.',
    },
    {
      name: 'description',
      type: 'textarea',
      localized: true,
      defaultValue:
        'Our team will review your application and contact you if your profile matches our current opportunities.',
    },
    {
      name: 'fullNameLabel',
      label: 'Full Name Label',
      type: 'text',
      localized: true,
      defaultValue: 'Full Name',
    },
    {
      name: 'emailLabel',
      label: 'Email Label',
      type: 'text',
      localized: true,
      defaultValue: 'Email Address',
    },
    {
      name: 'phoneLabel',
      label: 'Phone Label',
      type: 'text',
      localized: true,
      defaultValue: 'Phone Number',
    },
    {
      name: 'countryLabel',
      label: 'Country Label',
      type: 'text',
      localized: true,
      defaultValue: 'Country',
    },
    {
      name: 'positionLabel',
      label: 'Position Label',
      type: 'text',
      localized: true,
      defaultValue: 'Position Applied For',
    },
    {
      name: 'experienceLabel',
      label: 'Experience Label',
      type: 'text',
      localized: true,
      defaultValue: 'Years of Experience',
    },
    {
      name: 'gulfExperienceLabel',
      label: 'Gulf Experience Label',
      type: 'textarea',
      localized: true,
      defaultValue:
        'Tell us about your experience in the Gulf market or with cloud-based systems similar to Ostool.',
    },
    {
      name: 'availabilityLabel',
      label: 'Availability Label',
      type: 'text',
      localized: true,
      defaultValue: 'When are you available to start?',
    },
    {
      name: 'cvLabel',
      label: 'CV Upload Label',
      type: 'text',
      localized: true,
      defaultValue: 'Upload Your CV',
    },
    {
      name: 'portfolioLabel',
      label: 'Portfolio Upload Label',
      type: 'text',
      localized: true,
      defaultValue: 'Upload Your Portfolio',
    },
    {
      name: 'submitLabel',
      label: 'Submit Button Text',
      type: 'text',
      localized: true,
      defaultValue: 'Submit Application',
    },
    {
      name: 'successTitle',
      label: 'Success Title',
      type: 'text',
      localized: true,
      defaultValue: 'Your application has been received!',
    },
    {
      name: 'successMessage',
      label: 'Success Message',
      type: 'textarea',
      localized: true,
      defaultValue:
        'Thank you for your interest in joining Ostool. We will be in touch soon.',
    },
    {
      name: 'positionOptions',
      label: 'Position Options',
      type: 'array',
      labels: {
        singular: 'Position Option',
        plural: 'Position Options',
      },
      fields: [
        {
          name: 'label',
          type: 'text',
          localized: true,
          required: true,
        },
        {
          name: 'value',
          type: 'text',
          required: true,
        },
      ],
      admin: {
        description:
          'Optional list of positions available for selection. Leave empty to allow free text entry.',
      },
    },
    {
      name: 'countryOptions',
      label: 'Country Options',
      type: 'array',
      labels: {
        singular: 'Country Option',
        plural: 'Country Options',
      },
      fields: [
        {
          name: 'label',
          type: 'text',
          localized: true,
          required: true,
        },
        {
          name: 'value',
          type: 'text',
          required: true,
        },
      ],
      admin: {
        description:
          'Optional list of country choices. Leave empty to display a default list of GCC countries.',
      },
    },
  ],
}

