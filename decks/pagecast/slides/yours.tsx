import { Scene, Masthead, Kicker, H, Lede, C, F } from '../kit'

export const meta = { title: "It's yours", tags: ['ownership'] }
export const notes = 'Warm reframe of local-first — your decks are files you own, a library that grows. No "git" jargon.'

// A neat stack of slide thumbnails suggesting a personal library — drawn back
// to front, each peeking behind the next. No text, so nothing collides.
function CardStack() {
  const cards = [
    { x: 150, y: 26, rot: 6, o: 0.4, g: 'from 160deg, #6b6f9e, #8a6fae' },
    { x: 76, y: 78, rot: -2, o: 0.68, g: 'from 200deg, #8e7fd6, #c08bff' },
    { x: 0, y: 132, rot: 3, o: 1, g: 'from 140deg, #aeb4ff, #cf9bff, #ffb48c, #aeb4ff' },
  ]
  return (
    <div style={{ position: 'relative', width: 600, height: 470 }}>
      {cards.map((c, i) => (
        <div
          key={i}
          style={{
            position: 'absolute',
            left: c.x,
            top: c.y,
            width: 420,
            height: 280,
            borderRadius: 22,
            transform: `rotate(${c.rot}deg)`,
            background: 'linear-gradient(150deg, rgba(38,37,58,0.96), rgba(16,16,24,0.96))',
            border: '1px solid rgba(255,255,255,0.12)',
            boxShadow: '0 40px 90px rgba(0,0,0,0.5)',
            opacity: c.o,
            padding: 34,
            overflow: 'hidden',
          }}
        >
          <div style={{ width: 120, height: 120, borderRadius: 16, background: `conic-gradient(${c.g})`, position: 'absolute', right: -16, top: -16, filter: 'blur(1px)' }} />
          <div style={{ position: 'absolute', left: 34, bottom: 40, width: 230, height: 13, borderRadius: 6, background: 'rgba(255,255,255,0.20)' }} />
          <div style={{ position: 'absolute', left: 34, bottom: 16, width: 160, height: 11, borderRadius: 6, background: 'rgba(255,255,255,0.11)' }} />
        </div>
      ))}
    </div>
  )
}

export default function Yours() {
  return (
    <Scene blobs={[['18% 22%', 980, C.indigo], ['30% 86%', 640, C.violet]]} vignetteAt="65% 50%">
      <Masthead n="07" right="And it's yours" />
      <div style={{ flex: 1, display: 'flex', alignItems: 'center', gap: 40 }}>
        <div style={{ flex: 1 }}>
          <Kicker>And it's yours</Kicker>
          <H size={112} style={{ marginTop: 30 }}>
            Your decks
            <br />
            live with you.
          </H>
          <Lede style={{ marginTop: 36, maxWidth: 880 }}>
            Every slide is just a file on your computer — private by default, yours to keep.
            Reuse last quarter's slide, or grow a library that's truly your own.
          </Lede>
        </div>
        <CardStack />
      </div>
    </Scene>
  )
}
