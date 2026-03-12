import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { DashboardPage } from './DashboardPage'

describe('DashboardPage', () => {
  it('renders the page header title', () => {
    render(<DashboardPage />)

    expect(
      screen.getByRole('heading', { name: 'Dashboard' }),
    ).toBeInTheDocument()
  })

  it('renders the placeholder page section content', () => {
    render(<DashboardPage />)

    expect(
      screen.getByText(
        /This dashboard will show key inventory and movement metrics once the core workflows are in place\./i,
      ),
    ).toBeInTheDocument()
  })
})

