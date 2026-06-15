import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import {
  ROADMAPS,
  ROADMAPS_UNIFIED,
  PRODUCTS,
  PRODUCTS_UNIFIED,
  type ProductKey,
  type RoadmapStepV2,
} from '../data/home'
import { DsWelcomeRow, DsSimHero, DsProductPicker, DsIcon, DsButton, LpIcon } from './dsblocks'

export function HomeDSSplit({
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
  const roadmaps = unified ? ROADMAPS_UNIFIED : ROADMAPS
  const products = unified ? PRODUCTS_UNIFIED : PRODUCTS
  const activeProduct = unified && product === 'guarded' ? 'flags' : product
  const steps = roadmaps[activeProduct]
  const required = steps.filter((s) => !s.optional)
  const optional = steps.filter((s) => s.optional)
  const def = products.find((p) => p.key === activeProduct)!
  const [sel, setSel] = useState(steps[0].key)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => setSel(roadmaps[activeProduct][0].key), [activeProduct, unified])

  const idx = Math.max(0, steps.findIndex((s) => s.key === sel))
  const step = steps[idx]
  const reqIdx = required.findIndex((s) => s.key === sel)

  const listRow = (s: RoadmapStepV2, i: number, isOptional: boolean) => (
    <div
      key={`${activeProduct}-${s.key}`}
      className={`ds-step ${sel === s.key ? 'active' : ''}`}
      onClick={() => setSel(s.key)}
    >
      <span className="ds-node">{isOptional ? '+' : i + 1}</span>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--lp-spacing-300)' }}>
          <span style={{ fontSize: 'var(--lp-font-size-200)', fontWeight: 'var(--lp-font-weight-semibold)' }}>{s.title}</span>
          {s.sim && <span className="ds-chip success" style={{ fontSize: 10 }}>start here</span>}
        </div>
        <div className="ds-muted" style={{ fontSize: 'var(--lp-font-size-100)', marginTop: 2 }}>{s.blurb}</div>
      </div>
      <span style={{ color: sel === s.key ? 'var(--lp-color-fill-interactive-primary)' : 'var(--lp-color-fill-ui-secondary)' }}>
        <LpIcon name="chevron-right" size={16} />
      </span>
    </div>
  )

  return (
    <div className="content-inner ds-scope">
      <DsWelcomeRow title="Welcome, Natalie" subtitle="See the point first. Then walk the path, one step at a time." />

      <DsSimHero onWatch={onWatch} />

      <div style={{ margin: 'var(--lp-spacing-800) 0 var(--lp-spacing-400)' }}>
        <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', gap: 12, marginBottom: 'var(--lp-spacing-400)' }}>
          <h2 className="ds-display" style={{ fontSize: 'var(--lp-font-size-400)' }}>
            {unified ? 'One platform. What do you want to try first?' : 'What do you want to try first?'}
          </h2>
          <span className="ds-muted" style={{ fontSize: 'var(--lp-font-size-200)' }}>just a starting point, change anytime</span>
        </div>
        <DsProductPicker value={activeProduct} onChange={onProduct} products={products} />
      </div>

      <div
        className="cols"
        style={{ gridTemplateColumns: 'minmax(0, 360px) minmax(0, 1fr)', gap: 'var(--lp-spacing-600)', marginTop: 'var(--lp-spacing-700)', alignItems: 'start' }}
      >
        {/* roadmap list */}
        <div className="ds-card" style={{ padding: 'var(--lp-spacing-300)' }}>
          {required.map((s, i) => listRow(s, i, false))}
          {optional.length > 0 && (
            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--lp-spacing-300)', padding: 'var(--lp-spacing-400) var(--lp-spacing-400) var(--lp-spacing-200)' }}>
              <span className="ds-section-label" style={{ whiteSpace: 'nowrap' }}>Nice to have</span>
              <span className="ds-hairline" />
            </div>
          )}
          {optional.map((s, i) => listRow(s, i, true))}
        </div>

        {/* learning pane */}
        <motion.div
          key={`${activeProduct}-${sel}`}
          className="ds-card ds-card-pad"
          initial={{ opacity: 0, x: 10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
          style={{ minHeight: 320 }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--lp-spacing-400)', marginBottom: 'var(--lp-spacing-400)' }}>
            <span className="ds-step-ic" style={{ background: def.color }}>
              <DsIcon glyph={step.icon} size={19} />
            </span>
            <div>
              <div className="ds-section-label">
                {step.optional ? `Nice to have · ${def.label}` : `Step ${reqIdx + 1} of ${required.length} · ${def.label}`}
              </div>
              <h2 className="ds-display" style={{ fontSize: 'var(--lp-font-size-400)', marginTop: 2 }}>{step.title}</h2>
            </div>
          </div>

          <p className="ds-muted" style={{ fontSize: 'var(--lp-font-size-300)', lineHeight: 1.55, maxWidth: 560 }}>{step.learn.what}</p>

          <div style={{ marginTop: 'var(--lp-spacing-600)' }}>
            <div className="ds-section-label" style={{ marginBottom: 'var(--lp-spacing-300)' }}>Ways teams do this</div>
            <div style={{ display: 'flex', gap: 'var(--lp-spacing-300)', flexWrap: 'wrap' }}>
              {step.learn.ideas.map((idea) => (
                <span key={idea} className="ds-chip">{idea}</span>
              ))}
            </div>
          </div>

          <div style={{ marginTop: 'var(--lp-spacing-700)', display: 'flex', alignItems: 'center', gap: 'var(--lp-spacing-400)' }}>
            <DsButton variant={step.sim ? 'primary' : 'default'} onClick={step.sim ? onWatch : undefined}>
              {step.sim && <LpIcon name="shield-heart" size={16} />}
              {step.cta}
              <LpIcon name="arrow-right-thin" size={16} />
            </DsButton>
            {!step.sim && (
              <span className="ds-muted" style={{ fontSize: 'var(--lp-font-size-100)' }}>opens the {def.label.toLowerCase()} setup in the real product</span>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  )
}
