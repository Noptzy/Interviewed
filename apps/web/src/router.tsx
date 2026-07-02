import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { SidebarProvider } from './hooks/use-sidebar'
import Landing from './routes'
import PublicRoute from './routes/_public'
import Login from './routes/_public/auth/login'
import Register from './routes/_public/auth/register'
import AdminRoute from './routes/_authenticated/admin'
import AdminDashboard from './routes/_authenticated/admin/dashboard'
import AdminUsers from './routes/_authenticated/admin/users'
import AdminSettings from './routes/_authenticated/admin/settings'
import UsersRoute from './routes/_authenticated/users'
import RoleRedirect from './routes/_authenticated/role-redirect'
import UserDashboard from './routes/_authenticated/users/dashboard'
import UploadCv from './routes/_authenticated/users/upload-cv'
import Jobs from './routes/_authenticated/users/jobs'
import Interview from './routes/_authenticated/users/interview'

export default function Router() {
  return (
    <BrowserRouter>
      <SidebarProvider>
        <Routes>
          <Route path="/" element={<PublicRoute><Landing /></PublicRoute>} />
          <Route path="/auth/login" element={<PublicRoute><Login /></PublicRoute>} />
          <Route path="/auth/register" element={<PublicRoute><Register /></PublicRoute>} />
          <Route path="/login" element={<Navigate to="/auth/login" replace />} />
          <Route path="/register" element={<Navigate to="/auth/register" replace />} />
          <Route path="/admin" element={<Navigate to="/admin/dashboard" replace />} />
          <Route path="/admin/dashboard" element={<AdminRoute><AdminDashboard /></AdminRoute>} />
          <Route path="/admin/users" element={<AdminRoute><AdminUsers /></AdminRoute>} />
          <Route path="/admin/settings" element={<AdminRoute><AdminSettings /></AdminRoute>} />
          <Route path="/users" element={<Navigate to="/users/dashboard" replace />} />
          <Route path="/users/dashboard" element={<UsersRoute><UserDashboard /></UsersRoute>} />
          <Route path="/users/upload-cv" element={<UsersRoute><UploadCv /></UsersRoute>} />
          <Route path="/users/jobs" element={<UsersRoute><Jobs /></UsersRoute>} />
          <Route path="/users/interview" element={<UsersRoute><Interview /></UsersRoute>} />
          <Route path="/users/interview/:sessionId" element={<UsersRoute><Interview /></UsersRoute>} />
          <Route path="/users/settings" element={<RoleRedirect target="settings" />} />
          <Route path="/dashboard" element={<RoleRedirect target="dashboard" />} />
          <Route path="/onboarding/upload" element={<Navigate to="/users/upload-cv" replace />} />
          <Route path="/recommendations" element={<Navigate to="/users/jobs" replace />} />
          <Route path="/settings" element={<RoleRedirect target="settings" />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </SidebarProvider>
    </BrowserRouter>
  )
}
