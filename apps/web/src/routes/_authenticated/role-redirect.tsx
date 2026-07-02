import { Navigate } from 'react-router-dom'
import { useCurrentUser } from '@/hooks/use-current-user'
import AuthenticatedRoute from '../_authenticated'

type Target = 'dashboard' | 'settings'

const adminTargets: Record<Target, string> = {
  dashboard: '/admin/dashboard',
  settings: '/admin/settings',
}

const userTargets: Record<Target, string> = {
  dashboard: '/users/dashboard',
  settings: '/users/dashboard',
}

export default function RoleRedirect({ target }: { target: Target }) {
  const { data: user, isLoading } = useCurrentUser()

  if (isLoading) return <AuthenticatedRoute><div /></AuthenticatedRoute>
  if (!user) return <Navigate to="/auth/login" replace />

  return <Navigate to={user.role === 'ADMIN' ? adminTargets[target] : userTargets[target]} replace />
}
