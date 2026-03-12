import { describe, it, expect } from 'vitest'
import { render, screen, within } from '@testing-library/react'
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
})

