import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useLogin } from '../features/auth/useLogin'
import AuthCard from '../components/AuthCard'
import Button from '../components/Button'
import Input from '../components/Input'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const login = useLogin()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    login.mutate({ email, password })
  }

  return (
    <AuthCard
      title="Welcome back"
      subtitle="Sign in to your account"
      footer={<>Don't have an account? <Link to="/register">Create one</Link></>}
    >
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
        <Input label="Email" type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="you@example.com" required />
        <Input label="Password" type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="••••••••" required />
        {login.error && (
          <p className="auth-error">Invalid email or password</p>
        )}
        <Button type="submit" loading={login.isPending} style={{ width: '100%' }}>
          Sign In
        </Button>
      </form>
    </AuthCard>
  )
}