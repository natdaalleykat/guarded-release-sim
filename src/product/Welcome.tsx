import { useState } from 'react'
import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { PRODUCTS, type ProductKey } from '../data/home'
import { DsIcon, DsButton, LpIcon } from './dsblocks'

/* =========================================================================
   "/welcome" — a one-question mock of gonfalon's welcome survey
   (packages/onboarding/src/WelcomePage.tsx), per §3–4 of the change spec.
   The annotation panel shows what each answer does for real: the POSTed
   firstAction (what Marketo reads), the Mixpanel detail prop, and where the
   user routes. AgentControl routes to that team's onboarding and never
   sees Home; everything else lands on /home/spec with the product
   preselected via ?firstAction=.
   ========================================================================= */

type SurveyKey = 'flags' | 'experiments' | 'guarded' | 'ai' | 'observability'

const OPTIONS: { key: SurveyKey; label: string; product: ProductKey; note: string }[] = [
  { key: 'flags', label: 'Feature flag', product: 'flags', note: "POST firstAction: 'flags' · routes to Home, Feature flags preselected" },
  { key: 'experiments', label: 'Experiment', product: 'experiments', note: "POST firstAction: 'experiments' · routes to Home, Experimentation preselected" },
  { key: 'guarded', label: 'Guarded release', product: 'guarded', note: "POST firstAction: 'flags' (Marketo reads flags) · Mixpanel firstActionDetail: 'guarded' · routes to Home, Guarded releases preselected" },
  { key: 'ai', label: 'AgentControl', product: 'aiconfigs', note: "routes to toAIConfigsWelcome (AgentControl team's onboarding) · never sees Home" },
  { key: 'observability', label: 'Observability', product: 'observability', note: "POST firstAction: 'observability' · routes to Home, Observability preselected" },
]

export function WelcomeSurvey() {
  const navigate = useNavigate()
  const [sel, setSel] = useState<SurveyKey | null>(null)
  const [agentControl, setAgentControl] = useState(false)

  const go = () => {
    if (!sel) return
    // AgentControl never reaches Home (§4); the survey UI value rides the
    // ?firstAction= query for everyone else ('guarded' stays 'guarded' — only
    // the POSTed payload maps it to 'flags', and that POST is mocked here).
    if (sel === 'ai') setAgentControl(true)
    else navigate(`/home/spec?firstAction=${sel}`)
  }

  /* full-page interstitial: the AgentControl team's onboarding placeholder */
  if (agentControl) {
    return (
      <div className="ds-scope" style={{ minHeight: '100vh', display: 'grid', placeItems: 'center' }}>
        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }} style={{ textAlign: 'center', maxWidth: 460, padding: 24 }}>
          <span className="ds-pick-ic" style={{ background: 'rgb(135,23,205)', width: 44, height: 44, margin: '0 auto var(--lp-spacing-500)' }}>
            <DsIcon glyph="hub" size={22} />
          </span>
          <h1 className="ds-display" style={{ fontSize: 'var(--lp-font-size-500)' }}>AgentControl welcome</h1>
          <p className="ds-muted" style={{ fontSize: 'var(--lp-font-size-300)', marginTop: 'var(--lp-spacing-300)', lineHeight: 1.5 }}>
            Placeholder. This surface is owned by the AgentControl team (toAIConfigsWelcome). Users who pick AgentControl never see Home.
          </p>
          <div style={{ marginTop: 'var(--lp-spacing-600)' }}>
            <button className="ds-btn minimal" onClick={() => setAgentControl(false)}>
              <LpIcon name="arrow-left-thin" size={15} /> Back to the survey
            </button>
          </div>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="ds-scope" style={{ minHeight: '100vh', display: 'grid', placeItems: 'center', padding: '48px 16px' }}>
      <motion.div
        className="ds-card"
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
        style={{ width: 'min(560px, 94vw)', padding: 'var(--lp-spacing-800)' }}
      >
        <div className="ds-section-label" style={{ marginBottom: 'var(--lp-spacing-300)' }}>Welcome to LaunchDarkly</div>
        <h1 className="ds-display" style={{ fontSize: 'var(--lp-font-size-500)' }}>What do you want to do first?</h1>
        <p className="ds-muted" style={{ fontSize: 'var(--lp-font-size-300)', marginTop: 'var(--lp-spacing-200)', marginBottom: 'var(--lp-spacing-600)' }}>
          One question, then you’re in. This picks where Home starts you.
        </p>

        {OPTIONS.map((o) => {
          const p = PRODUCTS.find((x) => x.key === o.product)!
          const on = sel === o.key
          return (
            <button key={o.key} className={`ds-plane-row ${on ? 'on' : ''}`} style={{ width: '100%', marginBottom: 'var(--lp-spacing-300)' }} onClick={() => setSel(o.key)}>
              <span className="ds-radio" />
              <span className="ds-pick-ic" style={{ background: p.color, width: 28, height: 28 }}>
                <DsIcon glyph={p.icon} size={15} />
              </span>
              <span style={{ fontSize: 'var(--lp-font-size-300)', fontWeight: 'var(--lp-font-weight-semibold)' }}>{o.label}</span>
            </button>
          )
        })}

        {/* review-only: what this answer does in the real product */}
        <div className="ds-card" style={{ background: 'var(--lp-color-bg-ui-secondary)', padding: 'var(--lp-spacing-400)', margin: 'var(--lp-spacing-500) 0 var(--lp-spacing-600)' }}>
          <div className="ds-section-label" style={{ marginBottom: 'var(--lp-spacing-200)' }}>What happens for real</div>
          <div className="ds-dest-note" style={{ lineHeight: 1.6 }}>
            {sel ? OPTIONS.find((o) => o.key === sel)!.note : 'Pick an option to see the routing and payload.'}
          </div>
        </div>

        <DsButton variant="primary" size="large" onClick={go} style={sel ? undefined : { opacity: 0.45 }}>
          Continue <LpIcon name="arrow-right-thin" size={16} />
        </DsButton>
      </motion.div>
    </div>
  )
}
