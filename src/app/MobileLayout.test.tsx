import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { MemoryRouter, Routes, Route } from 'react-router-dom'
import { MobileLayout } from './MobileLayout'

function OutletContent() {
  return <div>Test child content</div>
}

describe('MobileLayout', () => {
  it('renders bottom navigation', () => {
    render(
      <MemoryRouter initialEntries={['/']} future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
        <Routes>
          <Route path="/" element={<MobileLayout />}>
            <Route index element={<OutletContent />} />
          </Route>
        </Routes>
      </MemoryRouter>,
    )

    expect(screen.getByRole('navigation', { name: 'Main navigation' })).toBeInTheDocument()
  })

  it('renders child route content', () => {
    render(
      <MemoryRouter initialEntries={['/']} future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
        <Routes>
          <Route path="/" element={<MobileLayout />}>
            <Route index element={<OutletContent />} />
          </Route>
        </Routes>
      </MemoryRouter>,
    )

    expect(screen.getByText('Test child content')).toBeInTheDocument()
  })
})
