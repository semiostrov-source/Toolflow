import { useEffect, useRef, useState } from 'react'
import type { Item, ItemStatus } from '..'
import { StatusBadge } from './StatusBadge'
import { mockItems } from '../mock/items'
import { InventoryRowActions } from './InventoryRowActions'

interface InventoryTableProps {
  items?: Item[]
  selectedItemId?: string
  onSelectItem?: (item: Item) => void
  bulkSelectedItemIds?: string[]
  onToggleBulkSelect?: (itemId: string) => void
  allVisibleSelected?: boolean
  someVisibleSelected?: boolean
  onToggleSelectAllVisible?: () => void
  onChangeItemStatus?: (itemId: string, status: ItemStatus) => void
  emptyMessage?: string
  hideEmpty?: boolean
}

export function InventoryTable({
  items,
  selectedItemId,
  onSelectItem,
  bulkSelectedItemIds,
  onToggleBulkSelect,
  allVisibleSelected,
  someVisibleSelected,
  onToggleSelectAllVisible,
  onChangeItemStatus,
  emptyMessage = 'No inventory items yet',
  hideEmpty = false,
}: InventoryTableProps) {
  const itemsToRender = items ?? mockItems
  const hasItems = itemsToRender.length > 0

  const headerCheckboxRef = useRef<HTMLInputElement | null>(null)
  const statusEditorRef = useRef<HTMLDivElement | null>(null)

  const [editingItemId, setEditingItemId] = useState<string | null>(null)
  const [editingStatus, setEditingStatus] = useState<ItemStatus | null>(null)

  useEffect(() => {
    if (!headerCheckboxRef.current) return

    headerCheckboxRef.current.indeterminate =
      !!someVisibleSelected && !allVisibleSelected && hasItems
  }, [someVisibleSelected, allVisibleSelected, hasItems])

  useEffect(() => {
    if (!editingItemId) return

    const handleDocumentMouseDown = (event: MouseEvent) => {
      if (!statusEditorRef.current) return
      if (statusEditorRef.current.contains(event.target as Node)) return

      setEditingItemId(null)
      setEditingStatus(null)
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key !== 'Escape') return
      event.stopImmediatePropagation()
      setEditingItemId(null)
      setEditingStatus(null)
    }

    document.addEventListener('mousedown', handleDocumentMouseDown)
    document.addEventListener('keydown', handleKeyDown, { capture: true })

    return () => {
      document.removeEventListener('mousedown', handleDocumentMouseDown)
      document.removeEventListener('keydown', handleKeyDown, { capture: true })
    }
  }, [editingItemId])

  return (
    <section className="page-section">
      <div className="inventory-table-container">
        <table className="inventory-table">
          <thead className="inventory-table-header">
            <tr>
              <th
                scope="col"
                className="inventory-table-cell inventory-table-cell--checkbox"
              >
                <input
                  type="checkbox"
                  ref={headerCheckboxRef}
                  className="inventory-table-checkbox"
                  checked={!!allVisibleSelected && hasItems}
                  disabled={!hasItems}
                  onChange={() => onToggleSelectAllVisible?.()}
                  aria-label="Select or clear all visible inventory rows"
                />
              </th>
              <th scope="col">Name</th>
              <th scope="col">SKU</th>
              <th scope="col">Unit</th>
              <th scope="col">Created</th>
              <th scope="col">Actions</th>
            </tr>
          </thead>
          <tbody>
            {hasItems ? (
              itemsToRender.map((item) => {
                const isSelected = item.id === selectedItemId
                const isBulkSelected = bulkSelectedItemIds?.includes(item.id)
                const isEditing = editingItemId === item.id

                return (
                  <tr
                    key={item.id}
                    data-row-id={item.id}
                    className={`inventory-table-row${
                      isSelected ? ' inventory-table-row--selected' : ''
                    }`}
                    tabIndex={0}
                    onClick={(event) => {
                      const target = event.target as HTMLElement | null

                      if (!target) return

                      if (
                        target.closest('button') ||
                        target.closest('a') ||
                        target.closest('input') ||
                        target.closest('[role="menu"]') ||
                        target.closest('[role="menuitem"]')
                      ) {
                        return
                      }

                      onSelectItem?.(item)
                    }}
                    onKeyDown={(event) => {
                      if (event.currentTarget !== event.target) return

                      if (event.key === 'Enter') {
                        onSelectItem?.(item)
                        return
                      }

                      if (event.key === ' ' || event.key === 'Spacebar') {
                        event.preventDefault()
                        onToggleBulkSelect?.(item.id)
                      }
                    }}
                  >
                    <td className="inventory-table-cell inventory-table-cell--checkbox">
                      <input
                        type="checkbox"
                        className="inventory-table-checkbox"
                        checked={!!isBulkSelected}
                        onChange={() => onToggleBulkSelect?.(item.id)}
                        aria-label={`Select ${item.name}`}
                      />
                    </td>
                    <td className="inventory-table-cell inventory-table-cell--primary">
                      {item.name}
                      {isEditing ? (
                        <div
                          ref={statusEditorRef}
                          className="inventory-table-status-editor"
                        >
                          <select
                            autoFocus
                            className="inventory-table-status-select"
                            value={editingStatus ?? item.status}
                            onChange={(event) => {
                              const nextStatus = event.target
                                .value as ItemStatus

                              onChangeItemStatus?.(item.id, nextStatus)
                              setEditingItemId(null)
                              setEditingStatus(null)
                            }}
                          >
                            <option value="available">Available</option>
                            <option value="in_use">In use</option>
                            <option value="maintenance">Maintenance</option>
                            <option value="written_off">Written off</option>
                          </select>
                        </div>
                      ) : (
                        <button
                          type="button"
                          className="inventory-table-status-button"
                          onClick={(event) => {
                            event.stopPropagation()
                            setEditingItemId(item.id)
                            setEditingStatus(item.status)
                          }}
                        >
                          <StatusBadge status={item.status} />
                        </button>
                      )}
                    </td>
                    <td className="inventory-table-cell">{item.sku}</td>
                    <td className="inventory-table-cell">{item.unit}</td>
                    <td className="inventory-table-cell">
                      {new Date(item.createdAt).toLocaleDateString()}
                    </td>
                    <td className="inventory-table-cell">
                      <InventoryRowActions
                        onView={() => onSelectItem?.(item)}
                        onEdit={undefined}
                      />
                    </td>
                  </tr>
                )
              })
            ) : !hideEmpty ? (
              <tr className="inventory-table-empty-row">
                <td colSpan={6} className="inventory-table-empty">
                  {emptyMessage}
                </td>
              </tr>
            ) : null}
          </tbody>
        </table>
      </div>
    </section>
  )
}

