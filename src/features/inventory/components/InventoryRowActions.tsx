interface InventoryRowActionsProps {
  onView?: () => void
  onEdit?: () => void
}

export function InventoryRowActions({
  onView,
  onEdit,
}: InventoryRowActionsProps) {
  return (
    <div className="inventory-table-actions">
      <button
        type="button"
        className="inventory-table-action-button"
        onClick={onView}
      >
        View
      </button>
      <button
        type="button"
        className="inventory-table-action-button"
        onClick={onEdit}
      >
        Edit
      </button>
    </div>
  )
}

