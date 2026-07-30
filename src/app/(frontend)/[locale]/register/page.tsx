import { signIn } from '@/auth'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

export default async function RegisterPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params

  async function registerWithGoogle() {
    'use server'
    await signIn('google', { redirectTo: `/${locale}/auth/continue` })
  }

  async function registerWithLinkedIn() {
    'use server'
    await signIn('linkedin', { redirectTo: `/${locale}/auth/continue` })
  }

  return (
    <main className="min-h-[70vh] bg-[#f8fafc] px-6 py-16">
      <section className="mx-auto flex w-full max-w-md flex-col gap-8 rounded-lg border border-gray-200 bg-white p-8 shadow-sm">
        <div className="space-y-3">
          <h1 className="text-3xl font-bold text-gray-950">Create your account</h1>
          <p className="text-sm leading-6 text-gray-600">
            Register with Google or LinkedIn, then add your company details.
          </p>
        </div>

        <div className="flex flex-col gap-3">
          <form action={registerWithGoogle}>
            <Button className="w-full bg-white text-gray-950 hover:bg-gray-50" variant="outline">
              Register with Google
            </Button>
          </form>
          <form action={registerWithLinkedIn}>
            <Button className="w-full bg-[#0a66c2] hover:bg-[#084f96]">
              Register with LinkedIn
            </Button>
          </form>
        </div>

        <p className="text-sm text-gray-600">
          Already registered?{' '}
          <Link className="font-medium text-primary" href={`/${locale}/login`}>
            Log in
          </Link>
        </p>
      </section>
    </main>
  )
}
