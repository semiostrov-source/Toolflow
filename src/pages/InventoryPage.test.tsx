import { describe, it, expect, vi, afterEach } from 'vitest'
import { render, screen, within, act, fireEvent } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import { InventoryPage } from './InventoryPage'
import { mockItems } from '../features/inventory'

function renderInventoryPage() {
  return render(
    <MemoryRouter initialEntries={['/inventory']}>
      <InventoryPage />
    </MemoryRouter>,
  )
}

afterEach(() => {
  vi.useRealTimers()
})

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

  it('renders View, Edit, and More actions for at least one row', () => {
    renderInventoryPage()

    const cardBoardRow = screen.getByText('Cardboard Box').closest('tr')
    expect(cardBoardRow).not.toBeNull()

    const row = cardBoardRow as HTMLTableRowElement

    expect(
      within(row).getByRole('button', { name: 'View' }),
    ).toBeInTheDocument()
    expect(
      within(row).getByRole('button', { name: 'Edit' }),
    ).toBeInTheDocument()
    expect(
      within(row).getByRole('button', { name: 'More' }),
    ).toBeInTheDocument()
  })

  it('shows the empty details state before any item is selected', () => {
    renderInventoryPage()

    expect(
      screen.getByText('Select an inventory item to view details'),
    ).toBeInTheDocument()
  })

  it('closes the details panel when the close button is clicked', async () => {
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
      screen.getByRole('heading', { name: /Cardboard Box/i }),
    ).toBeInTheDocument()

    const closeButton = screen.getByRole('button', {
      name: 'Close details panel',
    })

    await user.click(closeButton)

    expect(
      screen.queryByRole('heading', { name: /Cardboard Box/i }),
    ).not.toBeInTheDocument()
    expect(
      screen.getByText('Select an inventory item to view details'),
    ).toBeInTheDocument()
  })

  it('closes the details panel when Escape is pressed', async () => {
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
      screen.getByRole('heading', { name: /Cardboard Box/i }),
    ).toBeInTheDocument()

    await user.keyboard('{Escape}')

    expect(
      screen.queryByRole('heading', { name: /Cardboard Box/i }),
    ).not.toBeInTheDocument()
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

  it('shows item details when a row is clicked', async () => {
    renderInventoryPage()
    const user = userEvent.setup()

    const cardBoardRow = screen.getByText('Cardboard Box').closest('tr')
    expect(cardBoardRow).not.toBeNull()

    await user.click(cardBoardRow as HTMLTableRowElement)

    expect(
      screen.queryByText('Select an inventory item to view details'),
    ).not.toBeInTheDocument()

    expect(
      screen.getByRole('heading', { name: /Cardboard Box/ }),
    ).toBeInTheDocument()
  })

  it('does not open item details when the row checkbox is clicked', async () => {
    renderInventoryPage()
    const user = userEvent.setup()

    expect(
      screen.getByText('Select an inventory item to view details'),
    ).toBeInTheDocument()

    const checkbox = screen.getByRole('checkbox', {
      name: 'Select Cardboard Box',
    })

    await user.click(checkbox)

    expect(
      screen.getByText('Select an inventory item to view details'),
    ).toBeInTheDocument()
    expect(
      screen.queryByRole('heading', { name: /Cardboard Box/ }),
    ).not.toBeInTheDocument()
  })

  it('filters items by name using the search input with debounced search', async () => {
    vi.useFakeTimers()
    renderInventoryPage()

    // All items are visible before searching
    expect(screen.getByText('Cardboard Box')).toBeInTheDocument()
    expect(screen.getByText('Shipping Label')).toBeInTheDocument()
    expect(screen.getByText('Packing Tape')).toBeInTheDocument()

    const searchInput = screen.getByPlaceholderText('Search items')

    fireEvent.change(searchInput, { target: { value: 'card' } })

    // Before the debounce delay elapses, all items are still visible
    expect(screen.getByText('Cardboard Box')).toBeInTheDocument()
    expect(screen.getByText('Shipping Label')).toBeInTheDocument()
    expect(screen.getByText('Packing Tape')).toBeInTheDocument()

    await act(async () => {
      vi.advanceTimersByTime(300)
    })

    // Cardboard Box (name contains "card") remains visible
    expect(screen.getByText('Cardboard Box')).toBeInTheDocument()

    // Other items are filtered out
    expect(screen.queryByText('Shipping Label')).not.toBeInTheDocument()
    expect(screen.queryByText('Packing Tape')).not.toBeInTheDocument()

    // Non-empty state should not show the empty message
    expect(
      screen.queryByText('No inventory items yet'),
    ).not.toBeInTheDocument()
  })

  it('clears the search input and restores all items when Escape is pressed in the search field', async () => {
    vi.useFakeTimers()
    renderInventoryPage()

    const searchInput = screen.getByPlaceholderText('Search items')

    fireEvent.change(searchInput, { target: { value: 'card' } })

    await act(async () => {
      vi.advanceTimersByTime(300)
    })

    // Cardboard Box (name contains "card") remains visible
    expect(screen.getByText('Cardboard Box')).toBeInTheDocument()

    // Other items are filtered out
    expect(screen.queryByText('Shipping Label')).not.toBeInTheDocument()
    expect(screen.queryByText('Packing Tape')).not.toBeInTheDocument()

    fireEvent.keyDown(searchInput, { key: 'Escape', code: 'Escape' })

    await act(async () => {
      vi.advanceTimersByTime(300)
    })

    expect(searchInput).toHaveValue('')

    // All items are visible again after clearing
    expect(screen.getByText('Cardboard Box')).toBeInTheDocument()
    expect(screen.getByText('Shipping Label')).toBeInTheDocument()
    expect(screen.getByText('Packing Tape')).toBeInTheDocument()

    // The empty table state should not be shown
    expect(
      screen.queryByText('No inventory items yet'),
    ).not.toBeInTheDocument()
  })

  it('shows and uses a clear button for the search input', async () => {
    vi.useFakeTimers()
    renderInventoryPage()

    const searchInput = screen.getByPlaceholderText('Search items')

    // Initially, the clear button is not rendered
    expect(
      screen.queryByRole('button', { name: 'Clear search' }),
    ).not.toBeInTheDocument()

    fireEvent.change(searchInput, { target: { value: 'card' } })

    // Clear button appears when there is a non-empty query
    const clearButton = screen.getByRole('button', { name: 'Clear search' })
    expect(clearButton).toBeInTheDocument()

    fireEvent.click(clearButton)

    // Input value is cleared immediately
    expect(searchInput).toHaveValue('')

    await act(async () => {
      vi.advanceTimersByTime(300)
    })

    // After debounce, all baseline items are visible again
    expect(screen.getByText('Cardboard Box')).toBeInTheDocument()
    expect(screen.getByText('Shipping Label')).toBeInTheDocument()
    expect(screen.getByText('Packing Tape')).toBeInTheDocument()
    expect(
      screen.queryByText('No inventory items yet'),
    ).not.toBeInTheDocument()
  })

  it('filters items by SKU when searching', async () => {
    vi.useFakeTimers()
    renderInventoryPage()

    // All items are visible before searching
    expect(screen.getByText('Cardboard Box')).toBeInTheDocument()
    expect(screen.getByText('Shipping Label')).toBeInTheDocument()
    expect(screen.getByText('Packing Tape')).toBeInTheDocument()

    const searchInput = screen.getByPlaceholderText('Search items')

    fireEvent.change(searchInput, { target: { value: 'BOX' } })

    // Before the debounce delay elapses, all items are still visible
    expect(screen.getByText('Cardboard Box')).toBeInTheDocument()
    expect(screen.getByText('Shipping Label')).toBeInTheDocument()
    expect(screen.getByText('Packing Tape')).toBeInTheDocument()

    await act(async () => {
      vi.advanceTimersByTime(300)
    })

    // Matching SKU keeps Cardboard Box visible
    expect(screen.getByText('Cardboard Box')).toBeInTheDocument()
    expect(screen.getByText('BOX-001')).toBeInTheDocument()

    // Non-matching items are filtered out
    expect(screen.queryByText('Shipping Label')).not.toBeInTheDocument()
    expect(screen.queryByText('Packing Tape')).not.toBeInTheDocument()
  })

  it('matches SKU search case-insensitively', async () => {
    vi.useFakeTimers()
    renderInventoryPage()

    // All items are visible before searching
    expect(screen.getByText('Cardboard Box')).toBeInTheDocument()
    expect(screen.getByText('Shipping Label')).toBeInTheDocument()
    expect(screen.getByText('Packing Tape')).toBeInTheDocument()

    const searchInput = screen.getByPlaceholderText('Search items')

    fireEvent.change(searchInput, { target: { value: 'box-001' } })

    // Before the debounce delay elapses, all items are still visible
    expect(screen.getByText('Cardboard Box')).toBeInTheDocument()
    expect(screen.getByText('Shipping Label')).toBeInTheDocument()
    expect(screen.getByText('Packing Tape')).toBeInTheDocument()

    await act(async () => {
      vi.advanceTimersByTime(300)
    })

    // Even with different casing, the SKU still matches
    expect(screen.getByText('Cardboard Box')).toBeInTheDocument()
    expect(screen.getByText('BOX-001')).toBeInTheDocument()
  })

  it('shows the empty table state when no items match the search', async () => {
    vi.useFakeTimers()
    renderInventoryPage()

    const searchInput = screen.getByPlaceholderText('Search items')

    fireEvent.change(searchInput, {
      target: { value: 'no-matching-item-query' },
    })

    // Before the debounce delay elapses, all items are still visible
    expect(screen.getByText('Cardboard Box')).toBeInTheDocument()
    expect(screen.getByText('Shipping Label')).toBeInTheDocument()
    expect(screen.getByText('Packing Tape')).toBeInTheDocument()

    await act(async () => {
      vi.advanceTimersByTime(300)
    })

    // All item rows are gone
    expect(screen.queryByText('Cardboard Box')).not.toBeInTheDocument()
    expect(screen.queryByText('Shipping Label')).not.toBeInTheDocument()
    expect(screen.queryByText('Packing Tape')).not.toBeInTheDocument()

    // InventoryTable reuses its existing empty-state message
    expect(screen.getByText('No inventory items yet')).toBeInTheDocument()

    // Contextual empty state shows a clear search action
    const emptyActions = document.querySelector(
      '.inventory-table-empty-actions',
    ) as HTMLElement
    expect(emptyActions).not.toBeNull()
    expect(
      within(emptyActions).getByRole('button', { name: 'Clear search' }),
    ).toBeInTheDocument()
  })

  it('clears search from the contextual empty state and restores all items', async () => {
    vi.useFakeTimers()
    renderInventoryPage()

    const searchInput = screen.getByPlaceholderText('Search items')

    fireEvent.change(searchInput, {
      target: { value: 'no-matching-item-query' },
    })

    await act(async () => {
      vi.advanceTimersByTime(300)
    })

    // Sanity check: table is in filtered empty state
    expect(screen.queryByText('Cardboard Box')).not.toBeInTheDocument()
    expect(screen.queryByText('Shipping Label')).not.toBeInTheDocument()
    expect(screen.queryByText('Packing Tape')).not.toBeInTheDocument()
    expect(screen.getByText('No inventory items yet')).toBeInTheDocument()

    const emptyActions = document.querySelector(
      '.inventory-table-empty-actions',
    ) as HTMLElement
    expect(emptyActions).not.toBeNull()
    const clearFiltersButton = within(emptyActions).getByRole('button', {
      name: 'Clear search',
    })

    fireEvent.click(clearFiltersButton)

    // Search input is cleared immediately
    expect(searchInput).toHaveValue('')

    await act(async () => {
      vi.advanceTimersByTime(300)
    })

    // All items are visible again after debounce
    expect(screen.getByText('Cardboard Box')).toBeInTheDocument()
    expect(screen.getByText('Shipping Label')).toBeInTheDocument()
    expect(screen.getByText('Packing Tape')).toBeInTheDocument()
    expect(
      screen.queryByText('No inventory items yet'),
    ).not.toBeInTheDocument()
    expect(
      screen.queryByRole('button', { name: 'Clear search' }),
    ).not.toBeInTheDocument()
  })

  it('clears the selected item when it is filtered out of the table', async () => {
    vi.useFakeTimers()

    renderInventoryPage()

    // Select an item to populate the details panel
    const cardBoardRow = screen.getByText('Cardboard Box').closest('tr')
    expect(cardBoardRow).not.toBeNull()

    const viewButton = within(cardBoardRow as HTMLTableRowElement).getByRole(
      'button',
      { name: 'View' },
    )

    fireEvent.click(viewButton)

    // Sanity check: details panel shows the selected item
    expect(
      screen.queryByText('Select an inventory item to view details'),
    ).not.toBeInTheDocument()
    expect(
      screen.getByRole('heading', { name: /Cardboard Box/ }),
    ).toBeInTheDocument()

    // Apply a search that removes the selected item from the table
    const searchInput = screen.getByPlaceholderText('Search items')
    fireEvent.change(searchInput, { target: { value: '' } })
    fireEvent.change(searchInput, { target: { value: 'label' } })

    // Before the debounce delay elapses, the selected item row is still present
    expect(cardBoardRow).toBeInTheDocument()

    await act(async () => {
      vi.advanceTimersByTime(300)
    })

    // The selected item row should no longer be present
    expect(screen.queryByText('Cardboard Box')).not.toBeInTheDocument()

    // The details panel returns to its empty state
    expect(
      screen.getByText('Select an inventory item to view details'),
    ).toBeInTheDocument()

    // No row remains selected
    const selectedRow = document.querySelector(
      '.inventory-table-row--selected',
    )
    expect(selectedRow).toBeNull()
  })

  it('does not apply filters before the debounce delay elapses', async () => {
    vi.useFakeTimers()
    renderInventoryPage()

    const searchInput = screen.getByPlaceholderText('Search items')

    fireEvent.change(searchInput, { target: { value: 'card' } })

    // Advance time by less than the debounce delay
    await act(async () => {
      vi.advanceTimersByTime(150)
    })

    // All items are still visible because debounce has not completed
    expect(screen.getByText('Cardboard Box')).toBeInTheDocument()
    expect(screen.getByText('Shipping Label')).toBeInTheDocument()
    expect(screen.getByText('Packing Tape')).toBeInTheDocument()
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
    const namesAsc = rowsAsc.map((row) => {
      const nameCell = row.querySelector('td:nth-of-type(2)')
      return nameCell?.textContent?.trim() ?? ''
    })

    expect(namesAsc).toEqual(expectedAscNames)

    // Name descending
    await user.selectOptions(sortFieldSelect, 'name')
    await user.selectOptions(sortDirectionSelect, 'desc')

    const tableDesc = screen.getByRole('table')
    const rowsDesc = within(tableDesc).getAllByRole('row').slice(1)
    const namesDesc = rowsDesc.map((row) => {
      const nameCell = row.querySelector('td:nth-of-type(2)')
      return nameCell?.textContent?.trim() ?? ''
    })

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
    const namesAsc = rowsAsc.map((row) => {
      const nameCell = row.querySelector('td:nth-of-type(2)')
      return nameCell?.textContent?.trim() ?? ''
    })

    expect(namesAsc).toEqual(expectedAscNamesByCreated)

    // Created descending
    await user.selectOptions(sortFieldSelect, 'created')
    await user.selectOptions(sortDirectionSelect, 'desc')

    const tableDesc = screen.getByRole('table')
    const rowsDesc = within(tableDesc).getAllByRole('row').slice(1)
    const namesDesc = rowsDesc.map((row) => {
      const nameCell = row.querySelector('td:nth-of-type(2)')
      return nameCell?.textContent?.trim() ?? ''
    })

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

  it('shows the true empty state without a contextual reset action when there are no items at all', async () => {
    vi.useFakeTimers()
    vi.resetModules()

    vi.doMock('../features/inventory', async () => {
      const actual = await vi.importActual<typeof import('../features/inventory')>(
        '../features/inventory',
      )

      return {
        ...actual,
        mockItems: [],
      }
    })

    const { InventoryPage: EmptyInventoryPage } = await import('./InventoryPage')

    render(
      <MemoryRouter initialEntries={['/inventory']}>
        <EmptyInventoryPage />
      </MemoryRouter>,
    )

    expect(screen.getByText('No inventory items yet')).toBeInTheDocument()
    expect(
      screen.queryByRole('button', { name: 'Clear search' }),
    ).not.toBeInTheDocument()
  })

  it('selects all visible rows via the header checkbox', async () => {
    renderInventoryPage()
    const user = userEvent.setup()

    const headerCheckbox = screen.getByRole('checkbox', {
      name: 'Select or clear all visible inventory rows',
    })

    // Initially, no rows are selected and the header checkbox is unchecked
    expect(headerCheckbox).not.toBeChecked()
    expect(headerCheckbox).toHaveProperty('indeterminate', false)

    mockItems.forEach((item) => {
      const rowCheckbox = screen.getByRole('checkbox', {
        name: `Select ${item.name}`,
      })

      expect(rowCheckbox).not.toBeChecked()
    })

    await user.click(headerCheckbox)

    mockItems.forEach((item) => {
      const rowCheckbox = screen.getByRole('checkbox', {
        name: `Select ${item.name}`,
      })

      expect(rowCheckbox).toBeChecked()
    })

    const toolbarBulkSelection = document.querySelector(
      '.inventory-toolbar-bulk-selection',
    ) as HTMLElement | null
    expect(toolbarBulkSelection).not.toBeNull()

    expect(
      within(toolbarBulkSelection as HTMLElement).getByText(
        `${mockItems.length} items selected`,
      ),
    ).toBeInTheDocument()
  })

  it('clears selection for all visible rows when the header checkbox is toggled off', async () => {
    renderInventoryPage()
    const user = userEvent.setup()

    const headerCheckbox = screen.getByRole('checkbox', {
      name: 'Select or clear all visible inventory rows',
    })

    await user.click(headerCheckbox)

    mockItems.forEach((item) => {
      const rowCheckbox = screen.getByRole('checkbox', {
        name: `Select ${item.name}`,
      })

      expect(rowCheckbox).toBeChecked()
    })

    let toolbarBulkSelection = document.querySelector(
      '.inventory-toolbar-bulk-selection',
    ) as HTMLElement | null
    expect(toolbarBulkSelection).not.toBeNull()

    expect(
      within(toolbarBulkSelection as HTMLElement).getByText(
        `${mockItems.length} items selected`,
      ),
    ).toBeInTheDocument()

    await user.click(headerCheckbox)

    mockItems.forEach((item) => {
      const rowCheckbox = screen.getByRole('checkbox', {
        name: `Select ${item.name}`,
      })

      expect(rowCheckbox).not.toBeChecked()
    })

    toolbarBulkSelection = document.querySelector(
      '.inventory-toolbar-bulk-selection',
    ) as HTMLElement | null

    expect(
      toolbarBulkSelection &&
        within(toolbarBulkSelection).queryByText(/items selected$/),
    ).toBeNull()
  })

  it('shows the indeterminate state on the header checkbox when some but not all visible rows are selected', async () => {
    renderInventoryPage()
    const user = userEvent.setup()

    const headerCheckbox = screen.getByRole('checkbox', {
      name: 'Select or clear all visible inventory rows',
    })

    const firstItem = mockItems[0]
    const firstItemCheckbox = screen.getByRole('checkbox', {
      name: `Select ${firstItem.name}`,
    })

    await user.click(firstItemCheckbox)

    expect(firstItemCheckbox).toBeChecked()

    // Header checkbox should be visually indeterminate (mixed) but not fully checked
    expect(headerCheckbox).not.toBeChecked()
    expect(headerCheckbox).toHaveProperty('indeterminate', true)
  })

  it('allows selecting multiple rows via checkboxes and shows the correct bulk selection count', async () => {
    renderInventoryPage()
    const user = userEvent.setup()

    const cardboardCheckbox = screen.getByRole('checkbox', {
      name: 'Select Cardboard Box',
    })
    const palletJackCheckbox = screen.getByRole('checkbox', {
      name: 'Select Electric Pallet Jack',
    })

    expect(cardboardCheckbox).not.toBeChecked()
    expect(palletJackCheckbox).not.toBeChecked()
    expect(
      document.querySelector('.inventory-toolbar-bulk-selection'),
    ).toBeNull()

    await user.click(cardboardCheckbox)
    await user.click(palletJackCheckbox)

    expect(cardboardCheckbox).toBeChecked()
    expect(palletJackCheckbox).toBeChecked()

    const toolbarBulkSelection = document.querySelector(
      '.inventory-toolbar-bulk-selection',
    ) as HTMLElement | null
    expect(toolbarBulkSelection).not.toBeNull()

    expect(
      within(toolbarBulkSelection as HTMLElement).getByText('2 items selected'),
    ).toBeInTheDocument()
  })

  it('clears bulk selection state when Clear selection is clicked', async () => {
    renderInventoryPage()
    const user = userEvent.setup()

    const cardboardCheckbox = screen.getByRole('checkbox', {
      name: 'Select Cardboard Box',
    })
    const palletJackCheckbox = screen.getByRole('checkbox', {
      name: 'Select Electric Pallet Jack',
    })

    await user.click(cardboardCheckbox)
    await user.click(palletJackCheckbox)

    let toolbarBulkSelection = document.querySelector(
      '.inventory-toolbar-bulk-selection',
    ) as HTMLElement | null
    expect(toolbarBulkSelection).not.toBeNull()

    expect(
      within(toolbarBulkSelection as HTMLElement).getByText('2 items selected'),
    ).toBeInTheDocument()

    const clearButton = screen.getByRole('button', {
      name: 'Clear selection',
    })

    await user.click(clearButton)

    toolbarBulkSelection = document.querySelector(
      '.inventory-toolbar-bulk-selection',
    ) as HTMLElement | null

    expect(
      toolbarBulkSelection &&
        within(toolbarBulkSelection).queryByText(/items selected$/),
    ).toBeNull()
    expect(cardboardCheckbox).not.toBeChecked()
    expect(palletJackCheckbox).not.toBeChecked()
  })

  it('allows changing status in bulk and updates table badges and selection state', async () => {
    renderInventoryPage()
    const user = userEvent.setup()

    const cardboardCheckbox = screen.getByRole('checkbox', {
      name: 'Select Cardboard Box',
    })
    const palletJackCheckbox = screen.getByRole('checkbox', {
      name: 'Select Electric Pallet Jack',
    })

    await user.click(cardboardCheckbox)
    await user.click(palletJackCheckbox)

    // Bulk actions bar appears with Change status controls
    const bulkBar = document.querySelector(
      '.inventory-bulk-actions-bar',
    ) as HTMLElement | null
    expect(bulkBar).not.toBeNull()

    const changeStatusLabel = screen.getByText('Change status:')
    expect(changeStatusLabel).toBeInTheDocument()

    const changeStatusContainer = changeStatusLabel.closest(
      '.inventory-bulk-actions-change-status',
    ) as HTMLElement | null
    expect(changeStatusContainer).not.toBeNull()

    const statusSelect = changeStatusContainer?.querySelector(
      'select.inventory-bulk-status-select',
    ) as HTMLSelectElement | null
    expect(statusSelect).not.toBeNull()

    const applyButton = screen.getByRole('button', { name: 'Apply' })
    expect(applyButton).toBeInTheDocument()
    expect(applyButton).toBeDisabled()

    // Choose a new status and apply
    await user.selectOptions(statusSelect as HTMLSelectElement, 'maintenance')

    expect(applyButton).not.toBeDisabled()

    await user.click(applyButton)

    // Status badges in the table rows are updated
    const cardboardRow = screen.getByText('Cardboard Box').closest('tr')
    const palletJackRow = screen.getByText(
      'Electric Pallet Jack',
    ).closest('tr')

    expect(cardboardRow).not.toBeNull()
    expect(palletJackRow).not.toBeNull()

    expect(
      within(cardboardRow as HTMLTableRowElement).getByTitle('Maintenance'),
    ).toBeInTheDocument()
    expect(
      within(palletJackRow as HTMLTableRowElement).getByTitle('Maintenance'),
    ).toBeInTheDocument()

    // Bulk selection is cleared
    const headerCheckbox = screen.getByRole('checkbox', {
      name: 'Select or clear all visible inventory rows',
    })
    expect(headerCheckbox).not.toBeChecked()

    expect(cardboardCheckbox).not.toBeChecked()
    expect(palletJackCheckbox).not.toBeChecked()

    const toolbarBulkSelection = document.querySelector(
      '.inventory-toolbar-bulk-selection',
    ) as HTMLElement | null
    expect(
      toolbarBulkSelection &&
        within(toolbarBulkSelection).queryByText(/items selected$/),
    ).toBeNull()

    const bulkBarAfterApply = document.querySelector(
      '.inventory-bulk-actions-bar',
    ) as HTMLElement | null
    expect(bulkBarAfterApply).toBeNull()
  })

  it('updates the details panel status when the selected item is changed via bulk status change', async () => {
    renderInventoryPage()
    const user = userEvent.setup()

    // Show details for Cardboard Box
    const cardBoardRow = screen.getByText('Cardboard Box').closest('tr')
    expect(cardBoardRow).not.toBeNull()

    const viewButton = within(cardBoardRow as HTMLTableRowElement).getByRole(
      'button',
      { name: 'View' },
    )

    await user.click(viewButton)

    const detailsHeader = screen
      .getByRole('heading', { name: /Cardboard Box/ })
      .closest('header') as HTMLElement | null
    expect(detailsHeader).not.toBeNull()

    // Sanity check: details panel shows current status
    expect(
      within(detailsHeader as HTMLElement).getByTitle('Available'),
    ).toBeInTheDocument()

    // Add the same item to bulk selection and change status
    const cardboardCheckbox = screen.getByRole('checkbox', {
      name: 'Select Cardboard Box',
    })

    await user.click(cardboardCheckbox)

    const changeStatusLabel = screen.getByText('Change status:')
    const changeStatusContainer = changeStatusLabel.closest(
      '.inventory-bulk-actions-change-status',
    ) as HTMLElement | null
    const statusSelect = changeStatusContainer?.querySelector(
      'select.inventory-bulk-status-select',
    ) as HTMLSelectElement | null
    expect(statusSelect).not.toBeNull()

    const applyButton = screen.getByRole('button', { name: 'Apply' })
    expect(applyButton).toBeDisabled()

    await user.selectOptions(statusSelect as HTMLSelectElement, 'maintenance')
    expect(applyButton).not.toBeDisabled()

    await user.click(applyButton)

    // Details panel reflects the updated status
    const updatedDetailsHeader = screen
      .getByRole('heading', { name: /Cardboard Box/ })
      .closest('header') as HTMLElement | null
    expect(updatedDetailsHeader).not.toBeNull()

    expect(
      within(updatedDetailsHeader as HTMLElement).getByTitle('Maintenance'),
    ).toBeInTheDocument()
  })

  it('enters inline status edit mode when the status badge is clicked', async () => {
    renderInventoryPage()
    const user = userEvent.setup()

    const cardBoardRow = screen.getByText('Cardboard Box').closest('tr')
    expect(cardBoardRow).not.toBeNull()

    const row = cardBoardRow as HTMLTableRowElement

    // Sanity check: initial status badge is rendered
    expect(within(row).getByTitle('Available')).toBeInTheDocument()

    const statusButton = row.querySelector(
      'button.inventory-table-status-button',
    ) as HTMLButtonElement | null

    expect(statusButton).not.toBeNull()

    await user.click(statusButton as HTMLButtonElement)

    // Inline select appears in place of the badge for this row
    const statusSelect = row.querySelector(
      'select.inventory-table-status-select',
    ) as HTMLSelectElement | null

    expect(statusSelect).not.toBeNull()
    expect(
      within(row).queryByTitle('Available'),
    ).not.toBeInTheDocument()
  })

  it('updates the status badge when a new status is selected inline', async () => {
    renderInventoryPage()
    const user = userEvent.setup()

    const cardBoardRow = screen.getByText('Cardboard Box').closest('tr')
    expect(cardBoardRow).not.toBeNull()

    const row = cardBoardRow as HTMLTableRowElement

    const statusButton = row.querySelector(
      'button.inventory-table-status-button',
    ) as HTMLButtonElement | null
    expect(statusButton).not.toBeNull()

    await user.click(statusButton as HTMLButtonElement)

    const statusSelect = row.querySelector(
      'select.inventory-table-status-select',
    ) as HTMLSelectElement | null
    expect(statusSelect).not.toBeNull()

    // Change from Available to Maintenance
    await user.selectOptions(statusSelect as HTMLSelectElement, 'maintenance')

    // Editing mode ends and the updated badge appears
    expect(
      row.querySelector('select.inventory-table-status-select'),
    ).toBeNull()
    expect(
      await within(row).findByTitle('Maintenance'),
    ).toBeInTheDocument()
  })

  it('cancels inline status editing when clicking outside the editor', async () => {
    renderInventoryPage()
    const user = userEvent.setup()

    const cardBoardRow = screen.getByText('Cardboard Box').closest('tr')
    expect(cardBoardRow).not.toBeNull()

    const row = cardBoardRow as HTMLTableRowElement

    const statusButton = row.querySelector(
      'button.inventory-table-status-button',
    ) as HTMLButtonElement | null
    expect(statusButton).not.toBeNull()

    await user.click(statusButton as HTMLButtonElement)

    // Ensure we are in edit mode
    expect(
      row.querySelector('select.inventory-table-status-select'),
    ).not.toBeNull()

    // Click clearly outside the table/editor (page header)
    const header = screen.getByRole('heading', { name: 'Inventory' })
    await user.click(header)

    // Edit mode is cancelled and original status badge remains unchanged
    expect(
      row.querySelector('select.inventory-table-status-select'),
    ).toBeNull()
    expect(
      within(row).getByTitle('Available'),
    ).toBeInTheDocument()
    expect(
      within(row).queryByTitle('Maintenance'),
    ).toBeNull()
  })

  it('cancels inline status editing when Escape is pressed', async () => {
    renderInventoryPage()
    const user = userEvent.setup()

    const cardBoardRow = screen.getByText('Cardboard Box').closest('tr')
    expect(cardBoardRow).not.toBeNull()

    const row = cardBoardRow as HTMLTableRowElement

    const statusButton = row.querySelector(
      'button.inventory-table-status-button',
    ) as HTMLButtonElement | null
    expect(statusButton).not.toBeNull()

    await user.click(statusButton as HTMLButtonElement)

    const statusSelect = row.querySelector(
      'select.inventory-table-status-select',
    ) as HTMLSelectElement | null
    expect(statusSelect).not.toBeNull()

    // Focus the select and press Escape to cancel editing
    await user.click(statusSelect as HTMLSelectElement)
    await user.keyboard('{Escape}')

    expect(
      row.querySelector('select.inventory-table-status-select'),
    ).toBeNull()
    expect(
      within(row).getByTitle('Available'),
    ).toBeInTheDocument()
    expect(
      within(row).queryByTitle('Maintenance'),
    ).toBeNull()
  })

  it('Escape key clears search and keeps focus on the search input', async () => {
    vi.useFakeTimers()
    renderInventoryPage()

    // Open the details panel so we can verify stopPropagation() prevents it closing
    const cardBoardRow = screen.getByText('Cardboard Box').closest('tr')
    const viewButton = within(cardBoardRow as HTMLTableRowElement).getByRole(
      'button',
      { name: 'View' },
    )
    fireEvent.click(viewButton)
    expect(
      screen.getByRole('heading', { name: /Cardboard Box/i }),
    ).toBeInTheDocument()

    const searchInput = screen.getByPlaceholderText('Search items')

    fireEvent.change(searchInput, { target: { value: 'card' } })

    await act(async () => {
      vi.advanceTimersByTime(300)
    })

    // Confirm the filter is active
    expect(screen.queryByText('Shipping Label')).not.toBeInTheDocument()

    // Ensure the input is focused before pressing Escape
    searchInput.focus()
    fireEvent.keyDown(searchInput, { key: 'Escape', code: 'Escape' })

    // The search field must be cleared
    expect(searchInput).toHaveValue('')
    // The details panel must still be visible — proves stopPropagation() prevented
    // the document-level Escape handler from closing the panel
    expect(
      screen.getByRole('heading', { name: /Cardboard Box/i }),
    ).toBeInTheDocument()
  })

  it('toolbar clear button returns focus to the search input after clearing', async () => {
    renderInventoryPage()

    const searchInput = screen.getByPlaceholderText('Search items')

    fireEvent.change(searchInput, { target: { value: 'card' } })

    // Clear (×) button appears when the search query is non-empty
    const clearButton = screen.getByRole('button', { name: 'Clear search' })
    expect(clearButton).toBeInTheDocument()

    fireEvent.click(clearButton)

    expect(searchInput).toHaveValue('')
    expect(document.activeElement).toBe(searchInput)
  })

  it('contextual clear search button returns focus to the search input', async () => {
    vi.useFakeTimers()
    renderInventoryPage()

    const searchInput = screen.getByPlaceholderText('Search items')

    fireEvent.change(searchInput, {
      target: { value: 'no-matching-item-query' },
    })

    await act(async () => {
      vi.advanceTimersByTime(300)
    })

    // Sanity check: table is in filtered-empty state
    expect(screen.getByText('No inventory items yet')).toBeInTheDocument()

    const emptyActions = document.querySelector(
      '.inventory-table-empty-actions',
    ) as HTMLElement
    expect(emptyActions).not.toBeNull()

    const clearSearchButton = within(emptyActions).getByRole('button', {
      name: 'Clear search',
    })

    fireEvent.click(clearSearchButton)

    expect(searchInput).toHaveValue('')
    expect(document.activeElement).toBe(searchInput)
  })
})

