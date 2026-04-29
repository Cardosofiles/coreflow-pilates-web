'use client'

import type { JSX } from 'react'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

// import { Logo } from '@/components/icons'
import { Separator } from '@/components/ui/separator'
import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader } from '@/components/ui/sidebar'
import { FirstSidebarData } from '@/components/layout/sidebar/first-sidebar-data'
import { SecondSidebarData } from '@/components/layout/sidebar/second-sidebar-data'
import { UserSidebarButton } from '@/components/layout/sidebar/user-sidebar-button'
import { LogOut } from 'lucide-react'
import Image from 'next/image'

const DashboardView = (): JSX.Element => {
  const pathName = usePathname()

  return (
    <Sidebar>
      <SidebarHeader className="text-shadow-accent-foreground">
        <Link href="/" className="flex items-center gap-2 pt-2 text-lg font-bold">
          <Image
            src="/icon.png"
            alt="Coreflow Pilates Logo"
            width={32}
            height={32}
            className="rounded-full"
          />
          Coreflow Pilates
        </Link>
      </SidebarHeader>

      <div className="px-4 py-2">
        <Separator />
      </div>

      <SidebarContent>
        <FirstSidebarData pathName={pathName} />

        <div className="px-4 pt-2">
          <Separator />
        </div>

        <SecondSidebarData pathName={pathName} />
      </SidebarContent>

      <SidebarFooter>
        <UserSidebarButton />
      </SidebarFooter>
    </Sidebar>
  )
}

export { DashboardView }
