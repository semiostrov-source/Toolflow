import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { InventoryFilters } from './InventoryFilters'

describe('InventoryFilters', () => {
  it('renders the Warehouse select by label', () => {
    render(<InventoryFilters />)

    expect(screen.getByLabelText('Warehouse')).toBeInTheDocument()
  })

  it('renders the Unit select by label', () => {
    render(<InventoryFilters />)

    expect(screen.getByLabelText('Unit')).toBeInTheDocument()
  })

  it('renders default options for warehouse and unit', () => {
    render(<InventoryFilters />)

    expect(
      screen.getByRole('option', { name: 'All warehouses' }),
    ).toBeInTheDocument()
    expect(screen.getByRole('option', { name: 'All units' })).toBeInTheDocument()
  })
})

