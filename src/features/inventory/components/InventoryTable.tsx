import { mockItems } from '../mock/items'

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

