import type { JSX } from 'react'
import Image from 'next/image'
import { ArrowUpRight, BookOpen, GraduationCap, Sparkles, UserSquare2 } from 'lucide-react'

import { Reveal } from '../reveal'
import { StatBlock } from '../feature-card'
import { TechCloud, TechMarquee } from '../tech'
import { INSTITUTION, IA_TOOLS, MARQUEE_TECH } from '../../data/presentation-data'

const ACADEMIC = [
  { icon: GraduationCap, label: 'Instituição', value: INSTITUTION.university, hint: INSTITUTION.universityShort },
  { icon: BookOpen, label: 'Curso', value: INSTITUTION.course, hint: 'Graduação' },
  { icon: UserSquare2, label: 'Disciplina', value: INSTITUTION.discipline, hint: INSTITUTION.professor },
] as const

export const CoverTab = (): JSX.Element => {
  return (
    <div className="flex flex-col gap-16">
      {/* ── Hero ── */}
      <section className="grid grid-cols-1 items-center gap-10 lg:grid-cols-[1fr_auto]">
        <div className="flex flex-col gap-7">
          <Reveal className="flex items-center gap-3">
            <span className="h-px w-10 bg-primary" />
            <span className="font-mono text-xs tracking-[0.2em] text-primary uppercase">
              Trabalho {INSTITUTION.version} · {INSTITUTION.discipline}
            </span>
          </Reveal>

          <Reveal delay={80}>
            <h1 className="text-[clamp(2.75rem,7vw,5.5rem)] leading-[0.9] font-black tracking-tighter">
              <span className="block">CoreFlow</span>
              <span className="block bg-linear-to-r from-primary via-chart-1 to-primary bg-[length:200%_auto] bg-clip-text text-transparent [animation:gradient-pan_6s_ease-in-out_infinite]">
                Pilates.
              </span>
            </h1>
          </Reveal>

          <Reveal delay={160}>
            <p className="max-w-md text-base leading-relaxed text-muted-foreground text-pretty sm:text-lg">
              {INSTITUTION.tagline} — uma apresentação interativa do produto, da arquitetura e da
              equipe por trás de cada camada.
            </p>
          </Reveal>

          <Reveal delay={240} className="flex items-start gap-8 pt-1">
            <StatBlock value="6" label="áreas" />
            <StatBlock value="9" label="colaboradores" />
            <StatBlock value="20+" label="tecnologias" />
          </Reveal>
        </div>

        {/* Animated emblem */}
        <Reveal delay={120} className="hidden justify-self-center lg:block">
          <div className="relative flex size-72 items-center justify-center">
            <div className="absolute inset-0 animate-[spin_45s_linear_infinite] rounded-full border border-border" />
            <div
              className="absolute inset-6 animate-[spin_30s_linear_infinite_reverse] rounded-full"
              style={{ border: '1px dashed oklch(0.7 0 0 / 0.35)' }}
            />
            <div className="absolute inset-12 rounded-full border border-border/40" />
            <div className="absolute inset-0 rounded-full bg-primary/5 blur-2xl" />

            <div className="relative z-10 flex flex-col items-center gap-3">
              <Image
                src="/icon.png"
                alt="CoreFlow"
                width={64}
                height={64}
                className="rounded-2xl shadow-lg"
                priority
              />
              <span className="font-mono text-[10px] tracking-[0.22em] text-muted-foreground uppercase">
                {INSTITUTION.version} · 2026
              </span>
            </div>

            {[0, 90, 180, 270].map(angle => {
              const rad = (angle * Math.PI) / 180
              const r = 132
              return (
                <span
                  key={angle}
                  className="absolute size-2.5 rounded-full bg-primary shadow-[0_0_12px_oklch(0.62_0.14_39/0.6)]"
                  style={{
                    left: `calc(50% + ${Math.cos(rad) * r}px)`,
                    top: `calc(50% + ${Math.sin(rad) * r}px)`,
                    transform: 'translate(-50%, -50%)',
                  }}
                />
              )
            })}
          </div>
        </Reveal>
      </section>

      {/* ── Academia ── */}
      <section className="flex flex-col gap-5">
        <Reveal className="font-mono text-xs tracking-[0.2em] text-muted-foreground uppercase">
          Contexto acadêmico
        </Reveal>
        <div className="grid gap-4 *:h-full sm:grid-cols-2 lg:grid-cols-3">
          {ACADEMIC.map((item, index) => (
            <Reveal key={item.label} delay={index * 80}>
              <div className="group/ac flex h-full flex-col gap-3 rounded-2xl border border-border bg-card/60 p-5 backdrop-blur-sm transition-all duration-300 hover:-translate-y-1 hover:border-primary/40">
                <div className="flex size-10 items-center justify-center rounded-xl bg-primary/10 text-primary transition-transform duration-300 group-hover/ac:scale-110">
                  <item.icon className="size-5" />
                </div>
                <span className="font-mono text-xs tracking-[0.16em] text-muted-foreground uppercase">
                  {item.label}
                </span>
                <p className="text-base leading-snug font-semibold">{item.value}</p>
                <span className="text-sm text-muted-foreground">{item.hint}</span>
              </div>
            </Reveal>
          ))}

          <Reveal delay={240} className="sm:col-span-2 lg:col-span-3">
            <a
              href={INSTITUTION.coordinatorGithub}
              target="_blank"
              rel="noopener noreferrer"
              className="group/coord flex items-center justify-between gap-4 rounded-2xl border border-primary/20 bg-primary/5 p-5 transition-all duration-300 hover:border-primary/50 hover:bg-primary/10"
            >
              <div className="flex flex-col gap-1">
                <span className="font-mono text-xs tracking-[0.16em] text-primary uppercase">
                  Coordenação do curso
                </span>
                <p className="text-lg font-semibold">{INSTITUTION.coordinator}</p>
                <span className="font-mono text-sm text-muted-foreground">@voidmmn</span>
              </div>
              <ArrowUpRight className="size-5 shrink-0 text-primary transition-transform duration-300 group-hover/coord:translate-x-0.5 group-hover/coord:-translate-y-0.5" />
            </a>
          </Reveal>
        </div>
      </section>

      {/* ── IA & stack ── */}
      <section className="flex flex-col gap-5">
        <Reveal className="flex items-center gap-2 font-mono text-xs tracking-[0.2em] text-muted-foreground uppercase">
          <Sparkles className="size-3.5 text-primary" />
          Colaboração com IA
        </Reveal>
        <TechCloud items={IA_TOOLS} />

        <Reveal delay={120} className="mt-4 rounded-2xl border border-border bg-card/40 py-4 backdrop-blur-sm">
          <TechMarquee items={MARQUEE_TECH} />
        </Reveal>
      </section>
    </div>
  )
}
