import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import {
  ROADMAPS_V2,
  ROADMAPS_SPEC,
  PRODUCTS,
  PRODUCTS_SPEC,
  specProductFor,
  type ProductKey,
  type RoadmapStepV2,
  type Glyph,
} from '../data/home'
import { DsWelcomeRow, DsSimHero, DsProductPicker, DsIcon, LpIcon, DsButton } from './dsblocks'
import { destFor, SdkDrawer, DestinationModal, Code, type Dest } from './Destinations'
import { stubForSpec } from './DestPages'

/* =========================================================================
   "Split pane v2" + the experiment-led home.

   Two ideas the team asked for, squared with what gonfalon actually does:
   - Every path opens with a satisfying "create something" moment, and the
     FIRST step is a do-it-here inline surface; SDK wiring comes after.
   - Experimentation can lead with the pre-scaffolded "Better button copy"
     templated experiment.
   ========================================================================= */

const ANIM = { initial: { opacity: 0, x: 10 }, animate: { opacity: 1, x: 0 }, transition: { duration: 0.25, ease: [0.16, 1, 0.3, 1] } }

/* concept "Spec": the real gonfalon destination under a step's primary CTA.
   Only the ROADMAPS_SPEC data sets `dest`, so other concepts render nothing. */
function DestNote({ dest }: { dest?: string }) {
  if (!dest) return null
  return <div className="ds-dest-note" style={{ marginTop: 'var(--lp-spacing-300)' }}>→ {dest}</div>
}

/* opens the SDK drawer, a destination wireframe, or a docs link for a CTA */
function useDest() {
  const [dest, setDest] = useState<Dest | null>(null)
  const open = (step: RoadmapStepV2) => {
    const d = destFor(step)
    if (typeof d === 'object') window.open(d.docs, '_blank', 'noopener')
    else setDest(d)
  }
  const node = dest === 'sdk'
    ? <SdkDrawer onClose={() => setDest(null)} />
    : dest
      ? <DestinationModal kind={dest} onClose={() => setDest(null)} />
      : null
  return { open, node }
}

/* The first step rendered as a do-it-here surface rather than a reading pane.
   The "create" is a prototype gesture (no real resource is created). */
function InlineCreatePane({ kind, step, color, nextLabel, onAdvance, onOpenCreated }: { kind: 'flag' | 'experiment'; step: RoadmapStepV2; color: string; nextLabel: string; onAdvance: () => void; onOpenCreated?: () => void }) {
  const [done, setDone] = useState(false)
  const [flagKey, setFlagKey] = useState('release-new-checkout')

  const scaffold: [Glyph, string, string][] = [
    ['flag', 'Flag · button-copy', 'Control “Buy now” · Treatment “Get started”'],
    ['ruler', 'Metric · button-clicked', 'Binary conversion'],
    ['beaker', 'Experiment · 50/50', 'Frequentist, randomized by user'],
  ]

  return (
    <motion.div key={`inline-${kind}-${done}`} className="ds-card ds-card-pad" {...ANIM} style={{ minHeight: 320 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--lp-spacing-400)', marginBottom: 'var(--lp-spacing-400)' }}>
        <span className="ds-step-ic" style={{ background: color }}><DsIcon glyph={step.icon} size={19} /></span>
        <div>
          <div className="ds-section-label">Step 1</div>
          <h2 className="ds-display" style={{ fontSize: 'var(--lp-font-size-400)', marginTop: 2 }}>{step.title}</h2>
        </div>
      </div>

      {!done && (
        <p className="ds-muted" style={{ fontSize: 'var(--lp-font-size-300)', lineHeight: 1.55, maxWidth: 560 }}>{step.learn.what}</p>
      )}

      {kind === 'flag' && !done && (
        <>
          <div style={{ margin: 'var(--lp-spacing-600) 0 var(--lp-spacing-300)' }}>
            <div className="ds-section-label" style={{ marginBottom: 'var(--lp-spacing-200)' }}>Flag key</div>
            <div style={{ display: 'flex', gap: 'var(--lp-spacing-300)', alignItems: 'center', flexWrap: 'wrap' }}>
              <input
                value={flagKey}
                onChange={(e) => setFlagKey(e.target.value)}
                spellCheck={false}
                style={{ flex: '1 1 240px', minWidth: 0, padding: '10px 12px', borderRadius: 'var(--lp-border-radius-medium)', border: '1.5px solid var(--lp-color-border-ui-primary)', font: 'inherit', fontSize: 'var(--lp-font-size-200)', background: 'var(--lp-color-bg-ui-primary)', color: 'inherit' }}
              />
              <span className="ds-chip">Boolean · on / off</span>
            </div>
          </div>
          <div style={{ marginTop: 'var(--lp-spacing-500)' }}>
            <div className="ds-section-label" style={{ marginBottom: 'var(--lp-spacing-300)' }}>What teams build with flags</div>
            <div style={{ display: 'flex', gap: 'var(--lp-spacing-300)', flexWrap: 'wrap', maxHeight: 28, overflow: 'hidden' }}>
              {step.learn.ideas.map((i) => <span key={i} className="ds-chip">{i}</span>)}
            </div>
          </div>
          <div style={{ marginTop: 'var(--lp-spacing-700)', display: 'flex', alignItems: 'center', gap: 'var(--lp-spacing-400)' }}>
            <DsButton variant="primary" onClick={() => setDone(true)}><LpIcon name="flag" size={16} /> {step.cta}</DsButton>
          </div>
          <DestNote dest={step.dest} />
        </>
      )}

      {kind === 'experiment' && !done && (
        <>
          <div style={{ marginTop: 'var(--lp-spacing-500)' }}>
            <div className="ds-section-label" style={{ marginBottom: 'var(--lp-spacing-300)' }}>Ideas to test</div>
            <div style={{ display: 'flex', gap: 'var(--lp-spacing-300)', flexWrap: 'wrap', maxHeight: 28, overflow: 'hidden' }}>
              {step.learn.ideas.map((i) => <span key={i} className="ds-chip">{i}</span>)}
            </div>
          </div>
          <div style={{ marginTop: 'var(--lp-spacing-700)', display: 'flex', alignItems: 'center', gap: 'var(--lp-spacing-400)' }}>
            <DsButton variant="primary" onClick={() => setDone(true)}><LpIcon name="flask" size={16} /> {step.cta}</DsButton>
          </div>
          <DestNote dest={step.dest} />
        </>
      )}

      {done && (
        <>
          <div className="ds-chip success" style={{ marginBottom: 'var(--lp-spacing-400)' }}>
            <LpIcon name="check" size={13} /> {kind === 'flag' ? `Created ${flagKey || 'your-flag'}` : 'Scaffolded “Better button copy”'}
          </div>
          {kind === 'experiment' && (
            <div className="ds-card" style={{ padding: 'var(--lp-spacing-400)', marginBottom: 'var(--lp-spacing-500)' }}>
              <div className="ds-section-label" style={{ marginBottom: 'var(--lp-spacing-300)' }}>What we built for you</div>
              {scaffold.map(([g, t, s]) => (
                <div key={t} style={{ display: 'flex', alignItems: 'center', gap: 'var(--lp-spacing-300)', padding: '5px 0' }}>
                  <DsIcon glyph={g} size={15} />
                  <span style={{ fontSize: 'var(--lp-font-size-200)', fontWeight: 'var(--lp-font-weight-semibold)' }}>{t}</span>
                  <span className="ds-muted" style={{ fontSize: 'var(--lp-font-size-100)' }}>{s}</span>
                </div>
              ))}
            </div>
          )}
          <p className="ds-muted" style={{ fontSize: 'var(--lp-font-size-300)', lineHeight: 1.55, maxWidth: 520 }}>
            {kind === 'flag'
              ? 'Nice, that’s a live flag. On its own it does nothing yet, so let’s keep going.'
              : 'That’s a complete experiment running on a sample flag and metric, so you’ve seen the shape end to end. Now set up one on your own product.'}
          </p>
          <div style={{ marginTop: 'var(--lp-spacing-600)', display: 'flex', alignItems: 'center', gap: 'var(--lp-spacing-400)', flexWrap: 'wrap' }}>
            <DsButton variant="primary" onClick={onAdvance}>
              Next: {nextLabel} <LpIcon name="arrow-right-thin" size={16} />
            </DsButton>
            {/* concept "Spec": §7 "then toExperimentDesign (created experiment)" */}
            {kind === 'experiment' && onOpenCreated && (
              <button className="ds-btn minimal" onClick={onOpenCreated} style={{ fontSize: 'var(--lp-font-size-100)' }}>
                Open the experiment <span className="ds-dest-note">· toExperimentDesign</span>
              </button>
            )}
            <button className="ds-btn minimal" onClick={() => setDone(false)} style={{ fontSize: 'var(--lp-font-size-100)' }}>Start over</button>
          </div>
        </>
      )}
    </motion.div>
  )
}

/* Concept "Spec", observability step 1: setup instructions rendered INLINE in
   the learning pane, mirroring gonfalon's ObservabilitySetupInstructions
   (§7: NOT toSdkSetup — that page has no plugin instructions). Same
   do-it-here pattern as InlineCreatePane; snippets are faithful mocks. */
const O11Y_SNIPPETS = [
  {
    key: 'js',
    label: 'JavaScript',
    install: 'npm install @launchdarkly/observability @launchdarkly/session-replay',
    init: `import { initialize } from 'launchdarkly-js-client-sdk';
import Observability from '@launchdarkly/observability';
import SessionReplay from '@launchdarkly/session-replay';

// one init: replays, errors, console, network, performance
const client = initialize('<client-side-id>', context, {
  plugins: [new Observability(), new SessionReplay()],
});`,
  },
  {
    key: 'node',
    label: 'Node.js',
    install: 'npm install @launchdarkly/observability-node',
    init: `import { init } from '@launchdarkly/node-server-sdk';
import Observability from '@launchdarkly/observability-node';

// server side: errors, logs, and traces on the same SDK
const client = init('<sdk-key>', {
  plugins: [new Observability()],
});`,
  },
  {
    key: 'python',
    label: 'Python',
    install: 'pip install launchdarkly-observability',
    init: `import ldclient
from ldclient.config import Config
from ldobserve import ObservabilityPlugin

# server side: errors, logs, and traces on the same SDK
ldclient.set_config(Config('<sdk-key>',
    plugins=[ObservabilityPlugin()]))`,
  },
  {
    key: 'react',
    label: 'React',
    install: 'npm install @launchdarkly/observability @launchdarkly/session-replay',
    init: `import { LDProvider } from 'launchdarkly-react-client-sdk';
import Observability from '@launchdarkly/observability';
import SessionReplay from '@launchdarkly/session-replay';

<LDProvider clientSideID="<client-side-id>"
  options={{ plugins: [new Observability(), new SessionReplay()] }}>
  <App />
</LDProvider>`,
  },
]

function InlineO11yPane({ step, color, nextLabel, onAdvance, onFallback }: { step: RoadmapStepV2; color: string; nextLabel: string; onAdvance: () => void; onFallback?: () => void }) {
  const [lang, setLang] = useState(O11Y_SNIPPETS[0])

  return (
    <motion.div key={`inline-o11y-${lang.key}`} className="ds-card ds-card-pad" {...ANIM} style={{ minHeight: 320 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--lp-spacing-400)', marginBottom: 'var(--lp-spacing-400)' }}>
        <span className="ds-step-ic" style={{ background: color }}><DsIcon glyph={step.icon} size={19} /></span>
        <div>
          <div className="ds-section-label">Step 1</div>
          <h2 className="ds-display" style={{ fontSize: 'var(--lp-font-size-400)', marginTop: 2 }}>{step.title}</h2>
        </div>
      </div>

      <p className="ds-muted" style={{ fontSize: 'var(--lp-font-size-300)', lineHeight: 1.55, maxWidth: 560 }}>{step.learn.what}</p>

      <div style={{ margin: 'var(--lp-spacing-500) 0 var(--lp-spacing-400)', display: 'flex', gap: 'var(--lp-spacing-300)', flexWrap: 'wrap' }}>
        {O11Y_SNIPPETS.map((s) => (
          <button key={s.key} className={`ds-chip ${lang.key === s.key ? 'brand' : ''}`} style={{ cursor: 'pointer', padding: '4px var(--lp-spacing-400)' }} onClick={() => setLang(s)}>{s.label}</button>
        ))}
      </div>

      <div className="ds-section-label" style={{ marginBottom: 'var(--lp-spacing-300)' }}>1 · Install</div>
      <Code code={lang.install} />
      <div className="ds-section-label" style={{ margin: 'var(--lp-spacing-400) 0 var(--lp-spacing-300)' }}>2 · Pass the plugins on init</div>
      <Code code={lang.init} />

      <div className="ds-muted" style={{ fontSize: 'var(--lp-font-size-100)', lineHeight: 1.5, marginTop: 'var(--lp-spacing-400)' }}>
        Fallback: the Sessions page empty state carries these same setup pointers.
        {onFallback && (
          <button className="ds-btn minimal" onClick={onFallback} style={{ fontSize: 'var(--lp-font-size-100)', marginLeft: 6 }}>
            Open Sessions <span className="ds-dest-note">· toSessions</span>
          </button>
        )}
      </div>

      <div style={{ marginTop: 'var(--lp-spacing-600)', display: 'flex', alignItems: 'center', gap: 'var(--lp-spacing-400)' }}>
        <DsButton variant="primary" onClick={onAdvance}>
          Next: {nextLabel} <LpIcon name="arrow-right-thin" size={16} />
        </DsButton>
      </div>
      <DestNote dest={step.dest} />
    </motion.div>
  )
}

/* roadmap list + right pane; the first step can be an inline create surface */
function RoadmapV2({ steps, def, onWatch, onDest, initialStep, onStub }: {
  steps: RoadmapStepV2[]
  def: { label: string; color: string }
  onWatch: () => void
  onDest: (step: RoadmapStepV2) => void
  /* concept "Spec": step to preselect when returning from a /dest/* stub */
  initialStep?: string | null
  /* concept "Spec": navigate to a /dest/* stub from an inline pane's links */
  onStub?: (page: string, stepKey: string) => void
}) {
  const required = steps.filter((s) => !s.optional)
  const optional = steps.filter((s) => s.optional)
  const restore = (init?: string | null) => (init && steps.some((s) => s.key === init) ? init : steps[0].key)
  const [sel, setSel] = useState(restore(initialStep))
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => setSel(restore(initialStep)), [def.label, initialStep])

  const idx = Math.max(0, steps.findIndex((s) => s.key === sel))
  const step = steps[idx]
  const reqIdx = required.findIndex((s) => s.key === sel)
  const inlineFirst = idx === 0 && !!step.inline

  const listRow = (s: RoadmapStepV2, i: number, isOptional: boolean) => (
    <div key={`${def.label}-${s.key}`} className={`ds-step ${sel === s.key ? 'active' : ''}`} onClick={() => setSel(s.key)}>
      <span className="ds-node">{isOptional ? <DsIcon glyph={s.icon} size={15} /> : i + 1}</span>
      <div style={{ flex: 1, minWidth: 0 }}>
        <span style={{ fontSize: 'var(--lp-font-size-200)', fontWeight: 'var(--lp-font-weight-semibold)' }}>{s.title}</span>
        <div className="ds-muted" style={{ fontSize: 'var(--lp-font-size-100)', marginTop: 2 }}>{s.blurb}</div>
      </div>
      <span style={{ color: sel === s.key ? 'var(--lp-color-fill-interactive-primary)' : 'var(--lp-color-fill-ui-secondary)' }}>
        <LpIcon name="chevron-right" size={16} />
      </span>
    </div>
  )

  return (
    <div className="cols" style={{ gridTemplateColumns: 'minmax(0, 360px) minmax(0, 1fr)', gap: 'var(--lp-spacing-600)', alignItems: 'start' }}>
      <div className="ds-card" style={{ padding: 'var(--lp-spacing-300)' }}>
        {required.map((s, i) => listRow(s, i, false))}
        {optional.length > 0 && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--lp-spacing-300)', padding: 'var(--lp-spacing-400) var(--lp-spacing-400) var(--lp-spacing-200)' }}>
            <span className="ds-section-label" style={{ whiteSpace: 'nowrap' }}>Nice to have</span>
            <span className="ds-hairline" />
          </div>
        )}
        {optional.map((s, i) => listRow(s, i, true))}
      </div>

      {inlineFirst ? (
        step.inline === 'o11y' ? (
          <InlineO11yPane
            step={step}
            color={def.color}
            nextLabel={steps[1]?.title ?? 'Continue'}
            onAdvance={() => setSel(steps[1].key)}
            onFallback={onStub ? () => onStub('sessions', step.key) : undefined}
          />
        ) : (
          <InlineCreatePane
            kind={step.inline!}
            step={step}
            color={def.color}
            nextLabel={steps[1]?.title ?? 'Continue'}
            onAdvance={() => setSel(steps[1].key)}
            onOpenCreated={onStub ? () => onStub('experiment-design', step.key) : undefined}
          />
        )
      ) : (
        <motion.div key={`${def.label}-${sel}`} className="ds-card ds-card-pad" {...ANIM} style={{ minHeight: 320 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--lp-spacing-400)', marginBottom: 'var(--lp-spacing-400)' }}>
            <span className="ds-step-ic" style={{ background: def.color }}><DsIcon glyph={step.icon} size={19} /></span>
            <div>
              <div className="ds-section-label">
                {step.optional ? `Nice to have · ${def.label}` : `Step ${reqIdx + 1} of ${required.length} · ${def.label}`}
              </div>
              <h2 className="ds-display" style={{ fontSize: 'var(--lp-font-size-400)', marginTop: 2 }}>{step.title}</h2>
            </div>
          </div>
          <p className="ds-muted" style={{ fontSize: 'var(--lp-font-size-300)', lineHeight: 1.55, maxWidth: 560 }}>{step.learn.what}</p>
          <div style={{ marginTop: 'var(--lp-spacing-600)' }}>
            <div className="ds-section-label" style={{ marginBottom: 'var(--lp-spacing-300)' }}>Ways teams do this</div>
            <div style={{ display: 'flex', gap: 'var(--lp-spacing-300)', flexWrap: 'wrap', maxHeight: 28, overflow: 'hidden' }}>
              {step.learn.ideas.map((idea) => <span key={idea} className="ds-chip">{idea}</span>)}
            </div>
          </div>
          <div style={{ marginTop: 'var(--lp-spacing-700)', display: 'flex', alignItems: 'center', gap: 'var(--lp-spacing-400)' }}>
            <DsButton variant="primary" onClick={step.sim ? onWatch : () => onDest(step)}>
              {step.sim && <LpIcon name="shield-heart" size={16} />}
              {step.cta}
              <LpIcon name="arrow-right-thin" size={16} />
            </DsButton>
          </div>
          <DestNote dest={step.dest} />
          {step.docs && step.docs.length > 0 && (
            <div style={{ marginTop: 'var(--lp-spacing-400)', display: 'flex', alignItems: 'center', gap: 'var(--lp-spacing-400)', flexWrap: 'wrap' }}>
              <span className="ds-section-label">Docs</span>
              {step.docs.map((d) => (
                <a key={d.href} href={d.href} target="_blank" rel="noreferrer" className="doc-link" style={{ fontSize: 'var(--lp-font-size-200)', color: 'var(--lp-color-fill-interactive-primary)', textDecoration: 'none', fontWeight: 'var(--lp-font-weight-medium)' }}>
                  {d.label} ↗
                </a>
              ))}
            </div>
          )}
        </motion.div>
      )}
    </div>
  )
}

/* The shipped Home: Split pane v2 modified per home-page-spec-michael.md.
   The trial chip + Upgrade move to the global bar above the top bar (§2, the
   single trial surface), the welcome row goes plain, AgentControl leaves the
   picker (§4, the welcome survey routes it away before Home), and every CTA
   carries a mono annotation of its real gonfalon destination (§7).
   `firstAction` is the welcome survey's preselect (§3, ?firstAction= query);
   `productParam`/`stepParam` (?product= & ?step=) restore the selection when
   returning from a /dest/* stub or when the sim's summary CTA lands here. */
const isSpecProduct = (s?: string | null): s is ProductKey => PRODUCTS_SPEC.some((p) => p.key === s)

export function HomeDSSpec({ onWatch, firstAction, productParam, stepParam }: {
  onWatch: () => void
  firstAction?: string | null
  productParam?: string | null
  stepParam?: string | null
}) {
  const navigate = useNavigate()
  const [product, setProduct] = useState<ProductKey>(isSpecProduct(productParam) ? productParam : specProductFor(firstAction))
  const steps = ROADMAPS_SPEC[product]
  const def = PRODUCTS_SPEC.find((p) => p.key === product)!
  const dest = useDest()

  /* the sim's "Set up guarded releases for real" navigates in place
     (?product=guarded&step=rollout), so track the param after mount too */
  useEffect(() => {
    if (isSpecProduct(productParam)) setProduct(productParam)
  }, [productParam])

  /* §7: steps the destination table maps to a stub page navigate for real;
     ?product= and ?step= let the stub's "Back to Home" restore this spot.
     Everything else keeps the concept-4 drawer/modal/docs behavior. */
  const goStub = (page: string, stepKey: string) => navigate(`/dest/${page}?product=${product}&step=${stepKey}`)
  const openStep = (step: RoadmapStepV2) => {
    const stub = stubForSpec(product, step.key)
    if (stub) goStub(stub, step.key)
    else dest.open(step)
  }

  return (
    <div className="content-inner ds-scope">
      <DsWelcomeRow plain title="Welcome, Natalie" subtitle="Make something first, wire it up second. Pick where to start." />
      <DsSimHero onWatch={onWatch} />
      <div style={{ margin: 'var(--lp-spacing-800) 0 var(--lp-spacing-400)' }}>
        <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', gap: 12, marginBottom: 'var(--lp-spacing-400)' }}>
          <h2 className="ds-display" style={{ fontSize: 'var(--lp-font-size-400)' }}>Where do you want to start?</h2>
          <span className="ds-muted" style={{ fontSize: 'var(--lp-font-size-200)' }}>each path opens with something you create in under a minute</span>
        </div>
        <DsProductPicker value={product} onChange={setProduct} products={PRODUCTS_SPEC} />
      </div>
      <RoadmapV2 steps={steps} def={def} onWatch={onWatch} onDest={openStep} initialStep={product === productParam ? stepParam : undefined} onStub={goStub} />
      {dest.node}
    </div>
  )
}

