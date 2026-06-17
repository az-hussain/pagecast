import { Scene, Masthead, H, Grad, Lede, Chip } from '../kit'

export const meta = { title: 'Cover', tags: ['intro', 'cover'] }

export const notes =
  'Editorial-luxe cover: oversized Fraunces with an italic accent, drifting aurora, film grain. Warm and jargon-free.'

export default function Cover() {
  return (
    <Scene>
      <Masthead right="A new kind of deck" />
      <div style={{ marginTop: 'auto' }}>
        <H size={132}>
          <span style={{ fontStyle: 'italic', fontWeight: 400 }}>Beautiful</span> presentations,
          <br />
          <Grad>built by your AI.</Grad>
        </H>
        <Lede style={{ marginTop: 40, maxWidth: 1080, fontSize: 38 }}>
          Just describe what you want. Every slide is designed for you — then present it,
          share it with a link, or save a PDF.
        </Lede>
        <div style={{ display: 'flex', gap: 18, marginTop: 56 }}>
          {['Present live', 'Share a link', 'Save a PDF'].map((c) => (
            <Chip key={c}>{c}</Chip>
          ))}
        </div>
      </div>
    </Scene>
  )
}
