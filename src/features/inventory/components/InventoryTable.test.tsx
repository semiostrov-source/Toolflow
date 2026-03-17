import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
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

  it('makes each data row keyboard-focusable via tabIndex', () => {
    render(<InventoryTable />)

    const table = screen.getByRole('table')
    const dataRows = within(table).getAllByRole('row').slice(1)

    dataRows.forEach((row) => {
      expect(row).toHaveAttribute('tabindex', '0')
    })
  })

  it('header checkbox has an accessible name for select-all/clear-all', () => {
    render(<InventoryTable />)

    const headerCheckbox = screen.getByRole('checkbox', {
      name: 'Select or clear all visible inventory rows',
    })
    expect(headerCheckbox).toBeInTheDocument()
  })

  it('row checkboxes have accessible names tied to the item', () => {
    render(<InventoryTable />)

    const rowCheckbox = screen.getByRole('checkbox', {
      name: 'Select Cardboard Box',
    })
    expect(rowCheckbox).toBeInTheDocument()
  })

  it('toggles bulk selection for a row when pressing Enter and Space on the focused row', async () => {
    const user = userEvent.setup()
    const onToggleBulkSelect = vi.fn()

    render(<InventoryTable onToggleBulkSelect={onToggleBulkSelect} />)

    const table = screen.getByRole('table')
    const rows = within(table).getAllByRole('row').slice(1)
    const cardboardRow = rows.find((row) =>
      within(row).queryByText('Cardboard Box'),
    ) as HTMLTableRowElement | undefined

    expect(cardboardRow).toBeDefined()

    cardboardRow!.focus()
    expect(cardboardRow).toHaveFocus()

    // Press Enter on the focused row and assert a single toggle
    await user.keyboard('{Enter}')
    expect(onToggleBulkSelect).toHaveBeenCalledTimes(1)
    expect(onToggleBulkSelect).toHaveBeenNthCalledWith(1, 'item-1')

    // Ensure the row is still focused before pressing Space
    cardboardRow!.focus()
    expect(cardboardRow).toHaveFocus()

    // Press Space on the focused row using fireEvent
    fireEvent.keyDown(cardboardRow!, { key: ' ', code: 'Space' })

    expect(onToggleBulkSelect).toHaveBeenCalledTimes(2)
    expect(onToggleBulkSelect).toHaveBeenNthCalledWith(2, 'item-1')
  })
})

