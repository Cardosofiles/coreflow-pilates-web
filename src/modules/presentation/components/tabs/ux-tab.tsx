import type { JSX } from 'react'
import { ArrowUpRight, Contrast, MonitorSmartphone, Palette, Sparkles } from 'lucide-react'

import { cn } from '@/lib/utils'

import { Reveal } from '../reveal'
import { SectionHeading } from '../section-heading'
import { FeatureCard } from '../feature-card'
import { TechCloud } from '../tech'
import { DeveloperCarousel } from '../developer-carousel'
import { COLLABORATORS, TECH } from '../../data/presentation-data'
import type { GithubUserMap } from '../../types/presentation.types'

interface UxTabProps {
  users: GithubUserMap
  loading: boolean
}

const PALETTE = [
  { name: 'Primary', token: 'bg-primary', value: 'oklch(0.62 0.14 39)' },
  { name: 'Secondary', token: 'bg-secondary', value: 'oklch(0.92 0.01 93)' },
  { name: 'Accent', token: 'bg-accent', value: 'oklch(0.92 0.01 93)' },
  { name: 'Muted', token: 'bg-muted', value: 'oklch(0.93 0.02 90)' },
  { name: 'Background', token: 'bg-background', value: 'oklch(0.98 0.01 95)' },
  { name: 'Foreground', token: 'bg-foreground', value: 'oklch(0.34 0.03 96)' },
  { name: 'Chart 1', token: 'bg-chart-1', value: 'oklch(0.56 0.13 43)' },
  { name: 'Chart 2', token: 'bg-chart-2', value: 'oklch(0.69 0.16 290)' },
] as const

export const UxTab = ({ users, loading }: UxTabProps): JSX.Element => {
  return (
    <div className="flex flex-col gap-14">
      <SectionHeading
        eyebrow="Tab 02 · Produto & UX"
        title={
          <>
            Design que <span className="text-primary">respira.</span>
          </>
        }
        description="Uma identidade quente e editorial, construída sobre tokens semânticos. Cada cor, raio e sombra é uma variável — tema claro e escuro saem da mesma fonte de verdade."
      />

      <DeveloperCarousel collaborators={COLLABORATORS.ux} users={users} loading={loading} />

      {/* ── Paleta (tweakcn) ── */}
      <section className="flex flex-col gap-5">
        <Reveal className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2 font-mono text-sm tracking-[0.2em] text-muted-foreground uppercase">
            <Palette className="size-3.5 text-primary" />
            Paleta extraída
          </div>
          <a
            href="https://tweakcn.com/"
            target="_blank"
            rel="noopener noreferrer"
            className="group/tw flex items-center gap-1 font-mono text-sm text-primary transition-colors hover:text-primary/80"
          >
            tweakcn.com
            <ArrowUpRight className="size-3.5 transition-transform group-hover/tw:translate-x-0.5 group-hover/tw:-translate-y-0.5" />
          </a>
        </Reveal>

        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {PALETTE.map((swatch, index) => (
            <Reveal key={swatch.name} delay={index * 50}>
              <div className="group/sw overflow-hidden rounded-xl border border-border bg-card/60 backdrop-blur-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">
                <div
                  className={cn(
                    'h-20 w-full transition-transform duration-300 group-hover/sw:scale-105',
                    swatch.token,
                  )}
                />
                <div className="flex flex-col gap-0.5 p-3">
                  <span className="text-sm font-semibold">{swatch.name}</span>
                  <span className="font-mono text-sm text-muted-foreground">{swatch.value}</span>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ── Princípios ── */}
      <section className="grid gap-4 *:h-full sm:grid-cols-2 lg:grid-cols-3">
        <Reveal>
          <FeatureCard icon={Sparkles} title="Consistência por tokens">
            Componentes Shadcn sobre variáveis OKLCH — espaçamento, raio e tipografia previsíveis em
            toda a aplicação.
          </FeatureCard>
        </Reveal>
        <Reveal delay={80}>
          <FeatureCard icon={Contrast} title="Tema claro & escuro">
            Alternância instantânea via <span className="font-mono text-sm">next-themes</span>, com
            contraste calibrado nos dois modos.
          </FeatureCard>
        </Reveal>
        <Reveal delay={160}>
          <FeatureCard icon={MonitorSmartphone} title="Mobile-first">
            Layouts fluidos com <span className="font-mono text-sm">clamp()</span> e grids que se
            reorganizam do celular ao desktop.
          </FeatureCard>
        </Reveal>
      </section>

      <section className="flex flex-col gap-4">
        <Reveal className="font-mono text-sm tracking-[0.2em] text-muted-foreground uppercase">
          Ferramentas de design
        </Reveal>
        <TechCloud items={TECH.tools} />
      </section>
    </div>
  )
}
