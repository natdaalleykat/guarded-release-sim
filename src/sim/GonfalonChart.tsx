import { memo } from 'react'
import { type MetricOption, type ContextOption, fmtMetric, fmtPop } from '../data/content'
import { END_T, type SimState } from './useSimulation'
import { TREATMENT, CONTROL } from '../data/product'

/* A static, visually faithful take on LaunchDarkly's guarded rollout results
   chart: the treatment-vs-control DIFFERENCE over time with a shrinking
   credible-interval band, a zero line, a dashed regression-threshold line,
   a gray→red series, a pulsing head dot, and the variation results table. */

const W = 1000
const H = 230
const padL = 52
const padR = 96
const padT = 14
const padB = 22

function clamp(v: number, a: number, b: number) {
  return Math.max(a, Math.min(b, v))
}

function GonfalonChartInner({
  metric,
  context,
  state,
}: {
  metric: MetricOption
  context: ContextOption
  state: SimState
}) {
  const control = metric.baseline
  const rd = metric.regressed - control // signed difference at full regression
  const thr = metric.threshold - control // signed regression threshold (in diff units)
  const absRd = Math.abs(rd) || 1
  const pad = absRd * 0.18
  const yLo = Math.min(0, rd) - pad
  const yHi = Math.max(0, rd) + pad

  const x = (t: number) => padL + (t / END_T) * (W - padL - padR)
  const y = (d: number) => padT + (1 - (clamp(d, yLo, yHi) - yLo) / (yHi - yLo)) * (H - padT - padB)
  const margin = (t: number) => absRd * (0.08 + 0.22 * Math.exp(-t / 5)) // CI half-width, narrows over time

  const pts = state.history.length ? state.history : [{ t: 0, v: control }]
  const diffPts = pts.map((p) => ({ t: p.t, d: p.v - control }))
  const lineColor = state.breach ? 'var(--red)' : 'var(--text-2)'

  const hi = diffPts.map((p) => `${x(p.t).toFixed(1)},${y(p.d + margin(p.t)).toFixed(1)}`)
  const lo = diffPts.map((p) => `${x(p.t).toFixed(1)},${y(p.d - margin(p.t)).toFixed(1)}`).reverse()
  const band = `M ${hi.join(' L ')} L ${lo.join(' L ')} Z`
  const line = diffPts.map((p, i) => `${i === 0 ? 'M' : 'L'} ${x(p.t).toFixed(1)} ${y(p.d).toFixed(1)}`).join(' ')
  const head = diffPts[diffPts.length - 1]

  // results table values
  const tEst = state.metricValue
  const ciHalf = absRd * 0.05 + metric.noise
  const tSamp = state.contextsOnNew
  const cSamp = Math.round(state.contextsOnNew * 0.97)
  const enough = tSamp >= 100
  const cell = (s: string) => (enough ? s : '—')
  const swatch = (color: string) => (
    <span style={{ display: 'inline-block', width: 9, height: 9, borderRadius: 2, background: color, marginRight: 7, verticalAlign: 'middle' }} />
  )

  return (
    <div>
      <svg viewBox={`0 0 ${W} ${H}`} style={{ width: '100%', aspectRatio: `${W} / ${H}`, display: 'block' }}>
        {/* zero reference line */}
        <line x1={padL} y1={y(0)} x2={W - padR} y2={y(0)} stroke="var(--border)" strokeWidth="1" />
        <text x={padL - 8} y={y(0) + 4} textAnchor="end" fontSize="12" fill="var(--text-3)" fontFamily="var(--mono)">0</text>

        {/* credible-interval band */}
        <path d={band} fill={lineColor} fillOpacity="0.16" />

        {/* regression threshold */}
        <line x1={padL} y1={y(thr)} x2={W - padR} y2={y(thr)} stroke="var(--red)" strokeWidth="1.4" strokeDasharray="5 5" opacity="0.85" />
        <text x={W - padR + 7} y={y(thr) + 4} fontSize="10.5" fontWeight="600" fill="var(--red)">
          guardrail
        </text>

        {/* difference series */}
        <path d={line} fill="none" stroke={lineColor} strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />

        {/* pulsing head */}
        <circle cx={x(head.t)} cy={y(head.d)} r="4" fill={lineColor} />
        {!state.done && (
          <circle cx={x(head.t)} cy={y(head.d)} r="4" fill="none" stroke={lineColor} strokeWidth="1.5">
            <animate attributeName="r" values="4;13" dur="1.6s" repeatCount="indefinite" />
            <animate attributeName="opacity" values="0.6;0" dur="1.6s" repeatCount="indefinite" />
          </circle>
        )}
      </svg>

      <div className="faint" style={{ fontSize: 11.5, margin: '8px 2px 6px', fontFamily: 'var(--mono)' }}>
        Viewing: latest data
      </div>
      <table className="gf-table">
        <thead>
          <tr>
            <th style={{ textAlign: 'left' }}>Variation</th>
            <th>Estimate</th>
            <th>Lower</th>
            <th>Upper</th>
            <th>Sample size</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td className="gf-var">{swatch(TREATMENT.color)}{TREATMENT.name}</td>
            <td>{cell(fmtMetric(metric, tEst))}</td>
            <td>{cell(fmtMetric(metric, Math.max(0, tEst - ciHalf)))}</td>
            <td>{cell(fmtMetric(metric, tEst + ciHalf))}</td>
            <td>{cell(fmtPop(tSamp))}</td>
          </tr>
          <tr>
            <td className="gf-var">{swatch(CONTROL.color)}{CONTROL.name}</td>
            <td>{cell(fmtMetric(metric, control))}</td>
            <td>{cell(fmtMetric(metric, Math.max(0, control - ciHalf * 0.7)))}</td>
            <td>{cell(fmtMetric(metric, control + ciHalf * 0.7))}</td>
            <td>{cell(fmtPop(cSamp))}</td>
          </tr>
        </tbody>
      </table>
      <div className="faint" style={{ fontSize: 11, marginTop: 8, lineHeight: 1.4 }}>
        A regression is called when the whole interval crosses the guardrail. Rolling out by {context.singular}.
      </div>
    </div>
  )
}

export const GonfalonChart = memo(GonfalonChartInner)
