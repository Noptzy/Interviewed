import { useState, type FormEvent } from 'react'
import { Plus, Trash2, Users } from 'lucide-react'
import AppShell from '@/routes/_authenticated/_components/app-shell'
import { useAdminUsers, useCreateAdminUser, useDeleteAdminUser, useUpdateAdminUser } from './_apis/use-admin-users'

export default function AdminUsers() {
  const { data: users, isLoading, isError } = useAdminUsers()
  const createUser = useCreateAdminUser()
  const updateUser = useUpdateAdminUser()
  const deleteUser = useDeleteAdminUser()
  const [email, setEmail] = useState('')
  const [name, setName] = useState('')
  const [password, setPassword] = useState('')
  const [role, setRole] = useState<'USER' | 'ADMIN'>('USER')

  const submit = (event: FormEvent) => {
    event.preventDefault()
    createUser.mutate({ email, name, password, role }, {
      onSuccess: () => {
        setEmail('')
        setName('')
        setPassword('')
        setRole('USER')
      },
    })
  }

  return (
    <AppShell area="admin" size="wide">
      <div className="admin-page">
        <div className="admin-header">
          <div>
            <h1 className="admin-title">Admin Users</h1>
            <p className="admin-subtitle">Manage candidate and admin access.</p>
          </div>
          <span className="badge badge-teal">{users?.length ?? 0} accounts</span>
        </div>

        <form onSubmit={submit} className="card admin-form-grid">
          <input className="input-field" value={email} onChange={event => setEmail(event.target.value)} placeholder="email" type="email" required />
          <input className="input-field" value={name} onChange={event => setName(event.target.value)} placeholder="name" required />
          <input className="input-field" value={password} onChange={event => setPassword(event.target.value)} placeholder="password" type="password" required />
          <select className="input-field" value={role} onChange={event => setRole(event.target.value as 'USER' | 'ADMIN')}>
            <option value="USER">USER</option>
            <option value="ADMIN">ADMIN</option>
          </select>
          <button className="btn-primary" type="submit" disabled={createUser.isPending}><Plus size={16} /> Add</button>
        </form>

        <section className="card">
          <div className="admin-card-title">
            <span className="admin-icon"><Users size={18} /></span>
            <h2>Account List</h2>
          </div>
          {isLoading && <div className="loading-chart">Loading users</div>}
          {isError && <div className="error-state-chart">Could not load users</div>}
          {!isLoading && !isError && (users ?? []).length === 0 && <div className="empty-data-state">No users yet</div>}
          {!isLoading && !isError && (users ?? []).length > 0 && (
            <div className="admin-table-wrap">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Role</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {(users ?? []).map(user => (
                    <tr key={user.id}>
                      <td>{user.name}</td>
                      <td>{user.email}</td>
                      <td>
                        <select className="input-field" value={user.role} onChange={event => updateUser.mutate({ id: user.id, role: event.target.value as 'USER' | 'ADMIN' })} aria-label={`Change role for ${user.email}`}>
                          <option value="USER">USER</option>
                          <option value="ADMIN">ADMIN</option>
                        </select>
                      </td>
                      <td>
                        <button className="btn-secondary icon-button" type="button" onClick={() => deleteUser.mutate(user.id)} aria-label={`Delete ${user.email}`} disabled={deleteUser.isPending}>
                          <Trash2 size={15} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </div>
    </AppShell>
  )
}
