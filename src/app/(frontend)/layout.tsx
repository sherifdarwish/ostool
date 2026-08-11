import type { Metadata } from 'next'

import { thmanyahSans } from '@/fonts'
import { cn } from '@/utilities/ui'
import { GeistMono } from 'geist/font/mono'
import React from 'react'

import { mergeOpenGraph } from '@/utilities/mergeOpenGraph'

import { getServerSideURL } from '@/utilities/getURL'
import 'swiper/css'
import 'swiper/css/bundle'
import './globals.css'
export default async function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      className={cn(thmanyahSans.variable, GeistMono.variable)}
      lang="en"
      data-theme="light"
      suppressHydrationWarning
    >
      <head>
        {/* <InitTheme /> */}
        <link href="/favicon.ico" rel="icon" sizes="any" />
        <link href="/favicon.svg" rel="icon" type="image/svg+xml" />
        <link href="/Favicon.png" rel="apple-touch-icon" />
      </head>
      <body className="bg-white text-black">
        {/* <AdminBar
            adminBarProps={{
              preview: isEnabled,
            }}
          /> */}

        {/* <Header /> */}

        {children}
      </body>
    </html>
  )
}

export const metadata: Metadata = {
  metadataBase: new URL(getServerSideURL()),
  icons: {
    icon: '/Favicon.png',
    shortcut: '/Favicon.png',
    apple: '/Favicon.png',
    other: {
      rel: 'apple-touch-icon-precomposed',
      url: '/Favicon.png',
    },
  },
  openGraph: mergeOpenGraph(),
  twitter: {
    card: 'summary_large_image',
    creator: '@payloadcms',
  },
}
