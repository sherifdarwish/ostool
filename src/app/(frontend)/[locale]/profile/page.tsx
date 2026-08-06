import { getCurrentCustomer } from '@/utilities/getCurrentCustomer'
import { BriefcaseBusiness, Building2, CarFront, Mail, MapPin, Phone, UserRound } from 'lucide-react'

export default async function ProfilePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  const { session, user } = await getCurrentCustomer({ locale })
  const company = user.company && typeof user.company === 'object' ? user.company : null
  const isArabic = locale === 'ar'
  const profileName = user.name || session.user.name || user.email

  return (
    <main className="min-h-[70vh] bg-[#f8fafc] px-6 py-12">
      <div className="mx-auto max-w-5xl space-y-10" dir={isArabic ? 'rtl' : 'ltr'}>
        <header className="space-y-2 border-b border-gray-200 pb-6">
          <p className="text-sm font-medium text-primary">
            {isArabic ? 'إعدادات الحساب' : 'Account settings'}
          </p>
          <h1 className="text-3xl font-bold text-gray-950">
            {isArabic ? 'الملف الشخصي والشركة' : 'Profile and company'}
          </h1>
        </header>

        <section className="space-y-5">
          <div className="flex items-center gap-3">
            <UserRound className="h-5 w-5 text-primary" />
            <h2 className="text-xl font-semibold text-gray-950">
              {isArabic ? 'بيانات الملف الشخصي' : 'Profile details'}
            </h2>
          </div>
          <dl className="grid gap-px overflow-hidden rounded-lg border border-gray-200 bg-gray-200 sm:grid-cols-2">
            <Detail label={isArabic ? 'الاسم' : 'Name'} value={profileName} />
            <Detail icon={<Mail />} label={isArabic ? 'البريد الإلكتروني' : 'Email'} value={user.email} />
          </dl>
        </section>

        <section className="space-y-5">
          <div className="flex items-center gap-3">
            <Building2 className="h-5 w-5 text-primary" />
            <h2 className="text-xl font-semibold text-gray-950">
              {isArabic ? 'بيانات الشركة' : 'Company details'}
            </h2>
          </div>
          {company ? (
            <dl className="grid gap-px overflow-hidden rounded-lg border border-gray-200 bg-gray-200 sm:grid-cols-2">
              <Detail label={isArabic ? 'اسم الشركة' : 'Company name'} value={company.name} />
              <Detail icon={<BriefcaseBusiness />} label={isArabic ? 'نوع النشاط' : 'Business type'} value={company.businessType} />
              <Detail icon={<CarFront />} label={isArabic ? 'حجم الأسطول' : 'Fleet size'} value={company.fleetSize} />
              <Detail icon={<Phone />} label={isArabic ? 'رقم الجوال' : 'Phone'} value={company.phone} />
              <Detail icon={<MapPin />} label={isArabic ? 'الدولة' : 'Country'} value={company.country} />
            </dl>
          ) : (
            <div className="rounded-lg border border-gray-200 bg-white px-5 py-6 text-sm leading-6 text-gray-600">
              {isArabic
                ? 'لم يتم إنشاء ملف شركة لهذا الحساب بعد. ستظهر بيانات الشركة هنا بعد مراجعة التسجيل واعتماده.'
                : 'A company profile has not been created for this account yet. Company details will appear here after registration is reviewed and approved.'}
            </div>
          )}
        </section>
      </div>
    </main>
  )
}

function Detail({
  icon,
  label,
  value,
}: {
  icon?: React.ReactNode
  label: string
  value: string
}) {
  return (
    <div className="min-h-24 bg-white p-5">
      <dt className="flex items-center gap-2 text-sm text-gray-500">
        {icon && <span className="[&_svg]:h-4 [&_svg]:w-4">{icon}</span>}
        {label}
      </dt>
      <dd className="mt-2 break-words font-medium text-gray-950">{value}</dd>
    </div>
  )
}
