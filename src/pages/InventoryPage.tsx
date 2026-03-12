import { useEffect, useState } from 'react'
import type { Item } from '../features/inventory'
import { PageHeader } from '../shared/ui'
import { InventoryTable } from '../features/inventory/components/InventoryTable'
import { InventoryToolbar } from '../features/inventory/components/InventoryToolbar'
import { InventoryFilters } from '../features/inventory/components/InventoryFilters'
import { InventoryDetailsPanel } from '../features/inventory/components/InventoryDetailsPanel'
import { mockItems } from '../features/inventory/mock/items'

export function InventoryPage() {
  const [selectedItem, setSelectedItem] = useState<Item | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [sortField, setSortField] = useState<'name' | 'created'>('name')
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc')

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
      />
      <InventoryFilters
        onSortFieldChange={setSortField}
        onSortDirectionChange={setSortDirection}
      />
      <div className="inventory-workspace">
        <div className="inventory-workspace-main">
          <div className="inventory-workspace-table">
            <InventoryTable
              items={sortedItems}
              selectedItemId={selectedItem?.id}
              onSelectItem={setSelectedItem}
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
