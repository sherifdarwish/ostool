import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { getCurrentCustomer } from '@/utilities/getCurrentCustomer'
import { redirect } from 'next/navigation'
import { getAuthText, isArabic } from '../../authText'
import { saveCompanyProfile } from './actions'

export default async function CompanyOnboardingPage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  const { user } = await getCurrentCustomer({ locale })
  const text = getAuthText(locale)
  const rtl = isArabic(locale)

  if (user.company) {
    redirect(`/${locale}/apps`)
  }

  async function submitCompany(formData: FormData) {
    'use server'
    await saveCompanyProfile(locale, formData)
  }

  return (
    <main className="bg-[#f8fafc] px-6 py-12">
      <section
        className="mx-auto grid max-w-5xl gap-10 lg:grid-cols-[0.9fr_1.1fr]"
        dir={rtl ? 'rtl' : 'ltr'}
      >
        <div className="space-y-4 pt-4">
          <p className="text-sm font-medium uppercase tracking-wide text-primary">
            {text.companySetup}
          </p>
          <h1 className="text-4xl font-bold leading-tight text-gray-950">{text.companyTitle}</h1>
          <p className="text-base leading-7 text-gray-600">{text.companySubtitle}</p>
        </div>

        <form
          action={submitCompany}
          className="grid gap-5 rounded-lg border border-gray-200 bg-white p-8 shadow-sm"
        >
          <div className="grid gap-2">
            <Label htmlFor="name">{text.companyName}</Label>
            <Input id="name" name="name" required />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="businessType">{text.businessType}</Label>
            <Input
              id="businessType"
              name="businessType"
              placeholder={text.businessTypePlaceholder}
              required
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="fleetSize">{text.fleetSize}</Label>
            <select
              className="min-h-10 rounded-md border border-input bg-background px-3 py-2 text-sm"
              id="fleetSize"
              name="fleetSize"
              required
            >
              <option value="1-10">1-10 vehicles</option>
              <option value="11-50">11-50 vehicles</option>
              <option value="51-200">51-200 vehicles</option>
              <option value="200+">200+ vehicles</option>
            </select>
          </div>

          <div className="grid gap-2">
            <Label htmlFor="phone">{text.phone}</Label>
            <Input id="phone" name="phone" required />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="country">{text.country}</Label>
            <Input id="country" name="country" required />
          </div>

          <Button className="mt-2 w-full">{text.continueApps}</Button>
        </form>
      </section>
    </main>
  )
}
