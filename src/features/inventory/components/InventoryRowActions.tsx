interface InventoryRowActionsProps {
  onView?: () => void
  onEdit?: () => void
  onMore?: () => void
}

export function InventoryRowActions({
  onView,
  onEdit,
  onMore,
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
      <button
        type="button"
        className="inventory-table-action-button"
        onClick={onMore}
      >
        More
      </button>
    </div>
  )
}

