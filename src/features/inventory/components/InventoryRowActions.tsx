import { useState } from 'react'
import { InventoryRowOverflowMenu } from './InventoryRowOverflowMenu'

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
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  const handleMoreClick = () => {
    setIsMenuOpen((previous) => !previous)
    onMore?.()
  }

  const handleMenuClose = () => {
    setIsMenuOpen(false)
  }

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
        aria-haspopup="menu"
        aria-expanded={isMenuOpen}
        onClick={handleMoreClick}
      >
        More
      </button>
      <InventoryRowOverflowMenu
        isOpen={isMenuOpen}
        onClose={handleMenuClose}
      />
    </div>
  )
}

