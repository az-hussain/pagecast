/**
 * Design system for the Pagecast showcase deck.
 *
 * One visual language across every slide: deep ink canvas, a layered aurora that
 * drifts, film grain, Fraunces display + Hanken Grotesk body, and a gradient
 * accent. Slides compose these primitives instead of restyling from scratch.
 */
import type { CSSProperties, ReactNode } from 'react'
import { Slide } from '@/components/Slide'

export const C = {
  bg: '#070709',
  ink: '#f6f6f9',
  ink2: 'rgba(216,218,230,0.82)',
  ink3: 'rgba(235,236,245,0.52)',
  line: 'rgba(255,255,255,0.12)',
  card: 'rgba(255,255,255,0.05)',
  cardLine: 'rgba(255,255,255,0.12)',
  indigo: 'rgba(108,118,255,0.55)',
  violet: 'rgba(176,110,255,0.50)',
  amber: 'rgba(255,138,92,0.34)',
  glow: 'rgba(214,196,255,0.55)',
  grad: 'linear-gradient(96deg, #aeb4ff 0%, #cf9bff 48%, #ffb48c 100%)',
  gradSoft: 'linear-gradient(135deg, #aeb4ff, #ffb48c)',
}

export const F = {
  display: "'Fraunces', Georgia, serif",
  body: "'Hanken Grotesk', ui-sans-serif, sans-serif",
  mono: "'JetBrains Mono', ui-monospace, monospace",
}

const GRAIN =
  "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='220' height='220'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.82' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")"

export type Blob = [at: string, size: number, color: string]

const DEFAULT_BLOBS: Blob[] = [
  ['68% 8%', 1100, C.indigo],
  ['92% 34%', 1000, C.violet],
  ['80% 86%', 820, C.amber],
  ['74% 30%', 460, C.glow],
]

function blobStyle([at, size, color]: Blob): CSSProperties {
  const [x, y] = at.split(' ')
  return {
    position: 'absolute',
    width: size,
    height: size,
    left: `calc(${x} - ${size / 2}px)`,
    top: `calc(${y} - ${size / 2}px)`,
    background: `radial-gradient(circle, ${color} 0%, transparent 68%)`,
    filter: 'blur(60px)',
    mixBlendMode: 'screen',
  }
}

/** Full-bleed slide scene: ink base, drifting aurora, vignette, grain, padded content. */
export function Scene({
  children,
  blobs = DEFAULT_BLOBS,
  pad = '92px 140px 104px',
  vignetteAt = '30% 60%',
}: {
  children: ReactNode
  blobs?: Blob[]
  pad?: string
  vignetteAt?: string
}) {
  return (
    <Slide background={C.bg}>
      <style>{`@keyframes pc-drift {
        0% { transform: translate3d(0,0,0) scale(1); }
        50% { transform: translate3d(-40px,30px,0) scale(1.06); }
        100% { transform: translate3d(0,0,0) scale(1); }
      }`}</style>
      <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', animation: 'pc-drift 18s ease-in-out infinite' }}>
        {blobs.map((b, i) => (
          <div key={i} style={blobStyle(b)} />
        ))}
      </div>
      <div style={{ position: 'absolute', inset: 0, background: `radial-gradient(120% 90% at ${vignetteAt}, transparent 40%, rgba(7,7,9,0.55) 100%)` }} />
      <div style={{ position: 'absolute', inset: 0, backgroundImage: GRAIN, opacity: 0.14, mixBlendMode: 'overlay', pointerEvents: 'none' }} />
      <div style={{ position: 'relative', height: '100%', display: 'flex', flexDirection: 'column', padding: pad }}>
        {children}
      </div>
    </Slide>
  )
}

/** Magazine masthead row with a hairline under it. */
export function Masthead({ right, n }: { right?: string; n?: string }) {
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingBottom: 26,
        borderBottom: `1px solid ${C.line}`,
        fontFamily: F.body,
        fontSize: 21,
        letterSpacing: 6,
        textTransform: 'uppercase',
        color: 'rgba(235,236,245,0.85)',
        fontWeight: 600,
      }}
    >
      <span>Pagecast{n ? <span style={{ color: C.ink3, fontWeight: 500 }}>&nbsp;&nbsp;/&nbsp;&nbsp;{n}</span> : null}</span>
      {right ? <span style={{ color: C.ink3, fontWeight: 500 }}>{right}</span> : <span />}
    </div>
  )
}

/** Small letter-spaced section label. */
export function Kicker({ children, color }: { children: ReactNode; color?: string }) {
  return (
    <div style={{ fontFamily: F.body, fontSize: 23, letterSpacing: 7, textTransform: 'uppercase', fontWeight: 600, color: color ?? '#9aa0ff' }}>
      {children}
    </div>
  )
}

/** Gradient-filled text span. */
export function Grad({ children }: { children: ReactNode }) {
  return (
    <span style={{ background: C.grad, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
      {children}
    </span>
  )
}

export function Chip({ children }: { children: ReactNode }) {
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 13,
        padding: '16px 27px',
        borderRadius: 100,
        background: C.card,
        border: `1px solid ${C.cardLine}`,
        fontFamily: F.body,
        fontSize: 26,
        fontWeight: 500,
        color: '#e7e8f0',
      }}
    >
      <span style={{ width: 9, height: 9, borderRadius: '50%', background: C.gradSoft }} />
      {children}
    </div>
  )
}

/** Display headline. Pass size; defaults to a big editorial scale. */
export function H({ children, size = 128, style }: { children: ReactNode; size?: number; style?: CSSProperties }) {
  return (
    <h1 style={{ fontFamily: F.display, fontSize: size, lineHeight: 0.98, letterSpacing: '-0.025em', fontWeight: 530, margin: 0, color: C.ink, ...style }}>
      {children}
    </h1>
  )
}

export function Lede({ children, style }: { children: ReactNode; style?: CSSProperties }) {
  return (
    <p style={{ fontFamily: F.body, fontSize: 37, lineHeight: 1.5, color: C.ink2, margin: 0, maxWidth: 1100, fontWeight: 400, ...style }}>
      {children}
    </p>
  )
}
