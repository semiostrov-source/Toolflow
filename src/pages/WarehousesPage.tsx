import { PageHeader } from '../shared/ui'

export function WarehousesPage() {
  return (
    <>
      <PageHeader
        title="Warehouses"
        description="Overview of storage locations that will hold inventory."
      />
      <section className="page-section">
        <p>
          This page will show the list of warehouses and basic location details
          for planning and operations.
        </p>
      </section>
    </>
  )
}
