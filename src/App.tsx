import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Routes, Route, Navigate, useNavigate, useParams, useSearchParams } from 'react-router-dom'
import { Sidebar } from './product/Sidebar'
import { TopBar, TrialBar } from './product/TopBar'
import { HomeDSSplit } from './product/HomeDSSplit'
import { HomeV2SplitActive } from './product/HomeV2SplitActive'
import { HomeDSSplitV2, HomeDSExperiment, HomeDSSpec } from './product/HomeV2'
import { DestPage } from './product/DestPages'
import { WelcomeSurvey } from './product/Welcome'
import { SimWizard } from './sim/SimWizard'
import type { ProductKey } from './data/home'

/* The post-signup Home is a real route. Each design concept is its own path
   (/home/split, /home/unified, /home/active) so it can be linked and reviewed
   like a routed product surface. CTAs and checklist steps are intentionally
   inert in this prototype. */
type Concept = 'split' | 'unified' | 'active' | 'split-v2' | 'experiment' | 'spec'

const CONCEPTS: { key: Concept; label: string; thesis: string }[] = [
  { key: 'split', label: '1 · Split pane', thesis: 'Roadmap left, learning pane right' },
  { key: 'unified', label: '2 · Unified', thesis: 'Flags and guarded releases as one, no separate guarded tile' },
  { key: 'active', label: '3 · Active pane', thesis: 'Right pane does the step: real SDK key, snippet, live connect' },
  { key: 'split-v2', label: '4 · Split pane v2', thesis: 'Create-first: each path opens with an inline “make something”, SDK wiring comes after (test/staging)' },
  { key: 'experiment', label: '5 · Experiment-led', thesis: 'Experimentation starting from a pre-scaffolded experiment (Better button copy)' },
  { key: 'spec', label: '6 · Spec', thesis: 'The change spec applied to v2: one trial surface, four tiles, CTAs annotated with real destinations' },
]

/* "/welcome" sits outside /home/:concept but rides the same switcher */
const WELCOME_THESIS = 'The one-question welcome survey that routes into Home (AgentControl never reaches it)'

const UNIFIED = new Set<Concept>(['unified', 'active'])
const isConcept = (s?: string): s is Concept =>
  s === 'split' || s === 'unified' || s === 'active' || s === 'split-v2' || s === 'experiment' || s === 'spec'

/* the bottom review switcher, shared by the Home concepts and /welcome */
function Switcher({ current }: { current: Concept | 'welcome' }) {
  const navigate = useNavigate()
  const thesis = current === 'welcome' ? WELCOME_THESIS : CONCEPTS.find((d) => d.key === current)!.thesis
  return (
    <div className="switcher">
      <span className="lab">Home concept</span>
      <button className={current === 'welcome' ? 'on' : ''} onClick={() => navigate('/welcome')}>Survey</button>
      {CONCEPTS.map((d) => (
        <button key={d.key} className={current === d.key ? 'on' : ''} onClick={() => navigate(`/home/${d.key}`)}>
          {d.label}
        </button>
      ))}
      <span className="thesis">{thesis}</span>
    </div>
  )
}

function HomeRoute() {
  const { concept } = useParams()
  const [params] = useSearchParams()
  const navigate = useNavigate()
  const [wizardOpen, setWizardOpen] = useState(false)
  const [product, setProduct] = useState<ProductKey>('guarded')

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setWizardOpen(false)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  useEffect(() => {
    document.body.style.overflow = wizardOpen ? 'hidden' : ''
  }, [wizardOpen])

  if (!isConcept(concept)) return <Navigate to="/home/split" replace />
  const c = concept

  const open = () => setWizardOpen(true)

  // Finishing the sim lands on the guarded-release setup path. In the unified
  // concepts that path lives under Feature flags. On the Spec concept the
  // summary CTA navigates for real: guarded roadmap, rollout step selected.
  const finish = () => {
    setWizardOpen(false)
    if (c === 'spec') {
      navigate('/home/spec?product=guarded&step=rollout')
      return
    }
    setProduct(UNIFIED.has(c) ? 'flags' : 'guarded')
  }

  return (
    <div className="app">
      <Sidebar />
      <div className="main">
        {/* concept 6 (Spec): the app-level trial bar is the single trial surface */}
        {c === 'spec' && <TrialBar />}
        <TopBar />
        <div className="content">
          {/* keyed fade-in per concept; no AnimatePresence mode="wait" so a
              switch can never hang waiting on an exit animation */}
          <motion.div
            key={c}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
          >
            {c === 'split' && <HomeDSSplit product={product} onProduct={setProduct} onWatch={open} />}
            {c === 'unified' && <HomeDSSplit product={product} onProduct={setProduct} onWatch={open} unified />}
            {c === 'active' && <HomeV2SplitActive product={product} onProduct={setProduct} onWatch={open} unified />}
            {c === 'split-v2' && <HomeDSSplitV2 onWatch={open} />}
            {c === 'experiment' && <HomeDSExperiment onWatch={open} />}
            {c === 'spec' && (
              <HomeDSSpec
                onWatch={open}
                firstAction={params.get('firstAction')}
                productParam={params.get('product')}
                stepParam={params.get('step')}
              />
            )}
          </motion.div>
        </div>
      </div>

      <Switcher current={c} />

      <AnimatePresence>
        {wizardOpen && <SimWizard onClose={() => setWizardOpen(false)} onFinish={finish} />}
      </AnimatePresence>
    </div>
  )
}

/* the welcome survey mock; full page (no app chrome), same review switcher */
function WelcomeRoute() {
  return (
    <>
      <WelcomeSurvey />
      <Switcher current="welcome" />
    </>
  )
}

/* "/dest/:page" — concept 6 (Spec) stub destinations. Same chrome as
   /home/spec (sidebar, trial bar, top bar) so the CTA click-throughs read
   as real navigation; DestPage handles the wireframe + Back-to-Home. */
function DestRoute() {
  return (
    <div className="app">
      <Sidebar />
      <div className="main">
        <TrialBar />
        <TopBar />
        <div className="content">
          <DestPage />
        </div>
      </div>
      <Switcher current="spec" />
    </div>
  )
}

export default function App() {
  return (
    <Routes>
      <Route path="/home/:concept" element={<HomeRoute />} />
      <Route path="/dest/:page" element={<DestRoute />} />
      <Route path="/welcome" element={<WelcomeRoute />} />
      <Route path="*" element={<Navigate to="/home/split" replace />} />
    </Routes>
  )
}
