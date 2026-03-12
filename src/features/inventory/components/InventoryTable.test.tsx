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

  it('renders a status badge next to each item name', () => {
    render(<InventoryTable />)

    const dataRows = screen.getAllByRole('row').slice(1)

    dataRows.forEach((row) => {
      const primaryCell = row.querySelector(
        '.inventory-table-cell--primary',
      ) as HTMLElement | null

      if (!primaryCell) return

      const badge = primaryCell.querySelector(
        '.status-badge',
      ) as HTMLElement | null

      expect(badge).not.toBeNull()
    })
  })

  it('applies the correct modifier class for a maintenance status', () => {
    render(<InventoryTable />)

    const maintenanceRow = screen
      .getByText('Electric Pallet Jack')
      .closest('tr') as HTMLTableRowElement | null

    expect(maintenanceRow).not.toBeNull()

    const primaryCell = maintenanceRow?.querySelector(
      '.inventory-table-cell--primary',
    ) as HTMLElement | null

    expect(primaryCell).not.toBeNull()

    const badge = primaryCell?.querySelector(
      '.status-badge',
    ) as HTMLElement | null

    expect(badge).not.toBeNull()
    expect(badge as HTMLElement).toHaveClass('status-badge--maintenance')
  })

  it('renders View and Edit actions for at least one row', () => {
    render(<InventoryTable />)

    const viewButtons = screen.getAllByRole('button', { name: 'View' })
    const editButtons = screen.getAllByRole('button', { name: 'Edit' })
    const moreButtons = screen.getAllByRole('button', { name: 'More' })

    expect(viewButtons.length).toBeGreaterThan(0)
    expect(editButtons.length).toBeGreaterThan(0)
    expect(moreButtons.length).toBeGreaterThan(0)
  })
})

