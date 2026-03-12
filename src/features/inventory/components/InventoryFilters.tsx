export function InventoryFilters() {
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
      </div>
    </section>
  )
}

