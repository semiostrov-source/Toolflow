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
    expect(screen.getByRole('button', { name: 'Move' })).toBeInTheDocument()
    expect(
      screen.getByRole('button', { name: 'Change status' }),
    ).toBeInTheDocument()
    expect(
      screen.getByRole('button', { name: 'Write off' }),
    ).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Clear' })).toBeInTheDocument()
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

