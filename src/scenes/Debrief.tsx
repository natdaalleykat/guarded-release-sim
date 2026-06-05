import { motion } from 'framer-motion'
import { DEBRIEF, getMetric, getContext } from '../data/content'
import type { ConfigValue } from './Configure'
import { Check, AlertDiamond, ShieldHeart, ArrowRight } from '../components/icons'

const block = {
  hide: { opacity: 0, y: 22 },
  show: { opacity: 1, y: 0, transition: { duration: 0.55, ease: [0.16, 1, 0.3, 1] } },
}

export function Debrief({ config, onNext }: { config: ConfigValue; onNext: () => void }) {
  const m = getMetric(config.metric)
  const c = getContext(config.context)

  return (
    <div className="scene" style={{ padding: '34px 0 120px' }}>
      <motion.div
        initial="hide"
        animate="show"
        variants={{ show: { transition: { staggerChildren: 0.1 } } }}
        style={{ maxWidth: 940, margin: '0 auto' }}
      >
        <motion.div variants={block} style={{ textAlign: 'center', marginBottom: 30 }}>
          <div className="eyebrow" style={{ marginBottom: 12 }}>{DEBRIEF.eyebrow}</div>
          <h2 className="display" style={{ fontSize: 'clamp(30px, 4vw, 46px)' }}>
            {DEBRIEF.title}
          </h2>
          <p className="lede" style={{ marginTop: 14, maxWidth: 640, marginInline: 'auto' }}>
            You picked <strong style={{ color: 'var(--text)' }}>{m.short}</strong> as the metric to protect and rolled out
            by <strong style={{ color: 'var(--text)' }}>{c.singular}</strong>. When the metric broke its guardrail,
            the guarded release rolled back on its own.
          </p>
        </motion.div>

        {/* summary stats */}
        <motion.div variants={block} className="cols cols-3" style={{ gap: 14, marginBottom: 34 }}>
          <Summary k="Max blast radius" v="50%" sub={`of your ${c.plural}, for under a minute`} />
          <Summary k="Rollback" v="Automatic" sub="no human in the loop" />
          <Summary k="Pages sent" v="0" sub="you were getting coffee" />
        </motion.div>

        {/* contrast */}
        <motion.div variants={block} className="cols cols-2" style={{ gap: 16 }}>
          <ContrastCard
            tone="bad"
            title={DEBRIEF.withoutTitle}
            points={DEBRIEF.without}
            icon={<AlertDiamond size={18} />}
          />
          <ContrastCard
            tone="good"
            title={DEBRIEF.withTitle}
            points={DEBRIEF.with}
            icon={<ShieldHeart size={18} />}
          />
        </motion.div>

        <motion.p
          variants={block}
          className="h-lead"
          style={{ textAlign: 'center', marginTop: 40, fontSize: 'clamp(20px, 2.4vw, 28px)', maxWidth: 720, marginInline: 'auto' }}
        >
          {DEBRIEF.kicker}
        </motion.p>

        <motion.div variants={block} style={{ display: 'flex', justifyContent: 'center', marginTop: 32 }}>
          <button className="btn lg" onClick={onNext}>
            <span className="shine" />
            Set this up in my app
            <ArrowRight size={18} />
          </button>
        </motion.div>
      </motion.div>
    </div>
  )
}

function Summary({ k, v, sub }: { k: string; v: string; sub: string }) {
  return (
    <div className="stat" style={{ textAlign: 'center' }}>
      <div className="k">{k}</div>
      <div className="v" style={{ color: 'var(--text)' }}>{v}</div>
      <div className="faint" style={{ fontSize: 12.5, marginTop: 4 }}>{sub}</div>
    </div>
  )
}

function ContrastCard({
  tone,
  title,
  points,
  icon,
}: {
  tone: 'bad' | 'good'
  title: string
  points: string[]
  icon: React.ReactNode
}) {
  const accent = tone === 'good' ? 'var(--green-bright)' : 'var(--red-bright)'
  const bg =
    tone === 'good'
      ? 'linear-gradient(180deg, rgba(47,215,157,0.08), rgba(47,215,157,0.02))'
      : 'linear-gradient(180deg, rgba(255,84,112,0.08), rgba(255,84,112,0.02))'
  const border = tone === 'good' ? 'rgba(47,215,157,0.32)' : 'rgba(255,84,112,0.3)'
  return (
    <div className="panel" style={{ padding: '22px 24px', background: bg, borderColor: border }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 11, marginBottom: 18, color: accent }}>
        {icon}
        <h3 style={{ fontSize: 17, fontWeight: 700, letterSpacing: '-0.02em', color: 'var(--text)' }}>{title}</h3>
      </div>
      <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 13 }}>
        {points.map((p, i) => (
          <li key={i} style={{ display: 'flex', gap: 11, alignItems: 'flex-start' }}>
            <span style={{ color: accent, flex: '0 0 auto', marginTop: 1 }}>
              {tone === 'good' ? <Check size={17} /> : <CloseMark />}
            </span>
            <span className="muted" style={{ fontSize: 14.5, lineHeight: 1.45 }}>{p}</span>
          </li>
        ))}
      </ul>
    </div>
  )
}

function CloseMark() {
  return (
    <svg width={17} height={17} viewBox="0 0 24 24" fill="none">
      <path d="M6 6l12 12M18 6 6 18" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" />
    </svg>
  )
}
