import type { JSX } from 'react'
import {
  ArrowRight,
  Cloud,
  Container,
  Database,
  Globe,
  KeyRound,
  Network,
  Rocket,
} from 'lucide-react'

import { Reveal } from '../reveal'
import { SectionHeading } from '../section-heading'
import { FeatureCard } from '../feature-card'
import { TechCloud } from '../tech'
import { DeveloperCarousel } from '../developer-carousel'
import { COLLABORATORS, TECH } from '../../data/presentation-data'
import type { GithubUserMap } from '../../types/presentation.types'

interface DeployTabProps {
  users: GithubUserMap
  loading: boolean
}

const PIPELINE = [
  { icon: Container, title: 'Docker', sub: 'API conteinerizada' },
  { icon: Database, title: 'Railway', sub: 'API + PostgreSQL' },
  { icon: Rocket, title: 'OpenNext', sub: 'build p/ Workers' },
  { icon: Globe, title: 'Cloudflare', sub: 'edge + DNS' },
] as const

export const DeployTab = ({ users, loading }: DeployTabProps): JSX.Element => {
  return (
    <div className="flex flex-col gap-14">
      <SectionHeading
        eyebrow="Tab 06 · Deploy & Infra"
        title={
          <>
            Do container <span className="text-primary">ao edge.</span>
          </>
        }
        description="API e banco em containers Docker na Railway; front-end Next.js compilado pelo OpenNext e servido na borda da Cloudflare Workers, com o DNS gerenciado na mesma plataforma."
      />

      <DeveloperCarousel collaborators={COLLABORATORS.devops} users={users} loading={loading} />

      {/* ── Pipeline ── */}
      <section className="flex flex-col gap-5">
        <Reveal className="flex items-center gap-2 font-mono text-sm tracking-[0.2em] text-muted-foreground uppercase">
          <Network className="size-3.5 text-primary" />
          Pipeline de entrega
        </Reveal>

        <div className="flex flex-col items-stretch gap-3 lg:flex-row lg:items-center">
          {PIPELINE.map((step, index) => (
            <div key={step.title} className="flex flex-col items-stretch gap-3 lg:flex-row lg:items-center lg:gap-3">
              <Reveal delay={index * 120} className="flex-1">
                <div className="group/step flex items-center gap-4 rounded-2xl border border-border bg-card/60 px-5 py-4 backdrop-blur-sm transition-all duration-300 hover:-translate-y-1 hover:border-primary/40 lg:flex-col lg:items-center lg:gap-2 lg:text-center">
                  <div className="flex size-11 items-center justify-center rounded-xl bg-primary/10 text-primary transition-transform duration-300 group-hover/step:scale-110">
                    <step.icon className="size-5" />
                  </div>
                  <div className="flex flex-col lg:items-center">
                    <span className="text-base font-semibold tracking-tight">{step.title}</span>
                    <span className="text-sm text-muted-foreground">{step.sub}</span>
                  </div>
                </div>
              </Reveal>
              {index < PIPELINE.length - 1 ? (
                <ArrowRight className="mx-auto size-4 shrink-0 rotate-90 text-primary/50 lg:rotate-0" />
              ) : null}
            </div>
          ))}
        </div>
      </section>

      {/* ── Desafios ── */}
      <section className="grid gap-4 *:h-full sm:grid-cols-2 lg:grid-cols-3">
        <Reveal>
          <FeatureCard icon={Cloud} title="Next.js no edge">
            <span className="font-mono text-sm">@opennextjs/cloudflare</span> adapta o App Router para
            rodar como Cloudflare Worker.
          </FeatureCard>
        </Reveal>
        <Reveal delay={80}>
          <FeatureCard icon={Network} title="CORS entre domínios">
            Origens de dev e produção liberadas na API para o front consumir os endpoints com
            segurança.
          </FeatureCard>
        </Reveal>
        <Reveal delay={160}>
          <FeatureCard icon={KeyRound} title="Secrets & ambiente">
            Variáveis sensíveis isoladas via <span className="font-mono text-sm">wrangler</span> e
            painel da Railway.
          </FeatureCard>
        </Reveal>
      </section>

      <section className="flex flex-col gap-4">
        <Reveal className="font-mono text-sm tracking-[0.2em] text-muted-foreground uppercase">
          Stack de infraestrutura
        </Reveal>
        <TechCloud items={TECH.deploy} />
      </section>
    </div>
  )
}
