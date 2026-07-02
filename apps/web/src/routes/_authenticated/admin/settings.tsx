import { useEffect, useState, type FormEvent } from 'react'
import { Check, PlugZap, Plus, Settings, Trash2 } from 'lucide-react'
import AppShell from '@/routes/_authenticated/_components/app-shell'
import { useAdminModels, useAvailableModels, useCreateAdminModel, useDeleteAdminModel, useGlobalSettings, useUpdateGlobalSettings } from './_apis/use-global-settings'

export default function AdminSettings() {
  const { data: settings, isLoading: isSettingsLoading, isError: isSettingsError } = useGlobalSettings()
  const { data: savedModels, isLoading: isSavedModelsLoading, isError: isSavedModelsError } = useAdminModels()
  const { data: availableModels, isLoading: isAvailableModelsLoading, isError: isAvailableModelsError } = useAvailableModels()
  const updateSettings = useUpdateGlobalSettings()
  const createModel = useCreateAdminModel()
  const deleteModel = useDeleteAdminModel()
  const [model, setModel] = useState('')
  const [temperature, setTemperature] = useState(0.4)
  const [systemPrompt, setSystemPrompt] = useState('')
  const [newModelId, setNewModelId] = useState('')
  const [newModelLabel, setNewModelLabel] = useState('')
  const liveModels = availableModels ?? []
  const fallbackModels = savedModels ?? []
  const modelOptions = liveModels.length > 0 ? liveModels : fallbackModels
  const freeModels = modelOptions.filter(option => option.id.endsWith(':free'))
  const paidModels = modelOptions.filter(option => !option.id.endsWith(':free'))
  const isModelMissing = model !== '' && !modelOptions.some(option => option.id === model)

  useEffect(() => {
    if (settings) {
      setModel(settings.model)
      setTemperature(settings.temperature)
      setSystemPrompt(settings.systemPrompt || '')
    }
  }, [settings])

  const addModel = (event: FormEvent) => {
    event.preventDefault()
    createModel.mutate({ id: newModelId, label: newModelLabel }, {
      onSuccess: () => {
        setNewModelId('')
        setNewModelLabel('')
      },
    })
  }

  return (
    <AppShell area="admin" size="wide">
      <div className="admin-page-narrow">
        <div className="admin-header">
          <div>
            <h1 className="admin-title">Admin AI Settings</h1>
            <p className="admin-subtitle">Configure recruiter AI defaults and OpenRouter model catalog.</p>
          </div>
          <span className={isAvailableModelsError ? 'badge badge-navy' : 'badge badge-emerald'}>{isAvailableModelsError ? 'Fallback models' : 'Live OpenRouter'}</span>
        </div>

        <div className="admin-settings-layout">
          <section className="card">
            <div className="admin-card-title">
              <span className="admin-icon"><Settings size={18} /></span>
              <h2>Global Default</h2>
            </div>
            {isSettingsLoading && <div className="loading-chart">Loading settings</div>}
            {isSettingsError && <div className="error-state-chart">Could not load settings</div>}
            {!isSettingsLoading && !isSettingsError && (
              <>
                <div className="admin-settings-grid">
                  <div>
                    <label className="field-label" htmlFor="model">Model</label>
                    <select className="input-field" id="model" value={model} onChange={event => setModel(event.target.value)} disabled={isAvailableModelsLoading && isSavedModelsLoading}>
                      {isModelMissing && <option value={model}>{model}</option>}
                      {freeModels.length > 0 && (
                        <optgroup label="Free">
                          {freeModels.map(option => <option key={option.id} value={option.id}>{option.label}</option>)}
                        </optgroup>
                      )}
                      {paidModels.length > 0 && (
                        <optgroup label="Paid">
                          {paidModels.map(option => <option key={option.id} value={option.id}>{option.label}</option>)}
                        </optgroup>
                      )}
                    </select>
                    {isAvailableModelsLoading && <p className="admin-subtitle">Fetching OpenRouter catalog...</p>}
                    {isAvailableModelsError && <p className="admin-subtitle">OpenRouter unavailable. Saved overrides are used.</p>}
                  </div>
                  <div>
                    <label className="field-label" htmlFor="temperature">Temperature</label>
                    <input className="input-field" id="temperature" type="number" min={0} max={1} step={0.05} value={temperature} onChange={event => setTemperature(Number(event.target.value))} />
                  </div>
                </div>
                <div>
                  <label className="field-label" htmlFor="systemPrompt">System Prompt Template</label>
                  <textarea
                    className="input-field admin-textarea"
                    id="systemPrompt"
                    value={systemPrompt}
                    onChange={event => setSystemPrompt(event.target.value)}
                  />
                  <p className="admin-subtitle">Placeholders: <code className="code-pill">{`{{SUMMARY}}`}</code> <code className="code-pill">{`{{SKILLS}}`}</code></p>
                </div>
                <div className="admin-actions" style={{ marginTop: 20 }}>
                  <button className="btn-primary" type="button" onClick={() => updateSettings.mutate({ model, temperature, systemPrompt })} disabled={updateSettings.isPending || modelOptions.length === 0}>
                    <Check size={16} /> Save Settings
                  </button>
                </div>
              </>
            )}
          </section>

          <section className="card">
            <div className="admin-card-title">
              <span className="admin-icon"><PlugZap size={18} /></span>
              <h2>Saved Model Overrides</h2>
            </div>
            <form onSubmit={addModel} className="admin-model-form">
              <div>
                <label className="field-label" htmlFor="newModelId">Model ID</label>
                <input className="input-field" id="newModelId" value={newModelId} onChange={event => setNewModelId(event.target.value)} placeholder="openai/gpt-oss-20b:free" required />
              </div>
              <div>
                <label className="field-label" htmlFor="newModelLabel">Display Label</label>
                <input className="input-field" id="newModelLabel" value={newModelLabel} onChange={event => setNewModelLabel(event.target.value)} placeholder="GPT-OSS 20B Free" required />
              </div>
              <button className="btn-primary" type="submit" disabled={createModel.isPending}><Plus size={16} /> Add</button>
            </form>

            {isSavedModelsLoading && <div className="loading-chart">Loading saved models</div>}
            {isSavedModelsError && <div className="error-state-chart">Could not load saved models</div>}
            {!isSavedModelsLoading && !isSavedModelsError && fallbackModels.length === 0 && <div className="empty-data-state">No saved overrides</div>}
            {!isSavedModelsLoading && !isSavedModelsError && fallbackModels.length > 0 && (
              <div className="admin-table-wrap">
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th>Label</th>
                      <th>Model ID</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {fallbackModels.map(option => (
                      <tr key={option.id}>
                        <td>{option.label}</td>
                        <td><code className="code-pill">{option.id}</code></td>
                        <td>
                          <button className="btn-secondary icon-button" type="button" onClick={() => deleteModel.mutate(option.id)} aria-label={`Delete ${option.id}`} disabled={deleteModel.isPending}>
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
      </div>
    </AppShell>
  )
}
