import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import {
  METRICS,
  CONTEXTS,
  PACES,
  getMetric,
  getContext,
  getPace,
  fmtPop,
  DEFAULTS,
  type MetricKey,
  type ContextKey,
  type PaceKey,
} from '../data/content'
import { WIZARD } from '../data/product'
import { StepRun } from './StepRun'
import { ShieldHeart, Check, Bolt } from '../components/icons'
import { IcX } from '../components/navicons'

export interface ConfigValue {
  metric: MetricKey
  context: ContextKey
  pace: PaceKey
}

export type ChartVariant = 'default' | 'gonfalon'

export function SimWizard({
  onClose,
  onFinish,
  chartVariant = 'default',
}: {
  onClose: () => void
  onFinish: () => void
  chartVariant?: ChartVariant
}) {
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
              {step === 1 && (
                <StepRun
                  config={config}
                  onFinish={onFinish}
                  onReplay={() => setRunId((r) => r + 1)}
                  chartVariant={chartVariant}
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

/* ---- Step 1: Configure (compact) ---------------------------------------- */

function StepConfigure({
  config,
  onChange,
  onNext,
}: {
  config: ConfigValue
  onChange: (p: Partial<ConfigValue>) => void
  onNext: () => void
}) {
  const m = getMetric(config.metric)
  const c = getContext(config.context)
  const p = getPace(config.pace)

  return (
    <div style={{ padding: '20px 24px 0' }}>
      {/* prominent callout */}
      <div
        style={{
          display: 'flex',
          gap: 14,
          padding: '16px 18px',
          borderRadius: 'var(--r-lg)',
          border: '1px solid rgba(66,94,255,0.3)',
          background: 'linear-gradient(180deg, var(--blue-tint), var(--bg))',
        }}
      >
        <div
          style={{
            width: 42,
            height: 42,
            borderRadius: 12,
            flex: '0 0 auto',
            display: 'grid',
            placeItems: 'center',
            color: '#fff',
            background: 'linear-gradient(135deg, #6e8bff, #3f57e0)',
            boxShadow: '0 6px 16px -4px rgba(63,87,224,0.6)',
          }}
        >
          <ShieldHeart size={23} />
        </div>
        <div style={{ minWidth: 0 }}>
          <h3 style={{ fontSize: 17, fontWeight: 750, letterSpacing: '-0.02em' }}>
            Watch a guarded release catch a bad deploy
          </h3>
          <p className="muted" style={{ fontSize: 13.5, lineHeight: 1.5, marginTop: 4 }}>{WIZARD.configure.lede}</p>
          <div style={{ display: 'flex', gap: 7, marginTop: 10, flexWrap: 'wrap' }}>
            <span className="badge blue">~30 seconds</span>
            <span className="badge">No setup</span>
            <span className="badge">Simulation, not live data</span>
          </div>
        </div>
      </div>

      {/* compact choices */}
      <div style={{ marginTop: 18, display: 'flex', flexDirection: 'column', gap: 15 }}>
        <CfgRow label={WIZARD.configure.metricQ} caption={m.blurb}>
          {METRICS.map((x) => (
            <Pill key={x.key} on={config.metric === x.key} onClick={() => onChange({ metric: x.key })}>
              {x.label}
            </Pill>
          ))}
        </CfgRow>

        <CfgRow label={WIZARD.configure.contextQ} caption={c.blurb}>
          {CONTEXTS.map((x) => (
            <Pill key={x.key} on={config.context === x.key} onClick={() => onChange({ context: x.key })}>
              {x.label} <span className="mono">{fmtPop(x.population)}</span>
            </Pill>
          ))}
        </CfgRow>

        <CfgRow label="Ramp" caption={p.blurb}>
          {PACES.map((x) => (
            <Pill key={x.key} on={config.pace === x.key} onClick={() => onChange({ pace: x.key })}>
              {x.label} · {x.perStep}
            </Pill>
          ))}
        </CfgRow>

        {/* locked auto-rollback */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: 12,
            padding: '10px 13px',
            border: '1px solid var(--border)',
            borderRadius: 'var(--r-md)',
            background: 'var(--bg-sub)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <span style={{ color: 'var(--green)' }}><ShieldHeart size={16} /></span>
            <div>
              <div style={{ fontWeight: 600, fontSize: 13 }}>Automatically roll back if a regression is detected</div>
              <div className="faint" style={{ fontSize: 11.5 }}>On by default. Required for a guarded release.</div>
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 9, flex: '0 0 auto' }}>
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
          margin: '18px -24px 0',
          padding: '13px 24px',
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

function CfgRow({ label, caption, children }: { label: string; caption: string; children: React.ReactNode }) {
  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
        <span style={{ fontSize: 12, fontWeight: 650, color: 'var(--text-2)', width: 86, flex: '0 0 auto' }}>{label}</span>
        <div style={{ display: 'flex', gap: 7, flexWrap: 'wrap', flex: 1, minWidth: 0 }}>{children}</div>
      </div>
      <div className="faint" style={{ fontSize: 12, marginTop: 5, marginLeft: 98, lineHeight: 1.4 }}>{caption}</div>
    </div>
  )
}

function Pill({ on, onClick, children }: { on: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button className={`selpill ${on ? 'on' : ''}`} onClick={onClick}>
      {children}
    </button>
  )
}

function LockedToggleOn() {
  return (
    <span
      role="switch"
      aria-checked="true"
      aria-disabled="true"
      title="Required for guarded releases"
      style={{
        width: 36,
        height: 21,
        borderRadius: 999,
        background: 'var(--green)',
        position: 'relative',
        display: 'inline-block',
        cursor: 'not-allowed',
        flex: '0 0 auto',
      }}
    >
      <span style={{ position: 'absolute', top: 3, left: 18, width: 15, height: 15, borderRadius: '50%', background: '#fff', boxShadow: '0 1px 2px rgba(7,8,12,0.25)' }} />
    </span>
  )
}
