import { signIn } from '@/auth'
import OAuthButton from '@/components/shared/OAuthButton'
import PasswordField from '@/components/shared/PasswordField'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import Link from 'next/link'
import { getAuthText, isArabic } from '../authText'
import { registerWithPassword } from './actions'

export default async function RegisterPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  const text = getAuthText(locale)
  const rtl = isArabic(locale)

  async function registerWithGoogle() {
    'use server'
    await signIn('google', { redirectTo: `/${locale}/auth/continue` })
  }

  async function registerWithLinkedIn() {
    'use server'
    await signIn('linkedin', { redirectTo: `/${locale}/auth/continue` })
  }

  async function submitPasswordRegistration(formData: FormData) {
    'use server'
    await registerWithPassword(locale, formData)
  }

  return (
    <main className="min-h-[70vh] bg-[#f8fafc] px-6 py-16">
      <section
        className="mx-auto flex w-full max-w-md flex-col gap-7 rounded-lg border border-gray-200 bg-white p-8 shadow-sm"
        dir={rtl ? 'rtl' : 'ltr'}
      >
        <div className="space-y-3">
          <h1 className="text-3xl font-bold text-gray-950">{text.registerTitle}</h1>
          <p className="text-sm leading-6 text-gray-600">{text.registerSubtitle}</p>
        </div>

        <form action={submitPasswordRegistration} className="grid gap-4">
          <div className="grid gap-2">
            <Label htmlFor="name">{text.name}</Label>
            <Input
              autoComplete="name"
              id="name"
              name="name"
              placeholder={text.namePlaceholder}
              required
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="email">{text.email}</Label>
            <Input
              autoComplete="email"
              id="email"
              name="email"
              placeholder={text.emailPlaceholder}
              required
              type="email"
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="password">{text.password}</Label>
            <PasswordField
              hideLabel={text.hidePassword}
              placeholder={text.passwordPlaceholder}
              rtl={rtl}
              showLabel={text.showPassword}
              strengthLabels={text.passwordStrength}
            />
          </div>
          <Button className="w-full">{text.submitRegister}</Button>
        </form>

        <div className="flex items-center gap-3 text-xs text-gray-500">
          <span className="h-px flex-1 bg-gray-200" />
          <span>{text.socialDivider}</span>
          <span className="h-px flex-1 bg-gray-200" />
        </div>

        <div className="flex flex-col gap-3">
          <form action={registerWithGoogle}>
            <OAuthButton label={text.registerWithGoogle} provider="google" />
          </form>
          <form action={registerWithLinkedIn}>
            <OAuthButton label={text.registerWithLinkedIn} provider="linkedin" />
          </form>
        </div>

        <p className="text-sm text-gray-600">
          {text.hasAccount}{' '}
          <Link className="font-medium text-primary" href={`/${locale}/login`}>
            {text.login}
          </Link>
        </p>
      </section>
    </main>
  )
}
