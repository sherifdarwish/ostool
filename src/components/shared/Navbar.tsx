'use client'

import { NavbarButton } from '@/type'
import { cn } from '@/utilities/ui'
import Image from 'next/image'
import { JSXElementConstructor, Key, ReactElement, ReactNode, ReactPortal } from 'react'
import { UrlObject } from 'url'
import logo from '../../../public/logos/logo2.png'
import { Button } from '../ui/button'
import LanguageSwitcher from './LanguageSwitcher'
import LocaleLink from './LocaleLink'
import MobileNavbar from './MobileNavbar'
import { logout } from './actions'
import AccountMenu from './AccountMenu'

const Navbar = ({
  accountUser,
  authenticated,
  navbar,
  locale,
}: {
  accountUser: { image?: string | null; name?: string | null } | null
  authenticated: boolean
  navbar: any
  locale: string
}) => {
  const logoutAction = logout.bind(null, locale)
  const accountName = accountUser?.name || (locale === 'ar' ? 'حسابي' : 'My account')
  const resolvedNavLogo =
    navbar?.logo && typeof navbar.logo === 'object' && 'url' in navbar.logo ? navbar.logo : null
  const navLogoWidth =
    resolvedNavLogo?.width ||
    resolvedNavLogo?.sizes?.medium?.width ||
    resolvedNavLogo?.sizes?.small?.width ||
    160
  const navLogoHeight =
    resolvedNavLogo?.height ||
    resolvedNavLogo?.sizes?.medium?.height ||
    resolvedNavLogo?.sizes?.small?.height ||
    40

  const getNavbarHref = ({ href }: { href: string | UrlObject; label: ReactNode }) => {
    const hrefString = typeof href === 'string' ? href : ''
    const normalizedHref = hrefString.toLowerCase()

    if (/(?:^|\/)login(?:\/|$)/.test(normalizedHref)) return '/login'
    if (/(?:^|\/)(?:register|join-waiting-list)(?:\/|$)/.test(normalizedHref)) return '/register'

    return href
  }

  const isAuthLink = (link: { href: string | UrlObject; label: ReactNode }) => {
    const href = getNavbarHref(link)
    return href === '/login' || href === '/register'
  }

  const getNavbarLabel = (link: { href: string | UrlObject; label: ReactNode }) =>
    getNavbarHref(link) === '/register'
      ? locale === 'ar'
        ? 'ابدأ مجاناً'
        : 'Start for free'
      : link.label

  return (
    <div className="border-b  backdrop-blur-xl sticky top-0 z-50">
      <nav
        className={cn(
          'flex items-center justify-between px-6 py-3  mx-auto container ',
          // locale === 'ar' && 'flex-row-reverse',
        )}
      >
        {/* Logo */}
        <LocaleLink href="/" className="flex items-center">
          {resolvedNavLogo?.url ? (
            <Image
              src={resolvedNavLogo.url}
              alt={resolvedNavLogo.alt || 'logo'}
              width={navLogoWidth}
              height={navLogoHeight}
              className="h-8 w-auto object-contain"
              priority
            />
          ) : (
            <Image src={logo} alt="logo" className="h-8 w-auto object-contain" priority />
          )}
        </LocaleLink>

        <div
          className={cn(
            'flex gap-20',
            // locale === 'ar' && 'flex-row-reverse'
          )}
        >
          {/* Navigation Links */}
          <div
            className={cn(
              'hidden md:flex items-center gap-8',
              // locale === 'ar' && 'flex-row-reverse',
            )}
          >
            {navbar?.navLinks?.filter((link: any) => !authenticated || !isAuthLink(link)).map(
              (
                link: {
                  href: string | UrlObject
                  label:
                    | string
                    | number
                    | bigint
                    | boolean
                    | ReactElement<unknown, string | JSXElementConstructor<any>>
                    | Iterable<ReactNode>
                    | ReactPortal
                    | Promise<
                        | string
                        | number
                        | bigint
                        | boolean
                        | ReactPortal
                        | ReactElement<unknown, string | JSXElementConstructor<any>>
                        | Iterable<ReactNode>
                        | null
                        | undefined
                      >
                    | null
                    | undefined
                },
                i: Key | null | undefined,
              ) => (
                <LocaleLink
                  key={i}
                  href={getNavbarHref(link)}
                  className="text-gray-800 hover:text-primary transition-colors"
                >
                  {link.label}
                </LocaleLink>
              ),
            )}
          </div>

          {/* Right Side */}
          <div
            className={cn(
              'flex items-center gap-1 md:gap-4',
              //  locale === 'ar' && 'flex-row-reverse'
            )}
          >
            <div className="hidden md:block">
              <LanguageSwitcher />
            </div>
            {authenticated ? (
              <AccountMenu
                image={accountUser?.image}
                locale={locale}
                logoutAction={logoutAction}
                name={accountName}
              />
            ) : (
              navbar?.buttons?.map((btn: NavbarButton, i: number) => {
                const href = getNavbarHref(btn)

                return href === '/login' ? (
                  <LocaleLink
                    className="hidden text-sm font-medium text-gray-700 transition-colors hover:text-primary md:inline-flex"
                    href={href}
                    key={i}
                  >
                    {getNavbarLabel(btn)}
                  </LocaleLink>
                ) : (
                  <LocaleLink href={href} key={i}>
                    <Button>{getNavbarLabel(btn)}</Button>
                  </LocaleLink>
                )
              })
            )}

            <div className="block md:hidden">
              <MobileNavbar
                authenticated={authenticated}
                accountImage={accountUser?.image}
                accountName={accountName}
                locale={locale}
                navbar={navbar}
                getNavbarHref={getNavbarHref}
                isAuthLink={isAuthLink}
                getNavbarLabel={getNavbarLabel}
                logoutAction={logoutAction}
              />
            </div>
          </div>
        </div>
      </nav>
    </div>
  )
}

export default Navbar
