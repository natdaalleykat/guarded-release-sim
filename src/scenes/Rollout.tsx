import { AnimatePresence, motion } from 'framer-motion'
import {
  getMetric,
  getContext,
  getPace,
  fmtMetric,
  fmtPop,
  STAGES,
  type MetricOption,
  type ContextOption,
} from '../data/content'
import { useSimulation, fmtElapsed, type Phase } from '../sim/useSimulation'
import type { ConfigValue } from './Configure'
import { FleetGrid } from '../components/FleetGrid'
import { MetricChart } from '../components/MetricChart'
import { ActivityFeed } from '../components/ActivityFeed'
import { RolloutLadder } from '../components/RolloutLadder'
import { AlertDiamond, CheckCircle, Rollback, Spinner, ArrowRight } from '../components/icons'

function cap(s: string) {
  return s.charAt(0).toUpperCase() + s.slice(1)
}

function statusInfo(phase: Phase) {
  switch (phase) {
    case 'regression':
      return { cls: 'regression', label: 'Regression detected', icon: <AlertDiamond size={16} /> }
    case 'rollback':
      return { cls: 'rollback', label: 'Rolling back', icon: <Rollback size={16} /> }
    case 'recovered':
      return { cls: 'recovered', label: 'Rolled back · stable', icon: <CheckCircle size={16} /> }
    case 'idle':
      return { cls: 'monitoring', label: 'Starting', icon: <Spinner size={14} className="spin" /> }
    default:
      return { cls: 'monitoring', label: 'Monitoring', icon: <span className="pulse-dot" /> }
  }
}

function narrate(phase: Phase, t: number, m: MetricOption, c: ContextOption) {
  if (phase === 'recovered')
    return {
      title: `${cap(m.short)} is back to normal.`,
      sub: `Nobody got paged. The broken build never reached the other half of your ${c.plural}.`,
    }
  if (phase === 'rollback')
    return {
      title: `Rolling everyone back to the version that works.`,
      sub: `You did not lift a finger. This is the automatic rollback you left switched on.`,
    }
  if (phase === 'regression')
    return {
      title: `${m.label} just crossed your guardrail.`,
      sub: `The new checkout is failing under real load. None of your tests caught this.`,
    }
  if (t < 12)
    return {
      title: `Rolling out. LaunchDarkly is watching ${m.short}.`,
      sub: `Each ${c.singular} gets one version and stays on it the whole way.`,
    }
  if (t < 21)
    return {
      title: `A quarter of your ${c.plural} are on the new checkout.`,
      sub: `${cap(m.short)} is holding steady. Ramping up.`,
    }
  return { title: `Opening it up to half.`, sub: `This is the step that usually hurts.` }
}

export function Rollout({ config, onDone }: { config: ConfigValue; onDone: () => void }) {
  const m = getMetric(config.metric)
  const c = getContext(config.context)
  const pace = getPace(config.pace)
  const { state } = useSimulation(m, c)
  const s = statusInfo(state.phase)
  const n = narrate(state.phase, state.t, m, c)
  const breach = state.breach

  return (
    <div className="scene" style={{ padding: '14px 0 120px', maxWidth: 1180 }}>
      <div className={`stage-tint ${state.phase === 'idle' ? '' : state.phase}`} />

      {/* header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16, flexWrap: 'wrap', marginBottom: 14 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
          <div className={`status-chip ${s.cls}`}>
            {s.icon}
            {s.label}
          </div>
          <div className="faint" style={{ fontSize: 13 }}>
            Releasing <span style={{ color: 'var(--text)', fontWeight: 600 }}>Checkout v2</span> behind{' '}
            <span className="mono" style={{ color: 'var(--brand-bright)' }}>release-new-checkout</span>
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <div style={{ textAlign: 'right' }}>
            <div className="mono" style={{ fontSize: 18, fontWeight: 600 }}>
              {fmtElapsed(state.t)}
            </div>
            <div className="faint" style={{ fontSize: 11 }}>simulating {pace.perStep}</div>
          </div>
          {!state.done && (
            <button className="btn-ghost" style={{ padding: '8px 13px', borderRadius: 10, fontSize: 13 }} onClick={onDone}>
              Skip to results
            </button>
          )}
        </div>
      </div>

      {/* ladder */}
      <div className="panel" style={{ padding: '20px 26px', marginBottom: 16 }}>
        <RolloutLadder stages={STAGES} currentPct={state.rolloutPct} maxPct={state.maxPct} phase={state.phase} />
      </div>

      {/* narration */}
      <div style={{ minHeight: 70, marginBottom: 16, display: 'flex', alignItems: 'center', justifyContent: 'center', textAlign: 'center' }}>
        <AnimatePresence mode="wait">
          <motion.div
            key={n.title}
            initial={{ opacity: 0, y: 10, filter: 'blur(5px)' }}
            animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
            exit={{ opacity: 0, y: -8, filter: 'blur(5px)' }}
            transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
            style={{ maxWidth: 760 }}
          >
            <div
              style={{
                fontSize: 'clamp(19px, 2.3vw, 26px)',
                fontWeight: 750,
                letterSpacing: '-0.025em',
                color: breach || state.phase === 'regression' ? 'var(--red-bright)' : state.phase === 'recovered' ? 'var(--green-bright)' : 'var(--text)',
              }}
            >
              {n.title}
            </div>
            <div className="muted" style={{ fontSize: 14.5, marginTop: 6 }}>{n.sub}</div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* main grid */}
      <div className="cols cols-hero" style={{ gap: 16 }}>
        {/* left column */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16, minWidth: 0 }}>
          <div className="panel" style={{ padding: '20px 22px' }}>
            <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: 14 }}>
              <div>
                <div className="faint" style={{ fontSize: 12, fontWeight: 600, letterSpacing: '0.06em', textTransform: 'uppercase' }}>
                  Primary metric
                </div>
                <div style={{ fontSize: 16.5, fontWeight: 700, marginTop: 4 }}>{m.label}</div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <motion.div
                  key={breach ? 'b' : 'g'}
                  className="mono"
                  style={{
                    fontSize: 32,
                    fontWeight: 700,
                    lineHeight: 1,
                    color: breach ? 'var(--red-bright)' : 'var(--green-bright)',
                  }}
                >
                  {fmtMetric(m, state.metricValue)}
                </motion.div>
                <div className="faint" style={{ fontSize: 11.5, marginTop: 5 }}>
                  guardrail {m.guardrailPhrase}
                </div>
              </div>
            </div>
            <MetricChart metric={m} history={state.history} tNow={state.t} vNow={state.metricValue} breach={breach} phase={state.phase} />
          </div>

          <div className="panel" style={{ padding: '20px 22px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
              <div className="faint" style={{ fontSize: 12, fontWeight: 600, letterSpacing: '0.06em', textTransform: 'uppercase' }}>
                Your {c.plural} · live
              </div>
              <div className="mono" style={{ fontSize: 13, color: 'var(--text-dim)' }}>
                {fmtPop(state.contextsOnNew)} / {fmtPop(c.population)} on new
              </div>
            </div>
            <FleetGrid newShare={state.newShare} severity={state.severity} phase={state.phase} />
          </div>
        </div>

        {/* right column */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16, minWidth: 0 }}>
          <div className="cols cols-2" style={{ gap: 12 }}>
            <Counter k="Rollout" v={`${Math.round(state.rolloutPct)}%`} accent="var(--brand-bright)" />
            <Counter k="Guardrail checks" v={`${state.checksPassed}`} sub="passed" accent="var(--green-bright)" />
            <Counter k={`${cap(c.plural)} on new`} v={fmtPop(state.contextsOnNew)} accent="var(--brand-bright)" />
            <Counter
              k="Humans paged"
              v="0"
              accent={state.phase === 'recovered' ? 'var(--green-bright)' : 'var(--text)'}
            />
          </div>

          <div className="panel" style={{ padding: '18px 20px' }}>
            <div className="faint" style={{ fontSize: 12, fontWeight: 600, letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: 14 }}>
              Guardian activity
            </div>
            <ActivityFeed events={state.events} />
          </div>
        </div>
      </div>

      {/* done CTA */}
      <AnimatePresence>
        {state.done && (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            style={{ display: 'flex', justifyContent: 'center', marginTop: 30 }}
          >
            <button className="btn lg" onClick={onDone}>
              <span className="shine" />
              See what just happened
              <ArrowRight size={18} />
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

function Counter({ k, v, sub, accent }: { k: string; v: string; sub?: string; accent: string }) {
  return (
    <div className="stat">
      <div className="k">{k}</div>
      <div className="v mono" style={{ color: accent }}>
        {v}
        {sub && <span style={{ fontSize: 13, fontWeight: 500, color: 'var(--text-faint)', marginLeft: 6 }}>{sub}</span>}
      </div>
    </div>
  )
}
