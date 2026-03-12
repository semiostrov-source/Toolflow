type SortField = 'name' | 'created'
type SortDirection = 'asc' | 'desc'

type InventoryFiltersProps = {
  onSortFieldChange?: (field: SortField) => void
  onSortDirectionChange?: (direction: SortDirection) => void
}

export function InventoryFilters({
  onSortFieldChange,
  onSortDirectionChange,
}: InventoryFiltersProps) {
  return (
    <section className="page-section inventory-filters">
      <div className="inventory-filters-grid">
        <div className="inventory-filters-field">
          <label
            htmlFor="inventory-filter-warehouse"
            className="inventory-filters-label"
          >
            Warehouse
          </label>
          <select
            id="inventory-filter-warehouse"
            name="warehouse"
            className="inventory-filters-select"
            defaultValue="all"
          >
            <option value="all">All warehouses</option>
            <option value="warehouse-a">Warehouse A</option>
            <option value="warehouse-b">Warehouse B</option>
          </select>
        </div>

        <div className="inventory-filters-field">
          <label
            htmlFor="inventory-filter-unit"
            className="inventory-filters-label"
          >
            Unit
          </label>
          <select
            id="inventory-filter-unit"
            name="unit"
            className="inventory-filters-select"
            defaultValue="all"
          >
            <option value="all">All units</option>
            <option value="pcs">pcs</option>
            <option value="kg">kg</option>
            <option value="m">m</option>
          </select>
        </div>

        <div className="inventory-filters-field inventory-filters-sort">
          <div className="inventory-filters-sort-row">
            <div className="inventory-filters-sort-field">
              <label
                htmlFor="inventory-sort-field"
                className="inventory-filters-label"
              >
                Sort by
              </label>
              <select
                id="inventory-sort-field"
                name="sortField"
                className="inventory-filters-select"
                defaultValue="name"
                onChange={(event) =>
                  onSortFieldChange?.(event.target.value as SortField)
                }
              >
                <option value="name">Name</option>
                <option value="created">Created</option>
              </select>
            </div>
            <div className="inventory-filters-sort-field">
              <label
                htmlFor="inventory-sort-direction"
                className="inventory-filters-label"
              >
                Direction
              </label>
              <select
                id="inventory-sort-direction"
                name="sortDirection"
                className="inventory-filters-select"
                defaultValue="asc"
                onChange={(event) =>
                  onSortDirectionChange?.(
                    event.target.value as SortDirection,
                  )
                }
              >
                <option value="asc">Ascending</option>
                <option value="desc">Descending</option>
              </select>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

