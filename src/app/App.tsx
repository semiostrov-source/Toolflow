import { Routes, Route } from 'react-router-dom'
import { AppLayout } from './AppLayout'
import {
  DashboardPage,
  InventoryPage,
  WarehousesPage,
  RequestsPage,
} from '../pages'

export function App() {
  return (
    <Routes>
      <Route path="/" element={<AppLayout />}>
        <Route index element={<DashboardPage />} />
        <Route path="inventory" element={<InventoryPage />} />
        <Route path="warehouses" element={<WarehousesPage />} />
        <Route path="requests" element={<RequestsPage />} />
      </Route>
    </Routes>
  )
}
