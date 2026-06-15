import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Sidebar } from './product/Sidebar'
import { TopBar } from './product/TopBar'
import { HomeV2Single } from './product/HomeV2Single'
import { HomeV2Split } from './product/HomeV2Split'
import { SimWizard } from './sim/SimWizard'
import type { ProductKey } from './data/home'

type Dir = 'D' | 'E' | 'F' | 'G'

const DIRS: { key: Dir; label: string; thesis: string }[] = [
  { key: 'D', label: '1 · Single pane', thesis: 'One roadmap pane, expandable steps' },
  { key: 'E', label: '2 · Split pane', thesis: 'Roadmap left, learning pane right' },
  { key: 'F', label: '3 · Gonfalon chart', thesis: 'Production-style results chart + live checkout view' },
  { key: 'G', label: '4 · Unified', thesis: 'Flags and guarded releases as one, no separate Guardian' },
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

  // Finishing the sim closes the wizard and lands you on the guarded-release
  // setup path. In the unified concept that path lives under Feature flags.
  const finish = () => {
    setWizardOpen(false)
    setProduct(dir === 'G' ? 'flags' : 'guarded')
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
              {dir === 'D' && <HomeV2Single product={product} onProduct={setProduct} onWatch={open} />}
              {dir === 'F' && <HomeV2Single product={product} onProduct={setProduct} onWatch={open} />}
              {dir === 'G' && <HomeV2Single product={product} onProduct={setProduct} onWatch={open} unified />}
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
        {wizardOpen && (
          <SimWizard
            onClose={() => setWizardOpen(false)}
            onFinish={finish}
            chartVariant={dir === 'F' ? 'gonfalon' : 'default'}
          />
        )}
      </AnimatePresence>
    </div>
  )
}
