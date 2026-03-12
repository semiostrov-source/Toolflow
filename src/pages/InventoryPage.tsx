import { PageHeader } from '../shared/ui'

export function InventoryPage() {
  return (
    <>
      <PageHeader
        title="Inventory"
        description="List of items and stock that will power daily operations."
      />
      <section className="page-section">
        <p>
          This area will become the main inventory workspace with lists, search,
          and filters for items.
        </p>
      </section>
    </>
  )
}
