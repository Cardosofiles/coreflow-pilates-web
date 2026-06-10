import type { JSX } from 'react'
import { Bug, FileCheck2, FlaskConical, ListChecks, ShieldCheck } from 'lucide-react'

import { Reveal } from '../reveal'
import { SectionHeading } from '../section-heading'
import { FeatureCard, StatBlock } from '../feature-card'
import { TechCloud } from '../tech'
import { DeveloperCarousel } from '../developer-carousel'
import { COLLABORATORS, TECH } from '../../data/presentation-data'
import type { GithubUserMap } from '../../types/presentation.types'

interface QaTabProps {
  users: GithubUserMap
  loading: boolean
}

const PIPELINE = [
  { icon: FlaskConical, title: 'Testes automatizados', body: 'Suíte com Pytest cobrindo serviços e regras de negócio do back-end.' },
  { icon: FileCheck2, title: 'Contrato da API', body: 'Validação dos endpoints e schemas direto no Swagger e no Apidog.' },
  { icon: ListChecks, title: 'Cenários ponta a ponta', body: 'Fluxos de matrícula, agendamento e cancelamento verificados manualmente.' },
  { icon: Bug, title: 'Triagem de defeitos', body: 'Issues e revisões de PR garantindo regressão zero a cada merge.' },
] as const

export const QaTab = ({ users, loading }: QaTabProps): JSX.Element => {
  return (
    <div className="flex flex-col gap-14">
      <SectionHeading
        eyebrow="Tab 04 · Quality Assurance"
        title={
          <>
            Qualidade <span className="text-primary">verificável.</span>
          </>
        }
        description="Cada regra do back-end é exercitada por testes automatizados e validada contra o contrato da API — do Swagger ao Apidog, passando pelos fluxos reais do estúdio."
      />

      <DeveloperCarousel collaborators={COLLABORATORS.qa} users={users} loading={loading} />

      <Reveal className="flex flex-wrap items-center gap-8 rounded-2xl border border-border bg-card/50 px-6 py-5 backdrop-blur-sm">
        <ShieldCheck className="size-6 text-primary" />
        <StatBlock value="Pytest" label="runner" />
        <StatBlock value="Apidog" label="contrato" />
        <StatBlock value="Swagger" label="docs vivas" />
      </Reveal>

      <section className="grid gap-4 *:h-full sm:grid-cols-2">
        {PIPELINE.map((step, index) => (
          <Reveal key={step.title} delay={index * 90}>
            <FeatureCard icon={step.icon} title={step.title}>
              {step.body}
            </FeatureCard>
          </Reveal>
        ))}
      </section>

      <section className="flex flex-col gap-4">
        <Reveal className="font-mono text-xs tracking-[0.2em] text-muted-foreground uppercase">
          Ferramentas de QA
        </Reveal>
        <TechCloud items={TECH.qa} />
      </section>
    </div>
  )
}
