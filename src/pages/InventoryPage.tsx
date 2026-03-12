import { useState } from 'react'
import type { Item } from '../features/inventory'
import { PageHeader } from '../shared/ui'
import { InventoryTable } from '../features/inventory/components/InventoryTable'
import { InventoryToolbar } from '../features/inventory/components/InventoryToolbar'
import { InventoryFilters } from '../features/inventory/components/InventoryFilters'
import { InventoryDetailsPanel } from '../features/inventory/components/InventoryDetailsPanel'

export function InventoryPage() {
  const [selectedItem, setSelectedItem] = useState<Item | null>(null)

  return (
    <>
      <PageHeader
        title="Inventory"
        description="List of items and stock that will power daily operations."
      />
      <InventoryToolbar />
      <InventoryFilters />
      <div className="inventory-workspace">
        <div className="inventory-workspace-main">
          <div className="inventory-workspace-table">
            <InventoryTable
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
