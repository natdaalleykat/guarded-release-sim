import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { ROADMAPS, PRODUCTS, type ProductKey, type RoadmapStepV2 } from '../data/home'
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
}: {
  product: ProductKey
  onProduct: (k: ProductKey) => void
  onWatch: () => void
}) {
  return (
    <div className="content-inner">
      <WelcomeRow title="Welcome, Natalie" subtitle="See the point first. Setup can wait." />

      {/* value-first hero, straight from direction A */}
      <SimHero onWatch={onWatch} />

      {/* the capability strip, reframed as a low-commitment product picker */}
      <div style={{ margin: '28px 0 0' }}>
        <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', gap: 12, marginBottom: 12 }}>
          <h2 style={{ fontSize: 15, fontWeight: 700 }}>A platform, not just flags. What do you want to try first?</h2>
          <span className="faint" style={{ fontSize: 12.5 }}>just a starting point, change anytime</span>
        </div>
        <ProductPicker value={product} onChange={onProduct} />
      </div>

      {/* roadmap left (visual focus), quiet panel right */}
      <div
        className="cols"
        style={{ gridTemplateColumns: 'minmax(0, 1.5fr) minmax(0, 1fr)', gap: 18, marginTop: 20, alignItems: 'start' }}
      >
        <RoadmapV2Checklist product={product} onWatch={onWatch} />
        <QuietLinks />
      </div>
    </div>
  )
}

/* Visually identical to direction B's roadmap pane, except the step icons
   are filled with color, flipping to a green checkmark when completed.
   Clicking a step expands it to reveal its CTA; the CTA completes it. */
function RoadmapV2Checklist({ product, onWatch }: { product: ProductKey; onWatch: () => void }) {
  const steps = ROADMAPS[product]
  const label = PRODUCTS.find((p) => p.key === product)!.label
  const [done, setDone] = useState<Record<string, boolean>>({})
  const [open, setOpen] = useState(steps[0].key)
  useEffect(() => {
    setDone({})
    setOpen(ROADMAPS[product][0].key)
  }, [product])

  const doneCount = steps.filter((s) => done[s.key]).length

  const complete = (s: RoadmapStepV2) => {
    if (s.sim) onWatch()
    setDone((d) => {
      const next = { ...d, [s.key]: true }
      const nextOpen = steps.find((x) => !next[x.key])?.key ?? ''
      setOpen(nextOpen)
      return next
    })
  }

  return (
    <div className="card card-pad">
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 6 }}>
        <h2 style={{ fontSize: 15.5, fontWeight: 700 }}>Your {label.toLowerCase()} roadmap</h2>
        <span className="badge blue" style={{ fontSize: 11 }}>{doneCount}/{steps.length}</span>
      </div>
      <p className="faint" style={{ fontSize: 12.5, marginBottom: 12 }}>Value first. Setup when you are ready.</p>
      <div className="road-progress-track" style={{ marginBottom: 8 }}>
        <div className="road-progress-fill" style={{ width: `${(doneCount / steps.length) * 100}%` }} />
      </div>

      <div className="road">
        <AnimatePresence mode="popLayout">
          {steps.map((s, i) => {
            const isDone = !!done[s.key]
            const isOpen = s.key === open
            const color = STEP_COLORS[i % STEP_COLORS.length]
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
                  {i < steps.length - 1 && <span className="road-line" />}
                  <span
                    className="road-node"
                    style={isDone ? undefined : { background: color, borderColor: color, color: '#fff' }}
                  >
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
          })}
        </AnimatePresence>
      </div>
    </div>
  )
}
