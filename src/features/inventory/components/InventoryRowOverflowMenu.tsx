import type { Ref } from 'react'

interface InventoryRowOverflowMenuProps {
  isOpen: boolean
  onClose?: () => void
  firstItemRef?: Ref<HTMLButtonElement>
}

export function InventoryRowOverflowMenu({
  isOpen,
  onClose,
  firstItemRef,
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
        tabIndex={-1}
        className="inventory-row-overflow-menu-panel"
        role="menu"
        aria-label="Inventory row actions"
        onKeyDown={(event) => {
          if (event.key !== 'ArrowDown' && event.key !== 'ArrowUp') {
            return
          }

          event.preventDefault()

          const panel = event.currentTarget
          const items = Array.from(
            panel.querySelectorAll<HTMLButtonElement>('[role="menuitem"]'),
          )

          if (items.length === 0) {
            return
          }

          const currentIndex = items.findIndex(
            (item) => item === document.activeElement,
          )

          let nextIndex = 0

          if (event.key === 'ArrowDown') {
            nextIndex = currentIndex === -1 ? 0 : (currentIndex + 1) % items.length
          } else {
            // ArrowUp
            if (currentIndex === -1) {
              nextIndex = items.length - 1
            } else {
              nextIndex =
                (currentIndex - 1 + items.length) % items.length
            }
          }

          items[nextIndex].focus()
        }}
      >
        <button
          ref={firstItemRef}
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

