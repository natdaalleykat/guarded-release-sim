import { useEffect, useRef, useState } from 'react'
import {
  type MetricOption,
  type ContextOption,
  fmtMetric,
  fmtPop,
} from '../data/content'
import { ROLLBACK_MS, BLAST } from '../data/product'

/* =========================================================================
   The simulation engine.
   A deterministic timeline (in compressed "sim seconds") that produces the
   rollout %, the live metric value, the regression, and the auto-rollback.
   Nothing here is real data. It is choreography.
   ========================================================================= */

export type Phase = 'idle' | 'ramping' | 'regression' | 'rollback' | 'recovered'

export interface SimEvent {
  id: number
  t: number
  kind: 'info' | 'check' | 'stage' | 'warn' | 'act' | 'good'
  text: string
}

export interface SimState {
  t: number
  phase: Phase
  rolloutPct: number
  maxPct: number
  newShare: number // 0..1 realized share on the new variation
  metricValue: number
  breach: boolean
  severity: number // 0..1
  history: { t: number; v: number }[]
  events: SimEvent[]
  checksPassed: number
  contextsOnNew: number
  done: boolean
  started: boolean
}

// --- timeline constants (sim seconds) ---
// A 30-second run: ramp 1% -> 5% -> 10%, regression hits ~10s in,
// auto-rollback, recover, and the value summary lands by ~24s.
// Detection semantics (per the Guardian team): a regression is the new
// variation running significantly WORSE THAN CONTROL, not a metric crossing
// a fixed threshold. Rollback is instant — traffic snaps to 0, and treatment
// data simply stops (nothing left to measure).
const REG_START = 10
const REG_PEAK = 14
/** the moment the regression is called on the feed/chart */
export const REG_DETECT_T = 13.6
export const ROLLBACK_START = 14.6
// with traffic snapped to control, the metric recovers almost immediately
const REC_START = 14.7
const REC_END = 16
const RECOVERED_T = 17
export const END_T = 30
/** when the in-run value summary (blast radius etc.) appears */
export const VALUE_T = 24

// An early "safe blip": the new variation drifts above control, the system
// shows the gap is tracked, it isn't significant, and it recovers — no rollback.
const SPIKE_START = 3.2
const SPIKE_PEAK = 5.4
const SPIKE_END = 8.2
const SPIKE_FACTOR = 0.8 // fraction of the way from baseline to the (internal) trip level

const GATE: [number, number][] = [
  [0, 0],
  [1.5, 1],
  [3.6, 1],
  [4.6, 5],
  [7.6, 5],
  [8.6, 10],
  [14.6, 10],
  [14.72, 0], // rollback is instant: one frame, not a ramp-down
  [END_T, 0],
]

/* auto-rollback off: nothing rolls back — the release keeps serving 10%
   and the regression keeps running until a human steps in */
const GATE_NOTIFY: [number, number][] = [
  [0, 0],
  [1.5, 1],
  [3.6, 1],
  [4.6, 5],
  [7.6, 5],
  [8.6, 10],
  [END_T, 10],
]

function lerp(a: number, b: number, t: number) {
  return a + (b - a) * t
}
function clamp(v: number, lo: number, hi: number) {
  return Math.max(lo, Math.min(hi, v))
}
function easeInOut(t: number) {
  return t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2
}
function lerpKeyframes(t: number, kf: [number, number][]) {
  if (t <= kf[0][0]) return kf[0][1]
  for (let i = 0; i < kf.length - 1; i++) {
    const [t0, v0] = kf[i]
    const [t1, v1] = kf[i + 1]
    if (t >= t0 && t <= t1) {
      const p = t1 === t0 ? 0 : (t - t0) / (t1 - t0)
      return lerp(v0, v1, p)
    }
  }
  return kf[kf.length - 1][1]
}

function metricAt(m: MetricOption, t: number, autoRollback = true): number {
  // early blip rises toward, but stays under, the (internal) trip level
  const near = m.baseline + (m.threshold - m.baseline) * SPIKE_FACTOR
  let base: number
  if (t < SPIKE_START) base = m.baseline
  else if (t < SPIKE_PEAK) base = lerp(m.baseline, near, easeInOut((t - SPIKE_START) / (SPIKE_PEAK - SPIKE_START)))
  else if (t < SPIKE_END) base = lerp(near, m.baseline, easeInOut((t - SPIKE_PEAK) / (SPIKE_END - SPIKE_PEAK)))
  else if (t < REG_START) base = m.baseline
  else if (t < REG_PEAK) base = lerp(m.baseline, m.regressed, easeInOut((t - REG_START) / (REG_PEAK - REG_START)))
  else if (!autoRollback) base = m.regressed // nobody rolled it back; it stays broken
  else if (t < REC_START) base = m.regressed
  else if (t < REC_END) base = lerp(m.regressed, m.baseline, easeInOut((t - REC_START) / (REC_END - REC_START)))
  else base = m.baseline
  const n =
    (Math.sin(t * 5.3) * 0.5 + Math.sin(t * 11.7 + 1.3) * 0.3 + Math.sin(t * 2.1 + 0.7) * 0.2) *
    m.noise
  return base + n
}

function isBreach(m: MetricOption, v: number): boolean {
  return m.betterDirection === 'lower' ? v > m.threshold : v < m.threshold
}

function severityAt(m: MetricOption, v: number): number {
  const span = Math.abs(m.regressed - m.threshold) || 1
  const past = m.betterDirection === 'lower' ? v - m.threshold : m.threshold - v
  return clamp(past / span, 0, 1)
}

export function phaseAt(m: MetricOption, t: number, autoRollback = true): Phase {
  if (t < 0.15) return 'idle'
  if (!autoRollback) {
    // no rollback ever happens; once the regression is real it stays
    return isBreach(m, metricAt(m, t, false)) ? 'regression' : 'ramping'
  }
  if (t >= RECOVERED_T) return 'recovered'
  if (t >= ROLLBACK_START) return 'rollback'
  if (isBreach(m, metricAt(m, t))) return 'regression'
  return 'ramping'
}

interface FrameParams {
  m: MetricOption
  c: ContextOption
  autoRollback: boolean
}

function frameAt(t: number, { m, c, autoRollback }: FrameParams) {
  const pct = lerpKeyframes(t, autoRollback ? GATE : GATE_NOTIFY)
  const newShare = pct / 100
  const value = metricAt(m, t, autoRollback)
  return {
    rolloutPct: pct,
    newShare,
    metricValue: value,
    breach: isBreach(m, value),
    severity: severityAt(m, value),
    phase: phaseAt(m, t, autoRollback),
    contextsOnNew: Math.round(newShare * c.population),
  }
}

// --- scripted activity-feed events ---
interface EventDef {
  t: number
  kind: SimEvent['kind']
  build: (p: FrameParams) => string
}

function buildEvents(autoRollback: boolean): EventDef[] {
  const v = (p: FrameParams, t: number) => fmtMetric(p.m, metricAt(p.m, t, autoRollback))
  const ctrl = (p: FrameParams) => fmtMetric(p.m, p.m.baseline)
  const shared: EventDef[] = [
    { t: 0.4, kind: 'info', build: (p) => `Guarded release started. Serving the new variation to 1% of ${p.c.plural}; everyone else stays on the original variation.` },
    { t: 2.2, kind: 'check', build: (p) => `Regression check passed. New variation level with the original variation (${v(p, 2.2)} vs ${ctrl(p)}).` },
    { t: 4.4, kind: 'stage', build: () => `Ramped to 5%.` },
    { t: 5.2, kind: 'info', build: (p) => `${cap(p.m.short)} ticking up on the new variation — ${v(p, 5.2)} vs ${ctrl(p)} on the original variation. Watching the gap.` },
    { t: 6.0, kind: 'check', build: () => `Gap is not significant. Holding — noise alone never triggers a rollback.` },
    { t: 7.8, kind: 'good', build: (p) => `Blip cleared. New variation back level with the original variation at ${v(p, 7.8)}.` },
    { t: 8.8, kind: 'stage', build: () => `Ramped to 10%.` },
    { t: 10.8, kind: 'info', build: () => `Running regression check...` },
    { t: 11.8, kind: 'warn', build: (p) => `New variation pulling away from the original variation: ${v(p, 11.8)} vs ${ctrl(p)}.` },
    { t: REG_DETECT_T, kind: 'warn', build: (p) => `Regression detected. ${p.m.label} is significantly worse than the original variation.` },
  ]
  if (autoRollback) {
    return [
      ...shared,
      { t: 14.7, kind: 'act', build: (p) => `Automatic rollback executed in ~${ROLLBACK_MS} ms. 100% of ${p.c.plural} instantly back on the original variation.` },
      { t: 16.4, kind: 'good', build: () => `New-variation traffic: 0%. No one else gets exposed.` },
      { t: 18.2, kind: 'good', build: (p) => `${cap(p.m.short)} back at the original variation's baseline (${ctrl(p)}).` },
      { t: 21.8, kind: 'good', build: (p) => `Guarded release stopped. Nothing to revert by hand — ${p.c.plural} never noticed.` },
      { t: 23.4, kind: 'good', build: (p) => `${BLAST.protected}% of ${p.c.plural} were never exposed to the regression.` },
    ]
  }
  // the notify-only ending: the alert fires, and the regression keeps running
  return [
    ...shared,
    { t: 14.7, kind: 'act', build: (p) => `Alert sent: regression on ${p.m.label}. Auto-rollback is off, so the release keeps running.` },
    { t: 16.4, kind: 'warn', build: (p) => `Still serving 10% of ${p.c.plural}. ${cap(p.m.short)} holding at ${v(p, 16.4)}.` },
    { t: 18.2, kind: 'warn', build: () => `Waiting on a human to see the alert and revert by hand.` },
    { t: 21.8, kind: 'warn', build: (p) => `Regression ongoing. Every minute at 10% is more ${p.c.plural} hitting the bad version.` },
    { t: 23.4, kind: 'info', build: () => `With auto-rollback on, this would have been over at 15 seconds — flip it back on and replay.` },
  ]
}

function cap(s: string) {
  return s.charAt(0).toUpperCase() + s.slice(1)
}

export function fmtElapsed(t: number): string {
  const total = Math.floor(t)
  const mm = Math.floor(total / 60)
  const ss = total % 60
  return `T+${mm}:${ss.toString().padStart(2, '0')}`
}

const SAMPLE_DT = 0.14 // seconds between chart samples
const UI_DT = 42 // ms between React state pushes

export function useSimulation(m: MetricOption, c: ContextOption, autoStart = true, autoRollback = true) {
  const [state, setState] = useState<SimState>(() => ({
    t: 0,
    phase: 'idle',
    rolloutPct: 0,
    maxPct: 0,
    newShare: 0,
    metricValue: m.baseline,
    breach: false,
    severity: 0,
    history: [{ t: 0, v: m.baseline }],
    events: [],
    checksPassed: 0,
    contextsOnNew: 0,
    done: false,
    started: false,
  }))

  const raf = useRef<number | null>(null)
  const startedAt = useRef<number | null>(null)
  const lastUi = useRef(0)
  const lastSample = useRef(0)
  const history = useRef<{ t: number; v: number }[]>([{ t: 0, v: m.baseline }])
  const emitted = useRef<Set<number>>(new Set())
  const events = useRef<SimEvent[]>([])
  const checks = useRef(0)
  const maxPct = useRef(0)
  const eventDefs = useRef<EventDef[]>(buildEvents(autoRollback))
  const running = useRef(false)

  function start() {
    if (running.current) return
    running.current = true
    startedAt.current = null
    setState((s) => ({ ...s, started: true }))

    const tick = (now: number) => {
      if (startedAt.current === null) startedAt.current = now
      const t = Math.min((now - startedAt.current) / 1000, END_T)
      const f = frameAt(t, { m, c, autoRollback })
      maxPct.current = Math.max(maxPct.current, f.rolloutPct)

      // emit due events
      eventDefs.current.forEach((def, i) => {
        if (t >= def.t && !emitted.current.has(i)) {
          emitted.current.add(i)
          if (def.kind === 'check') checks.current += 1
          events.current = [
            { id: i, t: def.t, kind: def.kind, text: def.build({ m, c, autoRollback }) },
            ...events.current,
          ]
        }
      })

      // sample history — with auto-rollback on, treatment data ends at
      // rollback (no traffic on the new variation means nothing left to
      // measure); close the line with one final sample exactly at that
      // moment. With it off, the line keeps going: the regression is live.
      if ((!autoRollback || t <= ROLLBACK_START) && (t - lastSample.current >= SAMPLE_DT || t >= END_T)) {
        lastSample.current = t
        history.current = [...history.current, { t, v: f.metricValue }]
      } else if (autoRollback && t > ROLLBACK_START && lastSample.current < ROLLBACK_START) {
        lastSample.current = ROLLBACK_START
        history.current = [...history.current, { t: ROLLBACK_START, v: metricAt(m, ROLLBACK_START) }]
      }

      // throttle React updates
      if (now - lastUi.current >= UI_DT || t >= END_T) {
        lastUi.current = now
        setState({
          t,
          phase: f.phase,
          rolloutPct: f.rolloutPct,
          maxPct: maxPct.current,
          newShare: f.newShare,
          metricValue: f.metricValue,
          breach: f.breach,
          severity: f.severity,
          history: history.current,
          events: events.current,
          checksPassed: checks.current,
          contextsOnNew: f.contextsOnNew,
          done: t >= END_T,
          started: true,
        })
      }

      if (t < END_T) {
        raf.current = requestAnimationFrame(tick)
      } else {
        running.current = false
      }
    }
    raf.current = requestAnimationFrame(tick)
  }

  useEffect(() => {
    if (autoStart) start()
    return () => {
      if (raf.current) cancelAnimationFrame(raf.current)
      running.current = false
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return { state, contextsLabel: fmtPop(c.population) }
}
