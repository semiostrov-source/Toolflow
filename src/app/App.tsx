import { Routes, Route, Navigate } from 'react-router-dom'
import { MobileLayout } from './MobileLayout'
import {
  LoginPage,
  InventoryPage,
  MyItemsPage,
  CreatePage,
  InfoPage,
  PanelPage,
} from '../pages'
import { AuthProvider } from '../features/auth'
import { ProtectedRoute } from './ProtectedRoute'
import { PublicRoute } from './PublicRoute'

export function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route element={<PublicRoute />}>
          <Route path="/login" element={<LoginPage />} />
        </Route>

        <Route element={<ProtectedRoute />}>
          <Route element={<MobileLayout />}>
            <Route path="/" element={<Navigate to="/inventory" replace />} />
            <Route path="/inventory" element={<InventoryPage />} />
            <Route path="/my-items" element={<MyItemsPage />} />
            <Route path="/create" element={<CreatePage />} />
            <Route path="/info" element={<InfoPage />} />
            <Route path="/panel" element={<PanelPage />} />
          </Route>
        </Route>
      </Routes>
    </AuthProvider>
  )
}
