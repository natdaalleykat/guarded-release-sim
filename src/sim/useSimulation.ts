import { useEffect, useRef, useState } from 'react'
import {
  type MetricOption,
  type ContextOption,
  fmtMetric,
  fmtPop,
} from '../data/content'

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
// Tuned so the whole run lands in ~36s and the regression is caught at the
// 10% stage: ramp 1% -> 5% -> 10%, break, auto-rollback, recover.
const REG_START = 21
const REG_PEAK = 26
const REC_START = 27.5
const REC_END = 32
const ROLLBACK_START = 27
const RECOVERED_T = 32.5
export const END_T = 36

const GATE: [number, number][] = [
  [0, 0],
  [2, 1],
  [6, 1],
  [8, 5],
  [16, 5],
  [18, 10],
  [27, 10],
  [31, 0],
  [END_T, 0],
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

function metricAt(m: MetricOption, t: number): number {
  let base: number
  if (t < REG_START) base = m.baseline
  else if (t < REG_PEAK) base = lerp(m.baseline, m.regressed, easeInOut((t - REG_START) / (REG_PEAK - REG_START)))
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

export function phaseAt(m: MetricOption, t: number): Phase {
  if (t < 0.15) return 'idle'
  if (t >= RECOVERED_T) return 'recovered'
  if (t >= ROLLBACK_START) return 'rollback'
  if (isBreach(m, metricAt(m, t))) return 'regression'
  return 'ramping'
}

interface FrameParams {
  m: MetricOption
  c: ContextOption
}

function frameAt(t: number, { m, c }: FrameParams) {
  const pct = lerpKeyframes(t, GATE)
  const newShare = pct / 100
  const value = metricAt(m, t)
  return {
    rolloutPct: pct,
    newShare,
    metricValue: value,
    breach: isBreach(m, value),
    severity: severityAt(m, value),
    phase: phaseAt(m, t),
    contextsOnNew: Math.round(newShare * c.population),
  }
}

// --- scripted activity-feed events ---
interface EventDef {
  t: number
  kind: SimEvent['kind']
  build: (p: FrameParams) => string
}

function buildEvents(): EventDef[] {
  const v = (p: FrameParams, t: number) => fmtMetric(p.m, metricAt(p.m, t))
  return [
    { t: 0.4, kind: 'info', build: (p) => `Guarded release started. Serving new variation to 1% of ${p.c.plural}.` },
    { t: 3.5, kind: 'check', build: (p) => `Guardrail check passed. ${cap(p.m.short)} ${v(p, 3.5)}.` },
    { t: 8.2, kind: 'stage', build: () => `Ramped to 5%. Metric holding steady.` },
    { t: 12.0, kind: 'check', build: (p) => `Guardrail check passed. ${cap(p.m.short)} ${v(p, 12)}.` },
    { t: 16.5, kind: 'check', build: (p) => `Guardrail check passed. ${cap(p.m.short)} ${v(p, 16.5)}.` },
    { t: 18.3, kind: 'stage', build: () => `Ramped to 10%.` },
    { t: 21.0, kind: 'info', build: () => `Running guardrail check...` },
    { t: 22.9, kind: 'warn', build: (p) => `${p.m.label} is crossing the guardrail. ${v(p, 22.9)}.` },
    { t: 26.0, kind: 'warn', build: (p) => `Regression detected on ${p.m.label}. Guardrail: ${p.m.guardrailPhrase}.` },
    { t: 26.8, kind: 'act', build: (p) => `Automatic rollback initiated. Returning ${p.c.plural} to the stable version.` },
    { t: 28.5, kind: 'act', build: () => `Rollback propagating. New-variation traffic falling.` },
    { t: 30.5, kind: 'good', build: (p) => `Rollback complete. All ${p.c.plural} are back on the stable version.` },
    { t: 32.5, kind: 'good', build: (p) => `Guarded release stopped. ${cap(p.m.short)} recovered to ${v(p, 33)}.` },
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

export function useSimulation(m: MetricOption, c: ContextOption, autoStart = true) {
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
  const eventDefs = useRef<EventDef[]>(buildEvents())
  const running = useRef(false)

  function start() {
    if (running.current) return
    running.current = true
    startedAt.current = null
    setState((s) => ({ ...s, started: true }))

    const tick = (now: number) => {
      if (startedAt.current === null) startedAt.current = now
      const t = Math.min((now - startedAt.current) / 1000, END_T)
      const f = frameAt(t, { m, c })
      maxPct.current = Math.max(maxPct.current, f.rolloutPct)

      // emit due events
      eventDefs.current.forEach((def, i) => {
        if (t >= def.t && !emitted.current.has(i)) {
          emitted.current.add(i)
          if (def.kind === 'check') checks.current += 1
          events.current = [
            { id: i, t: def.t, kind: def.kind, text: def.build({ m, c }) },
            ...events.current,
          ]
        }
      })

      // sample history
      if (t - lastSample.current >= SAMPLE_DT || t >= END_T) {
        lastSample.current = t
        history.current = [...history.current, { t, v: f.metricValue }]
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
