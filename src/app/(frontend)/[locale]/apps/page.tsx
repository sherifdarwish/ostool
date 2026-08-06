import { Button } from '@/components/ui/button'
import { getCurrentCustomer } from '@/utilities/getCurrentCustomer'
import config from '@payload-config'
import { getPayload } from 'payload'
import Image from 'next/image'
import { CalendarRange, ExternalLink, MapPinned } from 'lucide-react'
import { ensureInitialApplications, selectApplication } from './actions'
import { getAuthText, isArabic } from '../authText'

function getYouTubeEmbedUrl(value?: string | null) {
  if (!value) return null

  try {
    const url = new URL(value)
    const hostname = url.hostname.replace(/^www\./, '').replace(/^m\./, '')
    let videoId: string | null = null

    if (hostname === 'youtu.be') {
      videoId = url.pathname.split('/').filter(Boolean)[0] || null
    } else if (hostname === 'youtube.com' || hostname === 'youtube-nocookie.com') {
      const pathParts = url.pathname.split('/').filter(Boolean)
      videoId = url.searchParams.get('v')

      if (!videoId && ['embed', 'shorts', 'live'].includes(pathParts[0])) {
        videoId = pathParts[1] || null
      }
    }

    return videoId && /^[A-Za-z0-9_-]{11}$/.test(videoId)
      ? `https://www.youtube-nocookie.com/embed/${videoId}`
      : null
  } catch {
    return null
  }
}

export default async function AppsPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>
  searchParams: Promise<{ onboarding?: string; selected?: string }>
}) {
  const { locale } = await params
  const { onboarding, selected } = await searchParams
  const { user } = await getCurrentCustomer({ locale, requireCompany: true })
  const text = getAuthText(locale)
  const rtl = isArabic(locale)

  await ensureInitialApplications()

  const payload = await getPayload({ config })
  const applications = await payload.find({
    collection: 'applications',
    fallbackLocale: 'en',
    locale: locale as 'en' | 'ar',
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
  const selectedApplication = applications.docs.find((application) => application.slug === selected)

  async function chooseApplication(formData: FormData) {
    'use server'
    await selectApplication(locale, formData)
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
        </div>

        {selected && (
          <div className="rounded-md border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800">
            {text.appSelected} {selectedApplication?.name || selected}.
          </div>
        )}

        {onboarding === 'complete' && (
          <div className="rounded-md border border-emerald-200 bg-emerald-50 px-4 py-4 text-sm leading-6 text-emerald-900">
            {locale === 'ar'
              ? 'شكراً لتسجيلك. تم حفظ معلوماتك بنجاح، ويمكنك الآن اختيار التطبيقات المناسبة لشركتك.'
              : 'Thank you for registering. Your information has been saved successfully, and you can now choose the applications that fit your company.'}
          </div>
        )}

        <div className="grid gap-6 md:grid-cols-2">
          {applications.docs.map((application) => {
            const isEnabled = enabledAppIds.includes(application.id)
            const media =
              application.media && typeof application.media === 'object'
                ? application.media
                : null
            const isVideo = media?.mimeType?.startsWith('video/')
            const youtubeEmbedUrl = getYouTubeEmbedUrl(application.videoUrl)
            const ProductIcon = application.slug === 'tracking' ? MapPinned : CalendarRange

            return (
              <article
                className="group flex min-h-[440px] flex-col overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm transition-shadow hover:shadow-md"
                key={application.id}
              >
                <div className="relative aspect-[16/9] overflow-hidden border-b border-gray-100 bg-[#eef6f7]">
                  {isVideo && media?.url ? (
                    <video
                      className="h-full w-full object-cover"
                      controls
                      muted
                      playsInline
                      poster={media.thumbnailURL || undefined}
                      preload="metadata"
                      src={media.url}
                    />
                  ) : media?.url ? (
                    <Image
                      alt={media.alt || application.name}
                      className="object-cover transition-transform duration-300 group-hover:scale-[1.02]"
                      fill
                      sizes="(min-width: 768px) 50vw, 100vw"
                      src={media.url}
                    />
                  ) : youtubeEmbedUrl ? (
                    <iframe
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                      allowFullScreen
                      className="h-full w-full border-0"
                      loading="lazy"
                      referrerPolicy="strict-origin-when-cross-origin"
                      src={youtubeEmbedUrl}
                      title={`${application.name} video`}
                    />
                  ) : application.videoUrl ? (
                    <video
                      className="h-full w-full object-cover"
                      controls
                      muted
                      playsInline
                      preload="metadata"
                      src={application.videoUrl}
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center">
                      <div className="flex h-20 w-20 items-center justify-center rounded-lg border border-primary/20 bg-white text-primary shadow-sm">
                        <ProductIcon aria-hidden="true" className="h-10 w-10" strokeWidth={1.5} />
                      </div>
                    </div>
                  )}
                </div>

                <div className="flex flex-1 flex-col justify-between gap-6 p-6">
                  <div className="space-y-3">
                  <div className="flex items-center justify-between gap-3">
                    <h2 className="text-2xl font-semibold text-gray-950">
                      {application.name}
                    </h2>
                    {isEnabled && (
                      <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-medium text-emerald-800">
                        {text.enabled}
                      </span>
                    )}
                  </div>
                  <p className="text-sm leading-6 text-gray-600">
                    {application.description}
                  </p>
                  </div>

                  {isEnabled && application.applicationUrl ? (
                    <Button asChild className="w-full">
                      <a href={application.applicationUrl} rel="noopener noreferrer" target="_blank">
                        {locale === 'ar' ? 'فتح التطبيق' : 'Open application'}
                        <ExternalLink aria-hidden="true" className="h-4 w-4" />
                      </a>
                    </Button>
                  ) : isEnabled ? (
                    <Button className="w-full" disabled>
                      {locale === 'ar' ? 'رابط التطبيق غير متاح' : 'Application URL unavailable'}
                    </Button>
                  ) : (
                    <form action={chooseApplication}>
                      <input name="application" type="hidden" value={application.slug} />
                      <Button className="w-full">{text.enableAccess}</Button>
                    </form>
                  )}
                </div>
              </article>
            )
          })}
        </div>
      </section>
    </main>
  )
}
