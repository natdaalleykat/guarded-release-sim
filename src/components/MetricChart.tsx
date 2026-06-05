import { memo } from 'react'
import type { MetricOption } from '../data/content'
import { END_T, type Phase } from '../sim/useSimulation'

interface Props {
  metric: MetricOption
  history: { t: number; v: number }[]
  tNow: number
  vNow: number
  breach: boolean
  phase: Phase
}

const W = 1000
const H = 340
const padL = 60
const padR = 20
const padT = 22
const padB = 30

function MetricChartInner({ metric, history, tNow, vNow, breach }: Props) {
  const { yMin, yMax, threshold, betterDirection } = metric
  const x = (t: number) => padL + (t / END_T) * (W - padL - padR)
  const y = (v: number) => padT + (1 - (v - yMin) / (yMax - yMin)) * (H - padT - padB)

  const fmt = (v: number) => (metric.unit === 'ms' ? `${Math.round(v)}` : v.toFixed(metric.decimals))

  // line path
  const pts = history.length ? history : [{ t: 0, v: metric.baseline }]
  const line = pts.map((p, i) => `${i === 0 ? 'M' : 'L'} ${x(p.t).toFixed(1)} ${y(p.v).toFixed(1)}`).join(' ')
  const area =
    `M ${x(pts[0].t).toFixed(1)} ${y(pts[0].v).toFixed(1)} ` +
    pts.map((p) => `L ${x(p.t).toFixed(1)} ${y(p.v).toFixed(1)}`).join(' ') +
    ` L ${x(pts[pts.length - 1].t).toFixed(1)} ${H - padB} L ${x(pts[0].t).toFixed(1)} ${H - padB} Z`

  // danger threshold normalized position for the stroke gradient
  const tY = (y(threshold) - padT) / (H - padT - padB)
  const dangerAtTop = betterDirection === 'lower'
  const colTop = dangerAtTop ? 'var(--red)' : 'var(--green)'
  const colBot = dangerAtTop ? 'var(--green)' : 'var(--red)'

  // danger zone rectangle
  const dangerRect = dangerAtTop
    ? { y: padT, h: y(threshold) - padT }
    : { y: y(threshold), h: H - padB - y(threshold) }

  // y gridlines
  const ticks = [0, 0.25, 0.5, 0.75, 1].map((f) => yMin + (yMax - yMin) * f)

  const dotX = x(tNow)
  const dotY = y(vNow)

  return (
    <div className="chart-wrap">
      <svg className="chart-svg" viewBox={`0 0 ${W} ${H}`} style={{ aspectRatio: `${W} / ${H}` }}>
        <defs>
          <linearGradient id="lineGrad" x1="0" y1={padT} x2="0" y2={H - padB} gradientUnits="userSpaceOnUse">
            <stop offset="0" stopColor={colTop} />
            <stop offset={Math.max(0, tY - 0.012).toFixed(3)} stopColor={colTop} />
            <stop offset={Math.min(1, tY + 0.012).toFixed(3)} stopColor={colBot} />
            <stop offset="1" stopColor={colBot} />
          </linearGradient>
          <linearGradient id="areaGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="rgba(110,139,255,0.28)" />
            <stop offset="1" stopColor="rgba(110,139,255,0)" />
          </linearGradient>
          <filter id="glowLine" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="3.2" result="b" />
            <feMerge>
              <feMergeNode in="b" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* danger zone */}
        <rect
          x={padL}
          y={dangerRect.y}
          width={W - padL - padR}
          height={Math.max(0, dangerRect.h)}
          fill="rgba(255,84,112,0.07)"
        />

        {/* gridlines + y labels */}
        {ticks.map((tk, i) => (
          <g key={i}>
            <line x1={padL} y1={y(tk)} x2={W - padR} y2={y(tk)} stroke="rgba(150,170,214,0.08)" strokeWidth="1" />
            <text x={padL - 10} y={y(tk) + 4} textAnchor="end" fill="var(--text-faint)" className="mono" fontSize="12">
              {fmt(tk)}
            </text>
          </g>
        ))}

        {/* guardrail line */}
        <line
          x1={padL}
          y1={y(threshold)}
          x2={W - padR}
          y2={y(threshold)}
          stroke="var(--red)"
          strokeWidth="1.6"
          strokeDasharray="7 6"
          opacity="0.85"
        />
        <g transform={`translate(${W - padR - 96}, ${y(threshold) - 22})`}>
          <rect width="96" height="18" rx="5" fill="rgba(255,84,112,0.16)" stroke="rgba(255,84,112,0.5)" />
          <text x="48" y="12.5" textAnchor="middle" fill="var(--red-bright)" className="danger-label">
            GUARDRAIL
          </text>
        </g>

        {/* area + line */}
        <path d={area} fill="url(#areaGrad)" opacity="0.9" />
        <path d={line} fill="none" stroke="url(#lineGrad)" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" filter="url(#glowLine)" />

        {/* now dot */}
        <circle cx={dotX} cy={dotY} r="9" fill={breach ? 'rgba(255,84,112,0.25)' : 'rgba(47,215,157,0.25)'} />
        <circle cx={dotX} cy={dotY} r="4.5" fill={breach ? 'var(--red-bright)' : 'var(--green-bright)'} stroke="#0a0e18" strokeWidth="1.5" />
      </svg>
    </div>
  )
}

export const MetricChart = memo(MetricChartInner)
