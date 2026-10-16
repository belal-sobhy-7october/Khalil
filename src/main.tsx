import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { MotionConfig } from 'framer-motion'
import './index.css'
import App from './App.tsx'
import ErrorBoundary from './components/Common/ErrorBoundary'
import { applyAppearance } from './lib/appearance'
import { readLocalKv } from './lib/userKv'
import { reloadForNewVersion } from './lib/staleChunk'
import { registerOfflineSupport } from './lib/offline'

// Apply the saved palette/theme before the first paint (no colour flash).
try {
  applyAppearance(readLocalKv<string>('appearance', 'default'), localStorage.getItem('khalil-theme') === 'dark' ? 'dark' : 'light')
} catch {
  // storage unavailable — defaults apply
}

// A newer version was deployed while this tab was open: reload to get it.
window.addEventListener('vite:preloadError', (event) => {
  if (reloadForNewVersion()) event.preventDefault()
})

// Save the app on this device so it opens with no internet.
if (import.meta.env.PROD) registerOfflineSupport()

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <MotionConfig reducedMotion="user">
      <ErrorBoundary>
        <App />
      </ErrorBoundary>
    </MotionConfig>
  </StrictMode>,
)
