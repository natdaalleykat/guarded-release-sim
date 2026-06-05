import { AnimatePresence, motion } from 'framer-motion'
import {
  getMetric,
  getContext,
  getPace,
  fmtMetric,
  fmtPop,
  STAGES,
  type MetricOption,
} from '../data/content'
import { FLAG_KEY, TREATMENT, CONTROL, ROLLBACK_MS } from '../data/product'
import { useSimulation, fmtElapsed, type Phase, type SimState } from './useSimulation'
import type { ConfigValue } from './SimWizard'
import { DiffChart } from './DiffChart'
import { ShieldHeart, CheckCircle, AlertDiamond, Rollback, ArrowRight } from '../components/icons'

function clamp01(v: number) {
  return Math.max(0, Math.min(1, v))
}
function ppUnit(m: MetricOption) {
  return m.unit === 'ms' ? '(ms)' : '(pp)'
}

export function StepRun({ config, onNext }: { config: ConfigValue; onNext: () => void }) {
  const m = getMetric(config.metric)
  const c = getContext(config.context)
  const pace = getPace(config.pace)
  const { state } = useSimulation(m, c)

  const broke = state.phase === 'regression' || state.phase === 'rollback' || state.phase === 'recovered'
  const reverted = state.phase === 'rollback' || state.phase === 'recovered'

  const windowLabel = pace.perStep.replace(' per step', '')

  return (
    <div>
      <RunHeader m={m} c={c} state={state} windowLabel={windowLabel} />

      {/* variation exposures */}
      <div className="gr-section">
        <div className="gr-section-label">Variations</div>
        <div className="exposures">
          <div className="exp-row">
            <span className="var-badge treatment" style={{ minWidth: 132 }}>
              <span className="swatch" style={{ background: TREATMENT.color }} />
              {TREATMENT.name}
            </span>
            <span className="exp-meta">
              <b>{fmtPop(state.contextsOnNew)}</b> {c.plural} · {Math.round(state.rolloutPct)}% traffic
            </span>
          </div>
          <div className="exp-row">
            <span className="var-badge control" style={{ minWidth: 132 }}>
              <span className="swatch" style={{ background: CONTROL.color }} />
              {CONTROL.name}
            </span>
            <span className="exp-meta">
              <b>{fmtPop(Math.max(0, c.population - state.contextsOnNew))}</b> {c.plural} · original variation
            </span>
          </div>
        </div>
      </div>

      {/* regression status */}
      <div className="gr-section">
        <div className="gr-section-label">Monitoring · Guardian checks this rollout about every 10 seconds</div>
        <div className="reg-list">
          <AnimatePresence mode="wait">
            {reverted ? (
              <motion.div key="rev" initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} className="reg-item revert">
                <span className="ic"><ShieldHeart size={18} /></span>
                <span>
                  Guarded against a regression on <strong>{m.label}</strong>. Rolled back automatically in{' '}
                  <strong>{ROLLBACK_MS} ms</strong>, now serving <strong>{CONTROL.name}</strong>.{' '}
                  <span className="when">· {fmtElapsed(state.t)}</span>
                </span>
              </motion.div>
            ) : broke ? (
              <motion.div key="bad" initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} className="reg-item bad">
                <span className="ic"><AlertDiamond size={18} /></span>
                <span>
                  <strong>{m.label}</strong> regressed past its guardrail. <span className="when">· {fmtElapsed(state.t)}</span>
                </span>
              </motion.div>
            ) : (
              <motion.div key="ok" initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} className="reg-item ok">
                <span className="ic"><CheckCircle size={18} /></span>
                <span>No regressions detected so far</span>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* metric result */}
      <div className="gr-section" style={{ borderBottom: 'none' }}>
        <div className="gr-section-label">Flag measurements</div>
        <MetricResult m={m} state={state} />
      </div>

      {/* footer */}
      <div style={{ padding: '16px 22px', borderTop: '1px solid var(--border-soft)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12 }}>
        <div className="faint" style={{ fontSize: 12.5 }}>
          {state.done ? 'Monitoring complete.' : 'This is a simulation. No live data.'}
        </div>
        <AnimatePresence>
          {state.done && (
            <motion.button
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              className="btn lg"
              onClick={onNext}
            >
              See what happened
              <ArrowRight size={16} />
            </motion.button>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}

function statusFor(phase: Phase) {
  if (phase === 'regression') return 'regressed'
  if (phase === 'rollback' || phase === 'recovered') return 'rolledback'
  return 'active'
}

function RunHeader({
  m,
  c,
  state,
  windowLabel,
}: {
  m: MetricOption
  c: ReturnType<typeof getContext>
  state: SimState
  windowLabel: string
}) {
  const cls = statusFor(state.phase)
  const reverted = state.phase === 'rollback' || state.phase === 'recovered'
  const broke = state.phase === 'regression' || reverted
  const regStage = STAGES.filter((s) => state.maxPct >= s - 0.001).pop() ?? STAGES[0]

  let statusNode: React.ReactNode
  let subNode: React.ReactNode
  if (reverted) {
    statusNode = (
      <>
        <Rollback size={18} />
        <span className="gr-status-text">
          <strong>{FLAG_KEY}</strong> rolled back automatically after detecting a regression for <strong>{m.label}</strong>
        </span>
      </>
    )
    subNode = (
      <>
        Rolled back in {ROLLBACK_MS} ms. Now serving {CONTROL.name} to all {c.plural}.
      </>
    )
  } else if (broke) {
    statusNode = (
      <>
        <AlertDiamond size={18} />
        <span className="gr-status-text">
          Regressions detected on <strong>{FLAG_KEY}</strong> for <strong>{m.label}</strong>
        </span>
      </>
    )
    subNode = <>Paused at {Math.round(state.rolloutPct)}% traffic while Guardian decides</>
  } else {
    statusNode = (
      <>
        <span className="live-dot" style={{ background: '#fff' }} />
        <span className="gr-status-text">
          Monitoring <strong>{FLAG_KEY}</strong> for regressions...
        </span>
      </>
    )
    subNode = <>Serving {TREATMENT.name} to {Math.round(state.rolloutPct)}% of {c.plural}</>
  }

  return (
    <div className={`gr-header ${cls}`}>
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 16 }}>
        <div>
          <div className="gr-status-line">{statusNode}</div>
          <div className="gr-sub">{subNode}</div>
        </div>
        <div style={{ textAlign: 'right', flex: '0 0 auto' }}>
          <div className="mono" style={{ fontSize: 15, fontWeight: 600 }}>{fmtElapsed(state.t)}</div>
          <div className="gr-sub" style={{ marginTop: 1 }}>{windowLabel} window</div>
        </div>
      </div>

      {/* segmented progress */}
      <div className="segbar">
        {STAGES.map((s, i) => {
          const prev = STAGES[i - 1] ?? 0
          const reached = state.maxPct >= s - 0.001
          const fill = reached ? 1 : clamp01((state.rolloutPct - prev) / (s - prev))
          const regd = broke && s === regStage
          return (
            <div className={`seg ${regd ? 'regd' : ''}`} key={s}>
              <div className="seg-fill" style={{ transform: `scaleX(${fill})` }} />
            </div>
          )
        })}
      </div>
      <div className="seg-row">
        <span>{STAGES.filter((s) => state.maxPct >= s - 0.001 && s < 100).map((s) => `${s}%`).join('  ·  ') || 'starting'}</span>
        <span>{reverted ? 'rolled back to 0%' : `current traffic ${Math.round(state.rolloutPct)}%`}</span>
      </div>
    </div>
  )
}

function MetricResult({ m, state }: { m: MetricOption; state: SimState }) {
  const treatment = state.metricValue
  const control = m.baseline + Math.sin(state.t * 3.1) * m.noise * 0.4
  const diff = treatment - control
  const showEstimate = state.t > 5
  const breach = state.breach
  const margin = Math.max(m.noise * 1.2, Math.abs(m.regressed - m.baseline) * 0.06) * (1 - clamp01(state.t / 30) * 0.55)

  const fmtDiff = (v: number) => (m.unit === 'ms' ? `${Math.round(Math.abs(v))} ms` : `${Math.abs(v).toFixed(2)} pp`)
  const fmtSigned = (v: number) =>
    `${v >= 0 ? '+' : '−'}${m.unit === 'ms' ? Math.round(Math.abs(v)) : Math.abs(v).toFixed(2)}`
  const sign = diff >= 0 ? '+' : '−'
  const tagClass = !showEstimate ? 'neutral' : breach ? 'bad' : 'neutral'

  const row = (name: string, color: string, val: number, sample: number, isTreatment: boolean) => (
    <tr>
      <td>
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>
          <span style={{ width: 9, height: 9, borderRadius: 3, background: color }} />
          {name}
        </span>
      </td>
      <td style={{ fontWeight: 650 }}>{fmtMetric(m, val)}</td>
      <td className="faint">{fmtMetric(m, Math.max(0, val - margin))}</td>
      <td className="faint">{fmtMetric(m, val + margin)}</td>
      <td>{sample > 0 ? fmtPop(sample) : '—'}</td>
    </tr>
  )

  return (
    <div className="metric-card">
      <div className="metric-card-head">
        <div className="metric-name">
          {m.label} <span className="metric-unit">{ppUnit(m)}</span>
        </div>
        <div className={`estimate-tag ${tagClass}`}>
          {showEstimate ? (
            <>
              {sign}
              {fmtDiff(diff)} <span style={{ fontWeight: 500, opacity: 0.75 }}>
                [{fmtSigned(diff - margin)}, {fmtSigned(diff + margin)}]
              </span>
            </>
          ) : (
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
              <span className="skeleton" style={{ width: 12, height: 12, borderRadius: 3 }} />
              Collecting data
            </span>
          )}
        </div>
      </div>

      <div style={{ padding: '14px 16px 8px' }}>
        <DiffChart metric={m} history={state.history} tNow={state.t} treatmentNow={treatment} controlNow={control} breach={breach} />
        <div className="diff-legend" style={{ marginTop: 6 }}>
          <span className="k"><span className="ln" style={{ background: 'var(--blue)' }} /> {TREATMENT.name} (treatment)</span>
          <span className="k"><span className="ln" style={{ background: 'var(--text-3)', height: 2, borderTop: '2px dashed var(--text-3)', backgroundColor: 'transparent' }} /> {CONTROL.name} (control)</span>
        </div>
      </div>

      <table className="vtable">
        <thead>
          <tr>
            <th>Variation</th>
            <th>Estimate</th>
            <th>Lower</th>
            <th>Upper</th>
            <th>Sample size</th>
          </tr>
        </thead>
        <tbody>
          {row(TREATMENT.name, TREATMENT.color, treatment, state.contextsOnNew, true)}
          {row(CONTROL.name, CONTROL.color, control, Math.max(0, state.contextsOnNew), false)}
        </tbody>
      </table>
    </div>
  )
}
