import { Navigate, Outlet } from 'react-router-dom'
import { useAuth } from '../features/auth'

export function PublicRoute() {
  const { user, isLoading } = useAuth()

  if (isLoading) {
    return null
  }

  if (user) {
    return <Navigate to="/inventory" replace />
  }

  return <Outlet />
}
