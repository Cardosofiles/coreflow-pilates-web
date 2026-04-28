import { AuthPanel } from '@/app/(auth)/_component/auth-panel'
import { ModeToggle } from '@/components/themes/mode-toggle'
import { Button } from '@/components/ui/button'

import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Autenticação',
}

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="grid min-h-screen overflow-hidden lg:grid-cols-2">
      <div className="flex flex-col gap-4 p-6 md:p-10">
        <div className="flex w-full justify-between">
          <div className="flex items-center gap-2">
            <div className="bg-foreground flex h-8 w-8 items-center justify-center rounded-full">
              <span className="text-background text-[11px] font-black tracking-tight">C</span>
            </div>

            <span className="text-sm font-semibold tracking-tight">CoreFlow</span>
            <span className="text-muted-foreground hidden text-sm sm:inline">Pilates</span>
          </div>

          <div className="flex items-center gap-2">
            <Button
              asChild
              variant="ghost"
              size="sm"
              className="text-muted-foreground hover:text-foreground h-9 px-5 text-xs font-medium"
            >
              <Link href="/">🠔 Voltar para Home</Link>
            </Button>
            <ModeToggle />
          </div>
        </div>

        <div className="flex flex-1 items-center justify-center">
          <div className="w-full max-w-md">{children}</div>
        </div>
      </div>

      <div className="bg-muted relative hidden lg:block">
        <AuthPanel />
      </div>
    </div>
  )
}
