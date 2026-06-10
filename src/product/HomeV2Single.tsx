import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { ROADMAPS, PRODUCTS, type ProductKey, type RoadmapStepV2 } from '../data/home'
import { WelcomeRow, ProductPicker, SimHero, QuietLinks, GlyphIcon } from './blocks'
import { ArrowRight } from '../components/icons'
import { IcChevronDown } from '../components/navicons'

/* per-step accent colors, echoing the "Connect your app" widgets */
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
  const steps = ROADMAPS[product]
  const label = PRODUCTS.find((p) => p.key === product)!.label
  const [open, setOpen] = useState(steps[0].key)
  useEffect(() => setOpen(ROADMAPS[product][0].key), [product])

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
        <div className="card">
          <div className="card-head">
            <div className="card-title">Your {label.toLowerCase()} roadmap</div>
            <span className="badge" style={{ fontSize: 11 }}>{steps.length} steps</span>
          </div>
          <div className="card-pad" style={{ display: 'flex', flexDirection: 'column', gap: 9, paddingTop: 14 }}>
            <AnimatePresence mode="popLayout">
              {steps.map((s, i) => (
                <motion.div
                  key={`${product}-${s.key}`}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.25, delay: i * 0.04 }}
                >
                  <StepRow
                    step={s}
                    color={STEP_COLORS[i % STEP_COLORS.length]}
                    open={open === s.key}
                    onToggle={() => setOpen(open === s.key ? '' : s.key)}
                    onWatch={onWatch}
                  />
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </div>

        <QuietLinks />
      </div>
    </div>
  )
}

function StepRow({
  step,
  color,
  open,
  onToggle,
  onWatch,
}: {
  step: RoadmapStepV2
  color: string
  open: boolean
  onToggle: () => void
  onWatch: () => void
}) {
  return (
    <div
      className="setup-row"
      onClick={onToggle}
      style={{
        flexDirection: 'column',
        alignItems: 'stretch',
        gap: 0,
        cursor: 'pointer',
        borderColor: open ? color : undefined,
        transform: 'none',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 13, width: '100%' }}>
        <span className="setup-ic" style={{ background: color }}>
          <GlyphIcon icon={step.icon} size={19} />
        </span>
        <span className="body">
          <span className="t">{step.title}</span>
          <span className="d">{step.blurb}</span>
        </span>
        <span
          style={{
            color: 'var(--text-3)',
            flex: '0 0 auto',
            transform: open ? 'rotate(180deg)' : 'none',
            transition: 'transform 0.2s',
          }}
        >
          <IcChevronDown size={16} />
        </span>
      </div>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
            style={{ overflow: 'hidden' }}
          >
            <div style={{ padding: '10px 2px 4px 51px' }}>
              <div className="muted" style={{ fontSize: 12.5, lineHeight: 1.5, maxWidth: 520 }}>{step.learn.what}</div>
              <button
                className="btn sm"
                style={{ marginTop: 10, background: color }}
                onClick={(e) => {
                  e.stopPropagation()
                  if (step.sim) onWatch()
                }}
              >
                {step.cta}
                <ArrowRight size={12} />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
