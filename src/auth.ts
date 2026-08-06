import config from '@payload-config'
import NextAuth from 'next-auth'
import Credentials from 'next-auth/providers/credentials'
import Google from 'next-auth/providers/google'
import LinkedIn from 'next-auth/providers/linkedin'
import { getPayload } from 'payload'

async function syncPayloadUser({
  email,
  name,
  image,
  provider,
  providerAccountId,
}: {
  email: string
  name?: string | null
  image?: string | null
  provider: string
  providerAccountId: string
}) {
  const payload = await getPayload({ config })

  const existing = await payload.find({
    collection: 'users',
    limit: 1,
    overrideAccess: true,
    where: {
      or: [
        {
          email: {
            equals: email,
          },
        },
        {
          and: [
            {
              authProvider: {
                equals: provider,
              },
            },
            {
              providerAccountId: {
                equals: providerAccountId,
              },
            },
          ],
        },
      ],
    },
  })

  if (existing.docs[0]) {
    return payload.update({
      collection: 'users',
      id: existing.docs[0].id,
      overrideAccess: true,
      data: {
        authProvider: provider as 'google' | 'linkedin',
        avatarUrl: image,
        name: existing.docs[0].name || name,
        providerAccountId,
      },
    })
  }

  return payload.create({
    collection: 'users',
    overrideAccess: true,
    data: {
      authProvider: provider as 'google' | 'linkedin',
      avatarUrl: image,
      email,
      name,
      onboardingStatus: 'company-required',
      password: crypto.randomUUID(),
      providerAccountId,
      role: 'customer',
    },
  })
}

export const { handlers, auth, signIn, signOut } = NextAuth({
  callbacks: {
    async jwt({ account, profile, token, user }) {
      if (account?.provider === 'credentials' && user?.email) {
        token.payloadUserId = user.payloadUserId
        token.onboardingStatus = user.onboardingStatus
      }

      if (account && account.provider !== 'credentials' && user?.email) {
        const payloadUser = await syncPayloadUser({
          email: user.email,
          image: user.image,
          name: user.name,
          provider: account.provider,
          providerAccountId: account.providerAccountId,
        })

        token.payloadUserId = payloadUser.id
        token.onboardingStatus = payloadUser.onboardingStatus
      }

      if (!token.payloadUserId && token.email) {
        const payload = await getPayload({ config })
        const existing = await payload.find({
          collection: 'users',
          limit: 1,
          overrideAccess: true,
          where: {
            email: {
              equals: token.email,
            },
          },
        })

        token.payloadUserId = existing.docs[0]?.id
        token.onboardingStatus = existing.docs[0]?.onboardingStatus
      }

      token.picture = token.picture || profile?.picture
      return token
    },
    async session({ session, token }) {
      session.user.payloadUserId = token.payloadUserId as number | undefined
      session.user.onboardingStatus = token.onboardingStatus as string | undefined

      return session
    },
  },
  pages: {
    signIn: '/en/login',
  },
  providers: [
    Credentials({
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        const email = String(credentials?.email || '')
          .trim()
          .toLowerCase()
        const password = String(credentials?.password || '')

        if (!email || !password) return null

        const payload = await getPayload({ config })
        const result = await payload.login({
          collection: 'users',
          data: {
            email,
            password,
          },
          overrideAccess: true,
        })

        if (!result.user) return null

        return {
          email: result.user.email,
          id: String(result.user.id),
          image: result.user.avatarUrl || null,
          name: result.user.name || result.user.email,
          onboardingStatus: result.user.onboardingStatus,
          payloadUserId: result.user.id,
        }
      },
    }),
    Google,
    LinkedIn,
  ],
  session: {
    strategy: 'jwt',
  },
  secret: process.env.AUTH_SECRET || process.env.PAYLOAD_SECRET,
  trustHost: true,
})
