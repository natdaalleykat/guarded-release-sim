import { useEffect, useState, type ReactNode } from 'react'
import { motion } from 'framer-motion'
import type { RoadmapStepV2 } from '../data/home'
import { LpIcon, DsButton } from './dsblocks'

/* =========================================================================
   Where each v2 CTA goes. The SDK step opens a slide-in drawer that mirrors
   the real in-product "Connect your app" SDK setup drawer
   (packages/sdk-setup). Every other CTA opens a wireframe of the real
   destination page (modeled on gonfalon) so it is clear what happens.
   Nothing here mutates state; these are faithful mocks.
   ========================================================================= */

export type Dest =
  | 'sdk'
  | 'flag-create'
  | 'flag-toggle'
  | 'metric-create'
  | 'targeting'
  | 'guarded-rollout'
  | 'segment'
  | 'experiment'

/** Map a roadmap step to its real destination, or a docs URL. */
export function destFor(step: RoadmapStepV2): Dest | { docs: string } {
  const k = step.key
  if (['wire', 'sdk', 'instrument', 'plugins'].includes(k)) return 'sdk'
  if (k === 'toggle' || k === 'enable') return 'flag-toggle'
  if (k === 'target') return 'targeting'
  if (k === 'metric') return 'metric-create'
  if (k === 'rollout' || k === 'ship') return 'guarded-rollout'
  if (k === 'build' || k === 'start') return 'experiment'
  if (k === 'flag') return 'flag-create'
  if (k === 'segment') return 'segment'
  return { docs: step.docs?.[0]?.href ?? 'https://launchdarkly.com/docs' }
}

const SERVER_KEY = 'sdk-7f3a9c21-4e8b-42d0-9a1f-2c5e8b1d3f9a'
const CLIENT_ID = '6627a1b9e4f2c80d3a5e1f42'

interface SdkDef {
  key: string
  label: string
  keyKind: 'SDK key' | 'client-side ID'
  keyVal: string
  install: string
  init: string
  evaluate: string
}

/* Snippets follow the real sdk-info wording, with the context-kind comment we
   agreed to add. Server SDKs show the context at the evaluate step; the React
   client SDK carries it on init, exactly like production. */
const SDKS: SdkDef[] = [
  {
    key: 'node',
    label: 'Node.js',
    keyKind: 'SDK key',
    keyVal: SERVER_KEY,
    install: 'npm install @launchdarkly/node-server-sdk',
    init: `import * as ld from '@launchdarkly/node-server-sdk';

// Your SDK key is already filled in for the Production environment.
const client = ld.init('${SERVER_KEY}');
await client.waitForInitialization();`,
    evaluate: `// A "context" is a data object representing users, devices,
// organizations, and other entities. Its "kind" is the
// context kind you target on.
const context = { kind: 'user', key: 'user-key-123abc', name: 'Sandy' };

const showFeature = await client.variation(
  'release-new-checkout', context, false,
);`,
  },
  {
    key: 'react',
    label: 'React',
    keyKind: 'client-side ID',
    keyVal: CLIENT_ID,
    install: 'npm install launchdarkly-react-client-sdk',
    init: `import { LDProvider } from 'launchdarkly-react-client-sdk';

// A "context" is a data object representing users, devices,
// organizations, and other entities. Its "kind" is the context kind.
const context = { kind: 'user', key: 'EXAMPLE_CONTEXT_KEY', email: 'biz@face.dev' };

<LDProvider clientSideID="${CLIENT_ID}" context={context}>
  <App />
</LDProvider>`,
    evaluate: `import { useFlags } from 'launchdarkly-react-client-sdk';

// flag keys are camelCased automatically
const { releaseNewCheckout } = useFlags();`,
  },
  {
    key: 'python',
    label: 'Python',
    keyKind: 'SDK key',
    keyVal: SERVER_KEY,
    install: 'pip install launchdarkly-server-sdk',
    init: `import ldclient
from ldclient.config import Config

# Your SDK key is already filled in for the Production environment.
ldclient.set_config(Config('${SERVER_KEY}'))`,
    evaluate: `from ldclient import Context

# A "context" is a data object representing users, devices,
# organizations, and other entities. Its "kind" is the
# context kind you target on.
context = Context.builder("user-key-123abc").name("Sandy").build()

show_feature = ldclient.get().variation("release-new-checkout", context, False)`,
  },
  {
    key: 'go',
    label: 'Go',
    keyKind: 'SDK key',
    keyVal: SERVER_KEY,
    install: 'go get github.com/launchdarkly/go-server-sdk/v7',
    init: `import ld "github.com/launchdarkly/go-server-sdk/v7"

// Your SDK key is already filled in for the Production environment.
client, _ := ld.MakeClient("${SERVER_KEY}", 5*time.Second)`,
    evaluate: `// A "context" represents users, devices, organizations, and
// other entities. Its kind (here "user") is the context kind
// you target on.
context := ldcontext.New("user-key-123abc")

show, _ := client.BoolVariation("release-new-checkout", context, false)`,
  },
]

export function Code({ code }: { code: string }) {
  return (
    <pre className="ds-code">
      <button className="ds-copy" onClick={() => navigator.clipboard?.writeText(code)}>Copy</button>
      {code.split('\n').map((line, i) => {
        const isComment = /^\s*(\/\/|#)/.test(line)
        return (
          <div key={i} className={isComment ? 'cmt' : undefined}>{line || ' '}</div>
        )
      })}
    </pre>
  )
}

export function Section({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div style={{ marginBottom: 'var(--lp-spacing-600)' }}>
      <div className="ds-section-label" style={{ marginBottom: 'var(--lp-spacing-300)' }}>{label}</div>
      {children}
    </div>
  )
}

/* ---- the SDK setup content (mirrors the real "Connect your app") ----
   Shared between the slide-in drawer (concepts 4–5) and the /dest/sdk-setup
   stub page (concept "Spec"), which renders it as a full page. */
export function SdkSetupContent() {
  const [sdk, setSdk] = useState(SDKS[0])
  const [tab, setTab] = useState<'manual' | 'ai'>('manual')

  return (
    <>
      <div style={{ display: 'flex', gap: 'var(--lp-spacing-200)', padding: 'var(--lp-spacing-400) var(--lp-spacing-600) 0' }}>
        <button className={`ds-tab ${tab === 'manual' ? 'on' : ''}`} onClick={() => setTab('manual')}>Manual</button>
        <button className={`ds-tab ${tab === 'ai' ? 'on' : ''}`} onClick={() => setTab('ai')}>With AI</button>
      </div>

      <div className="ds-dest-body">
        {tab === 'manual' ? (
            <>
              <Section label="Choose your SDK">
                <div style={{ display: 'flex', gap: 'var(--lp-spacing-300)', flexWrap: 'wrap' }}>
                  {SDKS.map((s) => (
                    <button key={s.key} className={`ds-chip ${sdk.key === s.key ? 'brand' : ''}`} style={{ cursor: 'pointer', padding: '4px var(--lp-spacing-400)' }} onClick={() => setSdk(s)}>{s.label}</button>
                  ))}
                </div>
              </Section>

              <Section label={sdk.keyKind}>
                <div className="ds-wire-field" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 'var(--lp-spacing-300)', fontFamily: 'ui-monospace, Menlo, monospace' }}>
                  <span style={{ overflow: 'hidden', textOverflow: 'ellipsis' }}>{sdk.keyVal}</span>
                  <button className="ds-iconbtn" aria-label="Copy key" onClick={() => navigator.clipboard?.writeText(sdk.keyVal)}><LpIcon name="duplicate" size={15} /></button>
                </div>
                <div className="ds-muted" style={{ fontSize: 'var(--lp-font-size-100)', marginTop: 6 }}>
                  It is already included in the snippets below for the <strong>Production</strong> environment.{sdk.keyKind === 'SDK key' ? ' Keep your SDK key secret.' : ''}
                </div>
              </Section>

              <Section label="1 · Install"><Code code={sdk.install} /></Section>
              <Section label="2 · Initialize the client"><Code code={sdk.init} /></Section>
              <Section label="3 · Evaluate the flag"><Code code={sdk.evaluate} /></Section>

              <div className="ds-card" style={{ padding: 'var(--lp-spacing-400) var(--lp-spacing-500)', display: 'flex', alignItems: 'center', gap: 'var(--lp-spacing-400)' }}>
                <span style={{ width: 10, height: 10, borderRadius: '50%', background: 'var(--lp-color-fill-feedback-warning, rgb(214,122,0))', flex: '0 0 auto' }} />
                <div>
                  <div style={{ fontWeight: 'var(--lp-font-weight-semibold)', fontSize: 'var(--lp-font-size-200)' }}>Verify the connection</div>
                  <div className="ds-muted" style={{ fontSize: 'var(--lp-font-size-100)' }}>Waiting for your app to connect. Flips to “Connected! You’re ready to build with LaunchDarkly.” once an SDK event arrives.</div>
                </div>
              </div>
            </>
          ) : (
            <>
              <Section label="Install with your coding agent">
                <Code code={`# In Cursor, Claude Code, or Copilot, run:\nSet up the LaunchDarkly SDK in this project\nusing the MCP server, then evaluate the\n'release-new-checkout' flag.`} />
              </Section>
              <div className="ds-muted" style={{ fontSize: 'var(--lp-font-size-200)' }}>The agent installs the SDK, wires the context, and evaluates the flag for you. Usually 3 to 5 minutes. Then verify the connection below.</div>
              <div className="ds-card" style={{ marginTop: 'var(--lp-spacing-500)', padding: 'var(--lp-spacing-400) var(--lp-spacing-500)', display: 'flex', alignItems: 'center', gap: 'var(--lp-spacing-400)' }}>
                <span style={{ width: 10, height: 10, borderRadius: '50%', background: 'var(--lp-color-fill-feedback-warning, rgb(214,122,0))', flex: '0 0 auto' }} />
                <div className="ds-muted" style={{ fontSize: 'var(--lp-font-size-100)' }}>Waiting for your app to connect.</div>
              </div>
            </>
          )}
      </div>
    </>
  )
}

/* ---- the slide-in drawer wrapper around the SDK setup content ---- */
export function SdkDrawer({ onClose }: { onClose: () => void }) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onClose])

  return (
    <div className="ds-overlay ds-scope" onMouseDown={(e) => e.target === e.currentTarget && onClose()}>
      <motion.div className="ds-drawer" initial={{ x: '100%' }} animate={{ x: 0 }} transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}>
        <div className="ds-dest-head">
          <div>
            <h2 className="ds-display" style={{ fontSize: 'var(--lp-font-size-400)' }}>Connect your app</h2>
            <div className="ds-muted" style={{ fontSize: 'var(--lp-font-size-200)', marginTop: 2 }}>Install a LaunchDarkly SDK and evaluate your first flag.</div>
          </div>
          <button className="ds-iconbtn" aria-label="Close" onClick={onClose}><LpIcon name="cancel" size={18} /></button>
        </div>
        <SdkSetupContent />
      </motion.div>
    </div>
  )
}

/* ---- wireframe destinations for the other CTAs ----
   The primitives are exported for the /dest/* stub pages (concept "Spec"). */
export function Field({ label, value, hl }: { label: string; value: string; hl?: boolean }) {
  return (
    <div style={{ marginBottom: 'var(--lp-spacing-400)' }}>
      <div className="ds-wire-label">{label}</div>
      <div className={`ds-wire-field ${hl ? 'hl' : ''}`}>{value}</div>
    </div>
  )
}

export function ToggleRow({ label, sub }: { label: string; sub?: string }) {
  return (
    <div className="ds-card" style={{ padding: 'var(--lp-spacing-400) var(--lp-spacing-500)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 'var(--lp-spacing-400)' }}>
      <div>
        <div style={{ fontWeight: 'var(--lp-font-weight-semibold)', fontSize: 'var(--lp-font-size-300)' }}>{label}</div>
        {sub && <div className="ds-muted" style={{ fontSize: 'var(--lp-font-size-100)' }}>{sub}</div>}
      </div>
      <span className="ds-switch" />
    </div>
  )
}

export function Chips({ label, options, sel }: { label: string; options: string[]; sel: number }) {
  return (
    <div style={{ marginBottom: 'var(--lp-spacing-400)' }}>
      <div className="ds-wire-label">{label}</div>
      <div style={{ display: 'flex', gap: 'var(--lp-spacing-300)', flexWrap: 'wrap' }}>
        {options.map((o, i) => <span key={o} className={`ds-chip ${i === sel ? 'brand' : ''}`} style={{ padding: '4px var(--lp-spacing-400)' }}>{o}</span>)}
      </div>
    </div>
  )
}

export function Note({ children }: { children: ReactNode }) {
  return <div className="ds-muted" style={{ fontSize: 'var(--lp-font-size-100)', lineHeight: 1.5, marginTop: 'var(--lp-spacing-300)' }}>{children}</div>
}

interface Spec {
  route: string[]
  title: string
  cta: string
  body: ReactNode
}

const SPECS: Record<Exclude<Dest, 'sdk'>, Spec> = {
  'flag-create': {
    route: ['Flags', 'Create flag'],
    title: 'Create a feature flag',
    cta: 'Create flag',
    body: (
      <>
        <Field label="Name" value="Release new checkout" />
        <Field label="Key" value="release-new-checkout" />
        <Chips label="Flag type" options={['Boolean (true / false)', 'Multivariate']} sel={0} />
        <ToggleRow label="Make available to client-side SDKs" sub="Lets browser and mobile apps evaluate this flag" />
        <Note>A boolean flag starts as a simple on / off. The variations become your treatments later if you experiment on it.</Note>
      </>
    ),
  },
  'metric-create': {
    route: ['Metrics', 'Create metric'],
    title: 'Create a metric',
    cta: 'Create metric',
    body: (
      <>
        <Chips label="What do you want to measure?" options={['Clicked or tapped', 'Page viewed', 'Custom']} sel={0} />
        <Field label="Name" value="Checkout conversion" />
        <Field label="Click target (CSS selector)" value=".checkout-button" hl />
        <Field label="Target URL" value="app.example.com/cart" />
        <Note>Clicked and page-view metrics are defined here with a selector or URL and need <strong>no code</strong> (a browser SDK captures them). Custom metrics need a <code>track()</code> call in your app.</Note>
      </>
    ),
  },
  targeting: {
    route: ['Flags', 'release-new-checkout', 'Targeting'],
    title: 'Targeting',
    cta: 'Review and save',
    body: (
      <>
        <ToggleRow label="release-new-checkout is On" sub="Serving by the rules below" />
        <Field label="Default rule" value="Serve: false (a 10% rollout, the rest fallthrough)" />
        <Field label="Rule 1" value="If user · plan is enterprise → serve true" />
        <Note>The dimensions in a rule (user, account, device) are <strong>context kinds</strong>, which come from the contexts your SDK sends. A <strong>segment</strong> is a reusable audience you build once and target on many flags. Setup seeds example kinds (account, device) to start.</Note>
        <div style={{ marginTop: 'var(--lp-spacing-400)' }}><DsButton variant="default"><LpIcon name="add" size={15} /> Create a segment</DsButton></div>
      </>
    ),
  },
  'flag-toggle': {
    route: ['Flags', 'Targeting'],
    title: 'Turn a flag on or off',
    cta: 'Done',
    body: (
      <>
        <Field label="Flag" value="release-new-checkout  ▾" hl />
        <Note>You may have created several flags. Pick the one you wired up, then flip it.</Note>
        <div style={{ marginTop: 'var(--lp-spacing-500)' }}>
          <ToggleRow label="On" sub="Serving true to 100% of contexts. Rerun or refresh your app to see it react." />
        </div>
      </>
    ),
  },
  'guarded-rollout': {
    route: ['Flags', 'release-new-checkout', 'Targeting', 'Serve'],
    title: 'Guarded rollout',
    cta: 'Start guarded rollout',
    body: (
      <>
        <div className="ds-wire-label">Serve menu</div>
        <div className="ds-serve-menu" style={{ marginBottom: 'var(--lp-spacing-500)' }}>
          <div className="ds-serve-item">Single variation</div>
          <div className="ds-serve-item">Percentage rollout</div>
          <div className="ds-serve-item on"><LpIcon name="shield-heart" size={15} /> Guarded rollout</div>
        </div>
        <Field label="Metric to watch" value="Checkout error rate  ▾" />
        <Chips label="Monitoring window" options={['1h', '12h', '24h', '48h', '1 week']} sel={2} />
        <Chips label="On regression" options={['Roll back automatically', 'Notify only']} sel={0} />
        <Note>Health checks confirm the flag is evaluating and the metric has events first. A rollout needs a minimum number of contexts per stage (about 30) to measure.</Note>
      </>
    ),
  },
  segment: {
    route: ['Segments', 'Create segment'],
    title: 'Create a segment',
    cta: 'Create segment',
    body: (
      <>
        <Field label="Name" value="Beta cohort" />
        <Field label="Key" value="beta-cohort" />
        <Field label="Description" value="Customers opted into early access" />
        <Note>A segment is a reusable audience. Build it once, then target it from any flag rule. Add individual targets or attribute rules after you create it.</Note>
      </>
    ),
  },
  experiment: {
    route: ['Experiments', 'Create experiment'],
    title: 'Build an experiment',
    cta: 'Save experiment',
    body: (
      <>
        <Field label="Name" value="Checkout button copy" />
        <Field label="Hypothesis" value="Changing the CTA from “Buy now” to “Get started” increases conversion" />
        <Field label="Randomize by" value="user  ▾" hl />
        <Note>Randomize by is a <strong>context kind</strong>. The user kind works by default; a custom unit like account must be turned on for experiments first.</Note>
        <div style={{ height: 'var(--lp-spacing-400)' }} />
        <Field label="Metric" value="Checkout conversion  ▾" />
        <Field label="Flag and rule" value="release-new-checkout · default rule" />
        <Chips label="Statistics" options={['Bayesian', 'Frequentist']} sel={0} />
        <Note>You can design and save the whole experiment here before writing any code. It records data once your SDK is live and the flag is on.</Note>
      </>
    ),
  },
}

export function DestinationModal({ kind, onClose }: { kind: Exclude<Dest, 'sdk'>; onClose: () => void }) {
  const spec = SPECS[kind]
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onClose])

  return (
    <div className="ds-overlay ds-scope" onMouseDown={(e) => e.target === e.currentTarget && onClose()}>
      <motion.div className="ds-modal" initial={{ opacity: 0, y: 12, scale: 0.99 }} animate={{ opacity: 1, y: 0, scale: 1 }} transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}>
        <div className="ds-dest-head">
          <div>
            <div className="ds-breadcrumb">
              {spec.route.map((r, i) => (
                <span key={i} style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
                  {i > 0 && <LpIcon name="chevron-right" size={12} />}{r}
                </span>
              ))}
            </div>
            <h2 className="ds-display" style={{ fontSize: 'var(--lp-font-size-400)' }}>{spec.title}</h2>
          </div>
          <button className="ds-iconbtn" aria-label="Close" onClick={onClose}><LpIcon name="cancel" size={18} /></button>
        </div>
        <div className="ds-dest-body">{spec.body}</div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 'var(--lp-spacing-400)', padding: 'var(--lp-spacing-400) var(--lp-spacing-600)', borderTop: '1px solid var(--lp-color-border-ui-primary)' }}>
          <span className="ds-muted" style={{ fontSize: 'var(--lp-font-size-100)' }}>Prototype. In the product this is the {spec.route.join(' / ')} page.</span>
          <DsButton variant="primary" onClick={onClose}>{spec.cta}</DsButton>
        </div>
      </motion.div>
    </div>
  )
}
