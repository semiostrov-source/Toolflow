# Inventory UI Foundation

**Status**: ✅ Initial implementation  
**Components**: `InventoryPage`, `InventoryToolbar`, `InventoryTable`  
**Mock Data**: `src/features/inventory/mock/items.ts`

## Overview

The inventory UI foundation establishes a lightweight, composable structure for the inventory feature. It consists of three coordinated components that work together with a centralized mock dataset for development.

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

## InventoryPage Layout

**Location**: `src/pages/InventoryPage.tsx`

The `InventoryPage` assembles the three core components into a cohesive page structure:

```
PageHeader
  ↓
InventoryToolbar
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
<InventoryTable />
```

### Component Responsibilities

| Component | Role |
|-----------|------|
| `PageHeader` | Displays page title, description, and any global actions |
| `InventoryToolbar` | Provides search and creation entry points |
| `InventoryTable` | Renders the list of inventory items from `mockItems` |

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

## Next Steps

1. **Search functionality** — Connect search input to filter table by name/SKU
2. **Add Item workflow** — Implement modal/form and create action
3. **Backend integration** — Replace `mockItems` with API endpoints
4. **Enhanced table** — Add sorting, filtering, pagination, and row actions
