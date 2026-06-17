import { Scene, Masthead, Kicker, H, Grad, Lede, C, F } from '../kit'

export const meta = { title: 'Share it', tags: ['share'] }
export const notes = 'Friendly take on publishing — a glowing share-link bar + a PDF option. No .pages.dev jargon.'

export default function Share() {
  return (
    <Scene blobs={[['24% 16%', 980, C.indigo], ['80% 78%', 840, C.amber], ['40% 40%', 420, C.glow]]} vignetteAt="50% 45%">
      <Masthead n="06" right="When it's ready" />
      <div style={{ marginTop: 'auto' }}>
        <Kicker>When it's ready</Kicker>
        <H size={120} style={{ marginTop: 30 }}>
          Send a link. <Grad>Or a PDF.</Grad>
        </H>
        <Lede style={{ marginTop: 36, maxWidth: 1120 }}>
          One step turns your deck into a page anyone can open in their browser — no app to
          install, no account to make, no sign-in.
        </Lede>
      </div>

      {/* glowing share-link bar */}
      <div style={{ marginTop: 64, display: 'flex', alignItems: 'center', gap: 22 }}>
        <div
          style={{
            flex: 1,
            maxWidth: 1080,
            display: 'flex',
            alignItems: 'center',
            gap: 22,
            padding: '26px 30px',
            borderRadius: 20,
            background: 'rgba(255,255,255,0.05)',
            border: '1px solid rgba(255,255,255,0.14)',
            boxShadow: '0 0 80px rgba(176,110,255,0.18)',
          }}
        >
          <div style={{ width: 46, height: 46, borderRadius: 12, background: C.gradSoft, display: 'grid', placeItems: 'center', flex: '0 0 auto' }}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#0a0a10" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
              <path d="M10 13a5 5 0 0 0 7 0l3-3a5 5 0 0 0-7-7l-1 1" />
              <path d="M14 11a5 5 0 0 0-7 0l-3 3a5 5 0 0 0 7 7l1-1" />
            </svg>
          </div>
          <div style={{ fontFamily: F.mono, fontSize: 30, color: '#dfe1ea' }}>
            yourname<span style={{ color: C.ink3 }}>/q3-review</span>
          </div>
          <div
            style={{
              marginLeft: 'auto',
              padding: '14px 28px',
              borderRadius: 12,
              background: C.grad,
              color: '#0a0a10',
              fontFamily: F.body,
              fontWeight: 700,
              fontSize: 26,
            }}
          >
            Copy link
          </div>
        </div>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 14,
            padding: '24px 30px',
            borderRadius: 20,
            background: 'rgba(255,255,255,0.05)',
            border: '1px solid rgba(255,255,255,0.14)',
            fontFamily: F.body,
            fontSize: 28,
            color: '#e7e8f0',
          }}
        >
          <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#ffb48c" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M14 3v5h5" />
            <path d="M7 3h7l5 5v11a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1z" />
          </svg>
          Save PDF
        </div>
      </div>
    </Scene>
  )
}
