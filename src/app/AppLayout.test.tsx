import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { MemoryRouter, Routes, Route } from 'react-router-dom'
import { AppLayout } from './AppLayout'

function OutletContent() {
  return <div>Outlet content</div>
}

describe('AppLayout', () => {
  it('renders Header and Sidebar', () => {
    render(
      <MemoryRouter initialEntries={['/']} future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
        <Routes>
          <Route path="/" element={<AppLayout />}>
            <Route index element={<OutletContent />} />
          </Route>
        </Routes>
      </MemoryRouter>,
    )
    expect(screen.getByText('ToolFlow')).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'Dashboard' })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'Inventory' })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'Warehouses' })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'Requests' })).toBeInTheDocument()
  })

  it('renders main area with Outlet content', () => {
    render(
      <MemoryRouter initialEntries={['/']} future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
        <Routes>
          <Route path="/" element={<AppLayout />}>
            <Route index element={<OutletContent />} />
          </Route>
        </Routes>
      </MemoryRouter>,
    )
    expect(screen.getByText('Outlet content')).toBeInTheDocument()
  })

  it('has app layout structure', () => {
    const { container } = render(
      <MemoryRouter initialEntries={['/']} future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
        <Routes>
          <Route path="/" element={<AppLayout />}>
            <Route index element={<OutletContent />} />
          </Route>
        </Routes>
      </MemoryRouter>,
    )
    expect(container.querySelector('.app')).toBeInTheDocument()
    expect(container.querySelector('.app-layout')).toBeInTheDocument()
    expect(container.querySelector('.app-main')).toBeInTheDocument()
  })
})
