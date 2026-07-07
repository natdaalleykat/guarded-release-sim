import type { ReactNode } from 'react'
import { motion } from 'framer-motion'
import { useNavigate, useParams, useSearchParams } from 'react-router-dom'
import type { ProductKey } from '../data/home'
import { LpIcon, DsButton } from './dsblocks'
import { SdkSetupContent, Field, ToggleRow, Chips, Note } from './Destinations'

/* =========================================================================
   Concept "Spec" stub destinations. Every learning-pane CTA on /home/spec
   navigates (react-router) to one of these /dest/* routes: a wireframe of
   the REAL gonfalon page the CTA lands on per §7 of the change spec, kept
   inside the app chrome so the flow reads end to end. Each page carries a
   mono annotation of the real route + @gonfalon/navigator helper, and a
   "Back to Home" link that restores the selected product and step via
   ?product= and ?step= query params. Nothing here mutates state.
   ========================================================================= */

/* §7 table: which /dest/* stub a spec step's primary CTA navigates to.
   Inline steps (flag create, experiment scaffold, o11y instructions) return
   null and never navigate; un-annotated steps fall back to the concept-4
   destFor() modals/docs so every CTA stays clickable. */
const STUB_FOR: Partial<Record<ProductKey, Record<string, string>>> = {
  guarded: {
    metric: 'create-metric',
    sdk: 'sdk-setup',
    rollout: 'flag-targeting', // fallback toGuardedRollouts linked on the page
    o11y: 'observe',
    alerts: 'integrations', // → flag-workflows for the trigger, linked on the page
  },
  flags: {
    wire: 'sdk-setup',
    toggle: 'flag-targeting',
    target: 'flag-targeting',
    guard: 'flag-targeting',
    coderefs: 'integrations',
  },
  experiments: {
    metric: 'create-metric',
    instrument: 'sdk-setup',
    start: 'experiment-design',
  },
  observability: {
    sessions: 'sessions',
    alerts: 'new-alert',
    guard: 'flag-targeting',
  },
}

export function stubForSpec(product: ProductKey, stepKey: string): string | null {
  return STUB_FOR[product]?.[stepKey] ?? null
}

/* what the stub pages render with: the return context + cross-stub nav */
interface StubCtx {
  product: string | null
  step: string | null
  go: (page: string) => void
}

interface StubDef {
  crumbs: string[]
  title: string
  subtitle?: string
  /* the real gonfalon route + navigator helper, shown as the mono annotation */
  route: string
  helper: string
  body: (ctx: StubCtx) => ReactNode
}

/* the flag + experiment created earlier in the flow; continuity with the
   inline create panes and the sim (same keys everywhere) */
const FLAG_KEY = 'release-new-checkout'
const EXP_KEY = 'better-button-copy'

const STUBS: Record<string, StubDef> = {
  'sdk-setup': {
    crumbs: ['Get started', 'SDK setup'],
    title: 'Connect your app',
    subtitle: 'Install a LaunchDarkly SDK and evaluate your first flag.',
    route: '/projects/default/sdk-setup',
    helper: 'toSdkSetup({ projectKey })',
    body: () => (
      <div className="ds-card">
        <SdkSetupContent />
      </div>
    ),
  },

  'flag-targeting': {
    crumbs: ['Flags', FLAG_KEY, 'Targeting'],
    title: FLAG_KEY,
    subtitle: 'Boolean · created from Home · Production',
    route: `/projects/default/flags/${FLAG_KEY}/targeting?env=production`,
    helper: 'toFlagTargeting({ projectKey, flagKey, environmentKey })',
    body: ({ product, step, go }) => (
      <>
        <div className="ds-card ds-card-pad">
          <ToggleRow label={`${FLAG_KEY} is Off`} sub="Serving false to everyone. Turn it on to serve by the rules below." />
          <div className="ds-wire-label" style={{ marginTop: 'var(--lp-spacing-500)' }}>Serve</div>
          <div className="ds-serve-menu" style={{ maxWidth: 480, marginBottom: 'var(--lp-spacing-500)' }}>
            <div className="ds-serve-item">Single variation</div>
            <div className="ds-serve-item">Percentage rollout</div>
            <div className="ds-serve-item">Progressive rollout</div>
            <div className="ds-serve-item on">
              <LpIcon name="shield-heart" size={15} />
              <span>
                Guarded rollout
                <span className="ds-muted" style={{ display: 'block', fontSize: 'var(--lp-font-size-100)', fontWeight: 'var(--lp-font-weight-regular)' }}>
                  a progressive rollout with regression monitoring
                </span>
              </span>
            </div>
          </div>
          <Field label="Targeting rules" value="+ Add rule (individual targets, attribute rules, segments)" />
          <Field label="Default rule" value="Serve: false" />
          {product === 'observability' && step === 'guard' ? (
            <Note>
              Pick Guarded rollout, then open the metric picker: the <strong>error-rate and latency metrics auto-generated from your telemetry</strong> are already in it. No track() calls to write.
            </Note>
          ) : (
            <Note>Pick Guarded rollout from the Serve menu, choose your metric and a monitoring window, and health checks run before launch.</Note>
          )}
        </div>
        {step === 'rollout' && (
          <div className="ds-muted" style={{ fontSize: 'var(--lp-font-size-200)', marginTop: 'var(--lp-spacing-400)' }}>
            Skipped creating a flag?{' '}
            <button className="ds-btn minimal" style={{ fontSize: 'var(--lp-font-size-200)' }} onClick={() => go('guarded-rollouts')}>
              Browse guarded rollouts <span className="ds-dest-note">· toGuardedRollouts({'{ projectKey }'})</span>
            </button>
          </div>
        )}
      </>
    ),
  },

  'create-metric': {
    crumbs: ['Metrics', 'Create metric'],
    title: 'Create a metric',
    route: '/projects/default/metrics/new?env=production',
    helper: 'toCreateMetric({ projectKey, environmentKey })',
    body: () => (
      <div className="ds-card ds-card-pad" style={{ maxWidth: 640 }}>
        <Chips label="What do you want to measure?" options={['Clicked or tapped', 'Page viewed', 'Custom']} sel={0} />
        <Field label="Name" value="Checkout error rate" />
        <Field label="Click target (CSS selector)" value=".checkout-button" hl />
        <Field label="Target URL" value="app.example.com/cart" />
        <Note>
          <strong>No code needed for click and page view</strong>: a browser SDK captures them from the selector or URL. Custom metrics are one <code>track()</code> call when the outcome happens.
        </Note>
      </div>
    ),
  },

  'guarded-rollouts': {
    crumbs: ['Release', 'Guarded rollouts'],
    title: 'Guarded rollouts',
    subtitle: 'Every rollout being watched by a metric, across all flags.',
    route: '/projects/default/guarded-rollouts',
    helper: 'toGuardedRollouts({ projectKey })',
    body: () => (
      <div className="ds-card" style={{ padding: 'var(--lp-spacing-300)' }}>
        {[
          { flag: FLAG_KEY, status: 'Monitoring', pct: '10% · Checkout error rate · 24h window', tone: 'brand' },
          { flag: 'search-ranking-v2', status: 'Completed', pct: 'Rolled out to 100% · no regression', tone: 'success' },
          { flag: 'enable-dark-mode', status: 'Rolled back', pct: 'Regression at 25% · p95 latency', tone: 'warning' },
        ].map((r) => (
          <div key={r.flag} className="ds-step" style={{ cursor: 'default' }}>
            <span className="ds-node"><LpIcon name="shield-heart" size={15} /></span>
            <div style={{ flex: 1, minWidth: 0 }}>
              <span style={{ fontSize: 'var(--lp-font-size-200)', fontWeight: 'var(--lp-font-weight-semibold)', fontFamily: 'ui-monospace, Menlo, monospace' }}>{r.flag}</span>
              <div className="ds-muted" style={{ fontSize: 'var(--lp-font-size-100)', marginTop: 2 }}>{r.pct}</div>
            </div>
            <span className={`ds-chip ${r.tone}`}>{r.status}</span>
          </div>
        ))}
      </div>
    ),
  },

  integrations: {
    crumbs: ['Organization settings', 'Integrations'],
    title: 'Integrations',
    subtitle: 'Connect the tools around your releases.',
    route: '/settings/integrations',
    helper: 'toIntegrations()',
    body: ({ step, go }) => (
      <>
        <div className="cols" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: 'var(--lp-spacing-400)' }}>
          <div className="ds-card ds-card-pad" style={{ borderColor: 'var(--lp-color-border-interactive-selected)' }}>
            <div style={{ fontWeight: 'var(--lp-font-weight-semibold)', fontSize: 'var(--lp-font-size-300)', marginBottom: 'var(--lp-spacing-200)' }}>Slack</div>
            <p className="ds-muted" style={{ fontSize: 'var(--lp-font-size-200)', lineHeight: 1.5 }}>Flag changes, rollbacks, and approvals in your channels.</p>
            <div style={{ marginTop: 'var(--lp-spacing-400)' }}>
              <DsButton variant="primary">Install the LaunchDarkly Slack app</DsButton>
            </div>
          </div>
          {[
            ['GitHub', 'Code references: find every flag in your repos.'],
            ['Datadog', 'Dual-send telemetry for auto-generated guardrail metrics.'],
            ['Webhooks', 'POST every change to any endpoint you run.'],
          ].map(([name, blurb]) => (
            <div key={name} className="ds-card ds-card-pad">
              <div style={{ fontWeight: 'var(--lp-font-weight-semibold)', fontSize: 'var(--lp-font-size-300)', marginBottom: 'var(--lp-spacing-200)' }}>{name}</div>
              <p className="ds-muted" style={{ fontSize: 'var(--lp-font-size-200)', lineHeight: 1.5 }}>{blurb}</p>
              <div style={{ marginTop: 'var(--lp-spacing-400)' }}>
                <DsButton variant="default">Connect</DsButton>
              </div>
            </div>
          ))}
        </div>
        {step === 'alerts' && (
          <div className="ds-card ds-card-pad" style={{ marginTop: 'var(--lp-spacing-500)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 'var(--lp-spacing-400)', flexWrap: 'wrap' }}>
            <div>
              <div style={{ fontWeight: 'var(--lp-font-weight-semibold)', fontSize: 'var(--lp-font-size-300)' }}>Then: send rollback alerts to a channel</div>
              <div className="ds-muted" style={{ fontSize: 'var(--lp-font-size-200)', marginTop: 2 }}>
                Once the Slack app is installed, add a trigger on <span className="ds-dest-note">{FLAG_KEY}</span> so the team hears the moment a release rolls back.
              </div>
            </div>
            <DsButton variant="default" onClick={() => go('flag-workflows')}>
              Create a flag trigger <LpIcon name="arrow-right-thin" size={15} />
            </DsButton>
          </div>
        )}
      </>
    ),
  },

  'flag-workflows': {
    crumbs: ['Flags', FLAG_KEY, 'Workflows'],
    title: 'Triggers & workflows',
    subtitle: `Automations attached to ${FLAG_KEY}.`,
    route: `/projects/default/flags/${FLAG_KEY}/workflows?env=production`,
    helper: 'toFlagWorkflows({ projectKey, flagKey, environmentKey })',
    body: () => (
      <div className="ds-card ds-card-pad" style={{ maxWidth: 640 }}>
        <div className="ds-section-label" style={{ marginBottom: 'var(--lp-spacing-400)' }}>New trigger</div>
        <Field label="When" value="Guarded rollout rolls back  ▾" hl />
        <Field label="Do" value="Send a message to Slack channel  ▾" />
        <Field label="Channel" value="#releases" />
        <Note>In-app and email notifications are always on. This trigger adds the Slack ping so nobody has to watch a dashboard. Requires the Slack app (one-time install).</Note>
        <div style={{ marginTop: 'var(--lp-spacing-500)' }}>
          <DsButton variant="primary">Save trigger</DsButton>
        </div>
      </div>
    ),
  },

  sessions: {
    crumbs: ['Observability', 'Sessions'],
    title: 'Sessions',
    route: '/projects/default/sessions',
    helper: 'toSessions({ projectKey })',
    body: () => (
      <div className="ds-card" style={{ padding: 'var(--lp-spacing-900) var(--lp-spacing-600)', textAlign: 'center' }}>
        {/* the real empty state: this page is also the §7 fallback for users
            who reach it before installing the plugins */}
        <span className="ds-step-ic" style={{ background: 'rgb(0,131,68)', width: 44, height: 44, margin: '0 auto var(--lp-spacing-400)' }}>
          <LpIcon name="play-circle" size={21} />
        </span>
        <h3 className="ds-display" style={{ fontSize: 'var(--lp-font-size-400)' }}>No sessions detected</h3>
        <p className="ds-muted" style={{ fontSize: 'var(--lp-font-size-300)', marginTop: 'var(--lp-spacing-200)' }}>
          Install the session-replay plugin to get results.
        </p>
        <div style={{ marginTop: 'var(--lp-spacing-500)', display: 'flex', justifyContent: 'center', gap: 'var(--lp-spacing-400)', alignItems: 'center', flexWrap: 'wrap' }}>
          <DsButton variant="primary">Install plugin</DsButton>
          <a href="https://launchdarkly.com/docs/sdk/observability/javascript" target="_blank" rel="noreferrer" style={{ fontSize: 'var(--lp-font-size-200)', color: 'var(--lp-color-fill-interactive-primary)', textDecoration: 'none', fontWeight: 'var(--lp-font-weight-medium)' }}>
            Observability SDK setup docs ↗
          </a>
        </div>
      </div>
    ),
  },

  'new-alert': {
    crumbs: ['Observability', 'Alerts', 'New alert'],
    title: 'Create an alert',
    route: '/projects/default/alerts/new',
    helper: 'toNewAlert({ projectKey })',
    body: () => (
      <div className="ds-card ds-card-pad" style={{ maxWidth: 640 }}>
        <Chips label="Alert type" options={['Error rate', 'Latency', 'Logs']} sel={0} />
        <Field label="Name" value="Checkout error spike" />
        <Field label="Condition" value="Error rate > 2% over 5 minutes" hl />
        <Field label="Notify" value="Slack · #alerts" />
        <Note>Alerts can be created <strong>before any data arrives</strong>; they arm themselves once telemetry flows. Delivered to Slack or a webhook.</Note>
        <div style={{ marginTop: 'var(--lp-spacing-500)' }}>
          <DsButton variant="primary">Create alert</DsButton>
        </div>
      </div>
    ),
  },

  observe: {
    crumbs: ['Observability', 'Overview'],
    title: 'Observability',
    subtitle: 'Errors, logs, traces, and sessions from the SDK plugins.',
    route: '/projects/default/observe?env=production',
    helper: 'toObserve({ projectKey, environmentKey })',
    body: () => (
      <>
        <div className="cols" style={{ gridTemplateColumns: 'repeat(4, minmax(0, 1fr))', gap: 'var(--lp-spacing-400)' }}>
          {[
            ['Errors', 'pulse'],
            ['Sessions', 'play-circle'],
            ['Traces', 'chart-venn'],
            ['Logs', 'article'],
          ].map(([label, icon]) => (
            <div key={label} className="ds-card ds-card-pad">
              <div className="ds-section-label" style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <LpIcon name={icon} size={13} /> {label}
              </div>
              <div className="ds-display" style={{ fontSize: 'var(--lp-font-size-500)', marginTop: 'var(--lp-spacing-300)' }}>—</div>
              <div className="ds-muted" style={{ fontSize: 'var(--lp-font-size-100)', marginTop: 2 }}>waiting for plugin data</div>
            </div>
          ))}
        </div>
        <div className="ds-card ds-card-pad" style={{ marginTop: 'var(--lp-spacing-500)' }}>
          <Note>
            Once telemetry flows, LaunchDarkly <strong>auto-generates error-rate and latency metrics</strong> from it. They show up in the guarded rollout metric picker with no track() calls to write. Honest estimate: ~10 min.
          </Note>
        </div>
      </>
    ),
  },

  'experiment-design': {
    crumbs: ['Experiments', 'Better button copy', 'Design'],
    title: 'Better button copy',
    subtitle: 'Scaffolded for you: flag, metric, and a 50/50 test.',
    route: `/projects/default/experiments/${EXP_KEY}/design?env=production`,
    helper: 'toExperimentDesign({ projectKey, experimentKey, environmentKey })',
    body: () => (
      <div className="ds-card ds-card-pad" style={{ maxWidth: 680 }}>
        <Field label="Hypothesis" value="Changing the CTA from “Buy now” to “Get started” increases clicks" />
        <Field label="Flag" value="button-copy · Control “Buy now” · Treatment “Get started”" />
        <div style={{ marginBottom: 'var(--lp-spacing-400)' }}>
          <div className="ds-wire-label">Metric</div>
          <div className="ds-wire-field" style={{ display: 'flex', alignItems: 'center', gap: 'var(--lp-spacing-300)' }}>
            <LpIcon name="check" size={14} /> button-clicked · binary conversion · attached
          </div>
        </div>
        <Chips label="Traffic split" options={['50 / 50', '90 / 10', 'Custom']} sel={0} />
        <Chips label="Statistics" options={['Frequentist', 'Bayesian']} sel={0} />
        <div style={{ marginTop: 'var(--lp-spacing-600)', display: 'flex', alignItems: 'center', gap: 'var(--lp-spacing-400)' }}>
          {/* the real gate: Start stays hidden/disabled until LD sees SDK traffic */}
          <DsButton variant="primary" style={{ opacity: 0.45, pointerEvents: 'none' }}>
            <LpIcon name="play-circle" size={15} /> Start experiment
          </DsButton>
          <span className="ds-muted" style={{ fontSize: 'var(--lp-font-size-100)' }}>Waiting for SDK traffic… install the SDK and this unlocks.</span>
        </div>
      </div>
    ),
  },
}

/* the /dest/:page route body, rendered inside the app chrome by App.tsx */
export function DestPage() {
  const { page } = useParams()
  const [params] = useSearchParams()
  const navigate = useNavigate()

  const product = params.get('product')
  const step = params.get('step')
  /* continuity: back to /home/spec with the product + step that sent us here */
  const homeSearch = product ? `?product=${product}${step ? `&step=${step}` : ''}` : ''
  const back = () => navigate(`/home/spec${homeSearch}`)
  /* cross-stub hops (integrations → flag-workflows, targeting → rollout
     list) carry the same params so "Back to Home" keeps working */
  const go = (p: string) => navigate(`/dest/${p}${params.size ? `?${params.toString()}` : ''}`)

  const stub = page ? STUBS[page] : undefined
  if (!stub) {
    return (
      <div className="content-inner ds-scope">
        <p className="ds-muted">Unknown destination.</p>
        <button className="ds-btn minimal" onClick={back}><LpIcon name="arrow-left-thin" size={15} /> Back to Home</button>
      </div>
    )
  }

  return (
    <motion.div
      key={page}
      className="content-inner ds-scope"
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
    >
      <button className="ds-btn minimal" style={{ marginBottom: 'var(--lp-spacing-500)' }} onClick={back}>
        <LpIcon name="arrow-left-thin" size={15} /> Back to Home
      </button>

      <div className="ds-breadcrumb">
        {stub.crumbs.map((r, i) => (
          <span key={i} style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
            {i > 0 && <LpIcon name="chevron-right" size={12} />}{r}
          </span>
        ))}
      </div>
      <h1 className="ds-display" style={{ fontSize: 'var(--lp-font-size-500)' }}>{stub.title}</h1>
      {stub.subtitle && (
        <p className="ds-muted" style={{ fontSize: 'var(--lp-font-size-300)', marginTop: 'var(--lp-spacing-200)' }}>{stub.subtitle}</p>
      )}
      {/* the prominent annotation: where this stub lives for real */}
      <div className="ds-dest-note" style={{ margin: 'var(--lp-spacing-300) 0 var(--lp-spacing-600)', fontSize: 12.5 }}>
        → {stub.route} · {stub.helper}
      </div>

      {stub.body({ product, step, go })}

      <p className="ds-muted" style={{ fontSize: 'var(--lp-font-size-100)', marginTop: 'var(--lp-spacing-600)' }}>
        Prototype wireframe. In the product this is the {stub.crumbs.join(' / ')} page.
      </p>
    </motion.div>
  )
}
