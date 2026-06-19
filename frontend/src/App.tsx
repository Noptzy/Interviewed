import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import Landing from './pages/Landing'
import Login from './pages/Login'
import Register from './pages/Register'
import Dashboard from './pages/Dashboard'
import Onboarding from './pages/Onboarding'
import Interview from './pages/Interview'
import Recommendations from './pages/Recommendations'
import Settings from './pages/Settings'
import ProtectedRoute from './features/auth/ProtectedRoute'
import { SidebarProvider } from './contexts/SidebarContext'

export default function App() {
  return (
    <BrowserRouter>
      <SidebarProvider>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
          <Route path="/onboarding/upload" element={<ProtectedRoute><Onboarding /></ProtectedRoute>} />
          <Route path="/interview/:sessionId" element={<ProtectedRoute><Interview /></ProtectedRoute>} />
          <Route path="/recommendations" element={<ProtectedRoute><Recommendations /></ProtectedRoute>} />
          <Route path="/settings" element={<ProtectedRoute><Settings /></ProtectedRoute>} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </SidebarProvider>
    </BrowserRouter>
  )
}
