import type { JSX, ReactNode } from 'react'

import { cn } from '@/lib/utils'

import { Reveal } from './reveal'

interface SectionHeadingProps {
  eyebrow: string
  title: ReactNode
  description?: ReactNode
  className?: string
}

/** Editorial heading block — mono eyebrow, heavy title and optional lede. */
export const SectionHeading = ({
  eyebrow,
  title,
  description,
  className,
}: SectionHeadingProps): JSX.Element => {
  return (
    <Reveal className={cn('flex flex-col gap-4', className)}>
      <div className="flex items-center gap-3">
        <span className="h-px w-10 bg-primary" />
        <span className="font-mono text-xs tracking-[0.2em] text-primary uppercase">{eyebrow}</span>
      </div>

      <h2 className="text-[clamp(2.25rem,5.5vw,3.75rem)] leading-[0.95] font-black tracking-tighter text-balance">
        {title}
      </h2>

      {description ? (
        <p className="max-w-2xl text-base leading-relaxed text-muted-foreground text-pretty sm:text-lg">
          {description}
        </p>
      ) : null}
    </Reveal>
  )
}
