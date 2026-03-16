import { useEffect, useRef, useState } from 'react'
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

  const actionsRef = useRef<HTMLDivElement | null>(null)
  const moreButtonRef = useRef<HTMLButtonElement | null>(null)
  const firstMenuItemRef = useRef<HTMLButtonElement | null>(null)

  const handleMenuClose = () => {
    setIsMenuOpen(false)
    if (moreButtonRef.current) {
      moreButtonRef.current.focus()
    }
  }

  useEffect(() => {
    if (!isMenuOpen) {
      return
    }

    const handleDocumentMouseDown = (event: MouseEvent) => {
      if (
        actionsRef.current &&
        !actionsRef.current.contains(event.target as Node)
      ) {
        handleMenuClose()
      }
    }

    const handleDocumentKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        handleMenuClose()
      }
    }

    document.addEventListener('mousedown', handleDocumentMouseDown)
    document.addEventListener('keydown', handleDocumentKeyDown)

    return () => {
      document.removeEventListener('mousedown', handleDocumentMouseDown)
      document.removeEventListener('keydown', handleDocumentKeyDown)
    }
  }, [isMenuOpen])

  useEffect(() => {
    if (!isMenuOpen) return
    if (firstMenuItemRef.current) {
      firstMenuItemRef.current.focus()
    }
  }, [isMenuOpen])

  const handleMoreClick = () => {
    setIsMenuOpen((previous) => !previous)
    onMore?.()
  }

  return (
    <div ref={actionsRef} className="inventory-table-actions">
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
        ref={moreButtonRef}
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
        firstItemRef={firstMenuItemRef}
      />
    </div>
  )
}

