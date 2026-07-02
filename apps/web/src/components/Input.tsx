interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
}

export default function Input({ label, error, ...props }: InputProps) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
      {label && <label style={{ fontSize: 14, fontWeight: 600, color: '#131f3d' }}>{label}</label>}
      <input className="input-field" {...props} />
      {error && <span style={{ fontSize: 12, color: '#ba1a1a' }}>{error}</span>}
    </div>
  )
}
