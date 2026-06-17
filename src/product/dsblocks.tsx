import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { type Glyph, type ProductDef, type ProductKey, type RoadmapStepV2 } from '../data/home'

/* Renders a real Launchpad icon from the injected sprite (#lp-icon-*),
   without pulling in the React Aria component layer. */
export function LpIcon({ name, size = 16, className }: { name: string; size?: number; className?: string }) {
  return (
    <svg
      className={className}
      width={size}
      height={size}
      aria-hidden="true"
      focusable={false}
      style={{ fill: 'currentColor', display: 'inline-block', verticalAlign: 'middle', flex: '0 0 auto' }}
    >
      <use href={`#lp-icon-${name}`} />
    </svg>
  )
}

/* token-faithful Launchpad-style button (built here so we don't bundle React Aria) */
export function DsButton({
  children,
  onClick,
  variant = 'default',
  size = 'medium',
  style,
}: {
  children: React.ReactNode
  onClick?: () => void
  variant?: 'primary' | 'default' | 'minimal'
  size?: 'medium' | 'large'
  style?: React.CSSProperties
}) {
  return (
    <button className={`ds-btn ${variant} ${size === 'large' ? 'lg' : ''}`} onClick={onClick} style={style}>
      {children}
    </button>
  )
}

const ICON: Record<Glyph, string> = {
  shield: 'shield-heart',
  beaker: 'flask',
  hub: 'chip-ai',
  pulse: 'pulse',
  venn: 'chart-venn',
  fingerprint: 'fingerprint',
  ruler: 'ruler',
  plug: 'plug',
  flag: 'flag',
  mcp: 'terminal',
  play: 'play-circle',
  playground: 'application',
  sparkle: 'sparkles',
  users: 'group',
  article: 'article',
}

export function DsIcon({ glyph, size = 16 }: { glyph: Glyph; size?: number }) {
  return <LpIcon name={ICON[glyph]} size={size} />
}

export function DsWelcomeRow({ title, subtitle }: { title: string; subtitle: string }) {
  return (
    <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 16, marginBottom: 'var(--lp-spacing-700)' }}>
      <div>
        <h1 className="ds-display" style={{ fontSize: 'var(--lp-font-size-600)' }}>{title}</h1>
        <p className="ds-muted" style={{ fontSize: 'var(--lp-font-size-300)', marginTop: 'var(--lp-spacing-200)' }}>{subtitle}</p>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--lp-spacing-300)', flex: '0 0 auto' }}>
        <span className="ds-chip warning" style={{ height: 28, padding: '0 var(--lp-spacing-400)' }}>Trial · 14 days left</span>
        <DsButton size="medium" variant="default"><LpIcon name="bolt" size={14} /> Upgrade</DsButton>
      </div>
    </div>
  )
}

export function DsMiniRollout() {
  const N = 22
  const [phase, setPhase] = useState(0)
  useEffect(() => {
    const id = setInterval(() => setPhase((p) => (p + 1) % 6), 620)
    return () => clearInterval(id)
  }, [])
  return (
    <div className="ds-mini">
      {Array.from({ length: N }).map((_, i) => {
        const onCount = [0, 4, 9, 9, 4, 0][phase]
        const bad = (phase === 2 || phase === 3) && i < 9 && i % 3 === 0
        const on = i < onCount
        return <span key={i} className={`ds-mini-cell ${bad ? 'bad' : on ? 'on' : ''}`} />
      })}
    </div>
  )
}

export function DsSimHero({ onWatch }: { onWatch: () => void }) {
  return (
    <div className="ds-hero">
      <div style={{ maxWidth: 640 }}>
        <span className="ds-chip brand" style={{ marginBottom: 'var(--lp-spacing-400)' }}>
          <LpIcon name="shield-heart" size={13} /> Guarded releases
        </span>
        <h1 className="ds-display" style={{ fontSize: 'clamp(28px, 3.4vw, 44px)' }}>
          Before you set anything up,
          <br />
          see what LaunchDarkly actually does.
        </h1>
        <p className="ds-muted" style={{ fontSize: 'var(--lp-font-size-300)', marginTop: 'var(--lp-spacing-400)', maxWidth: 560, lineHeight: 1.5 }}>
          Flags are the foundation. The point is shipping risky changes safely: roll out progressively, watch a metric,
          and roll back on its own before bad code reaches the rest of your customers.
        </p>
        <div style={{ marginTop: 'var(--lp-spacing-700)' }}>
          <DsButton size="large" variant="primary" onClick={onWatch}>
            <LpIcon name="bolt" size={16} /> Watch the 30-second simulation
          </DsButton>
        </div>
      </div>
    </div>
  )
}

export function DsProductPicker({
  value,
  onChange,
  products,
}: {
  value: ProductKey
  onChange: (k: ProductKey) => void
  products: ProductDef[]
}) {
  return (
    <div className="cols" style={{ gridTemplateColumns: `repeat(${products.length}, minmax(0, 1fr))`, gap: 'var(--lp-spacing-400)' }}>
      {products.map((p) => {
        const on = value === p.key
        return (
          <button key={p.key} className={`ds-pick ${on ? 'on' : ''}`} onClick={() => onChange(p.key)}>
            <span className="ds-pick-ic" style={{ background: p.color }}>
              <DsIcon glyph={p.icon} size={18} />
            </span>
            <span style={{ minWidth: 0 }}>
              <span style={{ display: 'block', fontSize: 'var(--lp-font-size-200)', fontWeight: 'var(--lp-font-weight-semibold)', lineHeight: 1.2 }}>{p.label}</span>
              <span className="ds-muted" style={{ display: 'block', fontSize: 'var(--lp-font-size-100)', marginTop: 2, lineHeight: 1.25 }}>{p.blurb}</span>
            </span>
            {on && <span className="ds-pick-check"><LpIcon name="check" size={16} /></span>}
          </button>
        )
      })}
    </div>
  )
}

/* The roadmap list + learning pane, shared by the split-pane, journey, and
   control-plane concepts. Identical markup to HomeDSSplit's body. */
export function DsRoadmap({
  steps,
  def,
  onWatch,
  resetKey,
}: {
  steps: RoadmapStepV2[]
  def: { label: string; color: string }
  onWatch: () => void
  resetKey: string
}) {
  const required = steps.filter((s) => !s.optional)
  const optional = steps.filter((s) => s.optional)
  const [sel, setSel] = useState(steps[0].key)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => setSel(steps[0].key), [resetKey])

  const idx = Math.max(0, steps.findIndex((s) => s.key === sel))
  const step = steps[idx]
  const reqIdx = required.findIndex((s) => s.key === sel)

  const listRow = (s: RoadmapStepV2, i: number, isOptional: boolean) => (
    <div key={`${resetKey}-${s.key}`} className={`ds-step ${sel === s.key ? 'active' : ''}`} onClick={() => setSel(s.key)}>
      <span className="ds-node">{isOptional ? <DsIcon glyph={s.icon} size={15} /> : i + 1}</span>
      <div style={{ flex: 1, minWidth: 0 }}>
        <span style={{ fontSize: 'var(--lp-font-size-200)', fontWeight: 'var(--lp-font-weight-semibold)' }}>{s.title}</span>
        <div className="ds-muted" style={{ fontSize: 'var(--lp-font-size-100)', marginTop: 2 }}>{s.blurb}</div>
      </div>
      <span style={{ color: sel === s.key ? 'var(--lp-color-fill-interactive-primary)' : 'var(--lp-color-fill-ui-secondary)' }}>
        <LpIcon name="chevron-right" size={16} />
      </span>
    </div>
  )

  return (
    <div className="cols" style={{ gridTemplateColumns: 'minmax(0, 360px) minmax(0, 1fr)', gap: 'var(--lp-spacing-600)', alignItems: 'start' }}>
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

      <motion.div
        key={`${resetKey}-${sel}`}
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
          <DsButton variant="primary" onClick={step.sim ? onWatch : undefined}>
            {step.sim && <LpIcon name="shield-heart" size={16} />}
            {step.cta}
            <LpIcon name="arrow-right-thin" size={16} />
          </DsButton>
          {step.est && <span className="ds-muted" style={{ fontSize: 'var(--lp-font-size-100)' }}>{step.est}</span>}
        </div>

        {step.docs && step.docs.length > 0 && (
          <div style={{ marginTop: 'var(--lp-spacing-400)', display: 'flex', alignItems: 'center', gap: 'var(--lp-spacing-400)', flexWrap: 'wrap' }}>
            <span className="ds-section-label">Docs</span>
            {step.docs.map((d) => (
              <a key={d.href} href={d.href} target="_blank" rel="noreferrer" className="doc-link" style={{ fontSize: 'var(--lp-font-size-200)', color: 'var(--lp-color-fill-interactive-primary)', textDecoration: 'none', fontWeight: 'var(--lp-font-weight-medium)' }}>
                {d.label} ↗
              </a>
            ))}
          </div>
        )}
      </motion.div>
    </div>
  )
}
