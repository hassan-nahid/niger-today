import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { RouterProvider } from 'react-router'
import { router } from './routes/index.tsx'
import { AuthProvider } from './context/AuthContext'
import { CustomerProvider } from './context/CustomerContext'
import { ToastProvider } from './context/ToastContext'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AuthProvider>
      <ToastProvider>
        <CustomerProvider>
          <RouterProvider router={router} />
        </CustomerProvider>
      </ToastProvider>
    </AuthProvider>
  </StrictMode>,
)
