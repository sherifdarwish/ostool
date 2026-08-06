import { NavbarButton } from '@/type'
import { cn } from '@/utilities/ui'
import { Menu, X } from 'lucide-react'
import { JSXElementConstructor, Key, ReactElement, ReactNode, ReactPortal } from 'react'
import { UrlObject } from 'url'
import { Button } from '../ui/button'
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerTrigger,
} from '../ui/drawer'
import LanguageSwitcher from './LanguageSwitcher'
import LocaleLink from './LocaleLink'
import AccountMenu from './AccountMenu'

const MobileNavbar = ({
  accountImage,
  accountName,
  authenticated,
  locale,
  navbar,
  getNavbarHref,
  getNavbarLabel,
  isAuthLink,
  logoutAction,
}: {
  accountImage?: string | null
  accountName: string
  authenticated: boolean
  locale: string
  navbar: any
  getNavbarHref: (link: { href: string | UrlObject; label: ReactNode }) => string | UrlObject
  getNavbarLabel: (link: { href: string | UrlObject; label: ReactNode }) => ReactNode
  isAuthLink: (link: { href: string | UrlObject; label: ReactNode }) => boolean
  logoutAction: () => Promise<void>
}) => {
  const onClick = () => {}
  return (
    <Drawer direction="left">
      <DrawerTrigger className="cursor-pointer" asChild>
        <Menu size={35} />
      </DrawerTrigger>
      <DrawerContent>
        <div className="mx-auto w-full max-w-sm">
          <DrawerHeader>
            <DrawerClose asChild>
              <X className="cursor-pointer" />
            </DrawerClose>
          </DrawerHeader>
          <div className="p-4 pb-0">
            <div
              className={cn(
                'md:hidden flex flex-col items-center gap-8',
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
                  <DrawerClose key={i} asChild>
                    <LocaleLink
                      href={getNavbarHref(link)}
                      className="text-gray-800 hover:text-primary transition-colors"
                    >
                      {link.label}
                    </LocaleLink>
                  </DrawerClose>
                ),
              )}
              <LanguageSwitcher />
            </div>

            {/* <div className="mt-3 h-[120px]"></div> */}
          </div>
          <DrawerFooter className="flex flex-row w-full items-center justify-center">
            {authenticated ? (
              <AccountMenu
                image={accountImage}
                locale={locale}
                logoutAction={logoutAction}
                name={accountName}
              />
            ) : (
              navbar?.buttons?.map((btn: NavbarButton, i: number) => {
                const href = getNavbarHref(btn)

                return href === '/login' ? (
                  <DrawerClose asChild key={i}>
                    <LocaleLink
                      className="inline-flex h-10 items-center px-3 text-sm font-medium text-gray-700"
                      href={href}
                    >
                      {getNavbarLabel(btn)}
                    </LocaleLink>
                  </DrawerClose>
                ) : (
                  <LocaleLink href={href} key={i}>
                    <DrawerClose asChild>
                      <Button>{getNavbarLabel(btn)}</Button>
                    </DrawerClose>
                  </LocaleLink>
                )
              })
            )}
          </DrawerFooter>
        </div>
      </DrawerContent>
    </Drawer>
  )
}

export default MobileNavbar
