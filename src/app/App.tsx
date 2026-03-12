import { Routes, Route } from 'react-router-dom'
import { Header } from '../shared/ui'
import {
  DashboardPage,
  InventoryPage,
  WarehousesPage,
  RequestsPage,
} from '../pages'

export function App() {
  return (
    <div className="app">
      <Header />
      <div className="app-body">
        <Routes>
          <Route path="/" element={<DashboardPage />} />
          <Route path="/inventory" element={<InventoryPage />} />
          <Route path="/warehouses" element={<WarehousesPage />} />
          <Route path="/requests" element={<RequestsPage />} />
        </Routes>
      </div>
    </div>
  )
}
