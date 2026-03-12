import { describe, it, expect } from 'vitest'
import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import { InventoryPage } from './InventoryPage'

function renderInventoryPage() {
  return render(
    <MemoryRouter initialEntries={['/inventory']}>
      <InventoryPage />
    </MemoryRouter>,
  )
}

describe('InventoryPage', () => {
  it('renders the Inventory page header', () => {
    renderInventoryPage()

    expect(
      screen.getByRole('heading', { name: 'Inventory' }),
    ).toBeInTheDocument()
  })

  it('renders the inventory table header', () => {
    renderInventoryPage()

    expect(
      screen.getByRole('columnheader', { name: 'Name' }),
    ).toBeInTheDocument()
  })

  it('shows the empty details state before any item is selected', () => {
    renderInventoryPage()

    expect(
      screen.getByText('Select an inventory item to view details'),
    ).toBeInTheDocument()
  })

  it('shows item details and highlights the selected row when View is clicked', async () => {
    renderInventoryPage()
    const user = userEvent.setup()

    const cardBoardRow = screen.getByText('Cardboard Box').closest('tr')
    expect(cardBoardRow).not.toBeNull()

    const viewButton = within(cardBoardRow as HTMLTableRowElement).getByRole(
      'button',
      { name: 'View' },
    )

    await user.click(viewButton)

    expect(
      screen.queryByText('Select an inventory item to view details'),
    ).not.toBeInTheDocument()

    expect(
      screen.getByRole('heading', { name: 'Cardboard Box' }),
    ).toBeInTheDocument()
    expect(
      screen.getByText('SKU BOX-001 · pcs'),
    ).toBeInTheDocument()

    const createdDate = new Date('2025-12-01T10:15:00.000Z').toLocaleDateString()
    const detailsSection = screen
      .getByText('SKU BOX-001 · pcs')
      .closest('section') as HTMLElement | null

    expect(detailsSection).not.toBeNull()

    const details = within(detailsSection as HTMLElement)

    expect(details.getByText('Name')).toBeInTheDocument()
    expect(details.getByText('SKU')).toBeInTheDocument()
    expect(details.getByText('Unit')).toBeInTheDocument()
    expect(details.getByText('Created')).toBeInTheDocument()
    expect(details.getByText(createdDate)).toBeInTheDocument()

    expect(
      screen.getByText('Stock summary (placeholder)'),
    ).toBeInTheDocument()
    expect(
      screen.getByText('Recent movements (placeholder)'),
    ).toBeInTheDocument()

    const table = screen.getByRole('table')
    const rows = within(table).getAllByRole('row')
    const selectedRow = rows.find((row) =>
      row.textContent?.includes('Cardboard Box'),
    )

    expect(selectedRow).toBeTruthy()
    expect(selectedRow as HTMLElement).toHaveClass(
      'inventory-table-row--selected',
    )
  })
})

