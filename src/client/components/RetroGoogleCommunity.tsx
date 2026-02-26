import './RetroGoogleCommunity.css'

// Google-style color palette: Blue, Red, Yellow, Blue, Green, Red
const GOOGLE_COLORS = [
  '#4285F4', // Blue
  '#EA4335', // Red
  '#FBBC05', // Yellow
  '#4285F4', // Blue
  '#34A853', // Green
  '#EA4335', // Red
]

const LETTERS = ['C', 'o', 'm', 'm', 'u', 'n', 'i', 't', 'y']

interface RetroGoogleCommunityProps {
  onClick?: () => void
  className?: string
}

export default function RetroGoogleCommunity({ onClick, className = '' }: RetroGoogleCommunityProps) {
  return (
    <span
      className={`retro-google-community ${className}`}
      onClick={onClick}
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
      onKeyDown={onClick ? (e) => e.key === 'Enter' && onClick() : undefined}
    >
      {LETTERS.map((letter, i) => (
        <span
          key={i}
          className="retro-letter"
          style={{
            color: GOOGLE_COLORS[i % GOOGLE_COLORS.length],
          }}
        >
          {letter}
        </span>
      ))}
    </span>
  )
}
