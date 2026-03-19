import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { App } from './App'

describe('App', () => {
  it('renders bottom navigation with all five tabs', () => {
    render(
      <MemoryRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
        <App />
      </MemoryRouter>,
    )

    const nav = screen.getByRole('navigation', { name: 'Main navigation' })
    expect(nav).toBeInTheDocument()

    expect(screen.getByRole('link', { name: /All items/ })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /My items/ })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /Create/ })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /Info/ })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /Panel/ })).toBeInTheDocument()
  })

  it('renders inventory page at default route', () => {
    render(
      <MemoryRouter initialEntries={['/']} future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
        <App />
      </MemoryRouter>,
    )

    expect(screen.getByRole('heading', { name: 'Inventory' })).toBeInTheDocument()
  })
})
