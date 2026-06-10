'use client'

import { useEffect, useRef, useState, type JSX, type ReactNode } from 'react'

import { cn } from '@/lib/utils'

interface RevealProps {
  children: ReactNode
  className?: string
  /** Delay, in ms, applied to the transition for staggered entrances. */
  delay?: number
  /** Vertical travel distance, in px, before settling. */
  y?: number
}

/**
 * Reveals its children with a fade + rise the first time they enter the viewport.
 * Mount-while-visible (e.g. switching tabs) triggers immediately with the given delay.
 */
export const Reveal = ({ children, className, delay = 0, y = 18 }: RevealProps): JSX.Element => {
  const ref = useRef<HTMLDivElement>(null)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const node = ref.current
    if (!node) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true)
          observer.disconnect()
        }
      },
      { threshold: 0.12, rootMargin: '0px 0px -8% 0px' },
    )

    observer.observe(node)
    return () => observer.disconnect()
  }, [])

  return (
    <div
      ref={ref}
      style={{
        transitionDelay: `${delay}ms`,
        transform: visible ? 'translateY(0)' : `translateY(${y}px)`,
      }}
      className={cn(
        'transition-[opacity,transform] duration-700 ease-out will-change-transform motion-reduce:transition-none',
        visible ? 'opacity-100' : 'opacity-0',
        className,
      )}
    >
      {children}
    </div>
  )
}
