import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { ROADMAPS, PRODUCTS, type ProductKey, type RoadmapStepV2 } from '../data/home'
import { WelcomeRow, ProductPicker, SimSideCard, GlyphIcon } from './blocks'
import { GlobalStatsWidget } from './Widgets'
import { ShieldHeart, ArrowRight } from '../components/icons'
import { IcChevronDown } from '../components/navicons'

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
      <WelcomeRow title="Welcome, Natalie" subtitle="Pick a product. Your roadmap reshapes around it." />

      <ProductPicker value={product} onChange={onProduct} />

      <div
        className="cols"
        style={{ gridTemplateColumns: 'minmax(0, 1.15fr) minmax(0, 0.85fr)', gap: 20, marginTop: 22, alignItems: 'start' }}
      >
        {/* roadmap */}
        <div className="card card-pad">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 4 }}>
            <h2 style={{ fontSize: 15.5, fontWeight: 700 }}>Your {label.toLowerCase()} roadmap</h2>
            <span className="badge" style={{ fontSize: 11 }}>{steps.length} steps</span>
          </div>
          <p className="faint" style={{ fontSize: 12.5, marginBottom: 10 }}>
            Click a step to see what it unlocks.
          </p>
          <AnimatePresence mode="popLayout">
            {steps.map((s, i) => (
              <motion.div
                key={`${product}-${s.key}`}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.25, delay: i * 0.04 }}
              >
                <StepItem step={s} open={open === s.key} onToggle={() => setOpen(s.key)} onWatch={onWatch} />
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {/* persistent sim + proof */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <SimSideCard onWatch={onWatch} />
          <GlobalStatsWidget />
        </div>
      </div>
    </div>
  )
}

function StepItem({
  step,
  open,
  onToggle,
  onWatch,
}: {
  step: RoadmapStepV2
  open: boolean
  onToggle: () => void
  onWatch: () => void
}) {
  return (
    <div
      className={`road-step ${open ? 'active' : ''}`}
      onClick={onToggle}
      style={{ flexDirection: 'column', gap: 0, padding: '11px 12px' }}
    >
      <div style={{ display: 'flex', gap: 12, alignItems: 'center', width: '100%' }}>
        <span className="road-node"><GlyphIcon icon={step.icon} size={15} /></span>
        <span style={{ fontSize: 13.5, fontWeight: 650, flex: 1, minWidth: 0 }}>{step.title}</span>
        {step.sim && <span className="badge green" style={{ fontSize: 9.5 }}>start here</span>}
        <span style={{ color: 'var(--text-3)', transform: open ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }}>
          <IcChevronDown size={15} />
        </span>
      </div>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
            style={{ overflow: 'hidden', width: '100%' }}
          >
            <div style={{ padding: '7px 0 4px 42px' }}>
              <div className="muted" style={{ fontSize: 12.5, lineHeight: 1.45 }}>{step.blurb}</div>
              <button
                className={step.sim ? 'btn sm' : 'btn default sm'}
                style={{ marginTop: 9 }}
                onClick={(e) => {
                  e.stopPropagation()
                  if (step.sim) onWatch()
                }}
              >
                {step.sim && <ShieldHeart size={13} />}
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
