'use client'

import {
  ArrowLeft,
  Cloud,
  GraduationCap,
  Palette,
  PanelsTopLeft,
  Server,
  ShieldCheck,
  type LucideProps,
} from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { useState, type ComponentType, type JSX } from 'react'

import { ModeToggle } from '@/components/layout/themes/mode-toggle'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { cn } from '@/lib/utils'

import { ALL_LOGINS } from '../data/presentation-data'
import { useGithubUsers } from '../hooks/use-github-users'
import { PresentationBackground } from './presentation-background'
import { BackendTab } from './tabs/backend-tab'
import { CoverTab } from './tabs/cover-tab'
import { DeployTab } from './tabs/deploy-tab'
import { FrontendTab } from './tabs/frontend-tab'
import { QaTab } from './tabs/qa-tab'
import { UxTab } from './tabs/ux-tab'

interface TabConfig {
  value: string
  index: string
  label: string
  word: string
  icon: ComponentType<LucideProps>
}

const TABS: TabConfig[] = [
  { value: 'capa', index: '01', label: 'Capa', word: 'UNITRI', icon: GraduationCap },
  { value: 'ux', index: '02', label: 'Produto & UX', word: 'DESIGN', icon: Palette },
  { value: 'backend', index: '03', label: 'Back-end', word: 'API', icon: Server },
  { value: 'qa', index: '04', label: 'QA', word: 'QUALIDADE', icon: ShieldCheck },
  { value: 'frontend', index: '05', label: 'Front-end', word: 'WEB', icon: PanelsTopLeft },
  { value: 'deploy', index: '06', label: 'Deploy', word: 'CLOUD', icon: Cloud },
]

const contentAnimation = 'animate-in fade-in-0 slide-in-from-bottom-3 duration-500 ease-out'

export const PresentationShell = (): JSX.Element => {
  const [active, setActive] = useState<string>('capa')
  const { data: users = {}, isLoading } = useGithubUsers(ALL_LOGINS)

  const activeWord = TABS.find(tab => tab.value === active)?.word ?? TABS[0].word

  return (
    <main className="relative min-h-screen bg-background text-foreground selection:bg-primary selection:text-primary-foreground">
      <PresentationBackground word={activeWord} />

      {/* ── Nav ── */}
      <nav className="relative z-20 flex items-center justify-between px-5 py-5 md:px-10">
        <div className="flex items-center gap-3">
          <Image
            src="/icon.png"
            alt="CoreFlow"
            width={30}
            height={30}
            className="rounded-lg"
            priority
          />
          <span className="text-sm font-semibold tracking-tight">CoreFlow</span>
          <span className="hidden font-mono text-[10px] tracking-[0.18em] text-muted-foreground uppercase sm:inline">
            · Apresentação
          </span>
        </div>

        <div className="flex items-center gap-2">
          <div className="[&_button]:size-9 [&_button]:bg-transparent [&_button]:text-muted-foreground [&_button]:shadow-none [&_button]:hover:bg-accent [&_button]:hover:text-foreground">
            <ModeToggle />
          </div>
          <Link href="/">
            <Button
              variant="ghost"
              size="sm"
              className="h-9 gap-1.5 px-4 text-xs font-medium text-muted-foreground hover:text-foreground"
            >
              <ArrowLeft className="size-3.5" />
              Voltar ao site
            </Button>
          </Link>
        </div>
      </nav>

      {/* ── Tabs ── */}
      <Tabs value={active} onValueChange={setActive} className="w-full gap-0">
        <div className="sticky top-0 z-30 border-y border-border bg-background/80 backdrop-blur-md">
          <div className="no-scrollbar mx-auto flex w-full max-w-6xl overflow-x-auto px-4 py-3">
            <TabsList className="mx-auto h-auto w-max gap-1 rounded-xl border border-border bg-card/70 px-1.5 py-6 backdrop-blur-sm">
              {TABS.map(tab => (
                <TabsTrigger
                  key={tab.value}
                  value={tab.value}
                  className={cn(
                    'group/tt h-auto gap-2 rounded-lg px-3.5 py-2.5 text-foreground/60',
                    'data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-sm'
                  )}
                >
                  <span className="font-mono text-[11px] tabular-nums opacity-50 group-data-[state=active]/tt:opacity-90">
                    {tab.index}
                  </span>
                  <tab.icon className="size-4" />
                  <span className="hidden text-sm font-medium whitespace-nowrap sm:inline">
                    {tab.label}
                  </span>
                </TabsTrigger>
              ))}
            </TabsList>
          </div>
        </div>

        <div className="mx-auto w-full max-w-6xl px-5 py-12 md:px-8 md:py-16">
          <TabsContent value="capa">
            <div className={contentAnimation}>
              <CoverTab />
            </div>
          </TabsContent>
          <TabsContent value="ux">
            <div className={contentAnimation}>
              <UxTab users={users} loading={isLoading} />
            </div>
          </TabsContent>
          <TabsContent value="backend">
            <div className={contentAnimation}>
              <BackendTab users={users} loading={isLoading} />
            </div>
          </TabsContent>
          <TabsContent value="qa">
            <div className={contentAnimation}>
              <QaTab users={users} loading={isLoading} />
            </div>
          </TabsContent>
          <TabsContent value="frontend">
            <div className={contentAnimation}>
              <FrontendTab users={users} loading={isLoading} />
            </div>
          </TabsContent>
          <TabsContent value="deploy">
            <div className={contentAnimation}>
              <DeployTab users={users} loading={isLoading} />
            </div>
          </TabsContent>
        </div>
      </Tabs>

      {/* ── Footer ── */}
      <footer className="relative z-10 border-t border-border px-5 py-8 text-center md:px-10">
        <p className="font-mono text-xs tracking-wider text-muted-foreground">
          CoreFlow Pilates · Trabalho V2 · Análise de Sistemas I — UNITRI
        </p>
      </footer>
    </main>
  )
}
