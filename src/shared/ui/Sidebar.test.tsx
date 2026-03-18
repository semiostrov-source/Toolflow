import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { Sidebar } from './Sidebar'

describe('Sidebar', () => {
  it('renders all four nav links', () => {
    render(
      <MemoryRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
        <Sidebar />
      </MemoryRouter>,
    )
    expect(screen.getByRole('link', { name: 'Dashboard' })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'Inventory' })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'Warehouses' })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'Requests' })).toBeInTheDocument()
  })

  it('marks Dashboard link as active at /', () => {
    render(
      <MemoryRouter initialEntries={['/']} future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
        <Sidebar />
      </MemoryRouter>,
    )
    const dashboardLink = screen.getByRole('link', { name: 'Dashboard' })
    expect(dashboardLink).toHaveClass('active')
  })

  it('marks Inventory link as active at /inventory', () => {
    render(
      <MemoryRouter initialEntries={['/inventory']} future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
        <Sidebar />
      </MemoryRouter>,
    )
    const inventoryLink = screen.getByRole('link', { name: 'Inventory' })
    expect(inventoryLink).toHaveClass('active')
  })

  it('marks Warehouses link as active at /warehouses', () => {
    render(
      <MemoryRouter initialEntries={['/warehouses']} future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
        <Sidebar />
      </MemoryRouter>,
    )
    const warehousesLink = screen.getByRole('link', { name: 'Warehouses' })
    expect(warehousesLink).toHaveClass('active')
  })

  it('marks Requests link as active at /requests', () => {
    render(
      <MemoryRouter initialEntries={['/requests']} future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
        <Sidebar />
      </MemoryRouter>,
    )
    const requestsLink = screen.getByRole('link', { name: 'Requests' })
    expect(requestsLink).toHaveClass('active')
  })

  it('has sidebar landmark with aria-label', () => {
    render(
      <MemoryRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
        <Sidebar />
      </MemoryRouter>,
    )
    expect(screen.getByRole('complementary', { name: 'Sidebar navigation' })).toBeInTheDocument()
  })
})
