import { Link, useLocation } from 'react-router-dom'

const navItems = [
  { to: '/', label: 'Dashboard' },
  { to: '/inventory', label: 'Inventory' },
  { to: '/warehouses', label: 'Warehouses' },
  { to: '/requests', label: 'Requests' },
] as const

export function Header() {
  const location = useLocation()

  return (
    <header className="app-header">
      <Link to="/" className="app-brand">
        ToolFlow
      </Link>
      <nav className="app-nav" aria-label="Main">
        {navItems.map(({ to, label }) => (
          <Link
            key={to}
            to={to}
            className={`app-nav-link ${location.pathname === to ? 'active' : ''}`}
          >
            {label}
          </Link>
        ))}
      </nav>
    </header>
  )
}
