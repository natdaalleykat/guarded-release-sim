import { Fragment, useEffect, useState } from 'react'
import {
  ROADMAPS,
  ROADMAPS_UNIFIED,
  PRODUCTS_UNIFIED,
  TRACKS,
  type ProductKey,
} from '../data/home'
import { DsWelcomeRow, DsSimHero, DsRoadmap, DsIcon, LpIcon, DsButton, DsMiniRollout } from './dsblocks'
import type { Glyph } from '../data/home'

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

/* =========================================================================
   Concept 7 — Gallery. Not a home layout: a board of design options for the
   simulation card (subtle, with charts, video-style, animated, timeline), plus
   a "how it all fits together" platform visual. A pick-a-direction surface.
   ========================================================================= */

const BLUE = 'rgb(66,94,255)'
const ORANGE = 'rgb(214,122,0)'
const PURPLE = 'rgb(135,23,205)'
const GREEN = 'rgb(0,131,68)'
const RED = 'rgb(219,52,52)'

function Variant({ tag, note, children }: { tag: string; note: string; children: React.ReactNode }) {
  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'baseline', gap: 'var(--lp-spacing-300)', marginBottom: 'var(--lp-spacing-300)' }}>
        <span className="ds-chip brand">{tag}</span>
        <span className="ds-muted" style={{ fontSize: 'var(--lp-font-size-200)' }}>{note}</span>
      </div>
      {children}
    </div>
  )
}

/* the metric curve: ramps, spikes over the guardrail, rolls back, recovers */
function SimCurve() {
  return (
    <svg viewBox="0 0 280 132" width="100%" style={{ display: 'block' }} aria-hidden="true">
      <line x1="8" y1="46" x2="272" y2="46" stroke="var(--lp-color-border-ui-secondary)" strokeWidth="1.5" strokeDasharray="4 4" />
      <text x="270" y="40" textAnchor="end" fontSize="9" fill="var(--lp-color-text-ui-secondary)">guardrail</text>
      <polyline points="8,98 64,96 100,88 138,28 150,30" fill="none" stroke={BLUE} strokeWidth="2.5" strokeLinejoin="round" strokeLinecap="round" />
      <line x1="151" y1="14" x2="151" y2="112" stroke={RED} strokeWidth="1.5" strokeDasharray="3 3" />
      <text x="156" y="20" fontSize="9" fill={RED}>rollback</text>
      <polyline points="151,30 170,80 202,100 272,98" fill="none" stroke={GREEN} strokeWidth="2.5" strokeLinejoin="round" strokeLinecap="round" />
    </svg>
  )
}

function PlatformFit() {
  const pillar = (label: string, sub: string, glyph: Glyph, color: string) => (
    <div className="ds-card ds-card-pad" style={{ borderTop: `3px solid ${color}` }}>
      <span className="ds-step-ic" style={{ background: color, width: 32, height: 32, marginBottom: 'var(--lp-spacing-300)' }}><DsIcon glyph={glyph} size={17} /></span>
      <div style={{ fontWeight: 'var(--lp-font-weight-semibold)', fontSize: 'var(--lp-font-size-300)' }}>{label}</div>
      <div className="ds-muted" style={{ fontSize: 'var(--lp-font-size-200)', marginTop: 2 }}>{sub}</div>
    </div>
  )
  const bar = (label: string, sub: string, glyph: Glyph, color: string) => (
    <div className="ds-card" style={{ display: 'flex', alignItems: 'center', gap: 'var(--lp-spacing-400)', padding: 'var(--lp-spacing-500) var(--lp-spacing-600)', borderLeft: `4px solid ${color}` }}>
      <span className="ds-step-ic" style={{ background: color, width: 34, height: 34 }}><DsIcon glyph={glyph} size={18} /></span>
      <div>
        <span style={{ fontWeight: 'var(--lp-font-weight-semibold)', fontSize: 'var(--lp-font-size-300)' }}>{label}</span>
        <span className="ds-muted" style={{ fontSize: 'var(--lp-font-size-200)', marginLeft: 'var(--lp-spacing-300)' }}>{sub}</span>
      </div>
    </div>
  )
  const connect = (text: string) => (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4, padding: 'var(--lp-spacing-300) 0' }}>
      <span className="ds-muted" style={{ fontSize: 'var(--lp-font-size-100)' }}>{text}</span>
    </div>
  )
  return (
    <div>
      <div className="cols" style={{ gridTemplateColumns: '1fr 1fr 1fr', gap: 'var(--lp-spacing-400)' }}>
        {pillar('Guarded releases', 'Ship safely, auto-rollback', 'shield', BLUE)}
        {pillar('Experimentation', 'Measure what works', 'beaker', ORANGE)}
        {pillar('AI Configs', 'Models and prompts', 'hub', PURPLE)}
      </div>
      {connect('↓ each one is just a flag you evaluate with a context')}
      {bar('Feature flags', 'one SDK, one context, evaluated everywhere', 'flag', BLUE)}
      {connect('↑ guarded releases and experiments watch a metric that observability supplies')}
      {bar('Observability', 'errors, latency, traces, session replay', 'pulse', GREEN)}
    </div>
  )
}

export function HomeDSGallery({ onWatch }: { onWatch: () => void }) {
  const beat = (label: string, glyph: Glyph, color: string) => (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6, flex: 1, textAlign: 'center' }}>
      <span className="ds-step-ic" style={{ background: color, width: 34, height: 34 }}><DsIcon glyph={glyph} size={17} /></span>
      <span style={{ fontSize: 'var(--lp-font-size-100)', fontWeight: 'var(--lp-font-weight-semibold)' }}>{label}</span>
    </div>
  )
  const line = <span style={{ flex: '0 0 24px', height: 2, background: 'var(--lp-color-border-ui-primary)', marginTop: 16 }} />

  return (
    <div className="content-inner ds-scope">
      <DsWelcomeRow title="Simulation card — design options" subtitle="Same 30-second sim, different invitations. Pick a direction, then we build it out." />

      {/* A — statement hero (current, trimmed) */}
      <div style={{ marginBottom: 'var(--lp-spacing-700)' }}>
        <Variant tag="A · Statement hero" note="current direction, now without the dots strip">
          <DsSimHero onWatch={onWatch} />
        </Variant>
      </div>

      {/* B — subtle bar */}
      <div style={{ marginBottom: 'var(--lp-spacing-700)' }}>
        <Variant tag="B · Subtle bar" note="smallest footprint, sits quietly above the products">
          <div className="ds-card" style={{ display: 'flex', alignItems: 'center', gap: 'var(--lp-spacing-400)', padding: 'var(--lp-spacing-400) var(--lp-spacing-500)' }}>
            <span className="ds-step-ic" style={{ background: BLUE, width: 34, height: 34 }}><LpIcon name="shield-heart" size={18} /></span>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontWeight: 'var(--lp-font-weight-semibold)', fontSize: 'var(--lp-font-size-300)' }}>See a guarded release catch a bad deploy and heal itself</div>
              <div className="ds-muted" style={{ fontSize: 'var(--lp-font-size-200)' }}>30 seconds, no setup.</div>
            </div>
            <DsButton variant="primary" onClick={onWatch}><LpIcon name="play-circle" size={16} /> Watch</DsButton>
          </div>
        </Variant>
      </div>

      <div className="cols" style={{ gridTemplateColumns: '1fr 1fr', gap: 'var(--lp-spacing-600)', marginBottom: 'var(--lp-spacing-700)' }}>
        {/* C — with a chart visual */}
        <Variant tag="C · With a chart" note="shows the curve break and recover">
          <div className="ds-card ds-card-pad" style={{ height: '100%' }}>
            <span className="ds-chip brand" style={{ marginBottom: 'var(--lp-spacing-300)' }}><LpIcon name="shield-heart" size={13} /> Guarded releases</span>
            <h3 className="ds-display" style={{ fontSize: 'var(--lp-font-size-400)' }}>Watch the metric break, then recover</h3>
            <div style={{ margin: 'var(--lp-spacing-400) 0' }}><SimCurve /></div>
            <DsButton variant="primary" onClick={onWatch}><LpIcon name="bolt" size={16} /> Watch the simulation</DsButton>
          </div>
        </Variant>

        {/* D — video thumbnail */}
        <Variant tag="D · Video thumbnail" note="reads like a 30-second lesson">
          <div className="ds-card" style={{ overflow: 'hidden', height: '100%' }}>
            <div style={{ position: 'relative', aspectRatio: '16 / 8', background: 'linear-gradient(135deg, rgba(66,94,255,0.14), rgba(135,23,205,0.12))', display: 'grid', placeItems: 'center' }}>
              <div style={{ position: 'absolute', inset: 0, display: 'flex', gap: 5, alignItems: 'center', justifyContent: 'center', opacity: 0.5 }}>
                {Array.from({ length: 16 }).map((_, i) => (
                  <span key={i} style={{ width: 11, height: 11, borderRadius: 3, background: i < 4 ? BLUE : i % 4 === 0 && i < 9 ? RED : 'var(--lp-color-bg-ui-tertiary)' }} />
                ))}
              </div>
              <button onClick={onWatch} aria-label="Watch" style={{ position: 'relative', width: 56, height: 56, borderRadius: '50%', border: 'none', background: 'var(--lp-color-bg-ui-primary)', boxShadow: '0 6px 18px rgba(0,0,0,0.18)', display: 'grid', placeItems: 'center', cursor: 'pointer', color: BLUE }}>
                <LpIcon name="play-circle" size={30} />
              </button>
              <span className="ds-chip" style={{ position: 'absolute', bottom: 10, right: 10 }}>0:30</span>
            </div>
            <div style={{ padding: 'var(--lp-spacing-400) var(--lp-spacing-500)' }}>
              <div style={{ fontWeight: 'var(--lp-font-weight-semibold)', fontSize: 'var(--lp-font-size-300)' }}>Watch a guarded release self-heal</div>
              <div className="ds-muted" style={{ fontSize: 'var(--lp-font-size-200)', marginTop: 2 }}>Ramp → regression → automatic rollback</div>
            </div>
          </div>
        </Variant>
      </div>

      <div className="cols" style={{ gridTemplateColumns: '1fr 1fr', gap: 'var(--lp-spacing-600)', marginBottom: 'var(--lp-spacing-800)' }}>
        {/* E — animated dots */}
        <Variant tag="E · Live dots" note="the rollout animates in place (reuses the strip we removed)">
          <div className="ds-card ds-card-pad" style={{ height: '100%' }}>
            <h3 className="ds-display" style={{ fontSize: 'var(--lp-font-size-300)' }}>This is the rollout you'll watch</h3>
            <div style={{ margin: 'var(--lp-spacing-400) 0' }}><DsMiniRollout /></div>
            <p className="ds-muted" style={{ fontSize: 'var(--lp-font-size-200)', marginBottom: 'var(--lp-spacing-400)' }}>Green is healthy traffic; red is the regression that triggers the rollback.</p>
            <DsButton variant="primary" onClick={onWatch}><LpIcon name="bolt" size={16} /> Watch it run</DsButton>
          </div>
        </Variant>

        {/* F — three beats timeline */}
        <Variant tag="F · Three beats" note="the story as a tiny timeline">
          <div className="ds-card ds-card-pad" style={{ height: '100%' }}>
            <h3 className="ds-display" style={{ fontSize: 'var(--lp-font-size-300)' }}>Three beats, 30 seconds</h3>
            <div style={{ display: 'flex', alignItems: 'flex-start', margin: 'var(--lp-spacing-500) 0' }}>
              {beat('Ramp to 10%', 'flag', BLUE)}
              {line}
              {beat('Regression detected', 'pulse', RED)}
              {line}
              {beat('Auto-rollback ~200ms', 'shield', GREEN)}
            </div>
            <DsButton variant="primary" onClick={onWatch}><LpIcon name="bolt" size={16} /> Watch the simulation</DsButton>
          </div>
        </Variant>
      </div>

      {/* platform-fit visual */}
      <div style={{ display: 'flex', alignItems: 'baseline', gap: 'var(--lp-spacing-300)', marginBottom: 'var(--lp-spacing-500)' }}>
        <h2 className="ds-display" style={{ fontSize: 'var(--lp-font-size-400)' }}>How it all fits together</h2>
        <span className="ds-muted" style={{ fontSize: 'var(--lp-font-size-200)' }}>a visual for the home, so the products do not read as five separate tools</span>
      </div>
      <div className="ds-card ds-card-pad">
        <PlatformFit />
        <p className="ds-muted" style={{ fontSize: 'var(--lp-font-size-200)', marginTop: 'var(--lp-spacing-500)', maxWidth: 720, lineHeight: 1.5 }}>
          Flags are the foundation. Guarded releases and experiments are just flags that watch a metric; observability supplies that metric; AI Configs are flags whose value is a model and prompt. One platform, one context.
        </p>
      </div>
    </div>
  )
}
