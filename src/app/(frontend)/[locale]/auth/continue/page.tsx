import { getCurrentCustomer } from '@/utilities/getCurrentCustomer'
import { redirect } from 'next/navigation'

export default async function AuthContinuePage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  const { user } = await getCurrentCustomer({ locale })

  if (user.onboardingStatus === 'company-required') {
    redirect(`/${locale}/onboarding`)
  }

  redirect(`/${locale}/apps`)
}
