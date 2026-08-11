'use client'

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { AppWindow, Building2, LogOut } from 'lucide-react'
import LocaleLink from './LocaleLink'

export default function AccountMenu({
  image,
  locale,
  logoutAction,
  name,
}: {
  image?: string | null
  locale: string
  logoutAction: () => Promise<void>
  name: string
}) {
  const initials = name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0])
    .join('')
    .toUpperCase()

  return (
    <DropdownMenu dir={locale === 'ar' ? 'rtl' : 'ltr'}>
      <DropdownMenuTrigger asChild>
        <button
          aria-label={locale === 'ar' ? 'فتح قائمة الحساب' : 'Open account menu'}
          className="flex h-9 w-9 items-center justify-center overflow-hidden rounded-full border-2 border-primary bg-primary text-xs font-semibold text-white shadow-sm outline-none transition-shadow hover:shadow-md focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
          type="button"
        >
          <span
            aria-hidden="true"
            className="flex h-full w-full items-center justify-center bg-cover bg-center"
            style={image ? { backgroundImage: `url(${JSON.stringify(image)})` } : undefined}
          >
            {image ? null : initials}
          </span>
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel className="truncate">{name}</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <LocaleLink href="/profile">
            <Building2 />
            {locale === 'ar' ? 'الملف الشخصي والشركة' : 'Profile and company'}
          </LocaleLink>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <LocaleLink href="/apps">
            <AppWindow />
            {locale === 'ar' ? 'التطبيقات' : 'Applications'}
          </LocaleLink>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <form action={logoutAction}>
          <DropdownMenuItem asChild variant="destructive">
            <button className="w-full" type="submit">
              <LogOut />
              {locale === 'ar' ? 'تسجيل الخروج' : 'Log out'}
            </button>
          </DropdownMenuItem>
        </form>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
