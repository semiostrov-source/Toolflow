import type { Item } from '..'
import { StatusBadge } from './StatusBadge'

interface InventoryDetailsPanelProps {
  item: Item | null
  onClose?: () => void
}

export function InventoryDetailsPanel({ item }: InventoryDetailsPanelProps) {
  if (!item) {
    return (
      <section className="page-section inventory-details">
        <p className="inventory-details-empty">
          Select an inventory item to view details
        </p>
      </section>
    )
  }

  return (
    <section className="page-section inventory-details">
      <header className="inventory-details-header">
        <h2 className="inventory-details-title">
          {item.name}
          <StatusBadge status={item.status} />
        </h2>
        <p className="inventory-details-subtitle">
          SKU {item.sku} · {item.unit}
        </p>
      </header>

      <dl className="inventory-details-grid">
        <div className="inventory-details-field">
          <dt className="inventory-details-label">Name</dt>
          <dd className="inventory-details-value">{item.name}</dd>
        </div>
        <div className="inventory-details-field">
          <dt className="inventory-details-label">SKU</dt>
          <dd className="inventory-details-value">{item.sku}</dd>
        </div>
        <div className="inventory-details-field">
          <dt className="inventory-details-label">Unit</dt>
          <dd className="inventory-details-value">{item.unit}</dd>
        </div>
        <div className="inventory-details-field">
          <dt className="inventory-details-label">Created</dt>
          <dd className="inventory-details-value">
            {new Date(item.createdAt).toLocaleDateString()}
          </dd>
        </div>
      </dl>

      <div className="inventory-details-placeholder-group">
        <div className="inventory-details-placeholder">
          <h3 className="inventory-details-placeholder-title">
            Stock summary (placeholder)
          </h3>
          <p className="inventory-details-placeholder-text">
            This area will eventually show stock levels and availability for the
            selected item.
          </p>
        </div>

        <div className="inventory-details-placeholder">
          <h3 className="inventory-details-placeholder-title">
            Recent movements (placeholder)
          </h3>
          <p className="inventory-details-placeholder-text">
            This area will eventually list recent stock movements for the
            selected item.
          </p>
        </div>
      </div>
    </section>
  )
}

