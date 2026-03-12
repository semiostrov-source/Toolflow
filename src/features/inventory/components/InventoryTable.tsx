import type { Item } from '..'
import { mockItems } from '../mock/items'

interface InventoryTableProps {
  items?: Item[]
  selectedItemId?: string
  onSelectItem?: (item: Item) => void
}

export function InventoryTable({
  items,
  selectedItemId,
  onSelectItem,
}: InventoryTableProps) {
  const itemsToRender = items ?? mockItems
  const hasItems = itemsToRender.length > 0

  return (
    <section className="page-section">
      <div className="inventory-table-container">
        <table className="inventory-table">
          <thead className="inventory-table-header">
            <tr>
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

                return (
                  <tr
                    key={item.id}
                    className={`inventory-table-row${
                      isSelected ? ' inventory-table-row--selected' : ''
                    }`}
                  >
                    <td className="inventory-table-cell inventory-table-cell--primary">
                      {item.name}
                    </td>
                    <td className="inventory-table-cell">{item.sku}</td>
                    <td className="inventory-table-cell">{item.unit}</td>
                    <td className="inventory-table-cell">
                      {new Date(item.createdAt).toLocaleDateString()}
                    </td>
                    <td className="inventory-table-cell">
                      <div className="inventory-table-actions">
                        <button
                          type="button"
                          className="inventory-table-action-button"
                          onClick={() => onSelectItem?.(item)}
                        >
                          View
                        </button>
                        <button
                          type="button"
                          className="inventory-table-action-button"
                        >
                          Edit
                        </button>
                      </div>
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

