import { PageHeader } from '../shared/ui'

export function RequestsPage() {
  return (
    <>
      <PageHeader
        title="Requests"
        description="Service and write-off requests that will support lifecycle workflows."
      />
      <section className="page-section">
        <p>
          This screen will host upcoming flows for tracking service, repair, and
          write-off requests.
        </p>
      </section>
    </>
  )
}
