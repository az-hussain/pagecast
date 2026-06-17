import { Scene, Masthead, Kicker, H, C, F } from '../kit'

export const meta = { title: 'How it works', tags: ['how'] }
export const notes = 'Three steps, no design tools. Big gradient numerals, hairline-separated columns.'

const steps = [
  { n: '01', t: 'Describe it', d: 'Tell your AI the deck you want — the topic, the tone, the story.' },
  { n: '02', t: 'It designs', d: 'Every slide is built for you as its own web page. You watch it take shape.' },
  { n: '03', t: 'Share it', d: 'Present live, send a link anyone can open, or save a polished PDF.' },
]

export default function Steps() {
  return (
    <Scene blobs={[['50% -8%', 1200, C.indigo], ['86% 64%', 760, C.violet], ['18% 80%', 640, C.amber]]} vignetteAt="50% 50%">
      <Masthead n="05" right="How it works" />
      <Kicker>How it works</Kicker>
      <H size={106} style={{ marginTop: 26 }}>
        Three steps. No design tools.
      </H>

      <div style={{ display: 'flex', gap: 0, marginTop: 'auto' }}>
        {steps.map((s, i) => (
          <div
            key={s.n}
            style={{
              flex: 1,
              padding: '46px 54px 18px 0',
              marginRight: 54,
              borderTop: `1px solid ${C.line}`,
            }}
          >
            <div
              style={{
                fontFamily: F.display,
                fontSize: 84,
                fontWeight: 500,
                lineHeight: 1,
                background: C.grad,
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}
            >
              {s.n}
            </div>
            <div style={{ fontFamily: F.display, fontSize: 50, color: C.ink, marginTop: 24, fontWeight: 500 }}>{s.t}</div>
            <div style={{ fontFamily: F.body, fontSize: 30, lineHeight: 1.45, color: C.ink2, marginTop: 18 }}>{s.d}</div>
          </div>
        ))}
      </div>
    </Scene>
  )
}
