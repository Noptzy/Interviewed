interface Props {
  children: React.ReactNode
  size?: 'default' | 'wide' | 'narrow'
}

const sizes = {
  default: 1280,
  wide: 1728,
  narrow: 896,
}

export default function PageContainer({ children, size = 'default' }: Props) {
  return (
    <div style={{ width: '100%', padding: '32px clamp(20px, 4vw, 44px)' }}>
      <div style={{ width: '100%', maxWidth: sizes[size], margin: '0 auto' }}>
        {children}
      </div>
    </div>
  )
}
