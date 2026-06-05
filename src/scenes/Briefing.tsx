import { motion } from 'framer-motion'
import { BRIEFING } from '../data/content'
import { ShieldHeart, ArrowRight } from '../components/icons'

const stagger = {
  show: { transition: { staggerChildren: 0.1, delayChildren: 0.05 } },
}
const item = {
  hide: { opacity: 0, y: 18 },
  show: { opacity: 1, y: 0, transition: { duration: 0.55, ease: [0.16, 1, 0.3, 1] } },
}

export function Briefing({ onNext }: { onNext: () => void }) {
  return (
    <div className="scene" style={{ padding: '36px 0 110px' }}>
      <motion.div
        variants={stagger}
        initial="hide"
        animate="show"
        style={{ maxWidth: 760, margin: '0 auto' }}
      >
        <motion.div variants={item} className="eyebrow" style={{ marginBottom: 14 }}>
          {BRIEFING.eyebrow}
        </motion.div>
        <motion.h2 variants={item} className="h-lead" style={{ marginBottom: 22 }}>
          {BRIEFING.title}
        </motion.h2>

        {BRIEFING.body.map((p, i) => (
          <motion.p
            key={i}
            variants={item}
            className="lede"
            style={{ marginBottom: 16, color: i === BRIEFING.body.length - 1 ? 'var(--text)' : undefined, fontWeight: i === BRIEFING.body.length - 1 ? 600 : 400 }}
          >
            {p}
          </motion.p>
        ))}

        <motion.div
          variants={item}
          className="glass"
          style={{ padding: '24px 26px', marginTop: 28, position: 'relative', overflow: 'hidden' }}
        >
          <div className="scanline" />
          <div style={{ display: 'flex', gap: 16, alignItems: 'flex-start' }}>
            <div
              style={{
                flex: '0 0 auto',
                width: 46,
                height: 46,
                borderRadius: 13,
                display: 'grid',
                placeItems: 'center',
                background: 'rgba(110,139,255,0.14)',
                border: '1px solid rgba(110,139,255,0.34)',
                color: 'var(--brand-bright)',
              }}
            >
              <ShieldHeart size={26} />
            </div>
            <div>
              <h3 style={{ fontSize: 18, fontWeight: 700, letterSpacing: '-0.02em' }}>
                {BRIEFING.defCard.title}
              </h3>
              <p className="muted" style={{ marginTop: 8, lineHeight: 1.55, fontSize: 15.5 }}>
                {BRIEFING.defCard.body}
              </p>
              <p style={{ marginTop: 12, fontSize: 14, color: 'var(--brand-bright)', fontWeight: 600 }}>
                {BRIEFING.defCard.foot}
              </p>
            </div>
          </div>
        </motion.div>

        <motion.div variants={item} style={{ marginTop: 32 }}>
          <button className="btn lg" onClick={onNext}>
            <span className="shine" />
            {BRIEFING.cta}
            <ArrowRight size={18} />
          </button>
        </motion.div>
      </motion.div>
    </div>
  )
}
