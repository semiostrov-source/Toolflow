import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { InventoryPage } from './InventoryPage'

describe('InventoryPage', () => {
  it('renders the Inventory page header', () => {
    render(<InventoryPage />)

    expect(screen.getByRole('heading', { name: 'Inventory' })).toBeInTheDocument()
  })

  it('renders the inventory table header', () => {
    render(<InventoryPage />)

    expect(screen.getByRole('columnheader', { name: 'Name' })).toBeInTheDocument()
  })
})

