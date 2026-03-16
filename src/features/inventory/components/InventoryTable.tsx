import type { Item } from '..'
import { StatusBadge } from './StatusBadge'
import { mockItems } from '../mock/items'
import { InventoryRowActions } from './InventoryRowActions'

interface InventoryTableProps {
  items?: Item[]
  selectedItemId?: string
  onSelectItem?: (item: Item) => void
  bulkSelectedItemIds?: string[]
  onToggleBulkSelect?: (itemId: string) => void
}

export function InventoryTable({
  items,
  selectedItemId,
  onSelectItem,
  bulkSelectedItemIds,
  onToggleBulkSelect,
}: InventoryTableProps) {
  const itemsToRender = items ?? mockItems
  const hasItems = itemsToRender.length > 0

  return (
    <section className="page-section">
      <div className="inventory-table-container">
        <table className="inventory-table">
          <thead className="inventory-table-header">
            <tr>
              <th
                scope="col"
                className="inventory-table-cell inventory-table-cell--checkbox"
              >
                <span className="sr-only">Select item</span>
              </th>
              <th scope="col">Name</th>
              <th scope="col">SKU</th>
              <th scope="col">Unit</th>
              <th scope="col">Created</th>
              <th scope="col">Actions</th>
            </tr>
          </thead>
          <tbody>
            {hasItems ? (
              itemsToRender.map((item) => {
                const isSelected = item.id === selectedItemId
                const isBulkSelected = bulkSelectedItemIds?.includes(item.id)

                return (
                  <tr
                    key={item.id}
                    className={`inventory-table-row${
                      isSelected ? ' inventory-table-row--selected' : ''
                    }`}
                  >
                    <td className="inventory-table-cell inventory-table-cell--checkbox">
                      <input
                        type="checkbox"
                        className="inventory-table-checkbox"
                        checked={!!isBulkSelected}
                        onChange={() => onToggleBulkSelect?.(item.id)}
                        aria-label={`Select ${item.name}`}
                      />
                    </td>
                    <td className="inventory-table-cell inventory-table-cell--primary">
                      {item.name}
                      <StatusBadge status={item.status} />
                    </td>
                    <td className="inventory-table-cell">{item.sku}</td>
                    <td className="inventory-table-cell">{item.unit}</td>
                    <td className="inventory-table-cell">
                      {new Date(item.createdAt).toLocaleDateString()}
                    </td>
                    <td className="inventory-table-cell">
                      <InventoryRowActions
                        onView={() => onSelectItem?.(item)}
                        onEdit={undefined}
                      />
                    </td>
                  </tr>
                )
              })
            ) : (
              <tr className="inventory-table-empty-row">
                <td colSpan={5} className="inventory-table-empty">
                  No inventory items yet
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </section>
  )
}

