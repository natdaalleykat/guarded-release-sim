import { useEffect, useRef, useState } from 'react'
import { SETUP, WIDGETS, GLOBAL_STATS, type ProductWidget, type SetupItem, type GlobalStat } from '../data/product'
import { ShieldHeart, ArrowRight, Bolt } from '../components/icons'
import { IcPlug, IcHub, IcPulse, IcMcp, IcChevron, IcFlag, IcBeaker, IcUsers } from '../components/navicons'

/* ---- SDK / get-started card -------------------------------------------- */

function SetupIcon({ icon }: { icon: SetupItem['icon'] }) {
  const s = 19
  switch (icon) {
    case 'plug': return <IcPlug size={s} />
    case 'hub': return <IcHub size={s} />
    case 'pulse': return <IcPulse size={s} />
    case 'mcp': return <IcMcp size={s} />
  }
}

export function GetStartedCard() {
  return (
    <div className="card">
      <div className="card-head">
        <div className="card-title">Connect your app to LaunchDarkly</div>
        <span className="badge">4 steps</span>
      </div>
      <div className="card-pad" style={{ display: 'flex', flexDirection: 'column', gap: 9 }}>
        {SETUP.map((item) => (
          <button key={item.title} className="setup-row">
            <span className="setup-ic" style={{ background: item.color }}>
              <SetupIcon icon={item.icon} />
            </span>
            <span className="body">
              <span className="t">{item.title}</span>
              <span className="d">{item.desc}</span>
            </span>
            <span className="chev"><IcChevron size={17} /></span>
          </button>
        ))}
      </div>
    </div>
  )
}

/* ---- Global "LaunchDarkly today" live counters ------------------------- */

function StatIcon({ icon, size = 14 }: { icon: GlobalStat['icon']; size?: number }) {
  if (icon === 'flag') return <IcFlag size={size} />
  if (icon === 'users') return <IcUsers size={size} />
  return <Bolt size={size} />
}

function StatLabel({ s }: { s: GlobalStat }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 11, fontWeight: 600, letterSpacing: '0.03em', textTransform: 'uppercase', color: 'var(--text-3)' }}>
      <span style={{ color: s.color }}><StatIcon icon={s.icon} /></span>
      {s.label}
    </div>
  )
}

const fmtInt = (v: number) => Math.floor(v).toLocaleString('en-US')

export function GlobalStatsWidget() {
  const vals = useRef<number[]>(GLOBAL_STATS.map((s) => s.base))
  const [, force] = useState(0)
  const last = useRef(0)
  const lastUi = useRef(0)

  useEffect(() => {
    let raf = 0
    const tick = (now: number) => {
      if (!last.current) last.current = now
      const dt = Math.min(0.1, (now - last.current) / 1000)
      last.current = now
      vals.current = vals.current.map((v, i) => v + GLOBAL_STATS[i].rate * dt * (0.8 + Math.random() * 0.4))
      if (now - lastUi.current > 80) {
        lastUi.current = now
        force((x) => x + 1)
      }
      raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [])

  const hero = GLOBAL_STATS[0]
  const rest = GLOBAL_STATS.slice(1)

  return (
    <div className="card card-pad">
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div>
          <div style={{ fontSize: 13.5, fontWeight: 650 }}>Across LaunchDarkly today</div>
          <div className="faint" style={{ fontSize: 12, marginTop: 1 }}>live, across every customer</div>
        </div>
        <span className="badge green" style={{ fontSize: 11 }}>
          <span className="live-dot" /> live
        </span>
      </div>

      <div style={{ marginTop: 16 }}>
        <StatLabel s={hero} />
        <div className="mono" style={{ fontSize: 'clamp(24px, 2.5vw, 31px)', fontWeight: 750, letterSpacing: '-0.02em', lineHeight: 1.05, marginTop: 5 }}>
          {fmtInt(vals.current[0])}
        </div>
        <div className="faint" style={{ fontSize: 11.5, marginTop: 2 }}>{hero.sub}</div>
      </div>

      <div className="hairline" style={{ margin: '16px 0' }} />

      <div className="cols" style={{ gridTemplateColumns: '1fr 1fr', gap: 16 }}>
        {rest.map((s, i) => (
          <div key={s.key} style={{ minWidth: 0 }}>
            <StatLabel s={s} />
            <div className="mono" style={{ fontSize: 18.5, fontWeight: 700, lineHeight: 1.1, marginTop: 4 }}>
              {fmtInt(vals.current[i + 1])}
            </div>
            <div className="faint" style={{ fontSize: 11, marginTop: 2, lineHeight: 1.3 }}>{s.sub}</div>
          </div>
        ))}
      </div>
    </div>
  )
}

/* ---- Product widget (empty state) -------------------------------------- */

function WidgetIcon({ icon }: { icon: ProductWidget['icon'] }) {
  const s = 21
  switch (icon) {
    case 'flag': return <IcFlag size={s} />
    case 'beaker': return <IcBeaker size={s} />
    case 'hub': return <IcHub size={s} />
    case 'shield': return <ShieldHeart size={s} />
  }
}

export function ProductWidgetCard({ widget, onWatch }: { widget: ProductWidget; onWatch?: () => void }) {
  return (
    <div className={`card pw ${widget.hero ? 'hero' : ''}`}>
      <div className="card-head" style={{ borderBottom: widget.hero ? '1px solid rgba(66,94,255,0.18)' : undefined }}>
        <div className="card-title">
          <span style={{ color: widget.iconColor }}><WidgetIcon icon={widget.icon} /></span>
          {widget.title}
        </div>
        {widget.hero ? <span className="badge blue" style={{ fontSize: 10.5 }}>Try it</span> : <span className="badge">0</span>}
      </div>
      <div className="pw-body">
        <div className="pw-empty-t">{widget.emptyTitle}</div>
        <div className="pw-empty-d">{widget.emptyBody}</div>
        {widget.hero ? (
          <button className="btn sm" style={{ marginTop: 14 }} onClick={onWatch}>
            <ShieldHeart size={15} /> {widget.cta}
          </button>
        ) : (
          <button className="btn default sm" style={{ marginTop: 14 }}>
            {widget.cta} <ArrowRight size={14} />
          </button>
        )}
      </div>
    </div>
  )
}

export { WIDGETS }
