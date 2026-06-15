import { useEffect, useState } from 'react'
import {
  CAPABILITIES,
  ROADMAP,
  INTENTS,
  SAMPLE_FLAGS,
  PRODUCTS,
  ON_HAND,
  type Glyph,
  type RoadmapStep,
  type ProductKey,
} from '../data/home'
import { ShieldHeart, ArrowRight, Bolt, Check } from '../components/icons'
import {
  IcBeaker, IcHub, IcPulse, IcVenn, IcFingerprint, IcRuler, IcPlug, IcFlag, IcMcp, IcChevron,
  IcPlay, IcPlayground, IcSparkle, IcUsers, IcArticle,
} from '../components/navicons'

export function WelcomeRow({ title, subtitle }: { title: string; subtitle: string }) {
  return (
    <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 16, marginBottom: 22 }}>
      <div>
        <h1 className="page-title">{title}</h1>
        <p className="muted" style={{ fontSize: 15, marginTop: 6 }}>{subtitle}</p>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, flex: '0 0 auto' }}>
        <span className="badge orange" style={{ height: 30, padding: '0 12px' }}>Trial · 14 days left</span>
        <button className="btn default" style={{ height: 34 }}><Bolt size={14} /> Upgrade</button>
      </div>
    </div>
  )
}

export function GlyphIcon({ icon, size = 18 }: { icon: Glyph; size?: number }) {
  switch (icon) {
    case 'shield': return <ShieldHeart size={size} />
    case 'beaker': return <IcBeaker size={size} />
    case 'hub': return <IcHub size={size} />
    case 'pulse': return <IcPulse size={size} />
    case 'venn': return <IcVenn size={size} />
    case 'fingerprint': return <IcFingerprint size={size} />
    case 'ruler': return <IcRuler size={size} />
    case 'plug': return <IcPlug size={size} />
    case 'flag': return <IcFlag size={size} />
    case 'mcp': return <IcMcp size={size} />
    case 'play': return <IcPlay size={size} />
    case 'playground': return <IcPlayground size={size} />
    case 'sparkle': return <IcSparkle size={size} />
    case 'users': return <IcUsers size={size} />
    case 'article': return <IcArticle size={size} />
  }
}

function tint(color: string) {
  return color.replace('rgb(', 'rgba(').replace(')', ',0.12)')
}

/* ---- Capability strip (kills "basic flags") ---------------------------- */

export function CapabilityStrip() {
  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
        <h2 style={{ fontSize: 15, fontWeight: 700 }}>More than flags</h2>
        <span className="faint" style={{ fontSize: 12.5 }}>flags are the foundation, not the point</span>
      </div>
      <div className="cols" style={{ gridTemplateColumns: 'repeat(5, 1fr)', gap: 10 }}>
        {CAPABILITIES.map((c) => (
          <div className="cap-pill" key={c.label}>
            <span className="cap-ic" style={{ background: tint(c.color), color: c.color }}>
              <GlyphIcon icon={c.icon} size={17} />
            </span>
            <div style={{ minWidth: 0 }}>
              <div style={{ fontSize: 12.5, fontWeight: 650, lineHeight: 1.2 }}>{c.label}</div>
              <div className="faint" style={{ fontSize: 11, marginTop: 2, lineHeight: 1.25 }}>{c.blurb}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

/* ---- Mini rollout animation for the hero ------------------------------- */

export function MiniRollout() {
  const N = 22
  const [phase, setPhase] = useState(0) // 0..5 loop
  useEffect(() => {
    const id = setInterval(() => setPhase((p) => (p + 1) % 6), 620)
    return () => clearInterval(id)
  }, [])
  return (
    <div className="mini-rollout">
      {Array.from({ length: N }).map((_, i) => {
        const onCount = [0, 4, 9, 9, 4, 0][phase]
        const bad = (phase === 2 || phase === 3) && i < 9 && i % 3 === 0
        const on = i < onCount
        return <span key={i} className={`mini-cell ${bad ? 'bad' : on ? 'on' : ''}`} />
      })}
    </div>
  )
}

/* ---- Value hero (Direction A) ------------------------------------------ */

export function SimHero({ onWatch }: { onWatch: () => void }) {
  return (
    <div className="hero">
      <div className="hero-glow" />
      <div style={{ position: 'relative', maxWidth: 640 }}>
        <span className="badge blue" style={{ marginBottom: 14 }}>
          <ShieldHeart size={13} /> Guarded releases
        </span>
        <h1 style={{ fontSize: 'clamp(26px, 3.4vw, 38px)', fontWeight: 800, letterSpacing: '-0.03em', lineHeight: 1.08 }}>
          Before you set anything up,
          <br />
          see what LaunchDarkly actually does.
        </h1>
        <p className="muted" style={{ fontSize: 16, lineHeight: 1.5, marginTop: 12, maxWidth: 560 }}>
          Flags are the foundation. The point is shipping risky changes safely: roll out progressively, watch a metric,
          and roll back on its own before bad code reaches the rest of your customers.
        </p>
        <div style={{ display: 'flex', gap: 11, marginTop: 22, flexWrap: 'wrap', alignItems: 'center' }}>
          <button className="btn lg" onClick={onWatch}>
            <Bolt size={16} /> Watch the 30-second simulation
          </button>
        </div>
        <div style={{ marginTop: 26 }}>
          <div className="faint" style={{ fontSize: 11, fontWeight: 600, letterSpacing: '0.05em', textTransform: 'uppercase', marginBottom: 7 }}>
            What you will watch
          </div>
          <MiniRollout />
          <div className="faint" style={{ fontSize: 12, marginTop: 8 }}>
            ramp to 10% · regression detected · automatic rollback in ~200 ms
          </div>
        </div>
      </div>
    </div>
  )
}

/* ---- Roadmap checklist (Direction B) ----------------------------------- */

export function RoadmapChecklist({ onWatch }: { onWatch: () => void }) {
  const [done, setDone] = useState<Record<string, boolean>>({})
  const doneCount = Object.values(done).filter(Boolean).length
  const activeKey = ROADMAP.find((s) => !done[s.key])?.key

  const act = (s: RoadmapStep) => {
    if (s.key === 'sim') {
      onWatch()
      setDone((d) => ({ ...d, sim: true }))
    } else {
      setDone((d) => ({ ...d, [s.key]: !d[s.key] }))
    }
  }

  return (
    <div className="card card-pad">
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 6 }}>
        <h2 style={{ fontSize: 15.5, fontWeight: 700 }}>Your LaunchDarkly roadmap</h2>
        <span className="badge blue" style={{ fontSize: 11 }}>{doneCount}/{ROADMAP.length}</span>
      </div>
      <p className="faint" style={{ fontSize: 12.5, marginBottom: 12 }}>Value first. Setup when you are ready.</p>
      <div className="road-progress-track" style={{ marginBottom: 8 }}>
        <div className="road-progress-fill" style={{ width: `${(doneCount / ROADMAP.length) * 100}%` }} />
      </div>

      <div className="road">
        {ROADMAP.map((s, i) => {
          const isDone = !!done[s.key]
          const isActive = s.key === activeKey
          return (
            <div key={s.key} className={`road-step ${isDone ? 'done' : ''} ${isActive ? 'active' : ''}`} onClick={() => act(s)}>
              {i < ROADMAP.length - 1 && <span className="road-line" />}
              <span className="road-node">{isDone ? <Check size={15} /> : <GlyphIcon icon={s.icon} size={15} />}</span>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span style={{ fontSize: 13.5, fontWeight: 650 }}>{s.title}</span>
                  {s.value && <span className="badge green" style={{ fontSize: 9.5 }}>start here</span>}
                </div>
                <div className="muted" style={{ fontSize: 12.5, marginTop: 3, lineHeight: 1.4 }}>{s.blurb}</div>
                {isActive && (
                  <button
                    className={s.key === 'sim' ? 'btn sm' : 'btn default sm'}
                    style={{ marginTop: 9 }}
                    onClick={(e) => {
                      e.stopPropagation()
                      act(s)
                    }}
                  >
                    {s.key === 'sim' && <ShieldHeart size={14} />}
                    {s.cta}
                    <ArrowRight size={13} />
                  </button>
                )}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

/* ---- Intent chips (Direction C) ---------------------------------------- */

export function IntentChips({ selected, onToggle }: { selected: Record<string, boolean>; onToggle: (k: string) => void }) {
  return (
    <div className="cols" style={{ gridTemplateColumns: 'repeat(5, 1fr)', gap: 10 }}>
      {INTENTS.map((it) => {
        const on = !!selected[it.key]
        return (
          <button key={it.key} className={`intent-chip ${on ? 'on' : ''}`} onClick={() => onToggle(it.key)}>
            <span className="intent-ic" style={{ background: tint(it.color), color: it.color }}>
              <GlyphIcon icon={it.icon} size={18} />
            </span>
            <div style={{ minWidth: 0 }}>
              <div style={{ fontSize: 13, fontWeight: 650, lineHeight: 1.2 }}>{it.label}</div>
              <div className="faint" style={{ fontSize: 11, marginTop: 2, lineHeight: 1.25 }}>{it.blurb}</div>
            </div>
            <span className="intent-check">{on && <Check size={11} />}</span>
          </button>
        )
      })}
    </div>
  )
}

/* ---- Sample flags / sandbox -------------------------------------------- */

export function SampleFlagsCard() {
  const [flags, setFlags] = useState(SAMPLE_FLAGS.map((f) => f.on))
  return (
    <div className="card">
      <div className="card-head">
        <div className="card-title">
          <IcFlag size={17} style={{ color: 'var(--blue)' }} /> Explore a sample project
        </div>
        <span className="badge">sandbox</span>
      </div>
      <div>
        {SAMPLE_FLAGS.map((f, i) => (
          <div className="flagrow" key={f.name}>
            <button
              className={`flag-toggle ${flags[i] ? 'on' : 'off'}`}
              onClick={() => setFlags((arr) => arr.map((v, j) => (j === i ? !v : v)))}
              aria-label="toggle flag"
            >
              <span className="flag-knob" />
            </button>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div className="mono" style={{ fontSize: 13, fontWeight: 600 }}>{f.name}</div>
              <div className="faint" style={{ fontSize: 12, marginTop: 1 }}>{f.desc}</div>
            </div>
            {f.tag && <span className={`badge ${f.tagTone}`} style={{ fontSize: 10.5 }}>{f.tag}</span>}
          </div>
        ))}
      </div>
      <div style={{ padding: '12px 14px', borderTop: '1px solid var(--border-soft)' }}>
        <a className="link" style={{ fontSize: 13 }}>
          Open the sandbox <IcChevron size={13} />
        </a>
      </div>
    </div>
  )
}

/* ---- v2: product picker (single select) --------------------------------- */

export function ProductPicker({
  value,
  onChange,
  products = PRODUCTS,
}: {
  value: ProductKey
  onChange: (k: ProductKey) => void
  products?: typeof PRODUCTS
}) {
  return (
    <div className="cols" style={{ gridTemplateColumns: `repeat(${products.length}, minmax(0, 1fr))`, gap: 10 }}>
      {products.map((p) => {
        const on = value === p.key
        return (
          <button key={p.key} className={`intent-chip ${on ? 'on' : ''}`} onClick={() => onChange(p.key)}>
            <span className="intent-ic" style={{ background: tint(p.color), color: p.color }}>
              <GlyphIcon icon={p.icon} size={18} />
            </span>
            <div style={{ minWidth: 0 }}>
              <div style={{ fontSize: 13, fontWeight: 650, lineHeight: 1.2 }}>{p.label}</div>
              <div className="faint" style={{ fontSize: 11, marginTop: 2, lineHeight: 1.25 }}>{p.blurb}</div>
            </div>
            <span className="intent-check">{on && <Check size={11} />}</span>
          </button>
        )
      })}
    </div>
  )
}

/* ---- v2: persistent simulation cards ------------------------------------ */

export function SimSideCard({ onWatch }: { onWatch: () => void }) {
  return (
    <div
      className="card card-pad"
      style={{
        borderColor: 'var(--blue)',
        boxShadow: '0 0 0 1px var(--blue), var(--shadow-card)',
        background: 'linear-gradient(180deg, var(--blue-tint), var(--bg) 75%)',
      }}
    >
      <span className="badge blue" style={{ marginBottom: 10 }}>
        <ShieldHeart size={13} /> Guarded releases
      </span>
      <h3 style={{ fontSize: 17, fontWeight: 750, letterSpacing: '-0.02em', lineHeight: 1.2 }}>
        See one catch bad code
      </h3>
      <p className="muted" style={{ fontSize: 13, lineHeight: 1.5, marginTop: 6 }}>
        Roll out, regress, and watch it heal itself. 30 seconds, no setup, whatever product you came for.
      </p>
      <div style={{ margin: '14px 0 8px' }}>
        <MiniRollout />
      </div>
      <div className="faint" style={{ fontSize: 11.5, marginBottom: 14 }}>
        ramp to 10% · regression detected · rollback in ~200 ms
      </div>
      <button className="btn" onClick={onWatch} style={{ width: '100%' }}>
        <Bolt size={15} /> Watch the simulation
      </button>
    </div>
  )
}

export function SimStrip({ onWatch }: { onWatch: () => void }) {
  return (
    <div
      className="card"
      style={{ padding: '12px 14px', display: 'flex', gap: 11, alignItems: 'center', borderColor: 'rgba(66,94,255,0.45)' }}
    >
      <span style={{ color: 'var(--blue)', flex: '0 0 auto' }}><ShieldHeart size={20} /></span>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: 13, fontWeight: 650 }}>See it before you set it up</div>
        <div className="faint" style={{ fontSize: 11.5 }}>30-second guarded release simulation</div>
      </div>
      <button className="btn sm" onClick={onWatch}>Watch</button>
    </div>
  )
}

/* ---- "Have these on hand" rail ------------------------------------------ */

export function HaveOnHandCard() {
  return (
    <div className="card">
      <div className="card-head">
        <div className="card-title">Have these on hand</div>
        <span className="badge" style={{ fontSize: 10.5 }}>any path</span>
      </div>
      <div style={{ padding: '8px 8px 10px' }}>
        <p className="faint" style={{ fontSize: 12, padding: '4px 10px 8px', lineHeight: 1.4 }}>
          Useful regardless of what you start with.
        </p>
        {ON_HAND.map((item) => (
          <button key={item.label} className="oh-row">
            <span className="ic"><GlyphIcon icon={item.icon} size={15} /></span>
            <span style={{ flex: 1, minWidth: 0 }}>
              <span style={{ display: 'block', fontSize: 13, fontWeight: 650 }}>{item.label}</span>
              <span className="faint" style={{ display: 'block', fontSize: 11.5, marginTop: 1, lineHeight: 1.35 }}>
                {item.blurb}
              </span>
            </span>
            <span style={{ color: 'var(--text-3)', flex: '0 0 auto' }}><IcChevron size={14} /></span>
          </button>
        ))}
      </div>
    </div>
  )
}

/* ---- Quiet "good to know" panel (muted, no color/iconography) ----------- */

export function QuietLinks() {
  return (
    <div className="card">
      <div style={{ padding: '15px 18px 2px' }}>
        <div style={{ fontSize: 14.5, fontWeight: 650 }}>Good to know</div>
        <div className="faint" style={{ fontSize: 12, marginTop: 2 }}>Useful whichever product you pick.</div>
      </div>
      <div style={{ padding: '8px 8px 8px' }}>
        {ON_HAND.map((item) => (
          <button key={item.label} className="quiet-row">
            <span style={{ flex: 1, minWidth: 0 }}>
              <span style={{ display: 'block', fontSize: 13, fontWeight: 600, color: 'var(--text-2)' }}>{item.label}</span>
              <span className="faint" style={{ display: 'block', fontSize: 11.5, marginTop: 1, lineHeight: 1.35 }}>
                {item.blurb}
              </span>
            </span>
            <span style={{ color: 'var(--text-3)', flex: '0 0 auto' }}><IcChevron size={13} /></span>
          </button>
        ))}
      </div>
    </div>
  )
}
