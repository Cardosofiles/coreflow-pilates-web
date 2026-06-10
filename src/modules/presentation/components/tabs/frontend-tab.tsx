import type { JSX } from 'react'
import { Boxes, FolderTree, LayoutDashboard, ShieldCheck, Workflow } from 'lucide-react'

import { Reveal } from '../reveal'
import { SectionHeading } from '../section-heading'
import { FeatureCard } from '../feature-card'
import { TechCloud } from '../tech'
import { DeveloperCarousel } from '../developer-carousel'
import { COLLABORATORS, TECH } from '../../data/presentation-data'
import type { GithubUserMap } from '../../types/presentation.types'

interface FrontendTabProps {
  users: GithubUserMap
  loading: boolean
}

const MODULE_TREE = [
  'src/modules/[feature]/',
  '├── components/      # UI da feature',
  '├── hooks/           # use-get / use-create',
  '├── actions/         # Server Actions',
  '├── schemas/         # Zod',
  '├── types/           # tipos da feature',
  '├── index.ts         # barrel client-safe',
  '└── index.server.ts  # barrel server-only',
] as const

export const FrontendTab = ({ users, loading }: FrontendTabProps): JSX.Element => {
  return (
    <div className="flex flex-col gap-14">
      <SectionHeading
        eyebrow="Tab 05 · Front-end"
        title={
          <>
            Módulos colocados, <span className="text-primary">páginas finas.</span>
          </>
        }
        description="Next.js App Router com arquitetura feature-based: cada módulo é autocontido e as páginas apenas compõem componentes. Dados via TanStack Query + Axios, formulários com React Hook Form + Zod, 100% type-safe."
      />

      <DeveloperCarousel collaborators={COLLABORATORS.frontend} users={users} loading={loading} />

      <section className="grid items-start gap-8 lg:grid-cols-[1fr_1fr]">
        {/* Estrutura de módulo */}
        <Reveal>
          <div className="overflow-hidden rounded-2xl border border-border bg-card/70 backdrop-blur-sm">
            <div className="flex items-center gap-2 border-b border-border px-4 py-2.5">
              <span className="size-2.5 rounded-full bg-destructive/60" />
              <span className="size-2.5 rounded-full bg-chart-1/60" />
              <span className="size-2.5 rounded-full bg-primary/60" />
              <span className="ml-2 flex items-center gap-1.5 font-mono text-sm text-muted-foreground">
                <FolderTree className="size-3.5" />
                module-structure
              </span>
            </div>
            <pre className="overflow-x-auto p-4 font-mono text-[13px] leading-relaxed text-muted-foreground">
              {MODULE_TREE.map(line => (
                <div key={line} className="whitespace-pre">
                  {line}
                </div>
              ))}
            </pre>
          </div>
        </Reveal>

        {/* Princípios de arquitetura */}
        <div className="grid gap-4 *:h-full sm:grid-cols-2">
          <Reveal>
            <FeatureCard icon={Boxes} title="Feature-based">
              Cada feature isola componentes, hooks, schemas e tipos sob{' '}
              <span className="font-mono text-sm">src/modules</span>.
            </FeatureCard>
          </Reveal>
          <Reveal delay={80}>
            <FeatureCard icon={LayoutDashboard} title="App Router">
              Route groups <span className="font-mono text-sm">(auth)</span> e{' '}
              <span className="font-mono text-sm">(backoffice)</span> com páginas finas.
            </FeatureCard>
          </Reveal>
          <Reveal delay={160}>
            <FeatureCard icon={Workflow} title="Data fetching">
              TanStack Query + Axios em hooks dedicados por recurso, com cache e revalidação.
            </FeatureCard>
          </Reveal>
          <Reveal delay={240}>
            <FeatureCard icon={ShieldCheck} title="100% type-safe">
              TypeScript estrito de ponta a ponta, validação com Zod e proxy de rotas no edge.
            </FeatureCard>
          </Reveal>
        </div>
      </section>

      <section className="flex flex-col gap-4">
        <Reveal className="font-mono text-sm tracking-[0.2em] text-muted-foreground uppercase">
          Stack do front-end
        </Reveal>
        <TechCloud items={TECH.frontend} />
      </section>
    </div>
  )
}
