import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import './App.css'
import '@mriqbox/ui-kit/dist/style.css'
import App from './App.tsx'
import { VisibilityProvider } from './providers/VisibilityProvider'
import { CrosshairOverlay } from './CrosshairOverlay';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <CrosshairOverlay />
    <VisibilityProvider>
      <App />
    </VisibilityProvider>
  </StrictMode>,
)
