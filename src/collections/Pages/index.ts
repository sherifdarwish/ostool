import type { CollectionConfig } from 'payload'
import { TextFieldSingleValidation } from 'payload'
import { authenticated } from '../../access/authenticated'
import { authenticatedOrPublished } from '../../access/authenticatedOrPublished'
import { populatePublishedAt } from '../../hooks/populatePublishedAt'
import { generatePreviewPath } from '../../utilities/generatePreviewPath'
import { revalidateDelete, revalidatePage } from './hooks/revalidatePage'
import { Hero } from '@/blocks/Home/Hero'
import { Trusted } from '@/blocks/Home/Trusted'
import { CompeteBetter } from '@/blocks/Home/CompeteBetter'
import { WorkFlow } from '@/blocks/Home/WorkFlow'
import { Client } from '@/blocks/Home/Client'
import { Assisting } from '@/blocks/Home/Assisting'
import { FAQ } from '@/blocks/Home/FAQ'
import { AboutHero } from '@/blocks/about/Hero'
import { AboutSection } from '@/blocks/about/AboutSection'
import { WhyChoose } from '@/blocks/about/WhyChoose'
import { Stats } from '@/blocks/about/Stats'
import { CtaSection } from '@/blocks/about/Cta'
import { PrivacyPolicy } from '@/blocks/privacy-policy/PrivacyPolicy'
import { KeyFeatures } from '@/blocks/Home/KeyFeatures'
import { TermsAndConditions } from '@/blocks/terms-and-conditions/TermsAndConditions'
import { WaitingListHero } from '@/blocks/waiting-list/WaitingListHero'
import { WaitingListReason } from '@/blocks/waiting-list/WaitingListReason'
import { MultiStepFormContainer } from '@/blocks/waiting-list/MultiStepFormContainer'
import { JobApplicationForm } from '@/blocks/careers/JobApplicationForm'

export const hardCodedSlugs = ['blogs']

export const Pages: CollectionConfig<'pages'> = {
  slug: 'pages',
  access: {
    create: authenticated,
    delete: authenticated,
    read: authenticatedOrPublished,
    update: authenticated,
  },
  defaultPopulate: {
    title: true,
    slug: true,
  },
  admin: {
    // defaultColumns: ['updatedAt'],
    // livePreview: {
    //   url: ({ data, req }) => {
    //     const path = generatePreviewPath({
    //       slug: typeof data?.slug === 'string' ? data.slug : '',
    //       collection: 'pages',
    //       req,
    //     })

    //     return path
    //   },
    // },
    preview: (data, { req }) =>
      generatePreviewPath({
        slug: typeof data?.slug === 'string' ? data.slug : '',
        collection: 'pages',
        req,
      }),
    useAsTitle: 'title',
  },
  fields: [
    { name: 'title', type: 'text', required: true, localized: true },
    {
      name: 'slug',
      type: 'text',
      required: true,
      unique: true,
      validate: ((value: unknown) => {
        if (typeof value !== 'string') return true
        if (hardCodedSlugs.includes(value.toLowerCase())) {
          return `The slug "${value}" is reserved and cannot be used.`
        }
        return true
      }) as TextFieldSingleValidation,
    },
    {
      name: 'layout',
      type: 'blocks',
      blocks: [
        Hero,
        Trusted,
        CompeteBetter,
        WorkFlow,
        Client,
        Assisting,
        FAQ,
        AboutHero,
        AboutSection,
        WhyChoose,
        Stats,
        CtaSection,
        PrivacyPolicy,
        KeyFeatures,
        TermsAndConditions,
        WaitingListHero,
        WaitingListReason,
        MultiStepFormContainer,
        JobApplicationForm,
      ],
      localized: true,
    },
    {
      name: 'publishedAt',
      type: 'date',
      admin: {
        description:
          'The date the page will be considered published. If this date is in the future, the page will not be publicly accessible until that date.',
      },
    },
  ],
  hooks: {
    afterChange: [revalidatePage],
    beforeChange: [populatePublishedAt],
    afterDelete: [revalidateDelete],
  },
  versions: {
    drafts: {
      autosave: {
        interval: 100,
      },
      schedulePublish: true,
    },
    maxPerDoc: 50,
  },
}
