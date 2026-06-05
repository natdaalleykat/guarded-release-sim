import { memo, useMemo } from 'react'
import type { Phase } from '../sim/useSimulation'

interface Props {
  newShare: number // 0..1
  severity: number // 0..1
  phase: Phase
  cols?: number
  rows?: number
}

function FleetGridInner({ newShare, severity, phase, cols = 30, rows = 13 }: Props) {
  const count = cols * rows
  // a stable scattered adoption order, assigned once
  const ranks = useMemo(() => {
    const r = Array.from({ length: count }, () => Math.random())
    return r
  }, [count])

  const showBad = phase === 'regression' || phase === 'rollback'

  return (
    <div>
      <div className="fleet" style={{ gridTemplateColumns: `repeat(${cols}, 1fr)` }}>
        {ranks.map((rank, i) => {
          const isNew = rank < newShare
          // newest-adopted cohort breaks first; severity grows the bad fraction
          const within = newShare > 0 ? rank / newShare : 0
          const isBad = isNew && showBad && within > 1 - severity * 1.02
          const cls = isBad ? 'cell bad' : isNew ? 'cell new' : 'cell'
          return <div key={i} className={cls} />
        })}
      </div>
      <div className="flex items-center gap-5 mt-3" style={{ fontSize: 11.5, color: 'var(--text-faint)' }}>
        <Legend swatch="#1a2236" border="rgba(150,170,214,0.2)" label="Stable version" />
        <Legend swatch="var(--brand)" border="var(--brand-bright)" label="New checkout" />
        <Legend swatch="var(--red)" border="var(--red-bright)" label="Failing" />
      </div>
    </div>
  )
}

function Legend({ swatch, border, label }: { swatch: string; border: string; label: string }) {
  return (
    <span className="flex items-center gap-2">
      <span
        style={{
          width: 11,
          height: 11,
          borderRadius: 3,
          background: swatch,
          border: `1px solid ${border}`,
          display: 'inline-block',
        }}
      />
      {label}
    </span>
  )
}

export const FleetGrid = memo(FleetGridInner)
