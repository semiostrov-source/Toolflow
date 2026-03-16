interface InventoryBulkActionsBarProps {
  selectedCount: number
  onClearSelection: () => void
}

export function InventoryBulkActionsBar({
  selectedCount,
  onClearSelection,
}: InventoryBulkActionsBarProps) {
  const itemLabel = selectedCount === 1 ? 'item' : 'items'

  return (
    <section className="page-section inventory-bulk-actions-bar">
      <div className="inventory-bulk-actions-main">
        <span className="inventory-bulk-actions-text">
          {selectedCount} {itemLabel} selected
        </span>
        <div className="inventory-bulk-actions-buttons">
          <button
            type="button"
            className="inventory-table-action-button"
          >
            Move
          </button>
          <button
            type="button"
            className="inventory-table-action-button"
          >
            Change status
          </button>
          <button
            type="button"
            className="inventory-table-action-button"
          >
            Write off
          </button>
          <button
            type="button"
            className="inventory-table-action-button"
            onClick={onClearSelection}
          >
            Clear
          </button>
        </div>
      </div>
    </section>
  )
}

