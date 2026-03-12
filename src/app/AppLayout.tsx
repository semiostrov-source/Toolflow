import { useState } from 'react'
import { Outlet } from 'react-router-dom'
import { Header, PageContainer, Sidebar } from '../shared/ui'

/**
 * Application shell: Header, Sidebar, and main content area.
 * Route content renders inside PageContainer via Outlet.
 * Sidebar is collapsible on small screens.
 */
export function AppLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false)

  return (
    <div className="app">
      <Header onMenuClick={() => setSidebarOpen((o) => !o)} />
      <div className="app-layout">
        <Sidebar
          open={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
        />
        {sidebarOpen && (
          <div
            className="app-sidebar-overlay"
            onClick={() => setSidebarOpen(false)}
            onKeyDown={(e) => e.key === 'Escape' && setSidebarOpen(false)}
            role="button"
            tabIndex={0}
            aria-label="Close sidebar"
          />
        )}
        <div className="app-main">
          <PageContainer>
            <Outlet />
          </PageContainer>
        </div>
      </div>
    </div>
  )
}
