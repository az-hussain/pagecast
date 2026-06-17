import { Scene, Masthead, Kicker, H, C, F } from '../kit'

export const meta = { title: 'Charts, not clip-art', tags: ['capability', 'data'] }
export const notes = 'Capability proof: a hand-rolled SVG area chart with gradient fill, smooth curve, and a peak callout. No chart library.'

const data = [
  { m: 'Jan', v: 18 },
  { m: 'Feb', v: 31 },
  { m: 'Mar', v: 27 },
  { m: 'Apr', v: 49 },
  { m: 'May', v: 63 },
  { m: 'Jun', v: 58 },
  { m: 'Jul', v: 86 },
]

const W = 1640
const Hh = 520
const padT = 40
const padB = 64
const max = 100

const x = (i: number) => (i * W) / (data.length - 1)
const y = (v: number) => padT + (1 - v / max) * (Hh - padT - padB)
const pts = data.map((d, i) => [x(i), y(d.v)] as [number, number])

function smooth(p: [number, number][]) {
  let d = `M ${p[0][0]} ${p[0][1]}`
  for (let i = 0; i < p.length - 1; i++) {
    const p0 = p[i - 1] || p[i]
    const p1 = p[i]
    const p2 = p[i + 1]
    const p3 = p[i + 2] || p[i + 1]
    const c1x = p1[0] + (p2[0] - p0[0]) / 6
    const c1y = p1[1] + (p2[1] - p0[1]) / 6
    const c2x = p2[0] - (p3[0] - p1[0]) / 6
    const c2y = p2[1] - (p3[1] - p1[1]) / 6
    d += ` C ${c1x} ${c1y}, ${c2x} ${c2y}, ${p2[0]} ${p2[1]}`
  }
  return d
}

const line = smooth(pts)
const area = `${line} L ${W} ${Hh - padB} L 0 ${Hh - padB} Z`

export default function Charts() {
  return (
    <Scene blobs={[['86% 6%', 900, C.violet], ['96% 50%', 760, C.amber], ['80% 20%', 420, C.glow]]}>
      <Masthead n="04" right="Made with code" />
      <Kicker>For example</Kicker>
      <H size={104} style={{ marginTop: 26 }}>
        Charts, not clip-art.
      </H>

      <div style={{ flex: 1, display: 'flex', alignItems: 'center', marginTop: 8 }}>
        <svg width="100%" viewBox={`0 0 ${W} ${Hh}`} style={{ overflow: 'visible' }}>
          <defs>
            <linearGradient id="fill" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#8e93ff" stopOpacity="0.45" />
              <stop offset="100%" stopColor="#8e93ff" stopOpacity="0" />
            </linearGradient>
            <linearGradient id="stroke" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#aeb4ff" />
              <stop offset="60%" stopColor="#cf9bff" />
              <stop offset="100%" stopColor="#ffb48c" />
            </linearGradient>
          </defs>

          {/* gridlines */}
          {[0, 25, 50, 75, 100].map((g) => (
            <line key={g} x1="0" x2={W} y1={y(g)} y2={y(g)} stroke="rgba(255,255,255,0.07)" strokeWidth="1" />
          ))}

          <path d={area} fill="url(#fill)" />
          <path d={line} fill="none" stroke="url(#stroke)" strokeWidth="6" strokeLinecap="round" />

          {pts.map(([px, py], i) => (
            <circle key={i} cx={px} cy={py} r="8" fill="#0a0a10" stroke="#cf9bff" strokeWidth="4" />
          ))}

          {/* peak callout */}
          <g transform={`translate(${pts[6][0] - 150}, ${pts[6][1] - 96})`}>
            <rect width="170" height="62" rx="14" fill="rgba(255,255,255,0.06)" stroke="rgba(255,255,255,0.14)" />
            <text x="24" y="40" fontFamily="Fraunces, serif" fontSize="38" fill="#fff" fontWeight="600">+86%</text>
          </g>

          {/* month labels */}
          {data.map((d, i) => (
            <text key={d.m} x={x(i)} y={Hh - 18} fontFamily="Hanken Grotesk, sans-serif" fontSize="26" fill={C.ink3} textAnchor="middle">
              {d.m}
            </text>
          ))}
        </svg>
      </div>
    </Scene>
  )
}
