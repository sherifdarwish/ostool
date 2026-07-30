import type { DefaultSession } from 'next-auth'

declare module 'next-auth' {
  interface Session {
    user: {
      onboardingStatus?: string
      payloadUserId?: number
    } & DefaultSession['user']
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    onboardingStatus?: string
    payloadUserId?: number
  }
}
