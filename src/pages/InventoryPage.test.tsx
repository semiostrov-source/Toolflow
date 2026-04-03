import { describe, it, expect } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { InventoryPage } from './InventoryPage'
import { mockItems } from '../features/inventory'

function renderInventoryPage() {
  return render(<InventoryPage />)
}

describe('InventoryPage', () => {
  it('renders the heading "Все инструменты"', () => {
    renderInventoryPage()

    expect(
      screen.getByRole('heading', { name: 'Все инструменты' }),
    ).toBeInTheDocument()
  })

  it('renders a search input with placeholder "Поиск..."', () => {
    renderInventoryPage()

    expect(screen.getByPlaceholderText('Поиск...')).toBeInTheDocument()
  })

  it('renders a ToolCard for each mock item', () => {
    renderInventoryPage()

    for (const item of mockItems) {
      expect(screen.getByText(item.name)).toBeInTheDocument()
    }
  })

  it('filters items when typing in the search input', () => {
    renderInventoryPage()

    const searchInput = screen.getByPlaceholderText('Поиск...')

    fireEvent.change(searchInput, { target: { value: 'card' } })

    expect(screen.getByText('Cardboard Box')).toBeInTheDocument()
    expect(screen.queryByText('Shipping Label')).not.toBeInTheDocument()
    expect(screen.queryByText('Packing Tape')).not.toBeInTheDocument()
  })

  it('shows "Ничего не найдено" when no items match the search', () => {
    renderInventoryPage()

    const searchInput = screen.getByPlaceholderText('Поиск...')

    fireEvent.change(searchInput, { target: { value: 'zzz-no-match-zzz' } })

    expect(screen.getByText('Ничего не найдено')).toBeInTheDocument()
    expect(screen.queryByText('Cardboard Box')).not.toBeInTheDocument()
  })
})
