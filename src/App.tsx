import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Sidebar } from './product/Sidebar'
import { TopBar } from './product/TopBar'
import { HomeDSSplit } from './product/HomeDSSplit'
import { HomeV2SplitActive } from './product/HomeV2SplitActive'
import { SimWizard } from './sim/SimWizard'
import type { ProductKey } from './data/home'

type Dir = 'ds-split' | 'ds-unified' | 'active'

const DIRS: { key: Dir; label: string; thesis: string }[] = [
  { key: 'ds-split', label: '1 · Split pane', thesis: 'Roadmap left, learning pane right' },
  { key: 'ds-unified', label: '2 · Unified', thesis: 'Flags and guarded releases as one, no separate guarded tile' },
  { key: 'active', label: '3 · Active pane', thesis: 'Right pane does the step: real SDK key, snippet, live connect' },
]

const UNIFIED = new Set<Dir>(['ds-unified', 'active'])

export default function App() {
  const [wizardOpen, setWizardOpen] = useState(false)
  const [dir, setDir] = useState<Dir>('ds-split')
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

  const open = () => setWizardOpen(true)

  // Finishing the sim lands on the guarded-release setup path. In the unified
  // concepts that path lives under Feature flags.
  const finish = () => {
    setWizardOpen(false)
    setProduct(UNIFIED.has(dir) ? 'flags' : 'guarded')
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
            key={dir}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
          >
            {dir === 'ds-split' && <HomeDSSplit product={product} onProduct={setProduct} onWatch={open} />}
            {dir === 'ds-unified' && <HomeDSSplit product={product} onProduct={setProduct} onWatch={open} unified />}
            {dir === 'active' && <HomeV2SplitActive product={product} onProduct={setProduct} onWatch={open} unified />}
          </motion.div>
        </div>
      </div>

      <div className="switcher">
        <span className="lab">Home concept</span>
        {DIRS.map((d) => (
          <button key={d.key} className={dir === d.key ? 'on' : ''} onClick={() => setDir(d.key)}>
            {d.label}
          </button>
        ))}
        <span className="thesis">{DIRS.find((d) => d.key === dir)!.thesis}</span>
      </div>

      <AnimatePresence>
        {wizardOpen && <SimWizard onClose={() => setWizardOpen(false)} onFinish={finish} />}
      </AnimatePresence>
    </div>
  )
}
