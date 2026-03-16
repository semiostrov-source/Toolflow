import type { ItemStatus } from '..'

interface InventoryBulkActionsBarProps {
  selectedCount: number
  onClearSelection: () => void
  selectedStatus: ItemStatus | ''
  onStatusChange: (status: ItemStatus | '') => void
  onApplyStatusChange: () => void
}

export function InventoryBulkActionsBar({
  selectedCount,
  onClearSelection,
  selectedStatus,
  onStatusChange,
  onApplyStatusChange,
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
            className="inventory-table-action-button inventory-action-disabled"
            disabled
            aria-disabled="true"
          >
            Move
          </button>
          <div className="inventory-bulk-actions-change-status">
            <span className="inventory-bulk-actions-text">Change status:</span>
            <select
              className="inventory-bulk-status-select"
              value={selectedStatus || ''}
              onChange={(event) =>
                onStatusChange(
                  (event.target.value as ItemStatus | '') || '',
                )
              }
            >
              <option value="">Select status</option>
              <option value="available">available</option>
              <option value="in_use">in_use</option>
              <option value="maintenance">maintenance</option>
              <option value="written_off">written_off</option>
            </select>
            <button
              type="button"
              className="inventory-table-action-button"
              disabled={!selectedStatus}
              onClick={onApplyStatusChange}
            >
              Apply
            </button>
          </div>
          <button
            type="button"
            className="inventory-table-action-button inventory-action-disabled"
            disabled
            aria-disabled="true"
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

