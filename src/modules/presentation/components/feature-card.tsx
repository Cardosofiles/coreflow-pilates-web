import type { JSX, ReactNode } from 'react'
import type { LucideIcon } from 'lucide-react'

import { cn } from '@/lib/utils'

interface FeatureCardProps {
  icon: LucideIcon
  title: string
  children: ReactNode
  className?: string
}

/** Icon + title + body tile with a hover lift, reused across the area tabs. */
export const FeatureCard = ({
  icon: Icon,
  title,
  children,
  className,
}: FeatureCardProps): JSX.Element => {
  return (
    <div
      className={cn(
        'group/feat relative flex h-full flex-col gap-3.5 rounded-2xl border border-border bg-card/60 p-6 backdrop-blur-sm transition-all duration-300 hover:-translate-y-1 hover:border-primary/40 hover:shadow-[0_16px_40px_oklch(0_0_0/0.10)]',
        className,
      )}
    >
      <div className="flex size-11 items-center justify-center rounded-xl bg-primary/10 text-primary transition-transform duration-300 group-hover/feat:scale-110">
        <Icon className="size-5.5" />
      </div>
      <h3 className="text-lg font-semibold tracking-tight">{title}</h3>
      <div className="text-[0.95rem] leading-relaxed text-muted-foreground sm:text-base">
        {children}
      </div>
    </div>
  )
}

interface StatBlockProps {
  value: string
  label: string
}

/** Mono numeric stat used in hero/cover rows. */
export const StatBlock = ({ value, label }: StatBlockProps): JSX.Element => {
  return (
    <div className="flex flex-col gap-1">
      <span className="font-mono text-3xl leading-none font-black tabular-nums">{value}</span>
      <span className="text-[11px] text-muted-foreground">{label}</span>
    </div>
  )
}
