import { type Glyph, type ProductDef, type ProductKey } from '../data/home'

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

/* `plain` (concept "Spec") drops the trial chip + Upgrade button: the global
   trial bar above the top bar is the only trial surface on that concept. */
export function DsWelcomeRow({ title, subtitle, plain }: { title: string; subtitle: string; plain?: boolean }) {
  return (
    <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 16, marginBottom: 'var(--lp-spacing-700)' }}>
      <div>
        <h1 className="ds-display" style={{ fontSize: 'var(--lp-font-size-600)' }}>{title}</h1>
        <p className="ds-muted" style={{ fontSize: 'var(--lp-font-size-300)', marginTop: 'var(--lp-spacing-200)' }}>{subtitle}</p>
      </div>
      {!plain && (
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--lp-spacing-300)', flex: '0 0 auto' }}>
          <span className="ds-chip warning" style={{ height: 28, padding: '0 var(--lp-spacing-400)' }}>Trial · 14 days left</span>
          <DsButton size="medium" variant="default"><LpIcon name="bolt" size={14} /> Upgrade</DsButton>
        </div>
      )}
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
