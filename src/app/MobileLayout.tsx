import { Outlet } from 'react-router-dom'
import { BottomNavigation } from '../shared/ui/BottomNavigation'

export function MobileLayout() {
  return (
    <div className="mobile-app">
      <div className="mobile-container">
        <main className="mobile-main">
          <Outlet />
        </main>
        <BottomNavigation />
      </div>
    </div>
  )
}
