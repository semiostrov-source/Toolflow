import { Link } from 'react-router-dom'

interface HeaderProps {
  onMenuClick?: () => void
}

export function Header({ onMenuClick }: HeaderProps) {
  return (
    <header className="app-header">
      {onMenuClick && (
        <button
          type="button"
          className="app-menu-btn"
          onClick={onMenuClick}
          aria-label="Toggle sidebar"
        >
          ☰
        </button>
      )}
      <Link to="/" className="app-brand">
        ToolFlow
      </Link>
    </header>
  )
}
