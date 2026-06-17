import { Scene, Masthead, Kicker, H, Grad, Lede, C, F } from '../kit'

export const meta = { title: 'The new way', tags: ['idea'] }
export const notes = 'The reframe: a slide is a web page, so it can be anything. The tiles prove range — type, data, gradient, motion.'

function Tile({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div
      style={{
        flex: 1,
        height: 260,
        borderRadius: 20,
        background: C.card,
        border: `1px solid ${C.cardLine}`,
        overflow: 'hidden',
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <div style={{ flex: 1, display: 'grid', placeItems: 'center' }}>{children}</div>
      <div style={{ fontFamily: F.body, fontSize: 22, letterSpacing: 3, textTransform: 'uppercase', color: C.ink3, padding: '0 0 22px', textAlign: 'center', fontWeight: 600 }}>
        {label}
      </div>
    </div>
  )
}

export default function Idea() {
  return (
    <Scene>
      <Masthead n="03" right="The new way" />
      <div style={{ marginTop: 'auto' }}>
        <Kicker>The new way</Kicker>
        <H size={120} style={{ marginTop: 30 }}>
          If the web can do it,
          <br />
          <Grad>your slide can too.</Grad>
        </H>
        <Lede style={{ marginTop: 36, maxWidth: 1180 }}>
          Every slide is a real web page. So it can hold real typography, live charts,
          gradients, motion — anything a website can show.
        </Lede>
      </div>

      <div style={{ display: 'flex', gap: 24, marginTop: 58 }}>
        <Tile label="Typography">
          <div style={{ fontFamily: F.display, fontSize: 118, color: C.ink, lineHeight: 1 }}>
            Aa<span style={{ fontStyle: 'italic', color: '#cf9bff' }}>g</span>
          </div>
        </Tile>
        <Tile label="Live data">
          <svg width="200" height="110" viewBox="0 0 200 110">
            <polyline points="6,90 40,70 74,78 108,40 142,52 176,18 196,26" fill="none" stroke="#aeb4ff" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
            {[ [6,90],[40,70],[74,78],[108,40],[142,52],[176,18],[196,26] ].map(([x,y],i)=>(
              <circle key={i} cx={x} cy={y} r="4.5" fill="#cf9bff" />
            ))}
          </svg>
        </Tile>
        <Tile label="Gradients">
          <div style={{ width: 150, height: 150, borderRadius: 28, background: 'conic-gradient(from 200deg, #aeb4ff, #cf9bff, #ffb48c, #aeb4ff)', filter: 'blur(0.3px)' }} />
        </Tile>
        <Tile label="Motion">
          <div style={{ position: 'relative', width: 150, height: 150 }}>
            <div style={{ position: 'absolute', inset: 0, borderRadius: '50%', border: '3px solid rgba(174,180,255,0.25)' }} />
            <div style={{ position: 'absolute', inset: 0, borderRadius: '50%', borderTop: '3px solid #cf9bff', borderRight: '3px solid transparent', borderBottom: '3px solid transparent', borderLeft: '3px solid transparent', animation: 'pc-drift 6s linear infinite' }} />
            <div style={{ position: 'absolute', inset: '40% 0 0 40%', width: 20, height: 20, borderRadius: '50%', background: '#ffb48c' }} />
          </div>
        </Tile>
      </div>
    </Scene>
  )
}
