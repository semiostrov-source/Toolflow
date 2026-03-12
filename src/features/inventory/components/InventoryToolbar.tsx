export function InventoryToolbar() {
  return (
    <section className="page-section inventory-toolbar">
      <div className="inventory-toolbar-main">
        <div className="inventory-toolbar-search">
          <input
            type="search"
            placeholder="Search items"
            className="inventory-toolbar-search-input"
          />
        </div>
        <div className="inventory-toolbar-actions">
          <button type="button" className="inventory-toolbar-add-button">
            Add Item
          </button>
        </div>
      </div>
    </section>
  )
}

