import { Fragment } from 'react'
import type { Phase } from '../sim/useSimulation'
import { Check } from './icons'

interface Props {
  stages: number[]
  currentPct: number
  maxPct: number
  phase: Phase
}

type RungState = 'pending' | 'active' | 'done' | 'failed'

export function RolloutLadder({ stages, currentPct, maxPct, phase }: Props) {
  const broke = phase === 'regression' || phase === 'rollback' || phase === 'recovered'
  const rounded = Math.round(currentPct)
  const activeVal = phase === 'ramping' ? stages.filter((s) => s <= rounded + 0.5).pop() ?? 0 : -1

  const stateFor = (s: number): RungState => {
    if (s === 50 && broke) return 'failed'
    if (s === activeVal && phase === 'ramping') return 'active'
    if (maxPct >= s - 0.5 && s !== 100) return 'done'
    if (s === 100 && maxPct >= 99.5) return 'done'
    return 'pending'
  }

  const caption = (s: number, st: RungState) => {
    if (st === 'failed') return 'rolled back'
    if (st === 'active') return 'live'
    if (s === 100 && phase === 'recovered') return 'never reached'
    return ''
  }

  return (
    <div className="ladder">
      {stages.map((s, i) => {
        const st = stateFor(s)
        return (
          <Fragment key={s}>
            <div className={`rung ${st}`}>
              <div className="node">{st === 'done' ? <Check size={15} /> : `${s}%`}</div>
              <div className="label" style={{ minHeight: 14 }}>
                {caption(s, st)}
              </div>
            </div>
            {i < stages.length - 1 && (
              <div className="rung-line">
                <div
                  className="fill"
                  style={{
                    transform: `scaleX(${clamp01((maxPct - s) / (stages[i + 1] - s))})`,
                    transition: 'transform 0.6s cubic-bezier(0.16,1,0.3,1)',
                    background:
                      s === 25 && broke
                        ? 'linear-gradient(90deg, var(--brand), var(--red))'
                        : undefined,
                  }}
                />
              </div>
            )}
          </Fragment>
        )
      })}
    </div>
  )
}

function clamp01(v: number) {
  return Math.max(0, Math.min(1, v))
}
