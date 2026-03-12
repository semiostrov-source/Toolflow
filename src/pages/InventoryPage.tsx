import { PageHeader } from '../shared/ui'
import { InventoryTable } from '../features/inventory/components/InventoryTable'

export function InventoryPage() {
  return (
    <>
      <PageHeader
        title="Inventory"
        description="List of items and stock that will power daily operations."
      />
      <InventoryTable />
    </>
  )
}
