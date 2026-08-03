import { Button } from '@/components/ui/button'
import { getCurrentCustomer } from '@/utilities/getCurrentCustomer'
import config from '@payload-config'
import { signOut } from '@/auth'
import { getPayload } from 'payload'
import { ensureInitialApplications, selectApplication } from './actions'
import { getApplicationText, getAuthText, isArabic } from '../authText'

export default async function AppsPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>
  searchParams: Promise<{ selected?: string }>
}) {
  const { locale } = await params
  const { selected } = await searchParams
  const { user } = await getCurrentCustomer({ locale, requireCompany: true })
  const text = getAuthText(locale)
  const rtl = isArabic(locale)

  await ensureInitialApplications()

  const payload = await getPayload({ config })
  const applications = await payload.find({
    collection: 'applications',
    overrideAccess: true,
    sort: 'name',
    where: {
      status: {
        equals: 'active',
      },
    },
  })

  const enabledAppIds = (user.enabledApps || []).map((app) =>
    typeof app === 'number' ? app : app.id,
  )

  async function chooseApplication(formData: FormData) {
    'use server'
    await selectApplication(locale, formData)
  }

  async function logout() {
    'use server'
    await signOut({ redirectTo: `/${locale}/login` })
  }

  return (
    <main className="min-h-[70vh] bg-[#f8fafc] px-6 py-12">
      <section className="mx-auto flex max-w-6xl flex-col gap-8" dir={rtl ? 'rtl' : 'ltr'}>
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
          <div className="space-y-3">
            <p className="text-sm font-medium uppercase tracking-wide text-primary">
              {text.appAccess}
            </p>
            <h1 className="text-4xl font-bold text-gray-950">{text.chooseApp}</h1>
            <p className="max-w-2xl text-base leading-7 text-gray-600">{text.appIntro}</p>
          </div>
          <form action={logout}>
            <Button variant="outline">{text.logout}</Button>
          </form>
        </div>

        {selected && (
          <div className="rounded-md border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800">
            {text.appSelected} {getApplicationText(locale, selected)?.name || selected}.
          </div>
        )}

        <div className="grid gap-5 md:grid-cols-2">
          {applications.docs.map((application) => {
            const isEnabled = enabledAppIds.includes(application.id)
            const applicationText = getApplicationText(locale, application.slug)

            return (
              <article
                className="flex min-h-56 flex-col justify-between rounded-lg border border-gray-200 bg-white p-6 shadow-sm"
                key={application.id}
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between gap-3">
                    <h2 className="text-2xl font-semibold text-gray-950">
                      {applicationText?.name || application.name}
                    </h2>
                    {isEnabled && (
                      <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-medium text-emerald-800">
                        {text.enabled}
                      </span>
                    )}
                  </div>
                  <p className="text-sm leading-6 text-gray-600">
                    {applicationText?.description || application.description}
                  </p>
                </div>

                <form action={chooseApplication}>
                  <input name="application" type="hidden" value={application.slug} />
                  <Button className="mt-6 w-full" disabled={isEnabled}>
                    {isEnabled ? text.enabled : text.enableAccess}
                  </Button>
                </form>
              </article>
            )
          })}
        </div>
      </section>
    </main>
  )
}
