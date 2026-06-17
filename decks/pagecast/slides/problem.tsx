import { Scene, Masthead, Kicker, H, Lede, C, F } from '../kit'

export const meta = { title: 'The old way', tags: ['problem'] }
export const notes = 'The contrast slide — cooler, dimmer aurora to feel like the colder "old way". The dull template thumbnails visualize sameness.'

// A muted, generic "template" thumbnail — deliberately boring.
function Template() {
  return (
    <div
      style={{
        width: 360,
        height: 220,
        borderRadius: 14,
        background: 'rgba(255,255,255,0.03)',
        border: '1px solid rgba(255,255,255,0.07)',
        padding: 28,
        display: 'flex',
        flexDirection: 'column',
        gap: 14,
        filter: 'saturate(0.2)',
      }}
    >
      <div style={{ width: '62%', height: 16, borderRadius: 6, background: 'rgba(255,255,255,0.16)' }} />
      <div style={{ width: '90%', height: 9, borderRadius: 5, background: 'rgba(255,255,255,0.08)' }} />
      <div style={{ width: '78%', height: 9, borderRadius: 5, background: 'rgba(255,255,255,0.08)' }} />
      <div style={{ marginTop: 'auto', display: 'flex', gap: 10 }}>
        <div style={{ width: 70, height: 70, borderRadius: 8, background: 'rgba(255,255,255,0.06)' }} />
        <div style={{ width: 70, height: 70, borderRadius: 8, background: 'rgba(255,255,255,0.06)' }} />
        <div style={{ width: 70, height: 70, borderRadius: 8, background: 'rgba(255,255,255,0.06)' }} />
      </div>
    </div>
  )
}

export default function Problem() {
  return (
    <Scene
      blobs={[
        ['12% 18%', 900, 'rgba(108,118,255,0.30)'],
        ['8% 70%', 700, 'rgba(120,120,150,0.18)'],
      ]}
      vignetteAt="70% 40%"
    >
      <Masthead n="02" right="The old way" />
      <div style={{ marginTop: 'auto' }}>
        <Kicker color={C.ink3}>For twenty years</Kicker>
        <H size={118} style={{ marginTop: 30 }}>
          The same template
          <br />
          as everyone else.
        </H>
        <Lede style={{ marginTop: 36 }}>
          Slide software still hands you a theme and a grid of boxes to fill in. Your
          ideas deserve more than a dropdown menu.
        </Lede>
      </div>
      <div style={{ display: 'flex', gap: 28, marginTop: 64, opacity: 0.9 }}>
        <Template />
        <Template />
        <Template />
      </div>
    </Scene>
  )
}
