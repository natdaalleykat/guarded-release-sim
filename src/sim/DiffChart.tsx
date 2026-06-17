import { memo } from 'react'
import type { MetricOption } from '../data/content'
import { END_T } from './useSimulation'

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

function DiffChartInner({ metric, history, tNow, controlNow, breach }: Props) {
  const { yMin, yMax, threshold, betterDirection } = metric
  const x = (t: number) => padL + (t / END_T) * (W - padL - padR)
  const y = (v: number) => padT + (1 - (v - yMin) / (yMax - yMin)) * (H - padT - padB)
  const fmt = (v: number) => (metric.unit === 'ms' ? `${Math.round(v)}` : v.toFixed(metric.decimals))

  const pts = history.length ? history : [{ t: 0, v: metric.baseline }]
  const tline = pts.map((p, i) => `${i === 0 ? 'M' : 'L'} ${x(p.t).toFixed(1)} ${y(p.v).toFixed(1)}`).join(' ')

  const tY = (y(threshold) - padT) / (H - padT - padB)
  const dangerTop = betterDirection === 'lower'
  const colTop = dangerTop ? 'var(--red)' : 'var(--blue)'
  const colBot = dangerTop ? 'var(--blue)' : 'var(--red)'

  const dangerRect = dangerTop
    ? { y: padT, h: y(threshold) - padT }
    : { y: y(threshold), h: H - padB - y(threshold) }

  const ticks = [0, 0.5, 1].map((f) => yMin + (yMax - yMin) * f)

  return (
    <svg viewBox={`0 0 ${W} ${H}`} style={{ width: '100%', aspectRatio: `${W} / ${H}`, display: 'block' }}>
      <defs>
        <linearGradient id="tGrad" x1="0" y1={padT} x2="0" y2={H - padB} gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor={colTop} />
          <stop offset={Math.max(0, tY - 0.01).toFixed(3)} stopColor={colTop} />
          <stop offset={Math.min(1, tY + 0.01).toFixed(3)} stopColor={colBot} />
          <stop offset="1" stopColor={colBot} />
        </linearGradient>
      </defs>

      <rect x={padL} y={dangerRect.y} width={W - padL - padR} height={Math.max(0, dangerRect.h)} fill="rgba(219,34,81,0.05)" />

      {ticks.map((tk, i) => (
        <g key={i}>
          <line x1={padL} y1={y(tk)} x2={W - padR} y2={y(tk)} stroke="rgba(7,8,12,0.07)" strokeWidth="1" />
          <text x={padL - 9} y={y(tk) + 4} textAnchor="end" fill="var(--text-3)" fontSize="12" fontFamily="var(--mono)">
            {fmt(tk)}
          </text>
        </g>
      ))}

      {/* guardrail */}
      <line x1={padL} y1={y(threshold)} x2={W - padR} y2={y(threshold)} stroke="var(--red)" strokeWidth="1.4" strokeDasharray="6 5" opacity="0.7" />
      <text x={W - padR} y={y(threshold) - 6} textAnchor="end" fill="var(--red)" fontSize="11" fontWeight="600">
        guardrail
      </text>

      {/* control (flat) */}
      <line x1={padL} y1={y(controlNow)} x2={x(tNow)} y2={y(controlNow)} stroke="var(--text-3)" strokeWidth="2" strokeDasharray="2 4" />

      {/* treatment */}
      <path d={tline} fill="none" stroke="url(#tGrad)" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx={x(tNow)} cy={y(pts[pts.length - 1].v)} r="4" fill={breach ? 'var(--red)' : 'var(--blue)'} stroke="#fff" strokeWidth="1.5" />
    </svg>
  )
}

export const DiffChart = memo(DiffChartInner)
