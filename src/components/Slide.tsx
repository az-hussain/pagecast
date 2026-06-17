import {
  Component,
  createContext,
  type ReactNode,
  useContext,
  useLayoutEffect,
  useRef,
  useState,
} from 'react'

export const SLIDE_W = 1920
export const SLIDE_H = 1080

const PrintModeContext = createContext(false)

export function PrintModeProvider({ children }: { children: ReactNode }) {
  return <PrintModeContext.Provider value={true}>{children}</PrintModeContext.Provider>
}

interface Props {
  children: ReactNode
  background?: string
  /** Fit to parent (default). Ignored when rendered inside <PrintModeProvider>. */
  fit?: boolean
}

export function Slide({ children, background = '#0b0d12', fit = true }: Props) {
  const isPrint = useContext(PrintModeContext)
  const effectiveFit = isPrint ? false : fit
  const containerRef = useRef<HTMLDivElement>(null)
  const [scale, setScale] = useState(1)

  useLayoutEffect(() => {
    if (!effectiveFit) return
    const el = containerRef.current
    if (!el) return
    const parent = el.parentElement
    if (!parent) return

    const compute = () => {
      const { width, height } = parent.getBoundingClientRect()
      const s = Math.min(width / SLIDE_W, height / SLIDE_H)
      setScale(Number.isFinite(s) && s > 0 ? s : 1)
    }
    compute()
    const ro = new ResizeObserver(compute)
    ro.observe(parent)
    return () => ro.disconnect()
  }, [effectiveFit])

  const inner = (
    <div
      className="slide-canvas"
      style={{
        width: SLIDE_W,
        height: SLIDE_H,
        background,
        position: 'relative',
        overflow: 'hidden',
        color: '#e6e8ee',
        fontFamily:
          'ui-sans-serif, system-ui, -apple-system, "Segoe UI", Inter, sans-serif',
      }}
    >
      {children}
    </div>
  )

  if (!effectiveFit) return inner

  return (
    <div
      ref={containerRef}
      style={{
        width: SLIDE_W * scale,
        height: SLIDE_H * scale,
        position: 'relative',
      }}
    >
      <div
        style={{
          width: SLIDE_W,
          height: SLIDE_H,
          transform: `scale(${scale})`,
          transformOrigin: 'top left',
          position: 'absolute',
          top: 0,
          left: 0,
        }}
      >
        {inner}
      </div>
    </div>
  )
}

/** Boundary so one bad slide doesn't kill the deck. */
export function SlideErrorBoundary({ children, name }: { children: ReactNode; name: string }) {
  return <ErrorWrap name={name}>{children}</ErrorWrap>
}

class ErrorWrap extends Component<{ children: ReactNode; name: string }, { err: Error | null }> {
  state = { err: null as Error | null }
  static getDerivedStateFromError(err: Error) { return { err } }
  componentDidCatch(err: Error) { console.error('Slide error:', this.props.name, err) }
  render() {
    if (this.state.err) {
      return (
        <Slide background="#3a1212">
          <div style={{ padding: 80 }}>
            <h1 style={{ fontSize: 64, marginBottom: 24 }}>Slide error</h1>
            <p style={{ fontSize: 28, opacity: 0.8 }}>{this.props.name}</p>
            <pre style={{ marginTop: 32, fontSize: 22, whiteSpace: 'pre-wrap' }}>
              {String(this.state.err.message)}
            </pre>
          </div>
        </Slide>
      )
    }
    return this.props.children
  }
}
