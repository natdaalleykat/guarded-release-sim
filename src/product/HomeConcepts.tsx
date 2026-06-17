import { Fragment, useEffect, useState } from 'react'
import {
  ROADMAPS,
  ROADMAPS_UNIFIED,
  PRODUCTS_UNIFIED,
  TRACKS,
  type ProductKey,
} from '../data/home'
import { DsWelcomeRow, DsSimHero, DsRoadmap, DsIcon, LpIcon, DsButton } from './dsblocks'

/* =========================================================================
   Concept 4 — Journey. The reviewer's "re-sequencing" idea: you set up one
   product, then the next, with visible progress across the whole platform.
   Picking a product makes it the current step; "mark set up" advances.
   ========================================================================= */
export function HomeDSJourney({ onWatch }: { onWatch: () => void }) {
  const order = PRODUCTS_UNIFIED // flags, experiments, aiconfigs, observability
  const [done, setDone] = useState<Set<ProductKey>>(new Set())
  const [current, setCurrent] = useState<ProductKey>(order[0].key)

  const def = order.find((p) => p.key === current)!
  const curIdx = order.findIndex((p) => p.key === current)
  const allDone = order.every((p) => done.has(p.key))

  const completeAndNext = () => {
    const nd = new Set(done)
    nd.add(current)
    setDone(nd)
    const next = order.find((p) => !nd.has(p.key))
    if (next) setCurrent(next.key)
  }

  return (
    <div className="content-inner ds-scope">
      <DsWelcomeRow title="Set up LaunchDarkly" subtitle="One product at a time. Finish one, move to the next." />

      <DsSimHero onWatch={onWatch} />

      <div className="ds-card ds-card-pad" style={{ margin: 'var(--lp-spacing-800) 0 var(--lp-spacing-700)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 'var(--lp-spacing-500)' }}>
          <span className="ds-section-label">Your setup journey</span>
          <span className="ds-muted" style={{ fontSize: 'var(--lp-font-size-200)' }}>{done.size} of {order.length} set up</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          {order.map((p, i) => {
            const isDone = done.has(p.key)
            const isCur = p.key === current
            return (
              <Fragment key={p.key}>
                <button className="ds-journey-node" data-state={isDone ? 'done' : isCur ? 'current' : 'todo'} onClick={() => setCurrent(p.key)}>
                  <span className="ds-journey-ic" style={isDone || isCur ? { background: p.color, color: '#fff' } : undefined}>
                    {isDone ? <LpIcon name="check" size={16} /> : <DsIcon glyph={p.icon} size={16} />}
                  </span>
                  <span>
                    <span className="ds-section-label" style={{ display: 'block' }}>Step {i + 1}</span>
                    <span style={{ display: 'block', fontSize: 'var(--lp-font-size-200)', fontWeight: 'var(--lp-font-weight-semibold)' }}>{p.label}</span>
                  </span>
                </button>
                {i < order.length - 1 && <span className="ds-journey-line" data-done={isDone || undefined} />}
              </Fragment>
            )
          })}
        </div>
      </div>

      {allDone ? (
        <div className="ds-card ds-card-pad" style={{ textAlign: 'center', padding: 'var(--lp-spacing-900) var(--lp-spacing-600)' }}>
          <span className="ds-step-ic" style={{ background: 'rgb(0,131,68)', margin: '0 auto var(--lp-spacing-500)', width: 48, height: 48 }}>
            <LpIcon name="check" size={24} />
          </span>
          <h2 className="ds-display" style={{ fontSize: 'var(--lp-font-size-400)' }}>You are set up across LaunchDarkly</h2>
          <p className="ds-muted" style={{ marginTop: 'var(--lp-spacing-300)' }}>Every product is configured. Invite the team and keep shipping.</p>
        </div>
      ) : (
        <>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 12, marginBottom: 'var(--lp-spacing-500)' }}>
            <h2 className="ds-display" style={{ fontSize: 'var(--lp-font-size-400)' }}>Step {curIdx + 1}: set up {def.label}</h2>
            <DsButton variant="default" onClick={completeAndNext}>
              Mark as set up, continue <LpIcon name="arrow-right-thin" size={16} />
            </DsButton>
          </div>
          <DsRoadmap steps={ROADMAPS_UNIFIED[current]} def={def} onWatch={onWatch} resetKey={current} />
        </>
      )}
    </div>
  )
}

/* =========================================================================
   Concept 5 — Code vs Agent, as a toggle. Two control planes; pick a side,
   then a product within it, then the familiar roadmap.
   ========================================================================= */
export function HomeDSTracks({ onWatch }: { onWatch: () => void }) {
  const [track, setTrack] = useState<'code' | 'agent'>('code')
  const t = TRACKS.find((x) => x.key === track)!
  const [prod, setProd] = useState(t.products[0].key)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => setProd(TRACKS.find((x) => x.key === track)!.products[0].key), [track])

  const tp = t.products.find((p) => p.key === prod) ?? t.products[0]
  const steps = (tp.unified ? ROADMAPS_UNIFIED : ROADMAPS)[tp.roadmapKey]

  return (
    <div className="content-inner ds-scope">
      <DsWelcomeRow title="Welcome, Natalie" subtitle="Move at AI speed, stay in control. Which side are you working on today?" />

      <div className="cols" style={{ gridTemplateColumns: '1fr 1fr', gap: 'var(--lp-spacing-400)', marginBottom: 'var(--lp-spacing-700)' }}>
        {TRACKS.map((tr) => (
          <button
            key={tr.key}
            className={`ds-track ${track === tr.key ? 'on' : ''}`}
            onClick={() => setTrack(tr.key)}
            style={{ ['--tc' as string]: tr.color } as React.CSSProperties}
          >
            <span className="ds-track-ic" style={{ background: tr.color }}><DsIcon glyph={tr.icon} size={20} /></span>
            <span style={{ minWidth: 0, textAlign: 'left' }}>
              <span style={{ display: 'block', fontSize: 'var(--lp-font-size-300)', fontWeight: 'var(--lp-font-weight-semibold)' }}>{tr.label}</span>
              <span className="ds-muted" style={{ display: 'block', fontSize: 'var(--lp-font-size-200)', marginTop: 2 }}>{tr.tagline}</span>
            </span>
            {track === tr.key && <span className="ds-pick-check"><LpIcon name="check" size={16} /></span>}
          </button>
        ))}
      </div>

      {track === 'code' && (
        <div style={{ marginBottom: 'var(--lp-spacing-700)' }}>
          <DsSimHero onWatch={onWatch} />
        </div>
      )}

      <div className="cols" style={{ gridTemplateColumns: `repeat(${t.products.length}, minmax(0, 1fr))`, gap: 'var(--lp-spacing-400)', marginBottom: 'var(--lp-spacing-700)' }}>
        {t.products.map((p) => (
          <button key={p.key} className={`ds-pick ${prod === p.key ? 'on' : ''}`} onClick={() => setProd(p.key)}>
            <span className="ds-pick-ic" style={{ background: p.color }}><DsIcon glyph={p.icon} size={18} /></span>
            <span style={{ minWidth: 0 }}>
              <span style={{ display: 'block', fontSize: 'var(--lp-font-size-200)', fontWeight: 'var(--lp-font-weight-semibold)', lineHeight: 1.2 }}>{p.label}</span>
              <span className="ds-muted" style={{ display: 'block', fontSize: 'var(--lp-font-size-100)', marginTop: 2, lineHeight: 1.25 }}>{p.blurb}</span>
            </span>
            {prod === p.key && <span className="ds-pick-check"><LpIcon name="check" size={16} /></span>}
          </button>
        ))}
      </div>

      <DsRoadmap steps={steps} def={tp} onWatch={onWatch} resetKey={`${track}-${prod}`} />
    </div>
  )
}

/* =========================================================================
   Concept 6 — Two planes side by side. Both control planes are visible at
   once (the "two halves of one platform" story); pick any product to open
   its roadmap below.
   ========================================================================= */
export function HomeDSPlanes({ onWatch }: { onWatch: () => void }) {
  const [sel, setSel] = useState<{ track: 'code' | 'agent'; prod: string }>({ track: 'code', prod: TRACKS[0].products[0].key })
  const t = TRACKS.find((x) => x.key === sel.track)!
  const tp = t.products.find((p) => p.key === sel.prod)!
  const steps = (tp.unified ? ROADMAPS_UNIFIED : ROADMAPS)[tp.roadmapKey]

  return (
    <div className="content-inner ds-scope">
      <DsWelcomeRow title="Control your code. Control your agents." subtitle="Two halves of one platform. Set up either side, in any order." />

      <div style={{ marginBottom: 'var(--lp-spacing-700)' }}>
        <DsSimHero onWatch={onWatch} />
      </div>

      <div className="cols" style={{ gridTemplateColumns: '1fr 1fr', gap: 'var(--lp-spacing-500)', marginBottom: 'var(--lp-spacing-700)' }}>
        {TRACKS.map((tr) => (
          <div key={tr.key} className="ds-card ds-card-pad" style={{ borderTop: `3px solid ${tr.color}` }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--lp-spacing-400)', marginBottom: 'var(--lp-spacing-500)' }}>
              <span className="ds-step-ic" style={{ background: tr.color }}><DsIcon glyph={tr.icon} size={19} /></span>
              <div>
                <h2 className="ds-display" style={{ fontSize: 'var(--lp-font-size-400)' }}>{tr.label}</h2>
                <div className="ds-muted" style={{ fontSize: 'var(--lp-font-size-200)' }}>{tr.blurb}</div>
              </div>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--lp-spacing-300)' }}>
              {tr.products.map((p) => {
                const on = sel.track === tr.key && sel.prod === p.key
                const rk = (p.unified ? ROADMAPS_UNIFIED : ROADMAPS)[p.roadmapKey]
                const reqCount = rk.filter((s) => !s.optional).length
                return (
                  <button key={p.key} className={`ds-plane-row ${on ? 'on' : ''}`} onClick={() => setSel({ track: tr.key, prod: p.key })}>
                    <span className="ds-pick-ic" style={{ background: p.color, width: 30, height: 30 }}><DsIcon glyph={p.icon} size={15} /></span>
                    <span style={{ flex: 1, minWidth: 0 }}>
                      <span style={{ display: 'block', fontSize: 'var(--lp-font-size-200)', fontWeight: 'var(--lp-font-weight-semibold)' }}>{p.label}</span>
                      <span className="ds-muted" style={{ display: 'block', fontSize: 'var(--lp-font-size-100)' }}>{p.blurb}</span>
                    </span>
                    <span className="ds-muted" style={{ fontSize: 'var(--lp-font-size-100)', whiteSpace: 'nowrap' }}>{reqCount} steps</span>
                    <LpIcon name="chevron-right" size={16} />
                  </button>
                )
              })}
            </div>
          </div>
        ))}
      </div>

      <div style={{ marginBottom: 'var(--lp-spacing-400)' }}>
        <span className="ds-section-label">{t.label} · {tp.label}</span>
      </div>
      <DsRoadmap steps={steps} def={tp} onWatch={onWatch} resetKey={`${sel.track}-${sel.prod}`} />
    </div>
  )
}
