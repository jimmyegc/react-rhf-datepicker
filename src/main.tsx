import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import ErrorBoundary from './components/ErrorBoundary/ErrorBoundary.tsx'
import ErrorTemplate from './components/ErrorTemplate/ErrorTemplate.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ErrorBoundary
      fallback={(error, resetErrorBoundary) => (
        <ErrorTemplate error={error} onRetry={resetErrorBoundary} />
      )}
    >
      <App />
    </ErrorBoundary>
  </StrictMode>,
)
