import { describe, it, expect, vi } from 'vitest'
import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { InventoryDetailsPanel } from './InventoryDetailsPanel'
import { mockItems } from '../mock/items'

describe('InventoryDetailsPanel', () => {
  it('renders a status badge in the header when an item is selected', () => {
    const item = mockItems.find(
      (mockItem) => mockItem.name === 'Electric Pallet Jack',
    )

    expect(item).toBeDefined()

    render(<InventoryDetailsPanel item={item ?? null} />)

    const headerTitle = screen.getByRole('heading', {
      name: /Electric Pallet Jack/,
    })

    const header = headerTitle.closest(
      '.inventory-details-title',
    ) as HTMLElement | null

    expect(header).not.toBeNull()

    const badge = within(header as HTMLElement).getByTitle('Maintenance')

    expect(badge).toHaveClass('status-badge')
  })

  it('renders a close button and calls onClose when clicked', async () => {
    const user = userEvent.setup()
    const item = mockItems.find(
      (mockItem) => mockItem.name === 'Electric Pallet Jack',
    )

    expect(item).toBeDefined()

    const handleClose = vi.fn()

    render(<InventoryDetailsPanel item={item ?? null} onClose={handleClose} />)

    const closeButton = screen.getByRole('button', {
      name: 'Close details panel',
    })

    expect(closeButton).toBeInTheDocument()

    await user.click(closeButton)

    expect(handleClose).toHaveBeenCalledTimes(1)
  })
})

