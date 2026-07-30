import config from '@payload-config'
import NextAuth from 'next-auth'
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
      if (account && user?.email) {
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
  providers: [Google, LinkedIn],
  session: {
    strategy: 'jwt',
  },
  trustHost: true,
})
