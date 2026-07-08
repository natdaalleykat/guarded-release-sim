import { memo } from 'react'
import type { MetricOption } from '../data/content'
import { END_T, REG_DETECT_T, ROLLBACK_START } from './useSimulation'

interface Props {
  metric: MetricOption
  history: { t: number; v: number }[]
  tNow: number
  treatmentNow: number
  controlNow: number
  breach: boolean
}

const W = 1000
/* kept shallow so the run view (chart + log + summary CTA) fits above the
   fold in the modal on laptop-height viewports */
const H = 205
const padL = 54
const padR = 16
const padT = 16
const padB = 26

/* Detection semantics per the Guardian team: a regression is the new
   variation running significantly worse than the STABLE VERSION — there is
   no fixed threshold line. The chart shades the gap between the variations:
   amber while it is being watched, red once the regression is called. After
   rollback the treatment line simply ends: no traffic, no data. The word
   "control" is deliberately avoided — day-0 trialists don't have the A/B
   vocabulary; "stable version" says the same thing in plain terms. */
function DiffChartInner({ metric, history, tNow, controlNow, breach }: Props) {
  const { yMin, yMax, betterDirection } = metric
  const x = (t: number) => padL + (t / END_T) * (W - padL - padR)
  const y = (v: number) => padT + (1 - (v - yMin) / (yMax - yMin)) * (H - padT - padB)
  const fmt = (v: number) => (metric.unit === 'ms' ? `${Math.round(v)}` : v.toFixed(metric.decimals))
  const fmtU = (v: number) => (metric.unit === 'ms' ? `${Math.round(v)} ms` : `${v.toFixed(metric.decimals)}${metric.unit}`)

  const pts = history.length ? history : [{ t: 0, v: metric.baseline }]
  const last = pts[pts.length - 1]
  const tline = pts.map((p, i) => `${i === 0 ? 'M' : 'L'} ${x(p.t).toFixed(1)} ${y(p.v).toFixed(1)}`).join(' ')

  // the gap between the variations, shaded only where the new variation is
  // WORSE; amber = watched, red = from the moment the regression is called
  const worse = (v: number) => (betterDirection === 'lower' ? v > controlNow : v < controlNow)
  const gapPath = (seg: { t: number; v: number }[]) => {
    if (seg.length < 2) return null
    const top = seg
      .map((p) => ({ ...p, v: worse(p.v) ? p.v : controlNow }))
      .map((p, i) => `${i === 0 ? 'M' : 'L'} ${x(p.t).toFixed(1)} ${y(p.v).toFixed(1)}`)
      .join(' ')
    const lastSeg = seg[seg.length - 1]
    return `${top} L ${x(lastSeg.t).toFixed(1)} ${y(controlNow).toFixed(1)} L ${x(seg[0].t).toFixed(1)} ${y(controlNow).toFixed(1)} Z`
  }
  const watchedGap = gapPath(pts.filter((p) => p.t <= REG_DETECT_T))
  const calledGap = gapPath(pts.filter((p) => p.t >= REG_DETECT_T))

  const ticks = [0, 0.5, 1].map((f) => yMin + (yMax - yMin) * f)
  const detected = tNow >= REG_DETECT_T
  const rolledBack = tNow > ROLLBACK_START
  const detectX = x(REG_DETECT_T)

  return (
    <svg viewBox={`0 0 ${W} ${H}`} style={{ width: '100%', aspectRatio: `${W} / ${H}`, display: 'block' }}>
      {ticks.map((tk, i) => (
        <g key={i}>
          <line x1={padL} y1={y(tk)} x2={W - padR} y2={y(tk)} stroke="rgba(7,8,12,0.07)" strokeWidth="1" />
          <text x={padL - 9} y={y(tk) + 4} textAnchor="end" fill="var(--text-3)" fontSize="12" fontFamily="var(--mono)">
            {fmt(tk)}
          </text>
        </g>
      ))}

      {/* gap while watched (never triggers anything on its own) */}
      {watchedGap && <path d={watchedGap} fill="rgba(214,122,0,0.14)" stroke="none" />}
      {/* gap once the regression is called */}
      {detected && calledGap && <path d={calledGap} fill="rgba(219,34,81,0.14)" stroke="none" />}

      {/* the stable version — the line the release is judged against */}
      <line x1={padL} y1={y(controlNow)} x2={x(tNow)} y2={y(controlNow)} stroke="rgba(7,8,12,0.55)" strokeWidth="2.4" />
      <text x={x(tNow) - 6} y={y(controlNow) + 17} textAnchor="end" fill="rgba(7,8,12,0.62)" fontSize="11.5" fontWeight="700">
        stable version · {fmtU(controlNow)}
      </text>

      {/* regression called: where the gap became sustained */}
      {detected && (
        <g>
          <line x1={detectX} y1={padT} x2={detectX} y2={H - padB} stroke="var(--red)" strokeWidth="1.2" strokeDasharray="4 4" opacity="0.65" />
          <text x={detectX + 6} y={padT + 12} fill="var(--red)" fontSize="11" fontWeight="600">
            regression detected
          </text>
        </g>
      )}

      {/* new variation — ends at rollback (no traffic, no data) */}
      <path d={tline} fill="none" stroke={breach ? 'var(--red)' : 'var(--blue)'} strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" />
      <text x={x(pts[0].t) + 4} y={y(pts[0].v) - 8} fill="var(--blue)" fontSize="11" fontWeight="600">
        new variation
      </text>
      <circle cx={x(last.t)} cy={y(last.v)} r="4" fill={breach ? 'var(--red)' : 'var(--blue)'} stroke="#fff" strokeWidth="1.5" />
      {rolledBack && (
        <text x={x(last.t) + 9} y={y(last.v) + 4} fill="var(--text-2, rgba(7,8,12,0.62))" fontSize="11" fontWeight="600">
          rolled back — no more traffic on the new variation
        </text>
      )}
    </svg>
  )
}

export const DiffChart = memo(DiffChartInner)
