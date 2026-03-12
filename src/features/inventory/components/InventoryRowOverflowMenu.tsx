interface InventoryRowOverflowMenuProps {
  isOpen: boolean
  onClose?: () => void
}

export function InventoryRowOverflowMenu({
  isOpen,
  onClose,
}: InventoryRowOverflowMenuProps) {
  if (!isOpen) {
    return null
  }

  const handleItemClick = () => {
    onClose?.()
  }

  return (
    <div className="inventory-row-overflow-menu">
      <div
        className="inventory-row-overflow-menu-panel"
        role="menu"
        aria-label="Inventory row actions"
      >
        <button
          type="button"
          className="inventory-row-overflow-menu-item"
          role="menuitem"
          onClick={handleItemClick}
        >
          Open details
        </button>
        <button
          type="button"
          className="inventory-row-overflow-menu-item"
          role="menuitem"
          onClick={handleItemClick}
        >
          Edit item
        </button>
        <button
          type="button"
          className="inventory-row-overflow-menu-item"
          role="menuitem"
          onClick={handleItemClick}
        >
          View history
        </button>
      </div>
    </div>
  )
}

