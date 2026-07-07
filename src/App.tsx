import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Routes, Route, Navigate, useNavigate, useSearchParams } from 'react-router-dom'
import { Sidebar } from './product/Sidebar'
import { TopBar, TrialBar } from './product/TopBar'
import { HomeDSSpec } from './product/HomeV2'
import { DestPage } from './product/DestPages'
import { WelcomeSurvey } from './product/Welcome'
import { SimWizard } from './sim/SimWizard'

/* One Home version ships: split pane v2 with the change spec applied (single
   trial surface, four tiles, create-first roadmaps, CTAs wired to stub
   destinations). The earlier review concepts (1-5) were removed 2026-07-06;
   they live in git history if a comparison is ever needed. /home/spec stays
   the canonical path because the Confluence spec links to it. */

/* the bottom review switcher: survey entry vs the home page */
function Switcher({ current }: { current: 'home' | 'welcome' }) {
  const navigate = useNavigate()
  return (
    <div className="switcher">
      <span className="lab">Prototype</span>
      <button className={current === 'welcome' ? 'on' : ''} onClick={() => navigate('/welcome')}>Survey</button>
      <button className={current === 'home' ? 'on' : ''} onClick={() => navigate('/home/spec')}>Home</button>
      <span className="thesis">
        {current === 'welcome'
          ? 'The one-question welcome survey that routes into Home (AgentControl never reaches it)'
          : 'Split pane v2 per the change spec: one trial surface, four tiles, create-first, CTAs wired to real destinations'}
      </span>
    </div>
  )
}

function HomeRoute() {
  const [params] = useSearchParams()
  const navigate = useNavigate()
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

  const open = () => setWizardOpen(true)

  // Finishing the sim navigates for real: guarded roadmap, rollout step selected.
  const finish = () => {
    setWizardOpen(false)
    navigate('/home/spec?product=guarded&step=rollout')
  }

  return (
    <div className="app">
      <Sidebar />
      <div className="main">
        {/* the app-level trial bar is the single trial surface */}
        <TrialBar />
        <TopBar />
        <div className="content">
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
          >
            <HomeDSSpec
              onWatch={open}
              firstAction={params.get('firstAction')}
              productParam={params.get('product')}
              stepParam={params.get('step')}
            />
          </motion.div>
        </div>
      </div>

      <Switcher current="home" />

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

/* "/dest/:page" — stub destinations. Same chrome as /home/spec (sidebar,
   trial bar, top bar) so the CTA click-throughs read as real navigation;
   DestPage handles the wireframe + Back-to-Home. */
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
      <Switcher current="home" />
    </div>
  )
}

export default function App() {
  return (
    <Routes>
      <Route path="/home/spec" element={<HomeRoute />} />
      {/* old concept URLs from earlier reviews redirect to the shipped version */}
      <Route path="/home/*" element={<Navigate to="/home/spec" replace />} />
      <Route path="/dest/:page" element={<DestRoute />} />
      <Route path="/welcome" element={<WelcomeRoute />} />
      <Route path="*" element={<Navigate to="/home/spec" replace />} />
    </Routes>
  )
}
