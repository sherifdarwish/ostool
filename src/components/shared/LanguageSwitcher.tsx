'use client'

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Check, ChevronDown } from 'lucide-react'
import Image from 'next/image'
import { usePathname, useSearchParams } from 'next/navigation'

const languages = {
  ar: { flagSrc: '/flags/sa.svg', label: 'العربية', short: 'AR' },
  en: { flagSrc: '/flags/gb.svg', label: 'English', short: 'EN' },
} as const

const LanguageSwitcher = () => {
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const currentLocale = pathname?.split('/')[1] === 'ar' ? 'ar' : 'en'
  const selectedLanguage = languages[currentLocale]

  const switchLanguage = (lang: string) => {
    if (!pathname) return

    const segments = pathname.split('/')
    if (segments.length > 1) {
      segments[1] = lang
    } else {
      segments.push(lang)
    }

    const nextPath = segments.join('/') || '/'
    const queryString = searchParams?.toString()
    const nextUrl = queryString ? `${nextPath}?${queryString}` : nextPath

    if (typeof window !== 'undefined') {
      window.location.assign(nextUrl)
    }
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          aria-label={currentLocale === 'ar' ? 'تغيير اللغة' : 'Change language'}
          className="inline-flex h-9 items-center gap-1.5 rounded-md px-2 text-sm font-semibold text-gray-700 outline-none transition-colors hover:bg-gray-100 focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
          type="button"
        >
          <span
            aria-hidden="true"
            className="h-4 w-6 overflow-hidden rounded-[2px] border border-black/10 shadow-sm"
          >
            <Image
              alt=""
              className="block h-full w-full object-cover"
              height={16}
              src={selectedLanguage.flagSrc}
              width={24}
            />
          </span>
          <span>{selectedLanguage.short}</span>
          <ChevronDown aria-hidden="true" className="h-4 w-4 text-gray-500" />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="min-w-44 p-1.5">
        {Object.entries(languages).map(([locale, language]) => {
          const isSelected = locale === currentLocale

          return (
            <DropdownMenuItem
              className="min-h-10 cursor-pointer gap-3 px-3 py-2"
              key={locale}
              onSelect={() => {
                if (!isSelected) switchLanguage(locale)
              }}
            >
              <span
                aria-hidden="true"
                className="h-5 w-[30px] overflow-hidden rounded-[3px] border border-black/10 shadow-sm"
              >
                <Image
                  alt=""
                  className="block h-full w-full object-cover"
                  height={20}
                  src={language.flagSrc}
                  width={30}
                />
              </span>
              <span className="flex-1">{language.label}</span>
              <span className="text-xs font-semibold text-gray-500">{language.short}</span>
              {isSelected && <Check aria-hidden="true" className="text-primary" />}
            </DropdownMenuItem>
          )
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

export default LanguageSwitcher
