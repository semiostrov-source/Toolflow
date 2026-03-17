import { useEffect, useRef, useState } from 'react'
import type { Item, ItemStatus } from '../features/inventory'
import { PageHeader } from '../shared/ui'
import {
  InventoryToolbar,
  InventoryFilters,
  InventoryBulkActionsBar,
  InventoryTable,
  InventoryDetailsPanel,
  mockItems,
} from '../features/inventory'

export function InventoryPage() {
  const searchInputRef = useRef<HTMLInputElement>(null)
  const [items, setItems] = useState<Item[]>(mockItems)
  const [selectedItem, setSelectedItem] = useState<Item | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [searchInput, setSearchInput] = useState('')
  const [sortField, setSortField] = useState<'name' | 'created'>('name')
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc')
  const [bulkSelectedItemIds, setBulkSelectedItemIds] = useState<string[]>([])
  const [bulkStatus, setBulkStatus] = useState<ItemStatus | ''>('')

  useEffect(() => {
    const debounceDelay = 300

    const timeoutId = window.setTimeout(() => {
      setSearchQuery(searchInput)
    }, debounceDelay)

    return () => {
      window.clearTimeout(timeoutId)
    }
  }, [searchInput])

  const normalizedQuery = searchQuery.trim().toLowerCase()
  const filteredItems = normalizedQuery
    ? items.filter((item) => {
        const name = item.name.toLowerCase()
        const sku = item.sku.toLowerCase()

        return (
          name.includes(normalizedQuery) ||
          sku.includes(normalizedQuery)
        )
      })
    : items

  const sortedItems = [...filteredItems].sort((a, b) => {
    let compareValue = 0

    if (sortField === 'name') {
      compareValue = a.name.localeCompare(b.name)
    } else {
      const aTime = new Date(a.createdAt).getTime()
      const bTime = new Date(b.createdAt).getTime()
      compareValue = aTime - bTime
    }

    return sortDirection === 'asc' ? compareValue : -compareValue
  })

  const visibleIds = sortedItems.map((item) => item.id)

  const selectedVisibleCount = visibleIds.filter((id) =>
    bulkSelectedItemIds.includes(id),
  ).length

  const allVisibleSelected =
    visibleIds.length > 0 && selectedVisibleCount === visibleIds.length

  const someVisibleSelected =
    selectedVisibleCount > 0 && selectedVisibleCount < visibleIds.length

  const handleToggleBulkSelect = (itemId: string) => {
    setBulkSelectedItemIds((previous) =>
      previous.includes(itemId)
        ? previous.filter((id) => id !== itemId)
        : [...previous, itemId],
    )
  }

  const handleToggleSelectAllVisible = () => {
    setBulkSelectedItemIds((previous) => {
      const visibleIdSet = new Set(visibleIds)
      const previousSelectedVisibleCount = previous.filter((id) =>
        visibleIdSet.has(id),
      ).length

      if (visibleIds.length === 0) {
        return previous
      }

      if (previousSelectedVisibleCount === 0) {
        const merged = new Set([...previous, ...visibleIds])
        return Array.from(merged)
      }

      if (previousSelectedVisibleCount === visibleIds.length) {
        return previous.filter((id) => !visibleIdSet.has(id))
      }

      const merged = new Set([...previous, ...visibleIds])
      return Array.from(merged)
    })
  }

  const handleClearBulkSelection = () => {
    setBulkSelectedItemIds([])
  }

  const handleBulkStatusChange = (status: ItemStatus | '') => {
    setBulkStatus(status)
  }

  const handleApplyBulkStatusChange = () => {
    if (!bulkStatus) return

    setItems((previousItems) =>
      previousItems.map((item) =>
        bulkSelectedItemIds.includes(item.id)
          ? { ...item, status: bulkStatus }
          : item,
      ),
    )

    setSelectedItem((previousSelected) => {
      if (!previousSelected) return previousSelected
      if (!bulkSelectedItemIds.includes(previousSelected.id)) {
        return previousSelected
      }

      return { ...previousSelected, status: bulkStatus }
    })

    setBulkSelectedItemIds([])
    setBulkStatus('')
  }

  const handleCloseDetails = () => {
    setSelectedItem(null)
  }

  useEffect(() => {
    if (!selectedItem) return

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        handleCloseDetails()
      }
    }

    document.addEventListener('keydown', handleKeyDown)

    return () => {
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [selectedItem])

  const handleChangeItemStatus = (itemId: string, status: ItemStatus) => {
    setItems((previousItems) =>
      previousItems.map((item) =>
        item.id === itemId ? { ...item, status } : item,
      ),
    )

    setSelectedItem((previousSelected) => {
      if (!previousSelected) return previousSelected
      if (previousSelected.id !== itemId) return previousSelected

      return { ...previousSelected, status }
    })
  }

  useEffect(() => {
    if (!selectedItem) return

    const stillVisible = filteredItems.some(
      (item) => item.id === selectedItem.id,
    )

    if (!stillVisible) {
      setSelectedItem(null)
    }
  }, [filteredItems, selectedItem])

  const handleClearSearch = () => {
    setSearchInput('')
    searchInputRef.current?.focus()
  }

  const isFilteredEmpty = items.length > 0 && sortedItems.length === 0

  return (
    <>
      <PageHeader
        title="Inventory"
        description="List of items and stock that will power daily operations."
      />
      <InventoryToolbar
        ref={searchInputRef}
        searchQuery={searchInput}
        onSearchChange={setSearchInput}
        bulkSelectedCount={bulkSelectedItemIds.length}
        onClearBulkSelection={handleClearBulkSelection}
      />
      <InventoryFilters
        onSortFieldChange={setSortField}
        onSortDirectionChange={setSortDirection}
      />
      {bulkSelectedItemIds.length > 0 && (
        <InventoryBulkActionsBar
          selectedCount={bulkSelectedItemIds.length}
          onClearSelection={handleClearBulkSelection}
          selectedStatus={bulkStatus}
          onStatusChange={handleBulkStatusChange}
          onApplyStatusChange={handleApplyBulkStatusChange}
        />
      )}
      <div className="inventory-workspace">
        <div className="inventory-workspace-main">
          <div className="inventory-workspace-table">
            <InventoryTable
              items={sortedItems}
              selectedItemId={selectedItem?.id}
              onSelectItem={setSelectedItem}
              bulkSelectedItemIds={bulkSelectedItemIds}
              onToggleBulkSelect={handleToggleBulkSelect}
              allVisibleSelected={allVisibleSelected}
              someVisibleSelected={someVisibleSelected}
              onToggleSelectAllVisible={handleToggleSelectAllVisible}
              onChangeItemStatus={handleChangeItemStatus}
            />
            {isFilteredEmpty && (
              <div className="inventory-table-empty-actions">
                <button
                  type="button"
                  onClick={handleClearSearch}
                  aria-label="Clear search"
                >
                  Clear search
                </button>
              </div>
            )}
          </div>
          <div className="inventory-workspace-details">
            <InventoryDetailsPanel item={selectedItem} onClose={handleCloseDetails} />
          </div>
        </div>
      </div>
    </>
  )
}
