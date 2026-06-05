import { useEffect, useState } from 'react'
import { AnimatePresence } from 'framer-motion'
import { Sidebar } from './product/Sidebar'
import { TopBar } from './product/TopBar'
import { Home } from './product/Home'
import { SimWizard } from './sim/SimWizard'

export default function App() {
  const [wizardOpen, setWizardOpen] = useState(false)

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

  return (
    <div className="app">
      <Sidebar />
      <div className="main">
        <TopBar />
        <div className="content">
          <Home onWatch={() => setWizardOpen(true)} />
        </div>
      </div>

      <AnimatePresence>
        {wizardOpen && <SimWizard onClose={() => setWizardOpen(false)} />}
      </AnimatePresence>
    </div>
  )
}
