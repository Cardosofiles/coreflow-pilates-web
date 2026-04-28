'use client'

import type { JSX } from 'react'

import Image from 'next/image'
import Link from 'next/link'

import { Button } from '@/components/ui/button'
import { ModeToggle } from '@/components/themes/mode-toggle'

const equipment = [
  { name: 'Reformer', abbr: 'RF', angle: -10 },
  { name: 'Cadillac', abbr: 'CD', angle: 45 },
  { name: 'Chair', abbr: 'CH', angle: 165 },
  { name: 'Ladder\nBarrel', abbr: 'LB', angle: 225 },
]

const STATS = [
  { value: '4', label: 'aparelhos' },
  { value: '12', label: 'horários / dia' },
  { value: '5', label: 'planos' },
  { value: '3', label: 'modalidades' },
]

const MARQUEE_ITEMS = [
  'Gestão de Alunos',
  'Rotação de Aparelhos',
  'Controle de Horários',
  'Planos e Renovações',
  'Instrutores',
  'Aulas Avulsas',
  'Alertas de Vencimento',
  'Dashboard Completo',
]

export default function LandingPage(): JSX.Element {
  return (
    <main className="bg-background selection:bg-foreground selection:text-background relative flex min-h-screen flex-col overflow-hidden">
      {/* ── Dot grid background ── */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          backgroundImage: 'radial-gradient(circle, oklch(0.6 0 0 / 0.12) 1px, transparent 1px)',
          backgroundSize: '28px 28px',
        }}
      />

      {/* ── Ghost headline background ── */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 flex items-center justify-center overflow-hidden select-none"
      >
        <span className="text-foreground/2.5 text-[22vw] font-black tracking-tighter whitespace-nowrap">
          PILATES
        </span>
      </div>

      {/* ── Gradient vignette ── */}
      <div
        aria-hidden
        className="from-background/0 via-background/0 to-background pointer-events-none absolute inset-0 bg-linear-to-b"
      />

      {/* ════════════════════════════════════
          NAV
      ════════════════════════════════════ */}
      <nav className="relative z-20 flex items-center justify-between px-8 py-7 md:px-16">
        <div className="flex items-center gap-3">
          {/* Logotype mark */}
          <Image
            src="/icon.png"
            alt="CoreFlow Logo"
            width={32}
            height={32}
            className="rounded-lg object-cover"
            priority
          />
          <span className="text-sm font-semibold tracking-tight">CoreFlow</span>
        </div>

        <div className="flex items-center gap-2">
          <div className="[&_button]:text-muted-foreground [&_button]:hover:bg-accent [&_button]:hover:text-foreground [&_button]:h-9 [&_button]:w-9 [&_button]:bg-transparent [&_button]:shadow-none">
            <ModeToggle />
          </div>
          <Link href="/sign-in">
            <Button
              variant="ghost"
              size="sm"
              className="text-muted-foreground hover:text-foreground h-9 cursor-pointer px-5 text-xs font-medium"
            >
              Entrar
            </Button>
          </Link>
          <Link href="/sign-up">
            <Button size="sm" className="h-9 cursor-pointer px-5 text-xs font-medium">
              Começar →
            </Button>
          </Link>
        </div>
      </nav>

      {/* ════════════════════════════════════
          HERO BODY
      ════════════════════════════════════ */}
      <section className="relative z-10 grid flex-1 grid-cols-1 items-center gap-12 overflow-hidden px-8 pb-4 md:grid-cols-[1fr_420px] md:gap-0 md:px-16 lg:grid-cols-[1fr_480px]">
        {/* ── LEFT: Editorial content ── */}
        <div className="flex flex-col gap-7 md:max-w-xl">
          {/* Eyebrow tag */}
          <div className="flex items-center gap-3">
            <span className="bg-muted-foreground/40 h-px w-10" />
            <span className="text-muted-foreground font-mono text-[11px] tracking-[0.22em] uppercase">
              Sistema de Gestão
            </span>
          </div>

          {/* Headline */}
          <h1 className="flex flex-col gap-1 text-[clamp(2.75rem,6.5vw,5.5rem)] leading-[0.92] font-black tracking-tighter">
            {['Gestão de', 'Pilates,', 'sem ruído.'].map(line => (
              <span key={line} className="block">
                {line}
              </span>
            ))}
          </h1>

          {/* Hairline divider */}
          <div className="bg-border h-px" />

          {/* Description */}
          <p className="text-muted-foreground max-w-sm text-[0.95rem] leading-relaxed">
            Agendamentos, instrutores, rotação de aparelhos e planos de alunos — tudo integrado numa
            plataforma limpa e intuitiva.
          </p>

          {/* CTA buttons */}
          <div className="flex items-center gap-3">
            <Link href="/sign-up">
              <Button size="lg" className="h-11 cursor-pointer px-7 text-sm font-semibold">
                Acessar o sistema
              </Button>
            </Link>

            <Link href="/sign-in">
              <Button
                variant="ghost"
                size="lg"
                className="text-muted-foreground hover:text-foreground h-11 cursor-pointer px-5 text-sm font-medium"
              >
                Já tenho conta →
              </Button>
            </Link>
          </div>

          {/* Stat row */}
          <div className="flex items-start gap-8 pt-2">
            {STATS.map(s => (
              <div key={s.label} className="flex flex-col gap-0.5">
                <span className="font-mono text-2xl leading-none font-black tabular-nums">
                  {s.value}
                </span>
                <span className="text-muted-foreground text-[11px]">{s.label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* ── RIGHT: Visual panel ── */}
        <div className="relative hidden min-h-[400px] items-center justify-center md:flex">
          {/* Orbit container */}
          <div className="relative flex h-72 w-72 items-center justify-center lg:h-80 lg:w-80">
            {/* Outer rotating ring */}
            <div
              aria-hidden
              className="border-border absolute inset-0 animate-[spin_45s_linear_infinite] rounded-full border"
            />
            {/* Dashed ring */}
            <div
              aria-hidden
              className="absolute inset-6 animate-[spin_30s_linear_infinite_reverse] rounded-full"
              style={{ border: '1px dashed oklch(0.7 0 0 / 0.35)' }}
            />
            {/* Inner static ring */}
            <div aria-hidden className="border-border/40 absolute inset-12 rounded-full border" />

            {/* Center display */}
            <div className="relative z-10 flex flex-col items-center gap-0.5">
              <span className="font-mono text-5xl leading-none font-black tabular-nums">4</span>
              <span className="text-muted-foreground font-mono text-[10px] tracking-[0.22em] uppercase">
                Aparelhos
              </span>
            </div>

            {/* Equipment nodes on orbit */}
            {equipment.map(eq => {
              const rad = (eq.angle * Math.PI) / 180
              const r = 130
              const x = Math.cos(rad) * r
              const y = Math.sin(rad) * r

              return (
                <div
                  key={eq.name}
                  className="absolute z-10"
                  style={{
                    left: `calc(50% + ${x}px)`,
                    top: `calc(50% + ${y}px)`,
                    transform: 'translate(-50%, -50%)',
                  }}
                >
                  <div className="flex flex-col items-center gap-1">
                    <div className="border-border bg-card flex h-10 w-10 items-center justify-center rounded-xl border shadow-[0_2px_12px_oklch(0_0_0/0.08)]">
                      <span className="font-mono text-[11px] font-bold tracking-tight">
                        {eq.abbr}
                      </span>
                    </div>
                    <span className="text-muted-foreground text-center text-[9px] leading-tight whitespace-pre-wrap">
                      {eq.name}
                    </span>
                  </div>
                </div>
              )
            })}
          </div>

          {/* ── Floating card: schedule ── */}
          <div className="border-border bg-card absolute top-4 right-0 rounded-2xl border p-4 shadow-[0_4px_24px_oklch(0_0_0/0.07)]">
            <p className="text-muted-foreground mb-2.5 text-[10px] font-medium tracking-wider uppercase">
              Horários disponíveis
            </p>
            <div className="flex items-end gap-1.5">
              <span className="font-mono text-3xl leading-none font-black tabular-nums">07</span>
              <span className="text-muted-foreground mb-0.5 text-sm">→ 19h</span>
            </div>
            <div className="mt-3 flex gap-0.75">
              {Array.from({ length: 12 }, (_, i) => (
                <div
                  key={i}
                  className="bg-foreground h-5 w-1.25 rounded-full"
                  style={{ opacity: 0.15 + (i / 12) * 0.85 }}
                />
              ))}
            </div>
            <p className="text-muted-foreground mt-2 font-mono text-[10px]">12 slots · 1h cada</p>
          </div>

          {/* ── Floating card: alert ── */}
          <div className="border-border bg-card absolute bottom-8 left-0 flex items-center gap-3 rounded-2xl border px-4 py-3 shadow-[0_4px_24px_oklch(0_0_0/0.07)]">
            {/* Alert pulse dot */}
            <div className="bg-foreground relative flex h-8 w-8 shrink-0 items-center justify-center rounded-full">
              <span className="bg-foreground/30 absolute inset-0 animate-ping rounded-full" />
              <span className="text-background font-mono text-[11px] font-black">!</span>
            </div>
            <div>
              <p className="text-xs leading-tight font-semibold">Renovação em breve</p>
              <p className="text-muted-foreground font-mono text-[10px]">3 alunos · ≤ 7 dias</p>
            </div>
          </div>

          {/* ── Floating card: plan badge ── */}
          <div className="border-border bg-card absolute top-6 left-8 rounded-xl border px-3 py-2 shadow-[0_2px_12px_oklch(0_0_0/0.06)]">
            <p className="text-muted-foreground font-mono text-[10px] tracking-wider uppercase">
              Plano ativo
            </p>
            <p className="mt-0.5 text-sm font-bold">Trimestral</p>
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════
          MARQUEE TICKER
      ════════════════════════════════════ */}
      <div className="border-border relative z-10 mt-auto overflow-hidden border-t py-3.5">
        <div className="flex w-max animate-[marquee_28s_linear_infinite] items-center gap-0">
          {[...MARQUEE_ITEMS, ...MARQUEE_ITEMS].map((item, i) => (
            <span
              key={i}
              className="text-muted-foreground/60 flex items-center gap-6 px-6 font-mono text-[11px] tracking-[0.18em] uppercase"
            >
              {item}
              <span aria-hidden className="bg-muted-foreground/30 h-0.75 w-0.75 rounded-full" />
            </span>
          ))}
        </div>
      </div>
    </main>
  )
}
