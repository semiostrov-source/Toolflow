import { describe, it, expect, beforeEach, afterEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { App } from './App'
import type { User } from '../features/auth'

const STORAGE_KEY = 'toolflow_user'

const mockUser: User = {
  id: '1',
  login: 'testuser',
  password_hash: '',
  status: 'active',
  is_admin: false,
  can_create_edit_cards: false,
  can_see_own_only: false,
  can_transfer: false,
  can_transfer_without_confirmation: false,
  can_transfer_for_others: false,
  can_manage_warehouse: false,
  can_confirm_writeoff: false,
  can_dispose: false,
  can_replenish_quantity: false,
  can_create_reports: false,
  can_manage_warehouses_objects: false,
  can_manage_users: false,
}

describe('App', () => {
  beforeEach(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(mockUser))
  })

  afterEach(() => {
    localStorage.removeItem(STORAGE_KEY)
  })

  it('renders bottom navigation with all five tabs', () => {
    render(
      <MemoryRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
        <App />
      </MemoryRouter>,
    )

    const nav = screen.getByRole('navigation', { name: 'Main navigation' })
    expect(nav).toBeInTheDocument()

    expect(screen.getByRole('link', { name: /Все/ })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /Мои/ })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /Создать/ })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /Инфо/ })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /Панель/ })).toBeInTheDocument()
  })

  it('renders inventory page at default route', () => {
    render(
      <MemoryRouter initialEntries={['/']} future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
        <App />
      </MemoryRouter>,
    )

    expect(screen.getByRole('heading', { name: 'Все инструменты' })).toBeInTheDocument()
  })
})
