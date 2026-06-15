import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import {
  ROADMAPS,
  ROADMAPS_UNIFIED,
  PRODUCTS,
  PRODUCTS_UNIFIED,
  type ProductKey,
  type RoadmapStepV2,
} from '../data/home'
import { WelcomeRow, ProductPicker, SimHero, QuietLinks, GlyphIcon } from './blocks'
import { Check, ShieldHeart, ArrowRight } from '../components/icons'

/* per-step node colors, echoing the "Connect your app" widgets */
const STEP_COLORS = [
  'rgb(66,94,255)',
  'rgb(135,23,205)',
  'rgb(0,131,68)',
  'rgb(214,122,0)',
  'rgb(8,150,180)',
]

export function HomeV2Single({
  product,
  onProduct,
  onWatch,
  unified = false,
}: {
  product: ProductKey
  onProduct: (k: ProductKey) => void
  onWatch: () => void
  unified?: boolean
}) {
  const products = unified ? PRODUCTS_UNIFIED : PRODUCTS
  // in unified mode there is no separate "guarded" tile; show it as flags
  const activeProduct = unified && product === 'guarded' ? 'flags' : product

  return (
    <div className="content-inner">
      <WelcomeRow title="Welcome, Natalie" subtitle="See the point first. Setup can wait." />

      {/* value-first hero */}
      <SimHero onWatch={onWatch} />

      {/* low-commitment product picker */}
      <div style={{ margin: '28px 0 0' }}>
        <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', gap: 12, marginBottom: 12 }}>
          <h2 style={{ fontSize: 15, fontWeight: 700 }}>
            {unified
              ? 'One platform. What do you want to try first?'
              : 'A platform, not just flags. What do you want to try first?'}
          </h2>
          <span className="faint" style={{ fontSize: 12.5 }}>just a starting point, change anytime</span>
        </div>
        <ProductPicker value={activeProduct} onChange={onProduct} products={products} />
      </div>

      {/* roadmap left (visual focus), quiet panel right */}
      <div
        className="cols"
        style={{ gridTemplateColumns: 'minmax(0, 1.5fr) minmax(0, 1fr)', gap: 18, marginTop: 20, alignItems: 'start' }}
      >
        <RoadmapV2Checklist product={activeProduct} unified={unified} onWatch={onWatch} />
        <QuietLinks />
      </div>
    </div>
  )
}

/* B's roadmap pane with color-filled nodes; required steps drive progress,
   optional "nice to have" steps render muted below a divider. */
function RoadmapV2Checklist({ product, unified, onWatch }: { product: ProductKey; unified: boolean; onWatch: () => void }) {
  const roadmaps = unified ? ROADMAPS_UNIFIED : ROADMAPS
  const productList = unified ? PRODUCTS_UNIFIED : PRODUCTS
  const steps = roadmaps[product]
  const required = steps.filter((s) => !s.optional)
  const optional = steps.filter((s) => s.optional)
  const label = productList.find((p) => p.key === product)!.label
  const [done, setDone] = useState<Record<string, boolean>>({})
  const [open, setOpen] = useState(steps[0].key)
  useEffect(() => {
    setDone({})
    setOpen(roadmaps[product][0].key)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [product, unified])

  const doneCount = required.filter((s) => done[s.key]).length

  const complete = (s: RoadmapStepV2) => {
    if (s.sim) onWatch()
    setDone((d) => {
      const next = { ...d, [s.key]: true }
      const nextOpen = steps.find((x) => !next[x.key])?.key ?? ''
      setOpen(nextOpen)
      return next
    })
  }

  const row = (s: RoadmapStepV2, i: number, group: RoadmapStepV2[]) => {
    const isDone = !!done[s.key]
    const isOpen = s.key === open
    const color = STEP_COLORS[i % STEP_COLORS.length]
    const nodeStyle = isDone
      ? undefined
      : s.optional
        ? undefined // muted: default gray outline node
        : { background: color, borderColor: color, color: '#fff' }
    return (
      <motion.div
        key={`${product}-${s.key}`}
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.25, delay: i * 0.04 }}
      >
        <div
          className={`road-step ${isDone ? 'done' : ''} ${isOpen ? 'active' : ''}`}
          onClick={() => setOpen(isOpen ? '' : s.key)}
        >
          {i < group.length - 1 && <span className="road-line" />}
          <span className="road-node" style={nodeStyle}>
            {isDone ? <Check size={15} /> : <GlyphIcon icon={s.icon} size={15} />}
          </span>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <span style={{ fontSize: 13.5, fontWeight: 650 }}>{s.title}</span>
              {s.sim && <span className="badge green" style={{ fontSize: 9.5 }}>start here</span>}
            </div>
            <div className="muted" style={{ fontSize: 12.5, marginTop: 3, lineHeight: 1.4 }}>{s.blurb}</div>
            <AnimatePresence initial={false}>
              {isOpen && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
                  style={{ overflow: 'hidden' }}
                >
                  <div className="faint" style={{ fontSize: 12, marginTop: 6, lineHeight: 1.45, maxWidth: 480 }}>
                    {s.learn.what}
                  </div>
                  <button
                    className={s.sim ? 'btn sm' : 'btn default sm'}
                    style={{ marginTop: 9 }}
                    onClick={(e) => {
                      e.stopPropagation()
                      complete(s)
                    }}
                  >
                    {s.sim && <ShieldHeart size={14} />}
                    {s.cta}
                    <ArrowRight size={13} />
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </motion.div>
    )
  }

  return (
    <div className="card card-pad">
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 6 }}>
        <h2 style={{ fontSize: 15.5, fontWeight: 700 }}>Your {label.toLowerCase()} roadmap</h2>
        <span className="badge blue" style={{ fontSize: 11 }}>{doneCount}/{required.length}</span>
      </div>
      <p className="faint" style={{ fontSize: 12.5, marginBottom: 12 }}>
        Complete these {required.length} and you are live.
      </p>
      <div className="road-progress-track" style={{ marginBottom: 8 }}>
        <div className="road-progress-fill" style={{ width: `${(doneCount / required.length) * 100}%` }} />
      </div>

      <div className="road">
        <AnimatePresence mode="popLayout">{required.map((s, i) => row(s, i, required))}</AnimatePresence>
      </div>

      {optional.length > 0 && (
        <>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, margin: '14px 0 4px' }}>
            <span className="faint" style={{ fontSize: 11, fontWeight: 600, letterSpacing: '0.06em', textTransform: 'uppercase', whiteSpace: 'nowrap' }}>
              Nice to have
            </span>
            <span className="hairline" />
          </div>
          <div className="road">
            <AnimatePresence mode="popLayout">{optional.map((s, i) => row(s, i, optional))}</AnimatePresence>
          </div>
        </>
      )}
    </div>
  )
}
