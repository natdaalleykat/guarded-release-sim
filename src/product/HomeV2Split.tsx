import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { ROADMAPS, PRODUCTS, type ProductKey, type RoadmapStepV2 } from '../data/home'
import { WelcomeRow, ProductPicker, SimHero, GlyphIcon } from './blocks'
import { ShieldHeart, ArrowRight } from '../components/icons'
import { IcChevron } from '../components/navicons'

export function HomeV2Split({
  product,
  onProduct,
  onWatch,
}: {
  product: ProductKey
  onProduct: (k: ProductKey) => void
  onWatch: () => void
}) {
  const steps = ROADMAPS[product]
  const required = steps.filter((s) => !s.optional)
  const optional = steps.filter((s) => s.optional)
  const def = PRODUCTS.find((p) => p.key === product)!
  const [sel, setSel] = useState(steps[0].key)
  useEffect(() => setSel(ROADMAPS[product][0].key), [product])

  const idx = Math.max(0, steps.findIndex((s) => s.key === sel))
  const step = steps[idx]
  const reqIdx = required.findIndex((s) => s.key === sel)

  const listRow = (s: RoadmapStepV2, i: number, isOptional: boolean) => (
    <div
      key={`${product}-${s.key}`}
      className={`road-step ${sel === s.key ? 'active' : ''}`}
      onClick={() => setSel(s.key)}
      style={{ alignItems: 'center', padding: '11px 12px' }}
    >
      <span className="road-node" style={{ fontSize: 12.5, fontWeight: 700 }}>
        {isOptional ? '+' : i + 1}
      </span>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
          <span style={{ fontSize: 13.5, fontWeight: 650 }}>{s.title}</span>
          {s.sim && <span className="badge green" style={{ fontSize: 9.5 }}>start here</span>}
        </div>
        <div className="faint" style={{ fontSize: 12, marginTop: 2 }}>{s.blurb}</div>
      </div>
      <span style={{ color: sel === s.key ? 'var(--blue)' : 'var(--text-3)' }}><IcChevron size={14} /></span>
    </div>
  )

  return (
    <div className="content-inner">
      <WelcomeRow title="Welcome, Natalie" subtitle="See the point first. Then walk the path, one step at a time." />

      {/* value-first hero */}
      <SimHero onWatch={onWatch} />

      <div style={{ margin: '28px 0 12px' }}>
        <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', gap: 12, marginBottom: 12 }}>
          <h2 style={{ fontSize: 15, fontWeight: 700 }}>What do you want to try first?</h2>
          <span className="faint" style={{ fontSize: 12.5 }}>just a starting point, change anytime</span>
        </div>
        <ProductPicker value={product} onChange={onProduct} />
      </div>

      <div
        className="cols"
        style={{ gridTemplateColumns: 'minmax(0, 360px) minmax(0, 1fr)', gap: 20, marginTop: 22, alignItems: 'start' }}
      >
        {/* roadmap list */}
        <div className="card" style={{ padding: '8px' }}>
          {required.map((s, i) => listRow(s, i, false))}
          {optional.length > 0 && (
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 12px 4px' }}>
              <span className="faint" style={{ fontSize: 10.5, fontWeight: 600, letterSpacing: '0.06em', textTransform: 'uppercase', whiteSpace: 'nowrap' }}>
                Nice to have
              </span>
              <span className="hairline" />
            </div>
          )}
          {optional.map((s, i) => listRow(s, i, true))}
        </div>

        {/* learning pane */}
        <motion.div
          key={`${product}-${sel}`}
          className="card card-pad"
          initial={{ opacity: 0, x: 10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
          style={{ minHeight: 320 }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 13, marginBottom: 14 }}>
            <span className="setup-ic" style={{ background: def.color }}>
              <GlyphIcon icon={step.icon} size={19} />
            </span>
            <div>
              <div className="faint" style={{ fontSize: 11, fontWeight: 600, letterSpacing: '0.05em', textTransform: 'uppercase' }}>
                {step.optional ? `Nice to have · ${def.label}` : `Step ${reqIdx + 1} of ${required.length} · ${def.label}`}
              </div>
              <h2 style={{ fontSize: 19, fontWeight: 750, letterSpacing: '-0.02em', marginTop: 2 }}>{step.title}</h2>
            </div>
          </div>

          <p className="muted" style={{ fontSize: 14.5, lineHeight: 1.55, maxWidth: 560 }}>{step.learn.what}</p>

          <div style={{ marginTop: 18 }}>
            <div className="gr-section-label" style={{ marginBottom: 9 }}>Ways teams do this</div>
            <div style={{ display: 'flex', gap: 7, flexWrap: 'wrap' }}>
              {step.learn.ideas.map((idea) => (
                <span key={idea} className="badge" style={{ fontSize: 11.5, padding: '5px 11px' }}>{idea}</span>
              ))}
            </div>
          </div>

          <div style={{ marginTop: 22, display: 'flex', alignItems: 'center', gap: 12 }}>
            <button className="btn" onClick={step.sim ? onWatch : undefined}>
              {step.sim && <ShieldHeart size={15} />}
              {step.cta}
              <ArrowRight size={14} />
            </button>
            {!step.sim && (
              <span className="faint" style={{ fontSize: 12 }}>opens the {def.label.toLowerCase()} setup in the real product</span>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  )
}
