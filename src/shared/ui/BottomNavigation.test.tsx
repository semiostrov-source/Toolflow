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

    expect(screen.getByRole('link', { name: /All items/ })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /My items/ })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /Create/ })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /Info/ })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /Panel/ })).toBeInTheDocument()
  })

  it('highlights the active tab', () => {
    render(
      <MemoryRouter initialEntries={['/inventory']} future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
        <BottomNavigation />
      </MemoryRouter>,
    )

    const allItemsLink = screen.getByRole('link', { name: /All items/ })
    expect(allItemsLink).toHaveClass('bottom-nav__tab--active')
  })

  it('links point to correct routes', () => {
    render(
      <MemoryRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
        <BottomNavigation />
      </MemoryRouter>,
    )

    expect(screen.getByRole('link', { name: /All items/ })).toHaveAttribute('href', '/inventory')
    expect(screen.getByRole('link', { name: /My items/ })).toHaveAttribute('href', '/my-items')
    expect(screen.getByRole('link', { name: /Create/ })).toHaveAttribute('href', '/create')
    expect(screen.getByRole('link', { name: /Info/ })).toHaveAttribute('href', '/info')
    expect(screen.getByRole('link', { name: /Panel/ })).toHaveAttribute('href', '/panel')
  })
})
