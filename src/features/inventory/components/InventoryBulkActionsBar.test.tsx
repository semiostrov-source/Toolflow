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
      />,
    )

    expect(screen.getByText('0 items selected')).toBeInTheDocument()
  })

  it('renders with the correct selected count when selectedCount > 0', () => {
    render(
      <InventoryBulkActionsBar
        selectedCount={3}
        onClearSelection={() => {}}
      />,
    )

    expect(screen.getByText('3 items selected')).toBeInTheDocument()
    const moveButton = screen.getByRole('button', { name: 'Move' })
    const changeStatusButton = screen.getByRole('button', {
      name: 'Change status',
    })
    const writeOffButton = screen.getByRole('button', { name: 'Write off' })
    const clearButton = screen.getByRole('button', { name: 'Clear' })

    expect(moveButton).toBeInTheDocument()
    expect(moveButton).toBeDisabled()
    expect(moveButton).toHaveAttribute('aria-disabled', 'true')
    expect(moveButton).toHaveClass('inventory-action-disabled')

    expect(changeStatusButton).toBeInTheDocument()
    expect(changeStatusButton).toBeDisabled()
    expect(changeStatusButton).toHaveAttribute('aria-disabled', 'true')
    expect(changeStatusButton).toHaveClass('inventory-action-disabled')

    expect(writeOffButton).toBeInTheDocument()
    expect(writeOffButton).toBeDisabled()
    expect(writeOffButton).toHaveAttribute('aria-disabled', 'true')
    expect(writeOffButton).toHaveClass('inventory-action-disabled')

    expect(clearButton).toBeInTheDocument()
    expect(clearButton).not.toBeDisabled()
    expect(clearButton).not.toHaveAttribute('aria-disabled', 'true')
  })

  it('calls onClearSelection when Clear is clicked', async () => {
    const user = userEvent.setup()
    const onClearSelection = vi.fn()

    render(
      <InventoryBulkActionsBar
        selectedCount={2}
        onClearSelection={onClearSelection}
      />,
    )

    const clearButton = screen.getByRole('button', { name: 'Clear' })

    await user.click(clearButton)

    expect(onClearSelection).toHaveBeenCalledTimes(1)
  })
})

