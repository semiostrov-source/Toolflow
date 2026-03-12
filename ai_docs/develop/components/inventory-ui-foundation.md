# Inventory UI Foundation

**Status**: ✅ UX foundation with filtering layer  
**Components**: `InventoryPage`, `InventoryToolbar`, `InventoryFilters`, `InventoryTable`  
**Mock Data**: `src/features/inventory/mock/items.ts`

## Overview

The inventory UI foundation establishes a lightweight, composable structure for the inventory feature. It consists of four coordinated components that work together with a centralized mock dataset for development.

## Mock Data: `mockItems`

**Location**: `src/features/inventory/mock/items.ts`

A centralized, development-only dataset that provides consistent test data across inventory components. All components in the inventory feature consume this shared `Item[]` array rather than defining their own inline mock data.

**Purpose**:
- Single source of truth for inventory data during development
- Ensures consistent behavior across all components
- Simplifies updates to mock data—change once, affects all consumers
- Prepares for easy transition to real backend API integration

**Usage**:
```typescript
import { mockItems } from '../mock/items'

// Use in components or tests
const items = mockItems
```

---

## InventoryToolbar Component

**Location**: `src/features/inventory/components/InventoryToolbar.tsx`

A simple toolbar positioned between the page header and the inventory table. It provides the UI foundation for search and item creation workflows.

### Current Behavior

**Features**:
- **Search Input**: A functional text input that filters the inventory table in real-time
- **Add Item Button**: An action button for creating new inventory items (no handler attached yet)
- **Responsive Layout**: Flexbox-based design that adapts to mobile and desktop screens

### Local Client-Side Search

The toolbar now includes **local, client-side search** over the `mockItems` dataset:

- **Scope**: Searches item `name` and `sku` fields
- **Case-insensitive**: All matches are performed case-insensitively for a better user experience
- **Real-time filtering**: Results update as the user types in the search input
- **Backend agnostic**: Currently operates on mock data only; no backend or URL synchronization yet—purely a UI-level concern for now
- **Empty state handling**: When the selected item is filtered out, the selection is cleared and the details panel reverts to its empty state

### Props

| Prop | Type | Purpose |
|------|------|---------|
| `searchQuery` | `string` | Current search input value |
| `onSearchChange` | `(query: string) => void` | Callback fired when the user types; updates parent state |

### Future Enhancements

- Implement "Add Item" modal or form for creating new inventory entries
- Add additional toolbar actions (export, bulk operations, etc.)
- Backend search integration (URL sync, server-side filtering)

---

## InventoryFilters Component

**Location**: `src/features/inventory/components/InventoryFilters.tsx`

A pre-filter UI row positioned between the toolbar and table. It provides dedicated UI controls for filtering inventory by warehouse and unit dimensions.

### Current Behavior

The filters row provides **local, UI-only controls** for refining the inventory list:

**Features**:
- **Warehouse Select**: Dropdown for selecting a warehouse scope (currently wired to page-level state, operating on mock data)
- **Unit Select**: Dropdown for narrowing by unit type or dimension (also local-only)
- **Sort Controls**: Minimal sort UI with:
  - **Sort Field**: `Name` or `Created`
  - **Sort Direction**: `Ascending` or `Descending`
- **Responsive Layout**: Flexbox row that adapts to available space

Filtering and sorting are applied **on top of the same mock `Item[]` dataset** and remain entirely client-side.

### Local Sorting Foundation

Sorting is applied after search and filter logic:

- **Fields**:
  - `Name` — alphabetical sort on the item name
  - `Created` — chronological sort on the `createdAt` timestamp
- **Directions**:
  - `Ascending`
  - `Descending`
- **Scope**:
  - Sorting is performed on the **already filtered** set of items (search + warehouse + unit)
  - Selection is preserved when the selected item remains in the sorted results
  - Behavior is local and mock-data–only; no backend or URL sync is involved yet

### Future Enhancements

- Add additional filter dimensions (category, status, etc.)
- Implement filter reset and preset filter groups
- Consider moving sorting and filtering to the backend once APIs are available

---

## InventoryPage Layout

**Location**: `src/pages/InventoryPage.tsx`

The `InventoryPage` assembles the four core components into a cohesive page structure:

```
PageHeader
  ↓
InventoryToolbar
  ↓
InventoryFilters
  ↓
InventoryTable
```

### Structure

```tsx
<PageHeader
  title="Inventory"
  description="Manage warehouse stock levels"
/>
<InventoryToolbar />
<InventoryFilters />
<InventoryTable />
```

### Component Responsibilities

| Component | Role |
|-----------|------|
| `PageHeader` | Displays page title, description, and any global actions |
| `InventoryToolbar` | Provides search and creation entry points |
| `InventoryFilters` | Pre-filter UI row for warehouse and unit filtering |
| `InventoryTable` | Renders the list of inventory items from `mockItems` with row actions |

---

## Data Flow

All inventory components depend on the shared `mockItems` dataset:

```
mockItems (src/features/inventory/mock/items.ts)
   ↓
InventoryTable (renders the items)
   
InventoryToolbar (will filter/create items)
```

This architecture enables:
- **Easy testing** — use `mockItems` directly in tests
- **Consistent data** — all components see the same item list
- **Simple integration** — replace `mockItems` import with API calls when ready

---

## Table Actions

The `InventoryTable` now includes an **Actions column** with placeholder buttons:
- **View**: Opens item details (not yet implemented)
- **Edit**: Opens item editor (not yet implemented)

These buttons are structural placeholders and do not perform navigation or state changes yet. They establish the UI foundation for item-level operations.

---

## Item Selection & Details Panel

**Location**: `src/features/inventory/components/InventoryDetailsPanel.tsx`

### Selection Mechanism

The inventory workspace now supports **local item selection** managed at the `InventoryPage` level:

- **State**: `selectedItem: Item | null` tracks the currently selected inventory item
- **Trigger**: Clicking the **View button** on a table row selects that item
- **Visual Feedback**: Selected rows are highlighted with the `inventory-table-row--selected` CSS class
- **Non-persistent**: Selection is temporary and lives only in component state; it is reset when navigating away or on page reload

This intentionally simple selection pattern establishes the interaction foundation without introducing routing or persistent state, allowing future layers to be added incrementally.

### InventoryDetailsPanel Component

A read-only details view panel that displays comprehensive item information alongside the inventory table.

**Features**:
- **Empty State**: Shows "Select an inventory item to view details" when no item is selected
- **Item Details**: Displays Name, SKU, Unit, and Created date when an item is selected
- **Placeholder Sections**: Includes reserved UI sections for "Stock summary" and "Recent movements" (to be implemented)

### Layout: Split-View Workspace

On large screens, the inventory page arranges the table and details panel side-by-side in a workspace layout:

```
┌─────────────────────────────────────────────────────────┐
│ Inventory Table                  │ Details Panel        │
│ ─────────────────────────────────┼──────────────────── │
│ • Item 1 [View] [Edit]          │ Name: Item 1        │
│ • Item 2 [View] [Edit]          │ SKU: SKU-001        │
│ • Item 3 [View] [Edit]          │ Unit: Pcs           │
│ ─────────────────────────────────┤ Created: 2025-01-01 │
│                                  │                      │
│                                  │ Stock summary        │
│                                  │ (placeholder)        │
│                                  │                      │
│                                  │ Recent movements     │
│                                  │ (placeholder)        │
└─────────────────────────────────────────────────────────┘
```

On mobile screens, the layout stacks vertically with the table above and details panel below.

---

## Next Steps

1. **Filter implementation** — Wire Warehouse and Unit selects to filter table results
2. **Row actions** — Implement View and Edit navigation handlers
3. **Add Item workflow** — Implement modal/form and create action
4. **Backend integration** — Replace `mockItems` with API endpoints and add server-side search
