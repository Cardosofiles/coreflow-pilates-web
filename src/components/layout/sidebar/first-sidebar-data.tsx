'use client'

import Link from 'next/link'
import type { JSX } from 'react'

import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/components/ui/sidebar'

import { firstSidebarData } from '@/data/sidebar-items'

import { cn } from '@/lib/utils'

interface FirstSidebarDataProps {
  pathName: string
}

const FirstSidebarData = ({ pathName }: FirstSidebarDataProps): JSX.Element => {
  return (
    <SidebarGroup>
      <SidebarGroupContent>
        <SidebarMenu>
          {firstSidebarData.map(item => {
            const Icon = item.icon
            return (
              <SidebarMenuItem key={item.id}>
                <SidebarMenuButton
                  asChild
                  className={cn(
                    'hover:border-border from-sidebar-accent via-sidebar/50 to-sidebar h-10',
                    'border border-transparent from-5% via-30% hover:bg-linear-to-r/oklch',
                    pathName === item.href && 'border-border/20 bg-linear-to-r/oklch'
                  )}
                  isActive={pathName === item.href}
                >
                  <Link href={item.href} className="flex items-center gap-2">
                    <Icon />
                    <span className="text-sm font-medium tracking-tight">{item.label}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            )
          })}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  )
}

export { FirstSidebarData }
