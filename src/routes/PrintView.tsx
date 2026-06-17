import { Suspense, lazy, useEffect, useMemo } from 'react'
import { useParams } from 'react-router-dom'
import { getDeck } from '@/lib/decks'
import { getSlide } from '@/lib/slides'
import { PrintModeProvider, Slide, SlideErrorBoundary } from '@/components/Slide'

/**
 * Renders every slide in a deck at native 1920x1080 stacked vertically with
 * page-break-after between them. Used by Playwright PDF export, but also
 * navigable directly via /print/<name>.
 *
 * Sets window.__SLIDES_READY = true once every slide module has settled, so
 * Playwright knows when to print.
 */
export function PrintView() {
  const { name = '' } = useParams()
  const deck = getDeck(name)

  const items = useMemo(() => {
    if (!deck) return []
    return deck.slides.map((path) => {
      const rec = getSlide(path)
      const Lazy = rec ? lazy(() => rec.load().then((m) => ({ default: m.default }))) : null
      return { path, Lazy }
    })
  }, [deck])

  useEffect(() => {
    if (!deck) return
    let cancelled = false
    Promise.all(
      deck.slides.map((path) =>
        getSlide(path)?.load().catch((e) => console.error('print: load failed', path, e)),
      ),
    )
      .then(() => (document.fonts?.ready ?? Promise.resolve()))
      .then(() => {
        if (cancelled) return
        requestAnimationFrame(() =>
          requestAnimationFrame(() => {
            ;(window as unknown as { __SLIDES_READY: boolean }).__SLIDES_READY = true
          }),
        )
      })
    return () => { cancelled = true }
  }, [deck])

  if (!deck) return <div style={{ padding: 40 }}>Deck not found: {name}</div>

  return (
    <PrintModeProvider>
      <div className="print-root" style={{ background: 'white' }}>
        {items.map((it, i) => (
          <div className="print-page" key={i}>
            <SlideErrorBoundary name={it.path}>
              <Suspense
                fallback={
                  <Slide>
                    <div style={{ padding: 80, opacity: 0.4 }}>Loading…</div>
                  </Slide>
                }
              >
                {it.Lazy ? (
                  <it.Lazy />
                ) : (
                  <Slide background="#3a1212">
                    <div style={{ padding: 80, fontSize: 32 }}>Missing slide: {it.path}</div>
                  </Slide>
                )}
              </Suspense>
            </SlideErrorBoundary>
          </div>
        ))}
      </div>
    </PrintModeProvider>
  )
}
