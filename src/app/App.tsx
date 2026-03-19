import { Routes, Route, Navigate } from 'react-router-dom'
import { MobileLayout } from './MobileLayout'
import {
  InventoryPage,
  MyItemsPage,
  CreatePage,
  InfoPage,
  PanelPage,
} from '../pages'

export function App() {
  return (
    <Routes>
      <Route element={<MobileLayout />}>
        <Route path="/" element={<Navigate to="/inventory" replace />} />
        <Route path="/inventory" element={<InventoryPage />} />
        <Route path="/my-items" element={<MyItemsPage />} />
        <Route path="/create" element={<CreatePage />} />
        <Route path="/info" element={<InfoPage />} />
        <Route path="/panel" element={<PanelPage />} />
      </Route>
    </Routes>
  )
}
