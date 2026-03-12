import { describe, it, expect } from 'vitest'
import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import { InventoryPage } from './InventoryPage'
import { mockItems } from '../features/inventory/mock/items'

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
      screen.getByRole('heading', { name: /Cardboard Box/ }),
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

  it('filters items by name using the search input', async () => {
    renderInventoryPage()
    const user = userEvent.setup()

    // All items are visible before searching
    expect(screen.getByText('Cardboard Box')).toBeInTheDocument()
    expect(screen.getByText('Shipping Label')).toBeInTheDocument()
    expect(screen.getByText('Packing Tape')).toBeInTheDocument()

    const searchInput = screen.getByPlaceholderText('Search items')

    await user.type(searchInput, 'card')

    // Cardboard Box (name contains "card") remains visible
    expect(await screen.findByText('Cardboard Box')).toBeInTheDocument()

    // Other items are filtered out
    expect(screen.queryByText('Shipping Label')).not.toBeInTheDocument()
    expect(screen.queryByText('Packing Tape')).not.toBeInTheDocument()

    // Non-empty state should not show the empty message
    expect(
      screen.queryByText('No inventory items yet'),
    ).not.toBeInTheDocument()
  })

  it('filters items by SKU when searching', async () => {
    renderInventoryPage()
    const user = userEvent.setup()

    const searchInput = screen.getByPlaceholderText('Search items')

    await user.type(searchInput, 'BOX')

    // Matching SKU keeps Cardboard Box visible
    expect(await screen.findByText('Cardboard Box')).toBeInTheDocument()
    expect(screen.getByText('BOX-001')).toBeInTheDocument()

    // Non-matching items are filtered out
    expect(screen.queryByText('Shipping Label')).not.toBeInTheDocument()
    expect(screen.queryByText('Packing Tape')).not.toBeInTheDocument()
  })

  it('matches SKU search case-insensitively', async () => {
    renderInventoryPage()
    const user = userEvent.setup()

    const searchInput = screen.getByPlaceholderText('Search items')

    await user.type(searchInput, 'box-001')

    // Even with different casing, the SKU still matches
    expect(await screen.findByText('Cardboard Box')).toBeInTheDocument()
    expect(screen.getByText('BOX-001')).toBeInTheDocument()
  })

  it('shows the empty table state when no items match the search', async () => {
    renderInventoryPage()
    const user = userEvent.setup()

    const searchInput = screen.getByPlaceholderText('Search items')

    await user.type(searchInput, 'no-matching-item-query')

    // All item rows are gone
    expect(screen.queryByText('Cardboard Box')).not.toBeInTheDocument()
    expect(screen.queryByText('Shipping Label')).not.toBeInTheDocument()
    expect(screen.queryByText('Packing Tape')).not.toBeInTheDocument()

    // InventoryTable reuses its existing empty-state message
    expect(
      await screen.findByText('No inventory items yet'),
    ).toBeInTheDocument()
  })

  it('clears the selected item when it is filtered out of the table', async () => {
    renderInventoryPage()
    const user = userEvent.setup()

    // Select an item to populate the details panel
    const cardBoardRow = screen.getByText('Cardboard Box').closest('tr')
    expect(cardBoardRow).not.toBeNull()

    const viewButton = within(cardBoardRow as HTMLTableRowElement).getByRole(
      'button',
      { name: 'View' },
    )

    await user.click(viewButton)

    // Sanity check: details panel shows the selected item
    expect(
      screen.queryByText('Select an inventory item to view details'),
    ).not.toBeInTheDocument()
    expect(
      screen.getByRole('heading', { name: /Cardboard Box/ }),
    ).toBeInTheDocument()

    // Apply a search that removes the selected item from the table
    const searchInput = screen.getByPlaceholderText('Search items')
    await user.clear(searchInput)
    await user.type(searchInput, 'label')

    // The selected item row should no longer be present
    expect(screen.queryByText('Cardboard Box')).not.toBeInTheDocument()

    // The details panel returns to its empty state
    expect(
      await screen.findByText('Select an inventory item to view details'),
    ).toBeInTheDocument()

    // No row remains selected
    const selectedRow = document.querySelector(
      '.inventory-table-row--selected',
    )
    expect(selectedRow).toBeNull()
  })

  it('sorts items by Name ascending and descending', async () => {
    renderInventoryPage()
    const user = userEvent.setup()

    const sortFieldSelect = screen.getByLabelText('Sort by')
    const sortDirectionSelect = screen.getByLabelText('Direction')

    const expectedAscNames = [...mockItems]
      .sort((a, b) => a.name.localeCompare(b.name))
      .map((item) => item.name)

    const expectedDescNames = [...expectedAscNames].reverse()

    // Name ascending
    await user.selectOptions(sortFieldSelect, 'name')
    await user.selectOptions(sortDirectionSelect, 'asc')

    const tableAsc = screen.getByRole('table')
    const rowsAsc = within(tableAsc).getAllByRole('row').slice(1)
    const namesAsc = rowsAsc.map(
      (row) => row.querySelector('td')?.textContent?.trim() ?? '',
    )

    expect(namesAsc).toEqual(expectedAscNames)

    // Name descending
    await user.selectOptions(sortFieldSelect, 'name')
    await user.selectOptions(sortDirectionSelect, 'desc')

    const tableDesc = screen.getByRole('table')
    const rowsDesc = within(tableDesc).getAllByRole('row').slice(1)
    const namesDesc = rowsDesc.map(
      (row) => row.querySelector('td')?.textContent?.trim() ?? '',
    )

    expect(namesDesc).toEqual(expectedDescNames)
  })

  it('sorts items by Created ascending and descending', async () => {
    renderInventoryPage()
    const user = userEvent.setup()

    const sortFieldSelect = screen.getByLabelText('Sort by')
    const sortDirectionSelect = screen.getByLabelText('Direction')

    const expectedAscNamesByCreated = [...mockItems]
      .sort(
        (a, b) =>
          new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
      )
      .map((item) => item.name)

    const expectedDescNamesByCreated = [...expectedAscNamesByCreated].reverse()

    // Created ascending
    await user.selectOptions(sortFieldSelect, 'created')
    await user.selectOptions(sortDirectionSelect, 'asc')

    const tableAsc = screen.getByRole('table')
    const rowsAsc = within(tableAsc).getAllByRole('row').slice(1)
    const namesAsc = rowsAsc.map(
      (row) => row.querySelector('td')?.textContent?.trim() ?? '',
    )

    expect(namesAsc).toEqual(expectedAscNamesByCreated)

    // Created descending
    await user.selectOptions(sortFieldSelect, 'created')
    await user.selectOptions(sortDirectionSelect, 'desc')

    const tableDesc = screen.getByRole('table')
    const rowsDesc = within(tableDesc).getAllByRole('row').slice(1)
    const namesDesc = rowsDesc.map(
      (row) => row.querySelector('td')?.textContent?.trim() ?? '',
    )

    expect(namesDesc).toEqual(expectedDescNamesByCreated)
  })

  it('keeps selected item selected after sorting when still present', async () => {
    renderInventoryPage()
    const user = userEvent.setup()

    // Select Cardboard Box
    const cardBoardRow = screen.getByText('Cardboard Box').closest('tr')
    expect(cardBoardRow).not.toBeNull()

    const viewButton = within(cardBoardRow as HTMLTableRowElement).getByRole(
      'button',
      { name: 'View' },
    )

    await user.click(viewButton)

    const sortFieldSelect = screen.getByLabelText('Sort by')
    const sortDirectionSelect = screen.getByLabelText('Direction')

    // Change sort order
    await user.selectOptions(sortFieldSelect, 'name')
    await user.selectOptions(sortDirectionSelect, 'desc')

    // Cardboard Box should still be selected even if its row moved
    const table = screen.getByRole('table')
    const rows = within(table).getAllByRole('row').slice(1)
    const selectedRow = rows.find((row) =>
      row.textContent?.includes('Cardboard Box'),
    )

    expect(selectedRow).toBeTruthy()
    expect(selectedRow as HTMLElement).toHaveClass(
      'inventory-table-row--selected',
    )
  })
})

