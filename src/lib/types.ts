import type { ComponentType } from 'react'

export interface SlideMeta {
  title?: string
  tags?: string[]
  caption?: string
}

export interface SlideModule {
  default: ComponentType
  meta?: SlideMeta
  notes?: string
}

export interface SlideRecord {
  /** Path from project root, e.g. "slides/shared/intro/title.tsx" */
  path: string
  /** "shared" or "<deck-name>" (for deck-local) */
  scope: 'shared' | string
  /** Relative within scope, e.g. "intro/title" (no extension) */
  name: string
  load: () => Promise<SlideModule>
}

export interface Deck {
  name: string
  manifestPath: string
  title: string
  description?: string
  author?: string
  createdAt?: string
  slides: string[]
}
