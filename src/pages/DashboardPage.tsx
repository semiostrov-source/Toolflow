import { PageHeader } from '../shared/ui'

export function DashboardPage() {
  return (
    <>
      <PageHeader
        title="Dashboard"
        description="High-level overview of inventory and activity."
      />
      <section className="page-section">
        <p>
          This dashboard will show key inventory and movement metrics once the
          core workflows are in place.
        </p>
      </section>
    </>
  )
}
