import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import {
  ROADMAPS,
  ROADMAPS_UNIFIED,
  PRODUCTS,
  PRODUCTS_UNIFIED,
  type ProductKey,
  type RoadmapStepV2,
} from '../data/home'
import { WelcomeRow, ProductPicker, SimHero, GlyphIcon } from './blocks'
import { ShieldHeart, ArrowRight, Check } from '../components/icons'
import { IcChevron } from '../components/navicons'

/* =========================================================================
   "Active right pane" split-pane concept.

   Same left roadmap as concept 1, but the right pane is a DOING surface, not a
   reading surface. Where a step can be completed in place (install the SDK,
   create a flag, add a metric, evaluate), the pane gives you the real key, a
   copy-able snippet, and a live "waiting → connected" detector — so the home
   page itself is the activation surface. Steps that genuinely belong in the
   product say so honestly and hand off.
   ========================================================================= */

const SDK_KEY = 'sdk-7f3a9c21-4e8b-42d0-9a1f-2c5e8b1d3f9a'

const SDK_SNIPPETS: Record<string, string> = {
  Node: `import * as ld from '@launchdarkly/node-server-sdk'

const client = ld.init('${SDK_KEY}')
await client.waitForInitialization()

const showCheckout = await client.variation(
  'release-new-checkout',
  { kind: 'user', key: 'user-123' },
  false,
)`,
  Python: `import ldclient
from ldclient.config import Config

ldclient.set_config(Config('${SDK_KEY}'))
client = ldclient.get()

show_checkout = client.variation(
    'release-new-checkout',
    {"kind": "user", "key": "user-123"},
    False,
)`,
  Go: `import ld "github.com/launchdarkly/go-server-sdk/v7"

client, _ := ld.MakeClient("${SDK_KEY}", 5*time.Second)

show, _ := client.BoolVariation(
  "release-new-checkout",
  ldcontext.New("user-123"),
  false,
)`,
}

const EVALUATE_SNIPPET = `// Anywhere you read a config value today, ask LaunchDarkly instead
const showCheckout = await client.variation(
  'release-new-checkout',
  { kind: 'user', key: currentUser.id },
  false,
)

if (showCheckout) {
  renderNewCheckout()
}`

const TRACK_SNIPPET = `// Custom conversion metric — one call where the outcome happens
client.track('checkout-completed', {
  kind: 'user',
  key: currentUser.id,
})`

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false)
  return (
    <button
      onClick={() => {
        navigator.clipboard?.writeText(text)
        setCopied(true)
        setTimeout(() => setCopied(false), 1500)
      }}
      style={{
        fontSize: 11,
        fontWeight: 600,
        color: copied ? 'rgb(120,220,160)' : '#aeb6c8',
        background: 'transparent',
        border: '1px solid rgba(140,150,180,0.3)',
        borderRadius: 6,
        padding: '3px 9px',
        cursor: 'pointer',
      }}
    >
      {copied ? 'Copied ✓' : 'Copy'}
    </button>
  )
}

function CodeBlock({ code, label }: { code: string; label: string }) {
  return (
    <div style={{ borderRadius: 9, overflow: 'hidden', border: '1px solid rgba(120,130,160,0.22)' }}>
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '7px 11px',
          background: '#11161f',
          borderBottom: '1px solid rgba(120,130,160,0.18)',
        }}
      >
        <span style={{ fontSize: 11, color: '#8b93a7', fontFamily: 'ui-monospace, Menlo, monospace' }}>{label}</span>
        <CopyButton text={code} />
      </div>
      <pre
        style={{
          margin: 0,
          padding: '12px 13px',
          overflowX: 'auto',
          fontSize: 12.5,
          lineHeight: 1.55,
          color: '#d7dce6',
          background: '#0d1117',
          fontFamily: 'ui-monospace, Menlo, monospace',
        }}
      >
        <code>{code}</code>
      </pre>
    </div>
  )
}

/* Live "is your app talking to us yet" detector — the activation moment. */
function ConnectDetector() {
  const [connected, setConnected] = useState(false)
  useEffect(() => {
    const id = setTimeout(() => setConnected(true), 3600)
    return () => clearTimeout(id)
  }, [])
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 10,
        padding: '11px 13px',
        borderRadius: 9,
        border: `1px solid ${connected ? 'rgba(0,160,80,0.45)' : 'var(--border-soft)'}`,
        background: connected ? 'rgba(0,160,80,0.07)' : 'transparent',
      }}
    >
      {connected ? (
        <>
          <span
            style={{
              width: 18,
              height: 18,
              borderRadius: '50%',
              background: 'rgb(0,160,80)',
              color: '#fff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flex: '0 0 auto',
            }}
          >
            <Check size={12} />
          </span>
          <span style={{ fontSize: 13, fontWeight: 650 }}>Connected — received your first flag evaluation</span>
          <span className="badge green" style={{ fontSize: 10, marginLeft: 'auto' }}>activated</span>
        </>
      ) : (
        <>
          <motion.span
            animate={{ opacity: [0.25, 1, 0.25] }}
            transition={{ duration: 1.3, repeat: Infinity, ease: 'easeInOut' }}
            style={{ width: 9, height: 9, borderRadius: '50%', background: 'var(--blue)', flex: '0 0 auto' }}
          />
          <span style={{ fontSize: 13, fontWeight: 600 }}>Listening for your app to connect…</span>
          <span className="faint" style={{ fontSize: 11.5, marginLeft: 'auto' }}>run your app</span>
        </>
      )}
    </div>
  )
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <div className="gr-section-label" style={{ marginBottom: 9 }}>
      {children}
    </div>
  )
}

function IdeaChips({ ideas }: { ideas: string[] }) {
  return (
    <div style={{ display: 'flex', gap: 7, flexWrap: 'wrap' }}>
      {ideas.map((idea) => (
        <span key={idea} className="badge" style={{ fontSize: 11.5, padding: '5px 11px' }}>
          {idea}
        </span>
      ))}
    </div>
  )
}

/* ---- the doing surfaces ------------------------------------------------- */

function SdkSurface({ step }: { step: RoadmapStepV2 }) {
  const langs = Object.keys(SDK_SNIPPETS)
  const [lang, setLang] = useState(langs[0])
  const masked = `${SDK_KEY.slice(0, 8)}${'•'.repeat(18)}${SDK_KEY.slice(-4)}`
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <p className="muted" style={{ fontSize: 14, lineHeight: 1.5, maxWidth: 580, margin: 0 }}>
        {step.learn.what}
      </p>

      <div>
        <SectionLabel>Your SDK key · Production</SectionLabel>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 10,
            padding: '9px 12px',
            borderRadius: 8,
            border: '1px solid var(--border-soft)',
            background: 'var(--bg)',
          }}
        >
          <span className="mono" style={{ fontSize: 13, flex: 1, minWidth: 0, letterSpacing: '0.02em' }}>{masked}</span>
          <CopyButton text={SDK_KEY} />
        </div>
      </div>

      <div>
        <div style={{ display: 'flex', gap: 6, marginBottom: 9 }}>
          {langs.map((l) => (
            <button
              key={l}
              onClick={() => setLang(l)}
              className={`badge ${lang === l ? 'blue' : ''}`}
              style={{ cursor: 'pointer', fontSize: 11.5, padding: '4px 11px' }}
            >
              {l}
            </button>
          ))}
        </div>
        <CodeBlock code={SDK_SNIPPETS[lang]} label={`${lang} · install + initialize`} />
      </div>

      <ConnectDetector />
      <div className="faint" style={{ fontSize: 12 }}>
        This is the activation moment, and it happens without leaving the page.
      </div>
    </div>
  )
}

function FlagSurface({ step }: { step: RoadmapStepV2 }) {
  const [created, setCreated] = useState(false)
  const [on, setOn] = useState(false)
  const [key, setKey] = useState('release-new-checkout')
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <p className="muted" style={{ fontSize: 14, lineHeight: 1.5, maxWidth: 580, margin: 0 }}>
        {step.learn.what}
      </p>

      {!created ? (
        <div>
          <SectionLabel>Name your first flag</SectionLabel>
          <div style={{ display: 'flex', gap: 9 }}>
            <input
              value={key}
              onChange={(e) => setKey(e.target.value)}
              spellCheck={false}
              className="mono"
              style={{
                flex: 1,
                minWidth: 0,
                fontSize: 13,
                padding: '9px 12px',
                borderRadius: 8,
                border: '1px solid var(--border-soft)',
                background: 'var(--bg)',
                color: 'inherit',
              }}
            />
            <button className="btn" onClick={() => setCreated(true)}>
              Create flag <ArrowRight size={14} />
            </button>
          </div>
          <div className="faint" style={{ fontSize: 12, marginTop: 8 }}>
            Boolean flag, off by default. No contexts or targeting needed first.
          </div>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 12,
              padding: '12px 14px',
              borderRadius: 9,
              border: '1px solid rgba(0,160,80,0.4)',
              background: 'rgba(0,160,80,0.06)',
            }}
          >
            <button
              className={`flag-toggle ${on ? 'on' : 'off'}`}
              onClick={() => setOn((v) => !v)}
              aria-label="toggle flag"
            >
              <span className="flag-knob" />
            </button>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div className="mono" style={{ fontSize: 13, fontWeight: 600 }}>{key}</div>
              <div className="faint" style={{ fontSize: 12, marginTop: 1 }}>
                Boolean · serving {on ? 'true' : 'false'} to everyone
              </div>
            </div>
            <span className="badge green" style={{ fontSize: 10 }}>created</span>
          </div>
          <div>
            <SectionLabel>Read it in your app</SectionLabel>
            <CodeBlock code={EVALUATE_SNIPPET} label="Node · evaluate" />
          </div>
        </div>
      )}
    </div>
  )
}

function MetricSurface({ step }: { step: RoadmapStepV2 }) {
  const [mode, setMode] = useState<'nocode' | 'custom'>('nocode')
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <p className="muted" style={{ fontSize: 14, lineHeight: 1.5, maxWidth: 580, margin: 0 }}>
        {step.learn.what}
      </p>
      <div style={{ display: 'flex', gap: 6 }}>
        <button
          className={`badge ${mode === 'nocode' ? 'blue' : ''}`}
          style={{ cursor: 'pointer', fontSize: 11.5, padding: '4px 11px' }}
          onClick={() => setMode('nocode')}
        >
          Clicks &amp; page views · no code
        </button>
        <button
          className={`badge ${mode === 'custom' ? 'blue' : ''}`}
          style={{ cursor: 'pointer', fontSize: 11.5, padding: '4px 11px' }}
          onClick={() => setMode('custom')}
        >
          Custom event
        </button>
      </div>
      {mode === 'nocode' ? (
        <div
          style={{
            padding: '13px 14px',
            borderRadius: 9,
            border: '1px solid var(--border-soft)',
            background: 'var(--bg)',
          }}
        >
          <div style={{ fontSize: 13, fontWeight: 600 }}>Pick an element or page in the visual editor.</div>
          <div className="faint" style={{ fontSize: 12, marginTop: 3 }}>
            No instrumentation. LaunchDarkly captures the click or pageview for you.
          </div>
          <button className="btn" style={{ marginTop: 12 }}>
            Create metric <ArrowRight size={14} />
          </button>
        </div>
      ) : (
        <CodeBlock code={TRACK_SNIPPET} label="Node · track conversion" />
      )}
    </div>
  )
}

function EvaluateSurface({ step }: { step: RoadmapStepV2 }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <p className="muted" style={{ fontSize: 14, lineHeight: 1.5, maxWidth: 580, margin: 0 }}>
        {step.learn.what}
      </p>
      <CodeBlock code={EVALUATE_SNIPPET} label="Node · evaluate with a context" />
      <div className="faint" style={{ fontSize: 12 }}>
        Define your contexts in the SDK, the same as any flag. Kinds register automatically as flags evaluate.
      </div>
    </div>
  )
}

/* Steps that genuinely belong in the product: be honest and hand off. */
function HandoffSurface({ step, productLabel, onWatch }: { step: RoadmapStepV2; productLabel: string; onWatch: () => void }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <p className="muted" style={{ fontSize: 14, lineHeight: 1.5, maxWidth: 580, margin: 0 }}>
        {step.learn.what}
      </p>
      <div>
        <SectionLabel>Ways teams do this</SectionLabel>
        <IdeaChips ideas={step.learn.ideas} />
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        <button className="btn" onClick={step.sim ? onWatch : undefined}>
          {step.sim && <ShieldHeart size={15} />}
          {step.cta}
          <ArrowRight size={14} />
        </button>
        {!step.sim && (
          <span className="faint" style={{ fontSize: 12 }}>opens {productLabel.toLowerCase()} setup in the real product</span>
        )}
      </div>
    </div>
  )
}

function ActivePane({
  step,
  productLabel,
  productColor,
  reqIdx,
  requiredLen,
  onWatch,
}: {
  step: RoadmapStepV2
  productLabel: string
  productColor: string
  reqIdx: number
  requiredLen: number
  onWatch: () => void
}) {
  let body: React.ReactNode
  if (step.key === 'sdk') body = <SdkSurface step={step} />
  else if (step.key === 'flag' || step.key === 'create') body = <FlagSurface step={step} />
  else if (step.key === 'metric') body = <MetricSurface step={step} />
  else if (step.key === 'evaluate') body = <EvaluateSurface step={step} />
  else body = <HandoffSurface step={step} productLabel={productLabel} onWatch={onWatch} />

  const inline = ['sdk', 'flag', 'create', 'metric', 'evaluate'].includes(step.key)

  return (
    <motion.div
      className="card card-pad"
      initial={{ opacity: 0, x: 10 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
      style={{ minHeight: 320 }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 13, marginBottom: 16 }}>
        <span className="setup-ic" style={{ background: productColor }}>
          <GlyphIcon icon={step.icon} size={19} />
        </span>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div className="faint" style={{ fontSize: 11, fontWeight: 600, letterSpacing: '0.05em', textTransform: 'uppercase' }}>
            {step.optional ? `Nice to have · ${productLabel}` : `Step ${reqIdx + 1} of ${requiredLen} · ${productLabel}`}
          </div>
          <h2 style={{ fontSize: 19, fontWeight: 750, letterSpacing: '-0.02em', marginTop: 2 }}>{step.title}</h2>
        </div>
        {inline && (
          <span className="badge green" style={{ fontSize: 10, flex: '0 0 auto' }}>
            do it here
          </span>
        )}
      </div>
      {body}
    </motion.div>
  )
}

export function HomeV2SplitActive({
  product,
  onProduct,
  onWatch,
  unified = false,
}: {
  product: ProductKey
  onProduct: (k: ProductKey) => void
  onWatch: () => void
  unified?: boolean
}) {
  const roadmaps = unified ? ROADMAPS_UNIFIED : ROADMAPS
  const products = unified ? PRODUCTS_UNIFIED : PRODUCTS
  const activeProduct = unified && product === 'guarded' ? 'flags' : product
  const steps = roadmaps[activeProduct]
  const required = steps.filter((s) => !s.optional)
  const optional = steps.filter((s) => s.optional)
  const def = products.find((p) => p.key === activeProduct)!
  const [sel, setSel] = useState(steps[0].key)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => setSel(roadmaps[activeProduct][0].key), [activeProduct, unified])

  const idx = Math.max(0, steps.findIndex((s) => s.key === sel))
  const step = steps[idx]
  const reqIdx = required.findIndex((s) => s.key === sel)

  const listRow = (s: RoadmapStepV2, i: number, isOptional: boolean) => (
    <div
      key={`${activeProduct}-${s.key}`}
      className={`road-step ${sel === s.key ? 'active' : ''}`}
      onClick={() => setSel(s.key)}
      style={{ alignItems: 'center', padding: '11px 12px' }}
    >
      <span className="road-node" style={{ fontSize: 12.5, fontWeight: 700 }}>
        {isOptional ? <GlyphIcon icon={s.icon} size={15} /> : i + 1}
      </span>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
          <span style={{ fontSize: 13.5, fontWeight: 650 }}>{s.title}</span>
          {!s.optional && !['sdk', 'flag', 'create', 'metric', 'evaluate'].includes(s.key) ? null : !s.optional ? (
            <span className="badge green" style={{ fontSize: 9 }}>inline</span>
          ) : null}
        </div>
        <div className="faint" style={{ fontSize: 12, marginTop: 2 }}>{s.blurb}</div>
      </div>
      <span style={{ color: sel === s.key ? 'var(--blue)' : 'var(--text-3)' }}><IcChevron size={14} /></span>
    </div>
  )

  return (
    <div className="content-inner">
      <WelcomeRow title="Welcome, Natalie" subtitle="See the point first. Then do each step right here, no tab-hopping." />

      <SimHero onWatch={onWatch} />

      <div style={{ margin: '28px 0 12px' }}>
        <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', gap: 12, marginBottom: 12 }}>
          <h2 style={{ fontSize: 15, fontWeight: 700 }}>
            {unified ? 'One platform. What do you want to try first?' : 'What do you want to try first?'}
          </h2>
          <span className="faint" style={{ fontSize: 12.5 }}>just a starting point, change anytime</span>
        </div>
        <ProductPicker value={activeProduct} onChange={onProduct} products={products} />
      </div>

      <div
        className="cols"
        style={{ gridTemplateColumns: 'minmax(0, 340px) minmax(0, 1fr)', gap: 20, marginTop: 22, alignItems: 'start' }}
      >
        <div className="card" style={{ padding: '8px' }}>
          {required.map((s, i) => listRow(s, i, false))}
          {optional.length > 0 && (
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 12px 4px' }}>
              <span className="faint" style={{ fontSize: 10.5, fontWeight: 600, letterSpacing: '0.06em', textTransform: 'uppercase', whiteSpace: 'nowrap' }}>
                Nice to have
              </span>
              <span className="hairline" />
            </div>
          )}
          {optional.map((s, i) => listRow(s, i, true))}
        </div>

        <ActivePane
          key={`${activeProduct}-${sel}`}
          step={step}
          productLabel={def.label}
          productColor={def.color}
          reqIdx={reqIdx}
          requiredLen={required.length}
          onWatch={onWatch}
        />
      </div>
    </div>
  )
}
