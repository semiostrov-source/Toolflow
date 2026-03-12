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

The toolbar is **intentionally non-functional** at this stage—it establishes the visual structure and layout for future feature development.

**Features**:
- **Search Input**: A placeholder text input (no filtering implemented yet)
- **Add Item Button**: An action button for creating new inventory items (no handler attached yet)
- **Responsive Layout**: Flexbox-based design that adapts to mobile and desktop screens

### Props

Currently no props required. The component renders the toolbar UI independently.

### Future Enhancements

- Connect search input to filter the `InventoryTable` by item name or SKU
- Implement "Add Item" modal or form for creating new inventory entries
- Add additional toolbar actions (export, bulk operations, etc.)

---

## InventoryFilters Component

**Location**: `src/features/inventory/components/InventoryFilters.tsx`

A pre-filter UI row positioned between the toolbar and table. It provides dedicated UI controls for filtering inventory by warehouse and unit dimensions.

### Current Behavior

The filters are **placeholder controls** at this stage—establishing the visual space and component structure for future filtering logic.

**Features**:
- **Warehouse Select**: Placeholder dropdown for filtering by warehouse location
- **Unit Select**: Placeholder dropdown for filtering by unit type or dimension
- **Responsive Layout**: Flexbox row that adapts to available space

### Future Enhancements

- Wire select controls to filter `InventoryTable` by warehouse and unit
- Add additional filter dimensions (category, status, etc.)
- Implement filter reset and preset filter groups

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
2. **Search functionality** — Connect search input to filter table by name/SKU
3. **Row actions** — Implement View and Edit navigation handlers
4. **Add Item workflow** — Implement modal/form and create action
5. **Backend integration** — Replace `mockItems` with API endpoints
