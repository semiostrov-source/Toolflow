import { forwardRef, useRef } from 'react'

interface InventoryToolbarProps {
  searchQuery: string
  onSearchChange: (value: string) => void
  bulkSelectedCount?: number
  onClearBulkSelection?: () => void
}

export const InventoryToolbar = forwardRef<HTMLInputElement, InventoryToolbarProps>(
  function InventoryToolbar({
    searchQuery,
    onSearchChange,
    bulkSelectedCount = 0,
    onClearBulkSelection,
  }, forwardedRef) {
    const inputRef = useRef<HTMLInputElement>(null)

    const mergedRef = (el: HTMLInputElement | null) => {
      (inputRef as React.MutableRefObject<HTMLInputElement | null>).current = el
      if (typeof forwardedRef === 'function') {
        forwardedRef(el)
      } else if (forwardedRef) {
        forwardedRef.current = el
      }
    }

    return (
      <section className="page-section inventory-toolbar">
        <div className="inventory-toolbar-main">
          <div className="inventory-toolbar-search">
            <input
              ref={mergedRef}
              type="search"
              placeholder="Search items"
              className="inventory-toolbar-search-input"
              value={searchQuery}
              onChange={(event) => onSearchChange(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === 'Escape' && searchQuery) {
                  event.preventDefault()
                  event.stopPropagation()
                  onSearchChange('')
                }
              }}
            />
            {searchQuery && (
              <button
                type="button"
                className="inventory-toolbar-search-clear-button"
                aria-label="Clear search"
                onClick={() => {
                  onSearchChange('')
                  inputRef.current?.focus()
                }}
              >
                Clear
              </button>
            )}
          </div>
          <div className="inventory-toolbar-actions">
            <button type="button" className="inventory-toolbar-add-button">
              Add Item
            </button>
            {bulkSelectedCount > 0 && (
              <div className="inventory-toolbar-bulk-selection">
                <span className="inventory-toolbar-bulk-selection-text">
                  {bulkSelectedCount} {bulkSelectedCount === 1 ? 'item' : 'items'} selected
                </span>
                <button
                  type="button"
                  className="inventory-toolbar-bulk-clear-button"
                  onClick={onClearBulkSelection}
                >
                  Clear selection
                </button>
              </div>
            )}
          </div>
        </div>
      </section>
    )
  },
)
