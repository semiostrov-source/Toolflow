import { NavLink } from 'react-router-dom'

const tabs = [
  {
    to: '/inventory',
    label: 'All items',
    icon: (
      <svg aria-hidden="true" focusable="false" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <line x1="4" y1="6" x2="20" y2="6" />
        <line x1="4" y1="12" x2="20" y2="12" />
        <line x1="4" y1="18" x2="20" y2="18" />
      </svg>
    ),
  },
  {
    to: '/my-items',
    label: 'My items',
    icon: (
      <svg aria-hidden="true" focusable="false" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="8" r="4" />
        <path d="M20 21c0-3.87-3.58-7-8-7s-8 3.13-8 7" />
      </svg>
    ),
  },
  {
    to: '/create',
    label: 'Create',
    icon: (
      <svg aria-hidden="true" focusable="false" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10" />
        <line x1="12" y1="8" x2="12" y2="16" />
        <line x1="8" y1="12" x2="16" y2="12" />
      </svg>
    ),
  },
  {
    to: '/info',
    label: 'Info',
    icon: (
      <svg aria-hidden="true" focusable="false" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10" />
        <line x1="12" y1="16" x2="12" y2="12" />
        <circle cx="12" cy="8" r="0.5" fill="currentColor" />
      </svg>
    ),
  },
  {
    to: '/panel',
    label: 'Panel',
    icon: (
      <svg aria-hidden="true" focusable="false" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="3" width="7" height="7" rx="1" />
        <rect x="14" y="3" width="7" height="7" rx="1" />
        <rect x="3" y="14" width="7" height="7" rx="1" />
        <rect x="14" y="14" width="7" height="7" rx="1" />
      </svg>
    ),
  },
] as const

function tabClassName({ isActive }: { isActive: boolean }) {
  return `bottom-nav__tab${isActive ? ' bottom-nav__tab--active' : ''}`
}

export function BottomNavigation() {
  return (
    <nav className="bottom-nav" aria-label="Main navigation">
      {tabs.map(({ to, label, icon }) => (
        <NavLink key={to} to={to} className={tabClassName}>
          {icon}
          <span className="bottom-nav__label">{label}</span>
        </NavLink>
      ))}
    </nav>
  )
}
