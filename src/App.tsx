import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Sidebar } from './product/Sidebar'
import { TopBar } from './product/TopBar'
import { HomeValue } from './product/HomeValue'
import { HomeRoadmap } from './product/HomeRoadmap'
import { HomePersonalized } from './product/HomePersonalized'
import { HomeV2Single } from './product/HomeV2Single'
import { HomeV2Split } from './product/HomeV2Split'
import { SimWizard } from './sim/SimWizard'
import type { ProductKey } from './data/home'

type Dir = 'A' | 'B' | 'C' | 'D' | 'E'

const DIRS: { key: Dir; label: string; thesis: string }[] = [
  { key: 'A', label: 'A · Value-first', thesis: 'Lead with the simulation; earn setup later' },
  { key: 'B', label: 'B · Roadmap', thesis: 'A guided path that teaches the model' },
  { key: 'C', label: 'C · Adaptive', thesis: 'Home reflows to the products they pick' },
  { key: 'D', label: 'D · v2 single pane', thesis: 'Product picker shapes one roadmap' },
  { key: 'E', label: 'E · v2 split pane', thesis: 'Roadmap left, learning pane right' },
]

export default function App() {
  const [wizardOpen, setWizardOpen] = useState(false)
  const [dir, setDir] = useState<Dir>('D')
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

  // Finishing the sim closes the wizard and lands you on the guarded
  // releases roadmap (v2 homes own that loop; A/B/C jump to D).
  const finish = () => {
    setWizardOpen(false)
    setProduct('guarded')
    setDir((d) => (d === 'D' || d === 'E' ? d : 'D'))
  }

  return (
    <div className="app">
      <Sidebar />
      <div className="main">
        <TopBar />
        <div className="content">
          <AnimatePresence mode="wait">
            <motion.div
              key={dir}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
            >
              {dir === 'A' && <HomeValue onWatch={open} />}
              {dir === 'B' && <HomeRoadmap onWatch={open} />}
              {dir === 'C' && <HomePersonalized onWatch={open} />}
              {dir === 'D' && <HomeV2Single product={product} onProduct={setProduct} onWatch={open} />}
              {dir === 'E' && <HomeV2Split product={product} onProduct={setProduct} onWatch={open} />}
            </motion.div>
          </AnimatePresence>
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
