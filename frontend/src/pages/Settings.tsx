import { useState, useEffect } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { Settings2, Check } from 'lucide-react'
import AppShell from '../components/AppShell'
import api from '../lib/api'
import type { ApiResponse, SettingsResponse, ModelOption } from '../types/api'

export default function Settings() {
  const queryClient = useQueryClient()
  const [selectedModel, setSelectedModel] = useState('')
  const [temperature, setTemperature] = useState(0.4)
  const [saved, setSaved] = useState(false)

  const { data: settings } = useQuery({
    queryKey: ['settings'],
    queryFn: async () => {
      const res = await api.get<ApiResponse<SettingsResponse>>('/api/settings')
      return res.data.data
    },
  })

  const { data: models } = useQuery({
    queryKey: ['models'],
    queryFn: async () => {
      const res = await api.get<ApiResponse<ModelOption[]>>('/api/settings/models')
      return res.data.data
    },
  })

  useEffect(() => {
    if (settings) {
      setSelectedModel(settings.model ?? 'openrouter/owl-alpha')
      setTemperature(settings.temperature ?? 0.4)
    }
  }, [settings])

  const updateSettings = useMutation({
    mutationFn: async () => {
      const res = await api.put<ApiResponse<SettingsResponse>>('/api/settings', { model: selectedModel, temperature })
      return res.data.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['settings'] })
      setSaved(true)
      setTimeout(() => setSaved(false), 2000)
    },
  })

  return (
    <AppShell>
      <div style={{ maxWidth: 600 }}>
        <div style={{ marginBottom: 32 }}>
          <h1 style={{ fontSize: 28, fontWeight: 700, color: '#131f3d', margin: '0 0 8px', display: 'flex', alignItems: 'center', gap: 10 }}>
            <Settings2 size={28} /> Settings
          </h1>
          <p style={{ color: '#45464e', margin: 0 }}>Configure your AI model preferences</p>
        </div>

        <div className="card" style={{ marginBottom: 20 }}>
          <h2 style={{ fontSize: 16, fontWeight: 700, color: '#131f3d', margin: '0 0 16px' }}>AI Model</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {models?.map((m) => (
              <label key={m.id} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: 14, border: `1.5px solid ${selectedModel === m.id ? '#0ea5a4' : '#e4e9ea'}`, borderRadius: 12, cursor: 'pointer', background: selectedModel === m.id ? 'rgba(14,165,164,0.05)' : 'white', transition: 'all 0.15s' }}>
                <input type="radio" name="model" value={m.id} checked={selectedModel === m.id} onChange={() => setSelectedModel(m.id)} style={{ accentColor: '#0ea5a4' }} />
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 600, color: '#131f3d', fontSize: 14 }}>{m.label}</div>
                  <div style={{ fontSize: 12, color: '#76777e' }}>{m.id}</div>
                </div>
                {selectedModel === m.id && <Check size={16} color="#0ea5a4" />}
              </label>
            ))}
          </div>

          <div style={{ marginTop: 16 }}>
            <label style={{ fontSize: 12, fontWeight: 700, color: '#76777e', display: 'block', marginBottom: 4 }}>CUSTOM MODEL ID</label>
            <input
              className="input-field"
              value={selectedModel}
              onChange={e => setSelectedModel(e.target.value)}
              placeholder="e.g. openai/gpt-4o"
            />
          </div>
        </div>

        <div className="card" style={{ marginBottom: 24 }}>
          <h2 style={{ fontSize: 16, fontWeight: 700, color: '#131f3d', margin: '0 0 4px' }}>Temperature</h2>
          <p style={{ color: '#76777e', fontSize: 13, margin: '0 0 16px' }}>Controls AI creativity. Lower = focused, Higher = creative.</p>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            <input type="range" min={0} max={1} step={0.05} value={temperature} onChange={e => setTemperature(Number(e.target.value))} style={{ flex: 1, accentColor: '#0ea5a4' }} />
            <span style={{ fontWeight: 700, color: '#131f3d', minWidth: 36, textAlign: 'right' }}>{temperature.toFixed(2)}</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 4 }}>
            <span style={{ fontSize: 11, color: '#76777e' }}>Focused</span>
            <span style={{ fontSize: 11, color: '#76777e' }}>Creative</span>
          </div>
        </div>

        <button onClick={() => updateSettings.mutate()} disabled={updateSettings.isPending} className="btn-primary" style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '12px 32px' }}>
          {saved ? <><Check size={16} /> Saved!</> : updateSettings.isPending ? 'Saving…' : 'Save Settings'}
        </button>
      </div>
    </AppShell>
  )
}
