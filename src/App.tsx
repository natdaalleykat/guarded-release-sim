import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Routes, Route, Navigate, useNavigate, useParams } from 'react-router-dom'
import { Sidebar } from './product/Sidebar'
import { TopBar } from './product/TopBar'
import { HomeDSSplit } from './product/HomeDSSplit'
import { HomeV2SplitActive } from './product/HomeV2SplitActive'
import { SimWizard } from './sim/SimWizard'
import type { ProductKey } from './data/home'

/* The post-signup Home is a real route. Each design concept is its own path
   (/home/split, /home/unified, /home/active) so it can be linked and reviewed
   like a routed product surface. CTAs and checklist steps are intentionally
   inert in this prototype. */
type Concept = 'split' | 'unified' | 'active'

const CONCEPTS: { key: Concept; label: string; thesis: string }[] = [
  { key: 'split', label: '1 · Split pane', thesis: 'Roadmap left, learning pane right' },
  { key: 'unified', label: '2 · Unified', thesis: 'Flags and guarded releases as one, no separate guarded tile' },
  { key: 'active', label: '3 · Active pane', thesis: 'Right pane does the step: real SDK key, snippet, live connect' },
]

const UNIFIED = new Set<Concept>(['unified', 'active'])
const isConcept = (s?: string): s is Concept => s === 'split' || s === 'unified' || s === 'active'

function HomeRoute() {
  const { concept } = useParams()
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
  // concepts that path lives under Feature flags.
  const finish = () => {
    setWizardOpen(false)
    setProduct(UNIFIED.has(c) ? 'flags' : 'guarded')
  }

  return (
    <div className="app">
      <Sidebar />
      <div className="main">
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
          </motion.div>
        </div>
      </div>

      <div className="switcher">
        <span className="lab">Home concept</span>
        {CONCEPTS.map((d) => (
          <button key={d.key} className={c === d.key ? 'on' : ''} onClick={() => navigate(`/home/${d.key}`)}>
            {d.label}
          </button>
        ))}
        <span className="thesis">{CONCEPTS.find((d) => d.key === c)!.thesis}</span>
      </div>

      <AnimatePresence>
        {wizardOpen && <SimWizard onClose={() => setWizardOpen(false)} onFinish={finish} />}
      </AnimatePresence>
    </div>
  )
}

export default function App() {
  return (
    <Routes>
      <Route path="/home/:concept" element={<HomeRoute />} />
      <Route path="*" element={<Navigate to="/home/split" replace />} />
    </Routes>
  )
}
