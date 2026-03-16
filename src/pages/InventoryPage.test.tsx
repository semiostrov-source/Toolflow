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

  it('selects all visible rows via the header checkbox', async () => {
    renderInventoryPage()
    const user = userEvent.setup()

    const headerCheckbox = screen.getByRole('checkbox', {
      name: 'Select all visible items',
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
      name: 'Select all visible items',
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
      name: 'Select all visible items',
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
      name: 'Select all visible items',
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
})

