import { motion } from 'framer-motion'
import {
  CONFIGURE,
  METRICS,
  CONTEXTS,
  PACES,
  STAGES,
  fmtPop,
  getContext,
  type MetricKey,
  type ContextKey,
  type PaceKey,
} from '../data/content'
import { Check, ShieldHeart, Bolt } from '../components/icons'

export interface ConfigValue {
  metric: MetricKey
  context: ContextKey
  pace: PaceKey
}

interface Props {
  value: ConfigValue
  onChange: (patch: Partial<ConfigValue>) => void
  onGo: () => void
}

const block = {
  hide: { opacity: 0, y: 22 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] } },
}

export function Configure({ value, onChange, onGo }: Props) {
  const ctx = getContext(value.context)

  return (
    <div className="scene" style={{ padding: '30px 0 130px' }}>
      <motion.div
        initial="hide"
        animate="show"
        variants={{ show: { transition: { staggerChildren: 0.12 } } }}
        style={{ maxWidth: 920, margin: '0 auto' }}
      >
        <motion.div variants={block} style={{ marginBottom: 30 }}>
          <div className="eyebrow" style={{ marginBottom: 12 }}>
            {CONFIGURE.eyebrow}
          </div>
          <h2 className="h-lead">Three quick calls, then we ship.</h2>
        </motion.div>

        {/* metric */}
        <motion.section variants={block} style={{ marginBottom: 34 }}>
          <Q n={1} q={CONFIGURE.metricQ} help={CONFIGURE.metricHelp} />
          <div className="cols cols-metrics" style={{ gap: 12 }}>
            {METRICS.map((m) => (
              <button
                key={m.key}
                className={`opt ${value.metric === m.key ? 'sel' : ''}`}
                onClick={() => onChange({ metric: m.key })}
              >
                <Tick on={value.metric === m.key} />
                <div className="opt-title">{m.label}</div>
                <div className="opt-blurb">{m.blurb}</div>
                <span
                  className="chip"
                  style={{ marginTop: 11, padding: '4px 9px', fontSize: 11 }}
                >
                  {m.betterDirection === 'lower' ? 'Lower is better' : 'Higher is better'}
                </span>
              </button>
            ))}
          </div>
        </motion.section>

        {/* context */}
        <motion.section variants={block} style={{ marginBottom: 34 }}>
          <Q n={2} q={CONFIGURE.contextQ} help={`${CONFIGURE.contextHelpA} ${CONFIGURE.contextHelpB(ctx.plural)}`} />
          <div className="cols cols-contexts" style={{ gap: 12 }}>
            {CONTEXTS.map((c) => (
              <button
                key={c.key}
                className={`opt ${value.context === c.key ? 'sel' : ''}`}
                onClick={() => onChange({ context: c.key })}
              >
                <Tick on={value.context === c.key} />
                <div className="opt-title">{c.label}</div>
                <div className="opt-blurb">{c.blurb}</div>
                <div className="mono" style={{ marginTop: 10, fontSize: 12.5, color: 'var(--brand-bright)' }}>
                  {fmtPop(c.population)} {c.plural}
                </div>
              </button>
            ))}
          </div>
        </motion.section>

        {/* pace */}
        <motion.section variants={block} style={{ marginBottom: 30 }}>
          <Q n={3} q={CONFIGURE.paceQ} help={CONFIGURE.paceHelp} />
          <div className="cols cols-paces" style={{ gap: 12 }}>
            {PACES.map((p) => (
              <button
                key={p.key}
                className={`opt ${value.pace === p.key ? 'sel' : ''}`}
                onClick={() => onChange({ pace: p.key })}
              >
                <Tick on={value.pace === p.key} />
                <div className="opt-title">{p.label}</div>
                <div className="mono" style={{ marginTop: 6, fontSize: 12.5, color: 'var(--text-dim)' }}>
                  {p.perStep}
                </div>
                <div className="opt-blurb" style={{ marginTop: 6 }}>
                  {p.blurb}
                </div>
              </button>
            ))}
          </div>
        </motion.section>

        {/* launch bar */}
        <motion.div
          variants={block}
          className="panel"
          style={{ padding: '20px 24px', marginTop: 8 }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
            <div className="faint" style={{ fontSize: 12, fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase' }}>
              Rollout plan
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
              {STAGES.map((s, i) => (
                <span key={s} style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>
                  <span
                    className="mono"
                    style={{
                      fontSize: 12.5,
                      padding: '4px 10px',
                      borderRadius: 8,
                      background: 'rgba(110,139,255,0.1)',
                      border: '1px solid rgba(110,139,255,0.26)',
                      color: 'var(--brand-bright)',
                    }}
                  >
                    {s}%
                  </span>
                  {i < STAGES.length - 1 && <span className="faint">›</span>}
                </span>
              ))}
            </div>
          </div>

          <div className="hairline" style={{ margin: '18px 0' }} />

          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 20, flexWrap: 'wrap' }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: 12, cursor: 'default' }}>
              <span
                style={{
                  width: 42,
                  height: 24,
                  borderRadius: 999,
                  background: 'var(--green)',
                  position: 'relative',
                  boxShadow: 'var(--glow-green)',
                  flex: '0 0 auto',
                }}
              >
                <span
                  style={{
                    position: 'absolute',
                    top: 3,
                    left: 21,
                    width: 18,
                    height: 18,
                    borderRadius: '50%',
                    background: '#fff',
                  }}
                />
              </span>
              <span>
                <div style={{ fontWeight: 600, fontSize: 14.5 }}>{CONFIGURE.rollbackLabel}</div>
                <div className="faint" style={{ fontSize: 12.5, marginTop: 2 }}>
                  {CONFIGURE.rollbackNote}
                </div>
              </span>
            </label>

            <button className="btn go lg" onClick={onGo}>
              <span className="shine" />
              <ShieldHeart size={20} />
              {CONFIGURE.go}
              <Bolt size={16} />
            </button>
          </div>
        </motion.div>
      </motion.div>
    </div>
  )
}

function Q({ n, q, help }: { n: number; q: string; help: string }) {
  return (
    <div style={{ marginBottom: 16 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        <span className="step-num">{n}</span>
        <h3 style={{ fontSize: 19, fontWeight: 700, letterSpacing: '-0.02em' }}>{q}</h3>
      </div>
      <p className="muted" style={{ fontSize: 14, marginTop: 8, maxWidth: 760, lineHeight: 1.5 }}>
        {help}
      </p>
    </div>
  )
}

function Tick({ on }: { on: boolean }) {
  return <span className="tick">{on && <Check size={13} style={{ color: '#fff' }} />}</span>
}
