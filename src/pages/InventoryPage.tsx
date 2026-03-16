import { useEffect, useState } from 'react'
import type { Item } from '../features/inventory'
import { PageHeader } from '../shared/ui'
import { InventoryTable } from '../features/inventory/components/InventoryTable'
import { InventoryToolbar } from '../features/inventory/components/InventoryToolbar'
import { InventoryFilters } from '../features/inventory/components/InventoryFilters'
import { InventoryDetailsPanel } from '../features/inventory/components/InventoryDetailsPanel'
import { InventoryBulkActionsBar } from '../features/inventory/components/InventoryBulkActionsBar'
import { mockItems } from '../features/inventory/mock/items'

export function InventoryPage() {
  const [selectedItem, setSelectedItem] = useState<Item | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [sortField, setSortField] = useState<'name' | 'created'>('name')
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc')
  const [bulkSelectedItemIds, setBulkSelectedItemIds] = useState<string[]>([])

  const normalizedQuery = searchQuery.trim().toLowerCase()
  const filteredItems = normalizedQuery
    ? mockItems.filter((item) => {
        const name = item.name.toLowerCase()
        const sku = item.sku.toLowerCase()

        return (
          name.includes(normalizedQuery) ||
          sku.includes(normalizedQuery)
        )
      })
    : mockItems

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

  useEffect(() => {
    if (!selectedItem) return

    const stillVisible = filteredItems.some(
      (item) => item.id === selectedItem.id,
    )

    if (!stillVisible) {
      setSelectedItem(null)
    }
  }, [filteredItems, selectedItem])

  return (
    <>
      <PageHeader
        title="Inventory"
        description="List of items and stock that will power daily operations."
      />
      <InventoryToolbar
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
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
            />
          </div>
          <div className="inventory-workspace-details">
            <InventoryDetailsPanel item={selectedItem} />
          </div>
        </div>
      </div>
    </>
  )
}
