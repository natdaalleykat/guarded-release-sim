import { useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Check } from '../components/icons'

/* A tiny mock of the production checkout app, so the abstract chart connects
   to "real customers clicking your live thing." Orders succeed normally and
   start failing while the release is in regression. Option F only. */
export function CheckoutApp({ breach }: { breach: boolean }) {
  const [orders, setOrders] = useState<boolean[]>([])
  const [tick, setTick] = useState(0)
  const breachRef = useRef(breach)
  breachRef.current = breach

  useEffect(() => {
    const id = setInterval(() => {
      setOrders((o) => [...o.slice(-15), !breachRef.current])
      setTick((t) => t + 1)
    }, 1050)
    return () => clearInterval(id)
  }, [])

  const ok = orders.length ? orders[orders.length - 1] : true

  return (
    <div
      style={{
        border: '1px solid var(--border)',
        borderRadius: 'var(--r-md)',
        overflow: 'hidden',
        background: 'var(--bg)',
      }}
    >
      {/* browser chrome */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 8,
          padding: '7px 12px',
          background: 'var(--bg-sub)',
          borderBottom: '1px solid var(--border-soft)',
        }}
      >
        <span style={{ display: 'flex', gap: 5 }}>
          {['#ff5f57', '#febc2e', '#28c840'].map((c) => (
            <span key={c} style={{ width: 9, height: 9, borderRadius: '50%', background: c, opacity: 0.7 }} />
          ))}
        </span>
        <span className="mono" style={{ fontSize: 11.5, color: 'var(--text-3)' }}>
          shop.example.com/checkout
        </span>
        <span className="badge blue" style={{ marginLeft: 'auto', fontSize: 10 }}>Checkout v2 · live</span>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: 16, padding: '14px 16px' }}>
        {/* cart + button */}
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontSize: 13, fontWeight: 650 }}>Your cart</div>
          <div className="faint" style={{ fontSize: 12, marginTop: 1 }}>2 items · $48.00</div>
          <div style={{ position: 'relative', display: 'inline-block', marginTop: 10 }}>
            <div
              className="btn"
              style={{ fontSize: 13, padding: '8px 16px', pointerEvents: 'none', background: 'var(--blue)' }}
            >
              Place order
            </div>
            {/* click ripple on each attempt */}
            <AnimatePresence>
              <motion.span
                key={tick}
                initial={{ opacity: 0.5, scale: 0.3 }}
                animate={{ opacity: 0, scale: 1.6 }}
                transition={{ duration: 0.8, ease: 'easeOut' }}
                style={{
                  position: 'absolute',
                  inset: 0,
                  borderRadius: 'var(--r)',
                  border: '2px solid var(--blue)',
                  pointerEvents: 'none',
                }}
              />
            </AnimatePresence>
            {/* cursor */}
            <motion.svg
              key={`c${tick}`}
              width="18"
              height="18"
              viewBox="0 0 24 24"
              initial={{ scale: 1 }}
              animate={{ scale: [1, 0.8, 1] }}
              transition={{ duration: 0.35 }}
              style={{ position: 'absolute', right: -6, bottom: -8 }}
            >
              <path d="M4 2l7 18 2.5-7L21 10.5 4 2z" fill="var(--text)" stroke="#fff" strokeWidth="1.2" strokeLinejoin="round" />
            </motion.svg>
          </div>
        </div>

        {/* live result */}
        <div style={{ width: 168, flex: '0 0 auto' }}>
          <AnimatePresence mode="wait">
            <motion.div
              key={`${tick}-${ok}`}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 8,
                padding: '8px 11px',
                borderRadius: 'var(--r)',
                fontSize: 12.5,
                fontWeight: 600,
                border: `1px solid ${ok ? 'rgba(0,131,68,0.35)' : 'rgba(219,34,81,0.4)'}`,
                background: ok ? 'var(--green-tint)' : 'var(--red-tint)',
                color: ok ? 'var(--green)' : 'var(--red)',
              }}
            >
              {ok ? <Check size={15} /> : <XMark />}
              {ok ? 'Order placed' : 'Checkout failed'}
            </motion.div>
          </AnimatePresence>

          {/* recent orders */}
          <div style={{ display: 'flex', gap: 3, marginTop: 9, flexWrap: 'wrap' }}>
            {orders.map((o, i) => (
              <span
                key={i}
                style={{
                  width: 9,
                  height: 9,
                  borderRadius: 2,
                  background: o ? 'var(--green)' : 'var(--red)',
                }}
              />
            ))}
          </div>
          <div className="faint" style={{ fontSize: 10.5, marginTop: 6, lineHeight: 1.3 }}>
            real customers checking out on the new code
          </div>
        </div>
      </div>
    </div>
  )
}

function XMark() {
  return (
    <svg width={15} height={15} viewBox="0 0 24 24" fill="none">
      <path d="M6 6l12 12M18 6 6 18" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" />
    </svg>
  )
}
