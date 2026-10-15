import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { MotionConfig } from 'framer-motion'
import './index.css'
import App from './App.tsx'
import ErrorBoundary from './components/Common/ErrorBoundary'
import { applyAppearance } from './lib/appearance'
import { readLocalKv } from './lib/userKv'

// Apply the saved palette/theme before the first paint (no colour flash).
try {
  applyAppearance(readLocalKv<string>('appearance', 'default'), localStorage.getItem('khalil-theme') === 'dark' ? 'dark' : 'light')
} catch {
  // storage unavailable — defaults apply
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <MotionConfig reducedMotion="user">
      <ErrorBoundary>
        <App />
      </ErrorBoundary>
    </MotionConfig>
  </StrictMode>,
)
