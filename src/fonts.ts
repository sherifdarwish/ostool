import localFont from 'next/font/local'

export const thmanyahSans = localFont({
  display: 'swap',
  fallback: ['Arial', 'sans-serif'],
  preload: true,
  src: [
    {
      path: '../public/fonts/thmanyah/thmanyah-sans-light.woff2',
      style: 'normal',
      weight: '300',
    },
    {
      path: '../public/fonts/thmanyah/thmanyah-sans-regular.woff2',
      style: 'normal',
      weight: '400',
    },
    {
      path: '../public/fonts/thmanyah/thmanyah-sans-medium.woff2',
      style: 'normal',
      weight: '500',
    },
    {
      path: '../public/fonts/thmanyah/thmanyah-sans-bold.woff2',
      style: 'normal',
      weight: '700',
    },
    {
      path: '../public/fonts/thmanyah/thmanyah-sans-black.woff2',
      style: 'normal',
      weight: '900',
    },
  ],
  variable: '--font-thmanyah-sans',
})
