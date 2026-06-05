import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { COLD_OPEN_LINES } from '../data/content'
import { ShieldHeart, Bolt } from '../components/icons'

export function ColdOpen({ onStart }: { onStart: () => void }) {
  const [idx, setIdx] = useState(0)
  const done = idx >= COLD_OPEN_LINES.length

  useEffect(() => {
    if (done) return
    const dwell = idx === COLD_OPEN_LINES.length - 1 ? 1700 : 1300
    const id = setTimeout(() => setIdx((i) => i + 1), dwell)
    return () => clearTimeout(id)
  }, [idx, done])

  return (
    <div className="center-stack scene" style={{ position: 'relative' }}>
      {!done && (
        <button
          onClick={() => setIdx(COLD_OPEN_LINES.length)}
          className="btn-ghost"
          style={{
            position: 'absolute',
            top: 28,
            right: 28,
            padding: '8px 14px',
            borderRadius: 10,
            fontSize: 13,
          }}
        >
          Skip intro
        </button>
      )}

      <AnimatePresence mode="wait">
        {!done ? (
          <motion.div
            key={idx}
            initial={{ opacity: 0, y: 14, filter: 'blur(8px)' }}
            animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
            exit={{ opacity: 0, y: -14, filter: 'blur(8px)' }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            style={{ maxWidth: 760 }}
          >
            <p
              className={idx === COLD_OPEN_LINES.length - 1 ? 'grad-text' : 'muted'}
              style={{
                fontSize: 'clamp(24px, 3.6vw, 40px)',
                fontWeight: 700,
                lineHeight: 1.18,
                letterSpacing: '-0.03em',
              }}
            >
              {COLD_OPEN_LINES[idx]}
            </p>
          </motion.div>
        ) : (
          <motion.div
            key="hero"
            initial="hide"
            animate="show"
            variants={{ show: { transition: { staggerChildren: 0.12, delayChildren: 0.05 } } }}
            style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', maxWidth: 820 }}
          >
            <Reveal>
              <motion.div
                animate={{ scale: [1, 1.08, 1] }}
                transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
                style={{
                  width: 76,
                  height: 76,
                  borderRadius: 22,
                  display: 'grid',
                  placeItems: 'center',
                  background: 'linear-gradient(180deg, rgba(110,139,255,0.25), rgba(63,87,224,0.12))',
                  border: '1px solid rgba(110,139,255,0.4)',
                  boxShadow: 'var(--glow-brand)',
                  marginBottom: 26,
                  color: 'var(--brand-bright)',
                }}
              >
                <ShieldHeart size={40} />
              </motion.div>
            </Reveal>
            <Reveal>
              <div className="eyebrow" style={{ marginBottom: 16 }}>
                A 90-second simulation
              </div>
            </Reveal>
            <Reveal>
              <h1 className="display" style={{ textAlign: 'center' }}>
                Watch a release <span className="grad-text">break</span>,
                <br />
                then heal itself.
              </h1>
            </Reveal>
            <Reveal>
              <p className="lede" style={{ marginTop: 22, maxWidth: 540, textAlign: 'center' }}>
                You make a few calls. We roll it out, let it go wrong on purpose, and show you what
                LaunchDarkly does about it. No account. No setup.
              </p>
            </Reveal>
            <Reveal>
              <button className="btn lg" onClick={onStart} style={{ marginTop: 34 }}>
                <span className="shine" />
                <Bolt size={18} />
                Press start
              </button>
            </Reveal>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

function Reveal({ children }: { children: React.ReactNode }) {
  return (
    <motion.div
      variants={{
        hide: { opacity: 0, y: 18, filter: 'blur(6px)' },
        show: { opacity: 1, y: 0, filter: 'blur(0px)', transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] } },
      }}
    >
      {children}
    </motion.div>
  )
}
