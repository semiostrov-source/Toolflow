import { PageHeader } from '../shared/ui'
import { InventoryTable } from '../features/inventory/components/InventoryTable'
import { InventoryToolbar } from '../features/inventory/components/InventoryToolbar'

export function InventoryPage() {
  return (
    <>
      <PageHeader
        title="Inventory"
        description="List of items and stock that will power daily operations."
      />
      <InventoryToolbar />
      <InventoryTable />
    </>
  )
}
