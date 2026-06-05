import { AnimatePresence, motion } from 'framer-motion'
import type { SimEvent } from '../sim/useSimulation'
import { fmtElapsed } from '../sim/useSimulation'
import { AlertDiamond, CheckCircle, Bolt, Rollback, Spinner } from './icons'

function iconFor(kind: SimEvent['kind']) {
  switch (kind) {
    case 'check':
      return <CheckCircle size={18} style={{ color: 'var(--green)' }} />
    case 'good':
      return <CheckCircle size={18} style={{ color: 'var(--green-bright)' }} />
    case 'stage':
      return <Bolt size={16} style={{ color: 'var(--brand-bright)' }} />
    case 'warn':
      return <AlertDiamond size={18} style={{ color: 'var(--red-bright)' }} />
    case 'act':
      return <Rollback size={18} style={{ color: 'var(--amber-bright)' }} />
    default:
      return <Spinner size={16} className="spin" style={{ color: 'var(--text-dim)' }} />
  }
}

function rowClass(kind: SimEvent['kind']) {
  if (kind === 'warn') return 'feed-item warn'
  if (kind === 'act') return 'feed-item act'
  if (kind === 'good') return 'feed-item good'
  return 'feed-item'
}

export function ActivityFeed({ events }: { events: SimEvent[] }) {
  const visible = events.slice(0, 7)
  return (
    <div className="feed">
      <AnimatePresence initial={false}>
        {visible.map((e) => (
          <motion.div
            key={e.id}
            layout
            initial={{ opacity: 0, x: -14, scale: 0.97 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ type: 'spring', stiffness: 380, damping: 30 }}
            className={rowClass(e.kind)}
          >
            <span className="ic">{iconFor(e.kind)}</span>
            <span>{e.text}</span>
            <span className="ftime">{fmtElapsed(e.t)}</span>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  )
}
