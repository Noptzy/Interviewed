interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary'
  loading?: boolean
}

export default function Button({ variant = 'primary', loading, children, disabled, ...props }: ButtonProps) {
  return (
    <button
      className={variant === 'primary' ? 'btn-primary' : 'btn-secondary'}
      disabled={disabled || loading}
      {...props}
    >
      {loading ? 'Loading…' : children}
    </button>
  )
}
