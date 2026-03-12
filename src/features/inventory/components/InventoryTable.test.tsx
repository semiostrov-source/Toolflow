import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { InventoryTable } from './InventoryTable'

describe('InventoryTable', () => {
  it('renders table headers', () => {
    render(<InventoryTable />)

    expect(screen.getByRole('columnheader', { name: 'Name' })).toBeInTheDocument()
    expect(screen.getByRole('columnheader', { name: 'SKU' })).toBeInTheDocument()
    expect(screen.getByRole('columnheader', { name: 'Unit' })).toBeInTheDocument()
    expect(screen.getByRole('columnheader', { name: 'Created' })).toBeInTheDocument()
    expect(
      screen.getByRole('columnheader', { name: 'Actions' }),
    ).toBeInTheDocument()
  })

  it('renders rows for mock items', () => {
    render(<InventoryTable />)

    expect(screen.getByText('Cardboard Box')).toBeInTheDocument()
    expect(screen.getByText('BOX-001')).toBeInTheDocument()

    expect(screen.getByText('Shipping Label')).toBeInTheDocument()
    expect(screen.getByText('LBL-010')).toBeInTheDocument()

    expect(screen.getByText('Packing Tape')).toBeInTheDocument()
    expect(screen.getByText('TAPE-004')).toBeInTheDocument()

    // Non-empty state should not show the empty message
    expect(screen.queryByText('No inventory items yet')).not.toBeInTheDocument()
  })

  it('renders View and Edit actions for at least one row', () => {
    render(<InventoryTable />)

    expect(screen.getByRole('button', { name: 'View' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Edit' })).toBeInTheDocument()
  })
})

