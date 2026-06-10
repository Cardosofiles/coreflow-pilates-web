import type { JSX } from 'react'
import { Bell, CalendarClock, Database, Layers, Lock, Boxes } from 'lucide-react'

import { Reveal } from '../reveal'
import { SectionHeading } from '../section-heading'
import { FeatureCard, StatBlock } from '../feature-card'
import { TechCloud } from '../tech'
import { DeveloperCarousel } from '../developer-carousel'
import { COLLABORATORS, TECH } from '../../data/presentation-data'
import type { GithubUserMap } from '../../types/presentation.types'

interface BackendTabProps {
  users: GithubUserMap
  loading: boolean
}

const LAYERS = [
  { name: 'routes', desc: 'Endpoints da API' },
  { name: 'schemas', desc: 'Entrada e saída com Pydantic' },
  { name: 'models', desc: 'Entidades do banco com SQLAlchemy' },
  { name: 'services', desc: 'Regras de negócio e acesso ao banco' },
  { name: 'db', desc: 'Conexão, session e base declarativa' },
  { name: 'core', desc: 'Configurações, segurança e JWT' },
] as const

export const BackendTab = ({ users, loading }: BackendTabProps): JSX.Element => {
  return (
    <div className="flex flex-col gap-14">
      <SectionHeading
        eyebrow="Tab 03 · Back-end"
        title={
          <>
            API em camadas, <span className="text-primary">por entidade.</span>
          </>
        }
        description="FastAPI + SQLAlchemy no padrão models · schemas · services. Cada entidade é isolada para facilitar manutenção e testes, com responsabilidades bem definidas em cada camada."
      />

      <DeveloperCarousel collaborators={COLLABORATORS.backend} users={users} loading={loading} />

      <section className="grid gap-10 lg:grid-cols-[1.1fr_1fr]">
        {/* Camadas */}
        <div className="flex flex-col gap-4">
          <Reveal className="flex items-center gap-2 font-mono text-xs tracking-[0.2em] text-muted-foreground uppercase">
            <Layers className="size-3.5 text-primary" />
            Arquitetura em camadas
          </Reveal>
          <div className="flex flex-col gap-2.5">
            {LAYERS.map((layer, index) => (
              <Reveal key={layer.name} delay={index * 70}>
                <div className="group/layer flex items-center gap-4 rounded-xl border border-border bg-card/60 px-4 py-3 backdrop-blur-sm transition-all duration-300 hover:translate-x-1 hover:border-primary/40">
                  <span className="font-mono text-sm text-primary/50 tabular-nums">
                    {String(index + 1).padStart(2, '0')}
                  </span>
                  <code className="rounded-md bg-primary/10 px-2 py-0.5 font-mono text-sm font-semibold text-primary">
                    {layer.name}
                  </code>
                  <span className="text-[0.95rem] text-muted-foreground">{layer.desc}</span>
                </div>
              </Reveal>
            ))}
          </div>
        </div>

        {/* Capacidades */}
        <div className="flex flex-col gap-4">
          <Reveal className="font-mono text-xs tracking-[0.2em] text-muted-foreground uppercase">
            Capacidades implementadas
          </Reveal>
          <div className="grid gap-4 *:h-full sm:grid-cols-2">
            <Reveal>
              <FeatureCard icon={Lock} title="Auth JWT por papel">
                Login com JWT e proteção de rotas por perfil — ADMIN, INSTRUTOR e ALUNO.
              </FeatureCard>
            </Reveal>
            <Reveal delay={80}>
              <FeatureCard icon={Boxes} title="CRUD de entidades">
                Alunos, instrutores, planos, matrículas, aparelhos e sessões.
              </FeatureCard>
            </Reveal>
            <Reveal delay={160}>
              <FeatureCard icon={CalendarClock} title="Regras de agenda">
                Ocupação por sessão, limite semanal, rodízio de aparelho e cancelamento com 12h.
              </FeatureCard>
            </Reveal>
            <Reveal delay={240}>
              <FeatureCard icon={Bell} title="Outbox de notificações">
                Fila de espera e lembretes de aula preparados para envio por e-mail.
              </FeatureCard>
            </Reveal>
          </div>
        </div>
      </section>

      <Reveal className="flex flex-wrap items-center gap-8 rounded-2xl border border-border bg-card/50 px-6 py-5 backdrop-blur-sm">
        <Database className="size-6 text-primary" />
        <StatBlock value="9" label="entidades" />
        <StatBlock value="40+" label="endpoints" />
        <StatBlock value="3" label="papéis" />
        <StatBlock value="Pytest" label="cobertura" />
      </Reveal>

      <section className="flex flex-col gap-4">
        <Reveal className="font-mono text-xs tracking-[0.2em] text-muted-foreground uppercase">
          Stack do back-end
        </Reveal>
        <TechCloud items={TECH.backend} />
      </section>
    </div>
  )
}
