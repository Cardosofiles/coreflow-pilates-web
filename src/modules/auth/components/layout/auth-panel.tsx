'use client'

import type { JSX } from 'react'

const FEATURES = [
  'Gestão de Alunos',
  'Rotação de Aparelhos',
  'Controle de Horários',
  'Planos e Renovações',
  'Alertas de Vencimento',
  'Dashboard Completo',
]

const GoogleIcon = (): JSX.Element => (
  <svg viewBox="0 0 24 24" className="h-4 w-4" aria-hidden>
    <path
      fill="#4285F4"
      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
    />
    <path
      fill="#34A853"
      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
    />
    <path
      fill="#FBBC05"
      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
    />
    <path
      fill="#EA4335"
      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
    />
  </svg>
)

const GitHubIcon = (): JSX.Element => (
  <svg viewBox="0 0 24 24" className="h-4 w-4 fill-current" aria-hidden>
    <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
  </svg>
)

const AuthPanel = (): JSX.Element => {
  return (
    <div className="relative h-full overflow-hidden">
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
        <span className="text-foreground/[0.025] text-[20vw] font-black tracking-tighter whitespace-nowrap lg:text-[8vw]">
          ACADEMY
        </span>
      </div>

      {/* ── Gradient vignette ── */}
      <div
        aria-hidden
        className="from-muted/0 via-muted/0 to-muted pointer-events-none absolute inset-0 bg-linear-to-b"
      />

      {/* ── Main centered content ── */}
      <div className="relative z-10 flex h-full flex-col items-center justify-center gap-8 px-14">
        {/* Logo + tagline */}
        <div className="flex flex-col items-center gap-4 text-center">
          {/* Pulsing ring around logo */}
          <div className="relative flex items-center justify-center">
            <div
              aria-hidden
              className="border-foreground/20 absolute h-20 w-20 animate-[pulse-ring-sm_2.6s_ease-in-out_infinite] rounded-full border"
            />
            <div
              aria-hidden
              className="border-foreground/10 absolute h-28 w-28 animate-[pulse-ring-lg_2.6s_ease-in-out_0.4s_infinite] rounded-full border"
            />
            <div className="bg-foreground relative flex h-14 w-14 items-center justify-center rounded-full">
              <span className="text-background text-xl font-black tracking-tight">C</span>
            </div>
          </div>

          <div>
            <h2 className="text-2xl font-black tracking-tighter">CoreFlow</h2>
            <p className="text-muted-foreground mt-1 text-sm leading-relaxed">
              Sistema completo de gestão para Pilates
            </p>
          </div>
        </div>

        {/* Hairline divider */}
        <div className="bg-border h-px w-20" />

        {/* Feature checklist */}
        <div className="flex flex-col gap-2.5">
          {FEATURES.map(feature => (
            <div key={feature} className="flex items-center gap-3">
              <span className="bg-foreground h-1 w-1 shrink-0 rounded-full" />
              <span className="text-muted-foreground font-mono text-[12px] tracking-wide">
                {feature}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* ── Floating card: Google ── */}
      <div className="border-border bg-card absolute top-10 right-8 flex items-center gap-3 rounded-2xl border px-4 py-3 shadow-[0_4px_24px_oklch(0_0_0/0.07)]">
        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-white shadow-sm">
          <GoogleIcon />
        </div>
        <div>
          <p className="text-xs leading-tight font-semibold">Continuar com Google</p>
          <p className="text-muted-foreground font-mono text-[10px]">Login rápido e seguro</p>
        </div>
      </div>

      {/* ── Floating card: GitHub ── */}
      <div className="border-border bg-card absolute bottom-20 left-8 flex items-center gap-3 rounded-2xl border px-4 py-3 shadow-[0_4px_24px_oklch(0_0_0/0.07)]">
        <div className="bg-foreground flex h-8 w-8 shrink-0 items-center justify-center rounded-full">
          <span className="text-background">
            <GitHubIcon />
          </span>
        </div>
        <div>
          <p className="text-xs leading-tight font-semibold">Continuar com GitHub</p>
          <p className="text-muted-foreground font-mono text-[10px]">Acesso via conta GitHub</p>
        </div>
      </div>

      {/* ── Floating badge: Better Auth ── */}
      <div className="border-border bg-card absolute top-1/3 right-6 rounded-xl border px-3 py-2 shadow-[0_2px_12px_oklch(0_0_0/0.06)]">
        <p className="text-muted-foreground font-mono text-[10px] tracking-wider uppercase">
          Autenticação
        </p>
        <p className="mt-0.5 text-sm font-bold">Better Auth</p>
      </div>

      {/* ── Floating badge: Aparelhos ── */}
      <div className="border-border bg-card absolute top-16 left-8 rounded-xl border px-3 py-2 shadow-[0_2px_12px_oklch(0_0_0/0.06)]">
        <p className="text-muted-foreground font-mono text-[10px] tracking-wider uppercase">
          Aparelhos
        </p>
        <div className="mt-0.5 flex items-baseline gap-1">
          <span className="font-mono text-xl leading-none font-black tabular-nums">4</span>
          <span className="text-muted-foreground text-[10px]">ativos</span>
        </div>
      </div>

      {/* ── CTA nudge card ── */}
      <div className="border-border bg-card absolute right-8 bottom-28 flex items-center gap-2.5 rounded-2xl border px-4 py-3 shadow-[0_4px_24px_oklch(0_0_0/0.07)]">
        <div className="bg-foreground relative flex h-7 w-7 shrink-0 items-center justify-center rounded-full">
          <span className="bg-foreground/30 absolute inset-0 animate-ping rounded-full" />
          <span className="text-background font-mono text-[10px] font-black">→</span>
        </div>
        <div>
          <p className="text-xs leading-tight font-semibold">Pronto para começar?</p>
          <p className="text-muted-foreground font-mono text-[10px]">Crie sua conta agora</p>
        </div>
      </div>

      {/* ── Marquee ticker ── */}
      <div className="border-border absolute inset-x-0 bottom-0 overflow-hidden border-t py-3">
        <div className="flex w-max animate-[marquee_22s_linear_infinite] items-center gap-0">
          {[...FEATURES, ...FEATURES].map((item, i) => (
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
    </div>
  )
}

export { AuthPanel }
