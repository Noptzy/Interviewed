import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useRegister } from '../features/auth/useRegister'
import AuthCard from '../components/AuthCard'
import Button from '../components/Button'
import Input from '../components/Input'

export default function Register() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const register = useRegister()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    register.mutate({ name, email, password })
  }

  return (
    <AuthCard
      title="Create account"
      subtitle="Start your job search with AI"
      footer={<>Already have an account? <Link to="/login">Sign in</Link></>}
    >
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
        <Input label="Full Name" value={name} onChange={e => setName(e.target.value)} placeholder="Jane Doe" required />
        <Input label="Email" type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="you@example.com" required />
        <Input label="Password" type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="Min. 8 characters" minLength={8} required />
        {register.error && (
          <p className="auth-error">
            {(register.error as { response?: { data?: { error?: string } } })?.response?.data?.error || 'Registration failed'}
          </p>
        )}
        <Button type="submit" loading={register.isPending} style={{ width: '100%' }}>
          Create Account
        </Button>
      </form>
    </AuthCard>
  )
}