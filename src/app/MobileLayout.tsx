import { Outlet } from 'react-router-dom'
import { BottomNavigation } from '../shared/ui/BottomNavigation'

export function MobileLayout() {
  return (
    <div className="mobile-layout">
      <main className="mobile-layout__content">
        <Outlet />
      </main>
      <BottomNavigation />
    </div>
  )
}
