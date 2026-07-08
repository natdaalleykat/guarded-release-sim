import { memo } from 'react'
import type { MetricOption } from '../data/content'
import { END_T, REG_DETECT_T } from './useSimulation'

interface Props {
  metric: MetricOption
  history: { t: number; v: number }[]
  tNow: number
  treatmentNow: number
  controlNow: number
  breach: boolean
}

const W = 1000
const H = 250
const padL = 54
const padR = 16
const padT = 16
const padB = 26

/* Detection semantics per the Guardian team: a regression is the new
   variation running significantly worse than CONTROL — there is no fixed
   threshold line. The chart shades the treatment-vs-control gap; the moment
   the gap is sustained, the regression is called. After rollback the
   treatment line simply ends: no traffic, no data. */
function DiffChartInner({ metric, history, tNow, controlNow, breach }: Props) {
  const { yMin, yMax, betterDirection } = metric
  const x = (t: number) => padL + (t / END_T) * (W - padL - padR)
  const y = (v: number) => padT + (1 - (v - yMin) / (yMax - yMin)) * (H - padT - padB)
  const fmt = (v: number) => (metric.unit === 'ms' ? `${Math.round(v)}` : v.toFixed(metric.decimals))

  const pts = history.length ? history : [{ t: 0, v: metric.baseline }]
  const last = pts[pts.length - 1]
  const tline = pts.map((p, i) => `${i === 0 ? 'M' : 'L'} ${x(p.t).toFixed(1)} ${y(p.v).toFixed(1)}`).join(' ')

  // the treatment-vs-control gap, shaded only where treatment is WORSE
  const worse = (v: number) => (betterDirection === 'lower' ? v > controlNow : v < controlNow)
  const gap = pts
    .map((p) => ({ ...p, v: worse(p.v) ? p.v : controlNow }))
    .map((p, i) => `${i === 0 ? 'M' : 'L'} ${x(p.t).toFixed(1)} ${y(p.v).toFixed(1)}`)
    .join(' ')
  const gapClose = ` L ${x(last.t).toFixed(1)} ${y(controlNow).toFixed(1)} L ${x(pts[0].t).toFixed(1)} ${y(controlNow).toFixed(1)} Z`

  const ticks = [0, 0.5, 1].map((f) => yMin + (yMax - yMin) * f)
  const detected = tNow >= REG_DETECT_T
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

      {/* the gap between the variations — the thing the release is judged on */}
      <path d={gap + gapClose} fill="rgba(219,34,81,0.10)" stroke="none" />

      {/* control (flat, the comparison line) */}
      <line x1={padL} y1={y(controlNow)} x2={x(tNow)} y2={y(controlNow)} stroke="var(--text-3)" strokeWidth="2" strokeDasharray="2 4" />
      <text x={x(tNow) - 6} y={y(controlNow) + 16} textAnchor="end" fill="var(--text-3)" fontSize="11" fontWeight="600">
        control
      </text>

      {/* regression called: where the gap became sustained */}
      {detected && (
        <g>
          <line x1={detectX} y1={padT} x2={detectX} y2={H - padB} stroke="var(--red)" strokeWidth="1.2" strokeDasharray="4 4" opacity="0.65" />
          <text x={detectX + 6} y={padT + 12} fill="var(--red)" fontSize="11" fontWeight="600">
            regression vs control
          </text>
        </g>
      )}

      {/* treatment — ends at rollback (no traffic, no data) */}
      <path d={tline} fill="none" stroke={breach ? 'var(--red)' : 'var(--blue)'} strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" />
      <text x={x(pts[0].t) + 4} y={y(pts[0].v) - 8} fill="var(--blue)" fontSize="11" fontWeight="600">
        new variation
      </text>
      <circle cx={x(last.t)} cy={y(last.v)} r="4" fill={breach ? 'var(--red)' : 'var(--blue)'} stroke="#fff" strokeWidth="1.5" />
    </svg>
  )
}

export const DiffChart = memo(DiffChartInner)
