import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { InventoryToolbar } from './InventoryToolbar'

describe('InventoryToolbar', () => {
  it('renders a search input', () => {
    render(
      <InventoryToolbar searchQuery="" onSearchChange={() => {}} />,
    )

    expect(screen.getByPlaceholderText('Search items')).toBeInTheDocument()
  })

  it('renders an "Add Item" button', () => {
    render(
      <InventoryToolbar searchQuery="" onSearchChange={() => {}} />,
    )

    expect(screen.getByRole('button', { name: 'Add Item' })).toBeInTheDocument()
  })
})

