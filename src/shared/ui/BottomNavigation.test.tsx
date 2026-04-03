import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { BottomNavigation } from './BottomNavigation'

describe('BottomNavigation', () => {
  it('renders all five navigation tabs', () => {
    render(
      <MemoryRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
        <BottomNavigation />
      </MemoryRouter>,
    )

    expect(screen.getByRole('link', { name: /Все/ })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /Мои/ })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /Создать/ })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /Инфо/ })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /Панель/ })).toBeInTheDocument()
  })

  it('highlights the active tab', () => {
    render(
      <MemoryRouter initialEntries={['/inventory']} future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
        <BottomNavigation />
      </MemoryRouter>,
    )

    const allItemsLink = screen.getByRole('link', { name: /Все/ })
    expect(allItemsLink).toHaveClass('bottom-nav__tab--active')
  })

  it('links point to correct routes', () => {
    render(
      <MemoryRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
        <BottomNavigation />
      </MemoryRouter>,
    )

    expect(screen.getByRole('link', { name: /Все/ })).toHaveAttribute('href', '/inventory')
    expect(screen.getByRole('link', { name: /Мои/ })).toHaveAttribute('href', '/my-items')
    expect(screen.getByRole('link', { name: /Создать/ })).toHaveAttribute('href', '/create')
    expect(screen.getByRole('link', { name: /Инфо/ })).toHaveAttribute('href', '/info')
    expect(screen.getByRole('link', { name: /Панель/ })).toHaveAttribute('href', '/panel')
  })
})
