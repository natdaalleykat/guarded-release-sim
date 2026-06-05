import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import {
  METRICS,
  CONTEXTS,
  PACES,
  getMetric,
  getContext,
  fmtPop,
  CHECKLIST,
  DEFAULTS,
  type MetricKey,
  type ContextKey,
  type PaceKey,
} from '../data/content'
import { WIZARD, TREATMENT, CONTROL, ROLLBACK_MS, BLAST } from '../data/product'
import { StepRun } from './StepRun'
import { ShieldHeart, Check, CheckCircle, ArrowRight, Replay, Bolt } from '../components/icons'
import { IcX } from '../components/navicons'

export interface ConfigValue {
  metric: MetricKey
  context: ContextKey
  pace: PaceKey
}

export function SimWizard({ onClose }: { onClose: () => void }) {
  const [step, setStep] = useState(0)
  const [runId, setRunId] = useState(0)
  const [config, setConfig] = useState<ConfigValue>({ ...DEFAULTS })

  return (
    <div className="scrim" onClick={onClose}>
      <motion.div
        className="modal"
        onClick={(e) => e.stopPropagation()}
        initial={{ opacity: 0, y: 18, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
      >
        <div className="modal-head">
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <span style={{ color: 'var(--blue)' }}><ShieldHeart size={20} /></span>
            <span style={{ fontWeight: 700, fontSize: 15 }}>Guarded release simulation</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            <Stepper step={step} />
            <button className="modal-x" onClick={onClose} aria-label="Close"><IcX size={18} /></button>
          </div>
        </div>

        <div className="modal-body">
          <AnimatePresence mode="wait">
            <motion.div
              key={`${step}-${runId}`}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
            >
              {step === 0 && (
                <StepConfigure
                  config={config}
                  onChange={(p) => setConfig((c) => ({ ...c, ...p }))}
                  onNext={() => setStep(1)}
                />
              )}
              {step === 1 && <StepRun config={config} onNext={() => setStep(2)} />}
              {step === 2 && (
                <StepResults
                  config={config}
                  onReplay={() => {
                    setRunId((r) => r + 1)
                    setStep(1)
                  }}
                  onClose={onClose}
                />
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  )
}

function Stepper({ step }: { step: number }) {
  return (
    <div className="stepper">
      {WIZARD.steps.map((label, i) => (
        <div key={label} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <div className={`step-pill ${i === step ? 'active' : i < step ? 'done' : ''}`}>
            <span className="step-num2">{i < step ? <Check size={13} /> : i + 1}</span>
            <span className="step-label">{label}</span>
          </div>
          {i < WIZARD.steps.length - 1 && <span className={`step-bar ${i < step ? 'done' : ''}`} />}
        </div>
      ))}
    </div>
  )
}

/* ---- Step 1: Configure -------------------------------------------------- */

function StepConfigure({
  config,
  onChange,
  onNext,
}: {
  config: ConfigValue
  onChange: (p: Partial<ConfigValue>) => void
  onNext: () => void
}) {
  return (
    <div style={{ padding: '20px 24px 0' }}>
      {/* prominent callout */}
      <div
        style={{
          display: 'flex',
          gap: 15,
          padding: '18px 20px',
          borderRadius: 'var(--r-lg)',
          border: '1px solid rgba(66,94,255,0.3)',
          background: 'linear-gradient(180deg, var(--blue-tint), var(--bg))',
        }}
      >
        <div
          style={{
            width: 46,
            height: 46,
            borderRadius: 13,
            flex: '0 0 auto',
            display: 'grid',
            placeItems: 'center',
            color: '#fff',
            background: 'linear-gradient(135deg, #6e8bff, #3f57e0)',
            boxShadow: '0 6px 16px -4px rgba(63,87,224,0.6)',
          }}
        >
          <ShieldHeart size={25} />
        </div>
        <div style={{ minWidth: 0 }}>
          <h3 style={{ fontSize: 18, fontWeight: 750, letterSpacing: '-0.02em' }}>
            Watch a guarded release catch a bad deploy
          </h3>
          <p className="muted" style={{ fontSize: 13.5, lineHeight: 1.5, marginTop: 5 }}>
            {WIZARD.configure.lede}
          </p>
          <div style={{ display: 'flex', gap: 7, marginTop: 11, flexWrap: 'wrap' }}>
            <span className="badge blue">~90 seconds</span>
            <span className="badge">No setup</span>
            <span className="badge">Guided simulation, not live data</span>
          </div>
        </div>
      </div>

      {/* compact config */}
      <div className="gr-section-label" style={{ marginTop: 20, marginBottom: 12 }}>Configure your rollout</div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
        <div>
          <CfgLabel>{WIZARD.configure.metricQ}</CfgLabel>
          <div className="cols grid-2" style={{ gridTemplateColumns: '1fr 1fr', gap: 8 }}>
            {METRICS.map((m) => (
              <Choice key={m.key} compact selected={config.metric === m.key} onClick={() => onChange({ metric: m.key })}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 6 }}>
                  <span style={{ fontWeight: 650, fontSize: 13 }}>{m.label}</span>
                  <span className={`badge ${m.betterDirection === 'lower' ? 'blue' : 'green'}`} style={{ fontSize: 9.5, padding: '1px 6px' }}>
                    {m.betterDirection === 'lower' ? 'lower' : 'higher'}
                  </span>
                </div>
                <div className="muted" style={{ fontSize: 11.5, marginTop: 3, lineHeight: 1.35 }}>{m.blurb}</div>
              </Choice>
            ))}
          </div>
        </div>

        <div>
          <CfgLabel>{WIZARD.configure.contextQ}</CfgLabel>
          <div className="cols" style={{ gridTemplateColumns: 'repeat(4, 1fr)', gap: 8 }}>
            {CONTEXTS.map((c) => (
              <Choice key={c.key} compact selected={config.context === c.key} onClick={() => onChange({ context: c.key })}>
                <div style={{ fontWeight: 650, fontSize: 12.5 }}>{c.label}</div>
                <div className="mono" style={{ fontSize: 10.5, color: 'var(--blue)', marginTop: 2 }}>{fmtPop(c.population)}</div>
              </Choice>
            ))}
          </div>
        </div>

        <div>
          <CfgLabel>Ramp speed</CfgLabel>
          <div style={{ display: 'flex', gap: 7, flexWrap: 'wrap' }}>
            {PACES.map((p) => (
              <button
                key={p.key}
                onClick={() => onChange({ pace: p.key })}
                style={{
                  padding: '6px 11px',
                  fontSize: 12,
                  fontWeight: 600,
                  borderRadius: 999,
                  cursor: 'pointer',
                  border: `1px solid ${config.pace === p.key ? 'var(--blue)' : 'var(--border)'}`,
                  background: config.pace === p.key ? 'var(--blue-tint)' : 'var(--bg)',
                  color: config.pace === p.key ? 'var(--blue-hover)' : 'var(--text-2)',
                }}
              >
                {p.label} · {p.perStep}
              </button>
            ))}
          </div>
        </div>

        {/* locked auto-rollback */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: 12,
            padding: '11px 14px',
            border: '1px solid var(--border)',
            borderRadius: 'var(--r-md)',
            background: 'var(--bg-sub)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <span style={{ color: 'var(--green)' }}><ShieldHeart size={17} /></span>
            <div>
              <div style={{ fontWeight: 600, fontSize: 13.5 }}>Automatically roll back if a regression is detected</div>
              <div className="faint" style={{ fontSize: 12 }}>On by default. Required for a guarded release.</div>
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, flex: '0 0 auto' }}>
            <span className="badge">Required</span>
            <LockedToggleOn />
          </div>
        </div>
      </div>

      <div
        style={{
          position: 'sticky',
          bottom: 0,
          background: 'var(--bg)',
          margin: '20px -24px 0',
          padding: '14px 24px',
          borderTop: '1px solid var(--border-soft)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <span className="faint" style={{ fontSize: 12.5 }}>Nothing here is real. It is a guided simulation.</span>
        <button className="btn lg" onClick={onNext}>
          <ShieldHeart size={18} />
          {WIZARD.configure.go}
          <Bolt size={15} />
        </button>
      </div>
    </div>
  )
}

function CfgLabel({ children }: { children: React.ReactNode }) {
  return <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-2)', marginBottom: 7 }}>{children}</div>
}

function LockedToggleOn() {
  return (
    <span
      role="switch"
      aria-checked="true"
      aria-disabled="true"
      title="Required for guarded releases"
      style={{
        width: 38,
        height: 22,
        borderRadius: 999,
        background: 'var(--green)',
        position: 'relative',
        display: 'inline-block',
        cursor: 'not-allowed',
        flex: '0 0 auto',
      }}
    >
      <span style={{ position: 'absolute', top: 3, left: 19, width: 16, height: 16, borderRadius: '50%', background: '#fff', boxShadow: '0 1px 2px rgba(7,8,12,0.25)' }} />
    </span>
  )
}

function Choice({
  selected,
  onClick,
  children,
  compact = false,
}: {
  selected: boolean
  onClick: () => void
  children: React.ReactNode
  compact?: boolean
}) {
  return (
    <button
      onClick={onClick}
      style={{
        textAlign: 'left',
        padding: compact ? '9px 11px' : '13px 15px',
        borderRadius: 'var(--r-md)',
        border: `1px solid ${selected ? 'var(--blue)' : 'var(--border)'}`,
        background: selected ? 'var(--blue-tint)' : 'var(--bg)',
        boxShadow: selected ? '0 0 0 1px var(--blue)' : 'none',
        transition: 'all 0.15s var(--ease)',
        position: 'relative',
      }}
    >
      {children}
      {selected && !compact && (
        <span style={{ position: 'absolute', top: 11, right: 11, color: 'var(--blue)' }}>
          <CheckCircle size={16} />
        </span>
      )}
    </button>
  )
}

/* ---- Step 3: Results ---------------------------------------------------- */

function StepResults({
  config,
  onReplay,
  onClose,
}: {
  config: ConfigValue
  onReplay: () => void
  onClose: () => void
}) {
  const m = getMetric(config.metric)
  const c = getContext(config.context)
  return (
    <div style={{ padding: '24px 26px 26px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 11, marginBottom: 6 }}>
        <span style={{ color: 'var(--green)' }}><CheckCircle size={26} /></span>
        <h2 style={{ fontSize: 23, fontWeight: 750, letterSpacing: '-0.02em' }}>Caught it early, and rolled back on its own</h2>
      </div>
      <p className="muted" style={{ fontSize: 14.5, lineHeight: 1.55, maxWidth: 720 }}>
        You guarded <strong style={{ color: 'var(--text)' }}>{m.short}</strong> and rolled out by{' '}
        <strong style={{ color: 'var(--text)' }}>{c.singular}</strong>. {TREATMENT.name} started failing at the{' '}
        {BLAST.exposed}% step, so LaunchDarkly caught it and rolled back to {CONTROL.name} in {ROLLBACK_MS} ms.{' '}
        <strong style={{ color: 'var(--text)' }}>
          {BLAST.protected}% of your {c.plural} were never exposed to it.
        </strong>{' '}
        No page, no incident.
      </p>

      <div className="cols grid-3" style={{ marginTop: 20 }}>
        <div className="stat-tile">
          <div className="k">Max blast radius</div>
          <div className="v">{BLAST.exposed}%</div>
          <div className="faint" style={{ fontSize: 12, marginTop: 3 }}>caught at the {BLAST.exposed}% step</div>
        </div>
        <div className="stat-tile">
          <div className="k">Users protected</div>
          <div className="v" style={{ color: 'var(--green)' }}>{BLAST.protected}%</div>
          <div className="faint" style={{ fontSize: 12, marginTop: 3 }}>saved from the regression</div>
        </div>
        <div className="stat-tile">
          <div className="k">Rolled back in</div>
          <div className="v">{ROLLBACK_MS} ms</div>
          <div className="faint" style={{ fontSize: 12, marginTop: 3 }}>every SDK, automatically</div>
        </div>
      </div>

      <div className="card" style={{ marginTop: 22, padding: '18px 20px' }}>
        <h3 style={{ fontSize: 16, fontWeight: 700 }}>Set up your first guarded release</h3>
        <p className="muted" style={{ fontSize: 13.5, marginTop: 4 }}>{CHECKLIST.subtitle}</p>
        <div style={{ marginTop: 12 }}>
          {CHECKLIST.steps.map((s, i) => (
            <div key={i} className="check-step">
              <span className="csnum">{i + 1}</span>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontWeight: 650, fontSize: 14 }}>{s.title}</div>
                <div className="muted" style={{ fontSize: 13, marginTop: 2, lineHeight: 1.45 }}>{s.body}</div>
                {s.link && (
                  <a className="link" href={s.link.href} target="_blank" rel="noreferrer" style={{ fontSize: 13, marginTop: 6 }}>
                    {s.link.label} <ArrowRight size={13} />
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div style={{ display: 'flex', gap: 10, marginTop: 22, flexWrap: 'wrap', alignItems: 'center' }}>
        <a className="btn lg" href={CHECKLIST.appHref} target="_blank" rel="noreferrer">
          Create your first flag <ArrowRight size={16} />
        </a>
        <a className="btn default lg" href={CHECKLIST.docsHref} target="_blank" rel="noreferrer">
          Read the docs
        </a>
        <button className="btn minimal lg" onClick={onReplay} style={{ marginLeft: 'auto' }}>
          <Replay size={15} /> Replay
        </button>
        <button className="btn minimal lg" onClick={onClose}>Done</button>
      </div>
    </div>
  )
}
