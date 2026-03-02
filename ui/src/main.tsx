import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import '@mriqbox/ui-kit/dist/style.css'
import App from './App.tsx'
import { VisibilityProvider } from './providers/VisibilityProvider'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <VisibilityProvider>
      <App />
    </VisibilityProvider>
  </StrictMode>,
)
