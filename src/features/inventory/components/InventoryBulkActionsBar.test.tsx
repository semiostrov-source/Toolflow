import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { InventoryBulkActionsBar } from './InventoryBulkActionsBar'

describe('InventoryBulkActionsBar', () => {
  it('renders 0 items selected when selectedCount is 0', () => {
    render(
      <InventoryBulkActionsBar
        selectedCount={0}
        onClearSelection={() => {}}
        selectedStatus=""
        onStatusChange={() => {}}
        onApplyStatusChange={() => {}}
      />,
    )

    expect(screen.getByText('0 items selected')).toBeInTheDocument()
  })

  it('renders with the correct selected count when selectedCount > 0', () => {
    render(
      <InventoryBulkActionsBar
        selectedCount={3}
        onClearSelection={() => {}}
        selectedStatus=""
        onStatusChange={() => {}}
        onApplyStatusChange={() => {}}
      />,
    )

    expect(screen.getByText('3 items selected')).toBeInTheDocument()

    const moveButton = screen.getByRole('button', { name: 'Move' })
    const writeOffButton = screen.getByRole('button', { name: 'Write off' })
    const clearButton = screen.getByRole('button', { name: 'Clear selection' })

    expect(moveButton).toBeInTheDocument()
    expect(moveButton).toBeDisabled()
    expect(moveButton).toHaveAttribute('aria-disabled', 'true')
    expect(moveButton).toHaveClass('inventory-action-disabled')

    expect(writeOffButton).toBeInTheDocument()
    expect(writeOffButton).toBeDisabled()
    expect(writeOffButton).toHaveAttribute('aria-disabled', 'true')
    expect(writeOffButton).toHaveClass('inventory-action-disabled')

    expect(clearButton).toBeInTheDocument()
    expect(clearButton).not.toBeDisabled()
    expect(clearButton).not.toHaveAttribute('aria-disabled', 'true')
  })

  it('renders Change status controls and keeps Apply disabled when no status is selected', () => {
    render(
      <InventoryBulkActionsBar
        selectedCount={2}
        onClearSelection={() => {}}
        selectedStatus=""
        onStatusChange={() => {}}
        onApplyStatusChange={() => {}}
      />,
    )

    const changeStatusLabel = screen.getByText('Change status:')
    expect(changeStatusLabel).toBeInTheDocument()

    const changeStatusContainer = changeStatusLabel.closest(
      '.inventory-bulk-actions-change-status',
    ) as HTMLElement | null
    expect(changeStatusContainer).not.toBeNull()

    const select = changeStatusContainer?.querySelector(
      'select.inventory-bulk-status-select',
    ) as HTMLSelectElement | null
    expect(select).not.toBeNull()
    expect(select?.value).toBe('')

    const applyButton = screen.getByRole('button', { name: 'Apply' })
    expect(applyButton).toBeInTheDocument()
    expect(applyButton).toBeDisabled()
  })

  it('calls onClearSelection when "Clear selection" is clicked', async () => {
    const user = userEvent.setup()
    const onClearSelection = vi.fn()

    render(
      <InventoryBulkActionsBar
        selectedCount={2}
        onClearSelection={onClearSelection}
        selectedStatus="available"
        onStatusChange={() => {}}
        onApplyStatusChange={() => {}}
      />,
    )

    const clearButton = screen.getByRole('button', { name: 'Clear selection' })

    await user.click(clearButton)

    expect(onClearSelection).toHaveBeenCalledTimes(1)
  })
})
