import { Navigate } from 'react-router-dom'
import { useCurrentUser } from '@/hooks/use-current-user'
import AuthenticatedRoute from '../_authenticated'

interface Props {
  children: React.ReactNode
}

export default function UsersRoute({ children }: Props) {
  const { data: user, isLoading } = useCurrentUser()

  if (isLoading) return <AuthenticatedRoute>{children}</AuthenticatedRoute>
  if (user?.role === 'ADMIN') return <Navigate to="/admin/dashboard" replace />

  return <AuthenticatedRoute>{children}</AuthenticatedRoute>
}
