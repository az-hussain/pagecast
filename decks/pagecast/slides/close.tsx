import { Scene, Masthead, H, Grad, Lede, C, F } from '../kit'

export const meta = { title: 'Start with a sentence', tags: ['close', 'cta'] }
export const notes = 'Close that mirrors the cover. The repo handle is the call to action.'

export default function Close() {
  return (
    <Scene blobs={[['50% -6%', 1240, C.violet], ['78% 80%', 820, C.amber], ['24% 70%', 640, C.indigo], ['60% 24%', 440, C.glow]]} vignetteAt="50% 50%">
      <Masthead n="08" right="Your turn" />
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', textAlign: 'center' }}>
        <H size={150} style={{ letterSpacing: '-0.03em' }}>
          Start with
          <br />
          <Grad>a sentence.</Grad>
        </H>
        <Lede style={{ marginTop: 44, maxWidth: 1000, fontSize: 40, textAlign: 'center' }}>
          Describe your next deck and watch it design itself.
        </Lede>
        <div
          style={{
            marginTop: 56,
            display: 'flex',
            alignItems: 'center',
            gap: 16,
            padding: '20px 34px',
            borderRadius: 100,
            background: 'rgba(255,255,255,0.05)',
            border: '1px solid rgba(255,255,255,0.16)',
            fontFamily: F.mono,
            fontSize: 30,
            color: '#e7e8f0',
          }}
        >
          <span style={{ width: 10, height: 10, borderRadius: '50%', background: C.gradSoft }} />
          github.com/az-hussain/pagecast
        </div>
      </div>
    </Scene>
  )
}
