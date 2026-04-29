'use client'

import { useRouter } from 'next/navigation'
import type { JSX } from 'react'

import { ChevronDownIcon, CreditCard, CreditCardIcon, LogOut } from 'lucide-react'

import { Avatar, AvatarImage } from '@/components/ui/avatar'
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

import { mockSession } from '@/data/mock-session'
import { cn } from '@/lib/utils'
import { GeneratedSidebarAvatar } from './generated-sidebar-avatar'

const UserSidebarButton = (): JSX.Element => {
  const router = useRouter()

  const isMobile = useIsMobile()

  // TODO: replace with real authClient.useSession() when API is ready
  const { data, isPending } = mockSession

  const handleSignOut = () => {
    // TODO:  implemente sign out logic
    router.push('/')
  }

  if (isPending || !data?.user) {
    return <div className="h-12 w-full animate-pulse rounded-lg bg-white/5" />
  }

  if (isMobile) {
    return (
      <Drawer>
        <DrawerTrigger className="border-border/10 data-[]: flex w-full cursor-pointer items-center justify-between overflow-hidden rounded-lg border bg-white/5 p-3 hover:bg-white/10">
          {data.user.image ? (
            <Avatar className="mr-3 size-10">
              <AvatarImage src={data.user.image} />
            </Avatar>
          ) : (
            <GeneratedSidebarAvatar
              seed={data.user.name}
              variant="initials"
              className="mr-3 size-9"
            />
          )}

          <div className="flex min-w-0 flex-1 flex-col gap-0.5 overflow-hidden text-left">
            <p className="w-full truncate text-sm font-medium">{data.user.name}</p>
            <p className="text-muted-foreground w-full truncate text-xs">{data.user.email}</p>
          </div>
          <ChevronDownIcon className="size-4 shrink-0" />
        </DrawerTrigger>

        <DrawerContent>
          <DrawerHeader>
            <DrawerTitle>{data.user.name}</DrawerTitle>
            <DrawerDescription>{data.user.email}</DrawerDescription>
          </DrawerHeader>

          <DrawerFooter>
            <Button>
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
        {data.user.image ? (
          <Avatar className="mr-3 size-10">
            <AvatarImage src={data.user.image} />
          </Avatar>
        ) : (
          <GeneratedSidebarAvatar
            seed={data.user.name}
            variant="initials"
            className="mr-3 size-9"
          />
        )}

        <div className="flex min-w-0 flex-1 flex-col gap-0.5 overflow-hidden text-left">
          <p className="w-full truncate text-sm font-medium">{data.user.name}</p>
          <p className="text-muted-foreground w-full truncate text-xs">{data.user.email}</p>
        </div>
        <ChevronDownIcon className="size-4 shrink-0" />
      </DropdownMenuTrigger>

      <DropdownMenuContent
        align="end"
        side="right"
        className={cn(
          // default styles
          'w-72',
          // light styles
          'bg-white [box-shadow:0_0_0_1px_rgba(0,0,0,.03),0_2px_4px_rgba(0,0,0,.05),0_12px_24px_rgba(0,0,0,.05)]',
          // dark styles
          'transform-gpu dark:bg-transparent dark:[box-shadow:0_-20px_80px_-20px_#ffffff1f_inset] dark:backdrop-blur-md dark:[border:1px_solid_rgba(255,255,255,.1)]'
        )}
      >
        <DropdownMenuLabel>
          <div className="flex flex-col gap-1">
            <span className="truncate font-medium">{data.user.name}</span>
            <span className="text-muted-foreground truncate text-sm">{data.user.email}</span>
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
