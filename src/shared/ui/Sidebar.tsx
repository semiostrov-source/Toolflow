import { NavLink } from 'react-router-dom'

const navItems = [
  { to: '/', label: 'Dashboard', end: true },
  { to: '/inventory', label: 'Inventory', end: false },
  { to: '/warehouses', label: 'Warehouses', end: false },
  { to: '/requests', label: 'Requests', end: false },
] as const

interface SidebarProps {
  open?: boolean
  onClose?: () => void
}

export function Sidebar({ open = true, onClose }: SidebarProps) {
  return (
    <aside
      className={`app-sidebar ${open ? 'app-sidebar--open' : ''}`}
      aria-label="Sidebar navigation"
    >
      {onClose && (
        <button
          type="button"
          className="app-sidebar-close"
          onClick={onClose}
          aria-label="Close sidebar"
        >
          ×
        </button>
      )}
      <nav className="app-sidebar-nav">
        {navItems.map(({ to, label, end }) => (
          <NavLink
            key={to}
            to={to}
            end={end}
            className={({ isActive }) =>
              `app-sidebar-link ${isActive ? 'active' : ''}`
            }
            onClick={onClose}
          >
            {label}
          </NavLink>
        ))}
      </nav>
    </aside>
  )
}
