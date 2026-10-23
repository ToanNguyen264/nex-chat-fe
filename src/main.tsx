import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import "./_metronic/styles/index.scss";
import App from './App.tsx'
import { BrowserRouter } from 'react-router'
import { QueryClientProvider } from '@tanstack/react-query'
import { queryClient } from './lib/query-client'
import './_metronic/helpers/keenicons/outline/style.css'


createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </QueryClientProvider>
  </StrictMode>,
)
