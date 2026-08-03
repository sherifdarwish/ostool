import { signIn } from '@/auth'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import Link from 'next/link'
import { getAuthText, isArabic } from '../authText'
import { loginWithPassword } from './actions'

export default async function LoginPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  const text = getAuthText(locale)
  const rtl = isArabic(locale)

  async function signInWithGoogle() {
    'use server'
    await signIn('google', { redirectTo: `/${locale}/auth/continue` })
  }

  async function signInWithLinkedIn() {
    'use server'
    await signIn('linkedin', { redirectTo: `/${locale}/auth/continue` })
  }

  async function submitPasswordLogin(formData: FormData) {
    'use server'
    await loginWithPassword(locale, formData)
  }

  return (
    <main className="min-h-[70vh] bg-[#f8fafc] px-6 py-16">
      <section
        className="mx-auto flex w-full max-w-md flex-col gap-7 rounded-lg border border-gray-200 bg-white p-8 shadow-sm"
        dir={rtl ? 'rtl' : 'ltr'}
      >
        <div className="space-y-3">
          <h1 className="text-3xl font-bold text-gray-950">{text.loginTitle}</h1>
          <p className="text-sm leading-6 text-gray-600">{text.loginSubtitle}</p>
        </div>

        <form action={submitPasswordLogin} className="grid gap-4">
          <div className="grid gap-2">
            <Label htmlFor="email">{text.email}</Label>
            <Input autoComplete="email" id="email" name="email" required type="email" />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="password">{text.password}</Label>
            <Input
              autoComplete="current-password"
              id="password"
              name="password"
              required
              type="password"
            />
          </div>
          <Button className="w-full">{text.submitLogin}</Button>
        </form>

        <div className="flex items-center gap-3 text-xs text-gray-500">
          <span className="h-px flex-1 bg-gray-200" />
          <span>{text.socialDivider}</span>
          <span className="h-px flex-1 bg-gray-200" />
        </div>

        <div className="flex flex-col gap-3">
          <form action={signInWithGoogle}>
            <Button className="w-full bg-white text-gray-950 hover:bg-gray-50" variant="outline">
              {text.withGoogle}
            </Button>
          </form>
          <form action={signInWithLinkedIn}>
            <Button className="w-full bg-[#0a66c2] hover:bg-[#084f96]">
              {text.withLinkedIn}
            </Button>
          </form>
        </div>

        <p className="text-sm text-gray-600">
          {text.newCustomer}{' '}
          <Link className="font-medium text-primary" href={`/${locale}/register`}>
            {text.createAccount}
          </Link>
        </p>
      </section>
    </main>
  )
}
