import type { Item } from '../../inventory'

const mockItems: Item[] = [
  {
    id: 'item-1',
    name: 'Cardboard Box',
    sku: 'BOX-001',
    unit: 'pcs',
    createdAt: '2025-12-01T10:15:00.000Z',
  },
  {
    id: 'item-2',
    name: 'Shipping Label',
    sku: 'LBL-010',
    unit: 'roll',
    createdAt: '2025-12-05T09:00:00.000Z',
  },
  {
    id: 'item-3',
    name: 'Packing Tape',
    sku: 'TAPE-004',
    unit: 'roll',
    createdAt: '2025-12-08T14:30:00.000Z',
  },
]

export function InventoryTable() {
  const items = mockItems
  const hasItems = items.length > 0

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
            </tr>
          </thead>
          <tbody>
            {hasItems ? (
              items.map((item) => (
                <tr key={item.id} className="inventory-table-row">
                  <td className="inventory-table-cell inventory-table-cell--primary">
                    {item.name}
                  </td>
                  <td className="inventory-table-cell">{item.sku}</td>
                  <td className="inventory-table-cell">{item.unit}</td>
                  <td className="inventory-table-cell">
                    {new Date(item.createdAt).toLocaleDateString()}
                  </td>
                </tr>
              ))
            ) : (
              <tr className="inventory-table-empty-row">
                <td colSpan={4} className="inventory-table-empty">
                  No inventory items yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </section>
  )
}

