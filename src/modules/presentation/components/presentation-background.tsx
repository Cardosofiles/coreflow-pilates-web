import type { CSSProperties, JSX } from 'react'

interface PresentationBackgroundProps {
  /** Ghost word that fades/zooms in behind the active tab. */
  word: string
}

const dotGrid: CSSProperties = {
  backgroundImage: 'radial-gradient(circle, oklch(0.6 0 0 / 0.10) 1px, transparent 1px)',
  backgroundSize: '30px 30px',
}

/** Fixed, decorative backdrop: dot grid, drifting aurora blobs and a ghost headline. */
export const PresentationBackground = ({ word }: PresentationBackgroundProps): JSX.Element => {
  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
      <div className="absolute inset-0" style={dotGrid} />

      <div
        className="absolute -top-1/4 -left-1/5 h-[55vh] w-[55vh] rounded-full bg-primary/15 blur-[120px]"
        style={{ animation: 'aurora 18s ease-in-out infinite' }}
      />
      <div
        className="absolute -right-1/5 -bottom-1/4 h-[50vh] w-[50vh] rounded-full bg-chart-2/10 blur-[130px]"
        style={{ animation: 'aurora 24s ease-in-out infinite reverse' }}
      />

      <div className="absolute inset-0 flex items-center justify-center select-none">
        <span
          key={word}
          className="animate-in fade-in zoom-in-95 text-[20vw] font-black tracking-tighter whitespace-nowrap text-foreground/[0.022] duration-1000"
        >
          {word}
        </span>
      </div>

      <div className="absolute inset-0 bg-linear-to-b from-background/0 via-background/0 to-background" />
    </div>
  )
}
