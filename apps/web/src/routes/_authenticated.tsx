import { Navigate } from 'react-router-dom'
import { useCurrentUser } from '../hooks/use-current-user'

interface Props {
  children: React.ReactNode
}

export default function AuthenticatedRoute({ children }: Props) {
  const { data: user, isLoading, isError } = useCurrentUser()

  if (isLoading) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', background: '#f5fafb' }}>
        <div style={{ width: 40, height: 40, border: '3px solid #0ea5a4', borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
      </div>
    )
  }

  if (isError || !user) return <Navigate to="/auth/login" replace />

  return <>{children}</>
}
