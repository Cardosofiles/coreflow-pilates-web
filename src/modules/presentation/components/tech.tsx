import type { CSSProperties, JSX } from 'react'

import { cn } from '@/lib/utils'

import type { TechItem } from '../types/presentation.types'
import { Reveal } from './reveal'

/* ────────────────────────────────────────────────
   Logo — theme-aware, variable aspect ratio
──────────────────────────────────────────────── */
interface TechLogoProps {
  tech: TechItem
  className?: string
}

export const TechLogo = ({ tech, className }: TechLogoProps): JSX.Element => {
  if (tech.srcLight && tech.srcDark) {
    return (
      <>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={tech.srcLight}
          alt={tech.name}
          loading="lazy"
          className={cn('block object-contain dark:hidden', className)}
        />
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={tech.srcDark}
          alt=""
          aria-hidden
          loading="lazy"
          className={cn('hidden object-contain dark:block', className)}
        />
      </>
    )
  }

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={tech.src}
      alt={tech.name}
      loading="lazy"
      className={cn('object-contain', tech.invertOnLight && 'invert dark:invert-0', className)}
    />
  )
}

/* ────────────────────────────────────────────────
   Chip — logo + label tile
──────────────────────────────────────────────── */
export const TechChip = ({ tech }: { tech: TechItem }): JSX.Element => {
  return (
    <div className="group/chip flex items-center gap-2.5 rounded-xl border border-border bg-card/60 px-4 py-2.5 backdrop-blur-sm transition-all duration-300 hover:-translate-y-0.5 hover:border-primary/40 hover:bg-card hover:shadow-[0_10px_30px_oklch(0_0_0/0.10)]">
      <TechLogo
        tech={tech}
        className="h-6 w-auto max-w-[6rem] transition-transform duration-300 group-hover/chip:scale-110"
      />
      <span className="text-sm font-medium whitespace-nowrap">{tech.name}</span>
    </div>
  )
}

/* ────────────────────────────────────────────────
   Cloud — staggered grid of chips
──────────────────────────────────────────────── */
export const TechCloud = ({
  items,
  className,
}: {
  items: TechItem[]
  className?: string
}): JSX.Element => {
  return (
    <div className={cn('flex flex-wrap gap-2.5', className)}>
      {items.map((tech, index) => (
        <Reveal key={`${tech.name}-${index}`} delay={index * 55} y={12}>
          <TechChip tech={tech} />
        </Reveal>
      ))}
    </div>
  )
}

/* ────────────────────────────────────────────────
   Marquee — infinite logo ticker
──────────────────────────────────────────────── */
export const TechMarquee = ({
  items,
  durationSeconds = 32,
}: {
  items: TechItem[]
  durationSeconds?: number
}): JSX.Element => {
  const style: CSSProperties = { animation: `marquee ${durationSeconds}s linear infinite` }

  return (
    <div className="no-scrollbar relative w-full overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_8%,black_92%,transparent)]">
      <div className="flex w-max items-center gap-12 py-2" style={style}>
        {[...items, ...items].map((tech, index) => (
          <TechLogo
            key={`${tech.name}-${index}`}
            tech={tech}
            className="h-7 w-auto max-w-[6rem] opacity-60 grayscale transition-all duration-300 hover:opacity-100 hover:grayscale-0"
          />
        ))}
      </div>
    </div>
  )
}
