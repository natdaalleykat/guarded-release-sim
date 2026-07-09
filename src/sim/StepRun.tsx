import { AnimatePresence, motion } from 'framer-motion'
import { getMetric, getContext, fmtMetric, fmtPop } from '../data/content'
import { FLAG_KEY, TREATMENT, CONTROL, ROLLBACK_MS, BLAST } from '../data/product'
import { useSimulation, fmtElapsed, VALUE_T, type Phase } from './useSimulation'
import { DiffChart } from './DiffChart'
import { GonfalonChart } from './GonfalonChart'
import { CheckoutApp } from './CheckoutApp'
import type { ConfigValue, ChartVariant } from './SimWizard'
import { CheckCircle, AlertDiamond, Rollback, ArrowRight, Replay } from '../components/icons'

function statusBadge(phase: Phase) {
  switch (phase) {
    case 'regression':
      return { cls: 'red', label: 'Regression detected', icon: <AlertDiamond size={13} /> }
    case 'rollback':
      return { cls: 'purple', label: `Rolling back · ~${ROLLBACK_MS} ms`, icon: <Rollback size={13} /> }
    case 'recovered':
      return { cls: 'green', label: 'Rolled back · stable', icon: <CheckCircle size={13} /> }
    default:
      return { cls: 'blue', label: 'Monitoring for regressions', icon: <span className="live-dot" style={{ background: 'currentColor' }} /> }
  }
}

export function StepRun({
  config,
  onFinish,
  onReplay,
  chartVariant = 'default',
}: {
  config: ConfigValue
  onFinish: () => void
  onReplay: () => void
  chartVariant?: ChartVariant
}) {
  const m = getMetric(config.metric)
  const c = getContext(config.context)
  const { state } = useSimulation(m, c)
  const sb = statusBadge(state.phase)
  const breach = state.breach
  const showValue = state.t >= VALUE_T

  const control = m.baseline + Math.sin(state.t * 3.1) * m.noise * 0.4
  const diff = state.metricValue - control
  const showEstimate = state.t > 4
  const fmtDiff = (v: number) => (m.unit === 'ms' ? `${Math.round(Math.abs(v))} ms` : `${Math.abs(v).toFixed(2)} pp`)
  const sign = diff >= 0 ? '+' : '−'

  // events are stored newest-first; logs read oldest -> newest
  const logs = [...state.events].reverse().slice(-4)

  return (
    <div>
      {/* compact status row */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 12,
          padding: '12px 22px',
          borderBottom: '1px solid var(--border-soft)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, minWidth: 0 }}>
          <span className={`badge ${sb.cls}`}>{sb.icon}{sb.label}</span>
          <span className="mono faint" style={{ fontSize: 12.5 }}>{FLAG_KEY}</span>
        </div>
        <div className="mono" style={{ fontSize: 13, color: 'var(--text-2)', flex: '0 0 auto' }}>
          {fmtElapsed(state.t)} · {Math.round(state.rolloutPct)}% traffic
        </div>
      </div>

      <div style={{ padding: '16px 22px 20px' }}>
        {/* option F: connect the chart to real customers clicking checkout */}
        {chartVariant === 'gonfalon' && (
          <div style={{ marginBottom: 14 }}>
            <CheckoutApp breach={breach} />
          </div>
        )}

        {/* the chart is the hero */}
        <div className="metric-card">
          <div className="metric-card-head">
            <div className="metric-name">
              {m.label} <span className="metric-unit">{m.unit === 'ms' ? '(ms)' : '(pp)'}</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              {showEstimate && (
                <span className={`estimate-tag ${breach ? 'bad' : 'neutral'}`}>
                  {sign}{fmtDiff(diff)} vs original
                </span>
              )}
              <span className="mono" style={{ fontSize: 18, fontWeight: 700, color: breach ? 'var(--red)' : 'var(--green)' }}>
                {fmtMetric(m, state.metricValue)}
              </span>
            </div>
          </div>

          {/* variations above the chart */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 12,
              padding: '6px 16px',
              borderBottom: '1px solid var(--border-soft)',
              flexWrap: 'wrap',
            }}
          >
            <span className="var-badge treatment">
              <span className="swatch" style={{ background: TREATMENT.color }} />
              {TREATMENT.name}
            </span>
            <span className="exp-meta">
              <b>{fmtPop(state.contextsOnNew)}</b> {c.plural} · {Math.round(state.rolloutPct)}%
            </span>
            <span style={{ width: 1, height: 18, background: 'var(--border-soft)' }} />
            <span className="var-badge control">
              <span className="swatch" style={{ background: CONTROL.color }} />
              {CONTROL.name}
            </span>
            <span className="exp-meta">
              <b>{fmtPop(Math.max(0, c.population - state.contextsOnNew))}</b> {c.plural}
            </span>
          </div>

          <div style={{ padding: '8px 16px 6px' }}>
            {chartVariant === 'gonfalon' ? (
              <GonfalonChart metric={m} context={c} state={state} />
            ) : (
              <>
                <DiffChart metric={m} history={state.history} tNow={state.t} treatmentNow={state.metricValue} controlNow={control} breach={breach} />
                <div className="diff-legend" style={{ margin: '6px 2px 8px' }}>
                  <span className="k"><span className="ln" style={{ background: 'var(--blue)' }} /> {TREATMENT.name} (new variation)</span>
                  <span className="k"><span className="ln" style={{ background: 'rgba(7,8,12,0.55)', height: 2.4 }} /> {CONTROL.name} (original variation)</span>
                </div>
              </>
            )}
          </div>
        </div>

        {/* live log lines */}
        <div className="logterm" style={{ marginTop: 10 }}>
          <AnimatePresence initial={false}>
            {logs.map((e) => (
              <motion.div
                key={e.id}
                className={`logline ${e.kind}`}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.25 }}
              >
                <span className="lt">{fmtElapsed(e.t)}</span>
                <span style={{ overflow: 'hidden', textOverflow: 'ellipsis' }}>{e.text}</span>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {/* value summary, in place of a results page */}
        <AnimatePresence>
          {showValue && (
            <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }} style={{ marginTop: 10 }}>
              <div className="cols grid-3" style={{ gap: 12 }}>
                <div className="stat-tile">
                  <div className="k">Max blast radius</div>
                  <div className="v">{BLAST.exposed}%</div>
                  <div className="faint" style={{ fontSize: 12, marginTop: 3 }}>caught at the {BLAST.exposed}% step</div>
                </div>
                <div className="stat-tile">
                  <div className="k">{c.plural} protected</div>
                  <div className="v" style={{ color: 'var(--green)' }}>{BLAST.protected}%</div>
                  <div className="faint" style={{ fontSize: 12, marginTop: 3 }}>never saw the bad release</div>
                </div>
                <div className="stat-tile">
                  <div className="k">Rolled back in</div>
                  <div className="v">~{ROLLBACK_MS} ms</div>
                  <div className="faint" style={{ fontSize: 12, marginTop: 3 }}>automatically, no human</div>
                </div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12, marginTop: 14, flexWrap: 'wrap' }}>
                <span className="muted" style={{ fontSize: 13.5 }}>
                  No page. No incident. You guarded <strong style={{ color: 'var(--text)' }}>{m.short}</strong> and it worked.
                </span>
                <div style={{ display: 'flex', gap: 8 }}>
                  <button className="btn minimal" onClick={onReplay}>
                    <Replay size={14} /> Replay
                  </button>
                  <button className="btn lg" onClick={onFinish}>
                    Set up guarded releases for real
                    <ArrowRight size={15} />
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}
