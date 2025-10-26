import type { Page } from '@/payload-types'
import React, { Fragment } from 'react'

// import all block components you support
import AboutSection from '@/app/(frontend)/[locale]/components/about/AboutSection'
import { CtaSection } from '@/app/(frontend)/[locale]/components/about/CtaSection'
import { AboutHero } from '@/app/(frontend)/[locale]/components/about/Hero'
import StatsSection from '@/app/(frontend)/[locale]/components/about/StatsSection'
import WhyChooseSection from '@/app/(frontend)/[locale]/components/about/WhyChooseSection'
import Assisting from '@/app/(frontend)/[locale]/components/home/Assisting'
import Client from '@/app/(frontend)/[locale]/components/home/Client'
import CompeteBetter from '@/app/(frontend)/[locale]/components/home/CompeteBetter'
import FAQ from '@/app/(frontend)/[locale]/components/home/FAQ'
import Hero from '@/app/(frontend)/[locale]/components/home/Hero'
import KeyFeatures from '@/app/(frontend)/[locale]/components/home/keyFeatures'
import Trusted from '@/app/(frontend)/[locale]/components/home/Trusted'
import WorkFlow from '@/app/(frontend)/[locale]/components/home/WorkFlow'
import PrivacyPolicy from '@/app/(frontend)/[locale]/components/privacy-policy/PrivacyPolicy'
import TermsAndConditionsBlock from '@/app/(frontend)/[locale]/components/terms-and-conditions/TermsAndConditions'
import MultiStepFormContainer from '@/app/(frontend)/[locale]/components/waiting-list/MultiStepFormContainer'
import WaitingHero from '@/app/(frontend)/[locale]/components/waiting-list/WaitingHero'
import WaitingListReason from '@/app/(frontend)/[locale]/components/waiting-list/WaitingListReason'
import JobApplicationForm from '@/app/(frontend)/[locale]/components/careers/JobApplicationForm'

const blockComponents: Record<string, React.FC<any>> = {
  hero: Hero,
  trusted: Trusted,
  competeBetter: CompeteBetter,
  workFlow: WorkFlow,
  client: Client,
  assisting: Assisting,
  faq: FAQ,
  aboutHero: AboutHero,
  aboutSection: AboutSection,
  whyChooseSection: WhyChooseSection,
  statsSection: StatsSection,
  ctaSection: CtaSection,
  privacyPolicy: PrivacyPolicy,
  KeyFeatures: KeyFeatures,
  termsAndConditions: TermsAndConditionsBlock,
  waitingListHero: WaitingHero,
  msForm: MultiStepFormContainer,
  waitingListReason: WaitingListReason,
  jobApplicationForm: JobApplicationForm,
}

export const RenderBlocks: React.FC<{
  blocks?: Page['layout']
  locale: string
}> = ({ blocks = [], locale = 'en' }) => {
  if ((blocks ?? []).length === 0) return null

  return (
    <Fragment>
      {(blocks ?? []).map((block, index) => {
        const { blockType } = block
        const Block = blockType ? blockComponents[blockType] : null
        if (!Block) return null

        return (
          <div className="" key={index}>
            <Block {...block} disableInnerContainer locale={locale} />
          </div>
        )
      })}
    </Fragment>
  )
}
