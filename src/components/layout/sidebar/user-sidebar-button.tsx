'use client'

import { type JSX } from 'react'

import { ChevronDownIcon, CreditCard, CreditCardIcon, LogOut } from 'lucide-react'

import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from '@/components/ui/drawer'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

import { Button } from '@/components/ui/button'
import { useIsMobile } from '@/hooks/use-mobile'

import { useAuth } from '@/modules/auth'
import { useUser } from '@/context/user-context'
import { cn } from '@/lib/utils'
import { GeneratedSidebarAvatar } from './generated-sidebar-avatar'

const UserSidebarButton = (): JSX.Element => {
  const isMobile = useIsMobile()
  const { logout } = useAuth()
  const { user: usuario } = useUser()

  const handleSignOut = () => {
    logout()
  }

  if (!usuario) {
    return <div className="h-12 w-full animate-pulse rounded-lg bg-white/5" />
  }

  if (isMobile) {
    return (
      <Drawer>
        <DrawerTrigger className="border-border/10 data-[]: flex w-full cursor-pointer items-center justify-between overflow-hidden rounded-lg border bg-white/5 p-3 hover:bg-white/10">
          <GeneratedSidebarAvatar seed={usuario.nome} variant="initials" className="mr-3 size-9" />

          <div className="flex min-w-0 flex-1 flex-col gap-0.5 overflow-hidden text-left">
            <p className="w-full truncate text-sm font-medium">{usuario.nome}</p>
            <p className="text-muted-foreground w-full truncate text-xs">{usuario.email}</p>
          </div>
          <ChevronDownIcon className="size-4 shrink-0" />
        </DrawerTrigger>

        <DrawerContent>
          <DrawerHeader>
            <DrawerTitle>{usuario.nome}</DrawerTitle>
            <DrawerDescription>{usuario.email}</DrawerDescription>
          </DrawerHeader>

          <DrawerFooter>
            <Button className="bg-violet-500">
              <CreditCardIcon className="ml-2 size-4" />
              Cobrança
            </Button>
            <Button onClick={handleSignOut}>
              <LogOut className="ml-2 size-4" />
              Sair
            </Button>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    )
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="border-border/10 data-[]: flex w-full cursor-pointer items-center justify-between overflow-hidden rounded-lg border bg-white/5 p-3 hover:bg-white/10">
        <GeneratedSidebarAvatar seed={usuario.nome} variant="initials" className="mr-3 size-9" />

        <div className="flex min-w-0 flex-1 flex-col gap-0.5 overflow-hidden text-left">
          <p className="w-full truncate text-sm font-medium">{usuario.nome}</p>
          <p className="text-muted-foreground w-full truncate text-xs">{usuario.email}</p>
        </div>
        <ChevronDownIcon className="size-4 shrink-0" />
      </DropdownMenuTrigger>

      <DropdownMenuContent
        align="end"
        side="right"
        className={cn(
          'w-72',
          'bg-white [box-shadow:0_0_0_1px_rgba(0,0,0,.03),0_2px_4px_rgba(0,0,0,.05),0_12px_24px_rgba(0,0,0,.05)]',
          'transform-gpu dark:bg-transparent dark:[box-shadow:0_-20px_80px_-20px_#ffffff1f_inset] dark:backdrop-blur-md dark:[border:1px_solid_rgba(255,255,255,.1)]'
        )}
      >
        <DropdownMenuLabel>
          <div className="flex flex-col gap-1">
            <span className="truncate font-medium">{usuario.nome}</span>
            <span className="text-muted-foreground truncate text-sm">{usuario.email}</span>
          </div>
        </DropdownMenuLabel>

        <DropdownMenuSeparator />

        <DropdownMenuItem className="flex cursor-pointer items-center justify-between">
          Cobrança
          <CreditCard className="size-4" />
        </DropdownMenuItem>

        <DropdownMenuItem
          className="flex cursor-pointer items-center justify-between"
          onClick={handleSignOut}
        >
          Sair
          <LogOut className="size-4" />
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

export { UserSidebarButton }
