import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
// Launchpad design system (used by the "design system" home options).
// Imported before index.css so our custom theme's body rules win for the
// non-design-system options.
import '@launchpad-ui/tokens/fonts.css'
import '@launchpad-ui/tokens/index.css'
import '@launchpad-ui/tokens/themes.css'
import sprite from '@launchpad-ui/icons/sprite.svg?raw'
import './index.css'
import './ds.css'
import App from './App'

document.documentElement.dataset.theme = 'default'

// Launchpad <Icon> resolves against an inlined sprite (#lp-icon-*).
const spriteHost = document.createElement('div')
spriteHost.style.display = 'none'
spriteHost.setAttribute('aria-hidden', 'true')
spriteHost.innerHTML = sprite
document.body.prepend(spriteHost)

// In production the app is served from /guarded-release-sim/; in dev from /.
const basename = import.meta.env.BASE_URL.replace(/\/$/, '')

createRoot(document.getElementById('root')!).render(
  <BrowserRouter basename={basename}>
    <App />
  </BrowserRouter>,
)
