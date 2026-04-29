'use client'

import { useEffect, useState, type JSX } from 'react'

import { PanelLeftCloseIcon, PanelLeftOpenIcon, SearchIcon } from 'lucide-react'

import { ModeToggle } from '@/components/layout/themes/mode-toggle'
import { Button } from '@/components/ui/button'
import { useSidebar } from '@/components/ui/sidebar'

import { CommandSidebarDialog } from './command-sidebar-dialog'

import { cn } from '@/lib/utils'

const NavbarSidebarSearch = (): JSX.Element => {
  const { state, toggleSidebar, isMobile } = useSidebar()
  const [commandOpen, setCommandOpen] = useState(false)

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'k' && (event.metaKey || event.ctrlKey)) {
        event.preventDefault()
        setCommandOpen(open => !open)
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => {
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [])

  return (
    <>
      <CommandSidebarDialog open={commandOpen} setOpen={setCommandOpen} />
      <nav className="border-border bg-muted flex items-center justify-between border-b px-4 py-3">
        <div className="flex items-center gap-x-2">
          <Button className="size-9" onClick={toggleSidebar}>
            {state === 'collapsed' || isMobile ? <PanelLeftOpenIcon /> : <PanelLeftCloseIcon />}
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={() => setCommandOpen(open => !open)}
            className="text-muted-foreground hover:text-accent-foreground h-10 w-[240px] justify-start font-normal"
          >
            <SearchIcon className="mr-2" />
            <span className="hidden sm:inline-flex">Search...</span>
            <kbd
              className={cn(
                'text-muted-foreground border-border pointer-events-none ml-auto inline-flex items-center justify-center',
                'h-5 gap-1 rounded border px-1.5 font-mono text-xs text-[16px] font-medium select-none'
              )}
            >
              <span className="text-xs">&#8984;</span>K
            </kbd>
          </Button>
        </div>
        <ModeToggle />
      </nav>
    </>
  )
}

export { NavbarSidebarSearch }
