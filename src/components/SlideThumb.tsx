import { Suspense, lazy, useMemo } from 'react'
import type { SlideRecord } from '@/lib/types'
import { Slide, SlideErrorBoundary } from './Slide'

export function SlideThumb({ slide }: { slide: SlideRecord }) {
  const Lazy = useMemo(
    () => lazy(() => slide.load().then((m) => ({ default: m.default }))),
    [slide.path],
  )
  return (
    <SlideErrorBoundary name={slide.path}>
      <Suspense
        fallback={
          <Slide background="#15171d">
            <div style={{ padding: 80, opacity: 0.4, fontSize: 28 }}>Loading…</div>
          </Slide>
        }
      >
        <Lazy />
      </Suspense>
    </SlideErrorBoundary>
  )
}
