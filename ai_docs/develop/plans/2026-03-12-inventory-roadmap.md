# Plan: Inventory UI — First Realistically Testable Version

**Created:** 2026-03-12
**Orchestration:** orch-2026-03-12-inv-roadmap
**Status:** 🟢 Ready
**Goal:** Bring the Inventory screen to a state where it can be meaningfully tested as a standalone UI before backend work begins.
**Total Tasks:** 7
**Estimated Time:** ~6–8 hours

---

## Maturity Analysis

### What Works Well

- **Component architecture** is clean and well-separated: `InventoryPage` owns all state, each child is a focused presentational component.
- **Search** (name + SKU, case-insensitive, real-time) is fully functional and tested.
- **Sort** (by name or created date, ascending/descending) is wired end-to-end and tested.
- **Selection** state is managed correctly in `InventoryPage`; `useEffect` handles auto-deselect when the selected item leaves the filtered list.
- **Details panel** renders structured `<dl>` fields with an empty state message when nothing is selected.
- **Test coverage** exists for table render, search, sort, selection, and empty states.

### Gaps Before "First Realistically Testable UI"

| Gap | Impact |
|-----|--------|
| Only 3 mock items — too few to stress-test search, filter, or sort | Cannot validate any real interaction pattern |
| No `status` field on `Item` — most critical piece of operational info is absent | Domain is incomplete for realistic UI work |
| Row click does not trigger selection — only the "View" button does | Core selection UX is broken for natural interaction |
| No item count display | Impossible to verify filter results visually |
| Warehouse and Unit filters render but do nothing | Two visible controls are non-functional; confuses testers |
| Details panel placeholder sections contain only text, no mock data | Panel feels incomplete; cannot review its future layout |
| Empty state is a bare text string with no guidance | Does not help users understand next action |
| Filter selects use `defaultValue` (uncontrolled) — no sync with parent state | Sort state is owned by parent but filters have no controlled value; filters and page state can diverge |

---

## Tasks Overview

- [ ] INV-001: Expand mock data and add item status to domain (⏳ Pending)
- [ ] INV-002: Status badge in table and details panel (⏳ Pending)
- [ ] INV-003: Row click selection and item count display (⏳ Pending)
- [ ] INV-004: Wire Warehouse and Unit filters (⏳ Pending)
- [ ] INV-005: Details panel mock stock and movement data (⏳ Pending)
- [ ] INV-006: Improved empty states (⏳ Pending)
- [ ] INV-007: Controlled filters and active state indicators (⏳ Pending)

---

## Dependencies Graph

```
INV-001 (mock data + status type)
  ├── INV-002 (status badge)
  │     └── INV-005 (details panel mock data)
  ├── INV-003 (row click + item count)
  │     └── INV-006 (empty states)
  └── INV-004 (wire filters)
          └── INV-007 (controlled filters + active indicators)
```

---

## Task Specifications

---

### INV-001 — Expand mock data and add item status to domain

**Priority:** Critical  
**Estimated time:** ~1 h  
**Dependencies:** None  
**Risk:** Low — type change is additive; existing tests will need `status` added to inline item fixtures.

**Description:**  
Add an `ItemStatus` type (`'available' | 'in_use' | 'maintenance' | 'written_off'`) to `domain.ts` and extend the `Item` interface with a required `status` field. Replace the 3-item mock with 12–15 items covering a variety of names, SKUs, units (`pcs`, `kg`, `m`, `roll`, `set`), statuses, and creation dates spread across several months. Realistic mock data is the prerequisite for every subsequent UX improvement — search, filter, sort, badges, and the details panel all become meaningless without varied inputs.

**Files likely affected:**
- `src/features/inventory/types/domain.ts`
- `src/features/inventory/mock/items.ts`
- `src/features/inventory/components/InventoryTable.test.tsx` *(update inline fixtures)*
- `src/features/inventory/components/InventoryToolbar.test.tsx` *(update inline fixtures)*
- `src/features/inventory/components/InventoryFilters.test.tsx` *(update inline fixtures)*
- `src/pages/InventoryPage.test.tsx` *(update inline fixtures)*

**Acceptance criteria:**
- `Item` type has `status: ItemStatus` field
- At least 12 mock items with varied status, unit, and date
- All existing tests pass with updated fixtures

---

### INV-002 — Status badge in table and details panel

**Priority:** High  
**Estimated time:** ~1 h  
**Dependencies:** INV-001  
**Risk:** Low — display-only, no logic changes; risk is only in badge styling consistency.

**Description:**  
Add a visual status badge to the `Name` column of `InventoryTable` and to the item header in `InventoryDetailsPanel`. Each status value (`available`, `in_use`, `maintenance`, `written_off`) should map to a distinct CSS modifier class (e.g., `status-badge--available`). No external library; pure CSS using semantic class names already present in the design system. This is the single highest-density information improvement for an operator scanning the list.

**Files likely affected:**
- `src/features/inventory/components/InventoryTable.tsx`
- `src/features/inventory/components/InventoryDetailsPanel.tsx`
- Shared or feature-level CSS for badge modifiers

**Acceptance criteria:**
- Every row shows an inline status badge next to the item name
- Badge is present in the details panel header
- Four status values have visually distinct styles
- Badge is readable at mobile breakpoints

---

### INV-003 — Row click selection and item count display

**Priority:** High  
**Estimated time:** ~45 min  
**Dependencies:** INV-001  
**Risk:** Low — purely additive; no existing logic changes required.

**Description:**  
Wire an `onClick` handler on each `<tr>` to call `onSelectItem`, making the entire row a selection target instead of requiring the "View" button. Add a small item-count line below the table (e.g., "12 items" or "4 of 12 items" when a filter is active) so operators immediately understand the scope of the current view. The "View" button can be removed or converted to a keyboard-friendly focus affordance.

**Files likely affected:**
- `src/features/inventory/components/InventoryTable.tsx` *(row onClick, count display, remove/adjust View button)*
- `src/features/inventory/components/InventoryTable.test.tsx` *(add row-click test)*

**Acceptance criteria:**
- Clicking any cell in a row selects the item and opens the details panel
- Item count is displayed and updates with search/filter changes
- "View" button is removed or clearly secondary
- Existing selection tests continue to pass

---

### INV-004 — Wire Warehouse and Unit filters

**Priority:** High  
**Estimated time:** ~1.5 h  
**Dependencies:** INV-001  
**Risk:** Medium — requires adding mock Stock data (warehouseId per item) to make warehouse filtering meaningful; introduces two new state values in `InventoryPage`.

**Description:**  
Add `warehouseId` to the `Stock` interface (already in domain) and create `mock/stocks.ts` mapping items to one or more warehouses. Add `selectedWarehouse` and `selectedUnit` state to `InventoryPage`, pass them down to `InventoryFilters` as controlled values, and apply them to the filter pipeline. Populate the warehouse select options dynamically from mock warehouse data. This turns two dead UI controls into genuinely testable features.

**Files likely affected:**
- `src/pages/InventoryPage.tsx` *(add filter state + filtering logic)*
- `src/features/inventory/components/InventoryFilters.tsx` *(add value/onChange props for warehouse and unit)*
- `src/features/inventory/mock/stocks.ts` *(new file — mock stock assignments)*
- `src/features/inventory/types/domain.ts` *(no change needed; Stock already has warehouseId)*
- `src/features/inventory/components/InventoryFilters.test.tsx` *(update or add tests)*

**Acceptance criteria:**
- Selecting a warehouse reduces the item list to items with stock in that warehouse
- Selecting a unit reduces the list to items with that unit value
- Filters combine with search and sort correctly
- "All warehouses" / "All units" resets the respective filter

---

### INV-005 — Details panel mock stock and movement data

**Priority:** Medium  
**Estimated time:** ~1.5 h  
**Dependencies:** INV-001, INV-002  
**Risk:** Medium — introduces new mock data files and renders mock lists; tests should be added for the new panel sections.

**Description:**  
Replace the two placeholder text blocks ("Stock summary (placeholder)" and "Recent movements (placeholder)") in `InventoryDetailsPanel` with structured mock data views. The stock summary should list per-warehouse quantities using `mock/stocks.ts`. The recent movements section should render a compact list of 3–5 movements per item using a new `mock/movements.ts`. This makes the details panel look like the real target layout — essential for reviewing and approving the panel design before backend wiring.

**Files likely affected:**
- `src/features/inventory/components/InventoryDetailsPanel.tsx`
- `src/features/inventory/mock/stocks.ts` *(shared with INV-004)*
- `src/features/inventory/mock/movements.ts` *(new file)*
- `src/features/inventory/components/InventoryDetailsPanel` test *(add or update)*

**Acceptance criteria:**
- "Stock summary" section shows a per-warehouse quantity table for the selected item
- "Recent movements" section shows a short list of recent movement records (date, type, quantity, warehouse)
- Sections show a contextual empty state when no data exists for the selected item
- Layout is readable on mobile breakpoints

---

### INV-006 — Improved empty states

**Priority:** Medium  
**Estimated time:** ~45 min  
**Dependencies:** INV-003  
**Risk:** Low — text and styling changes only; no logic or type changes.

**Description:**  
Replace the bare "No inventory items yet" empty state in `InventoryTable` with a structured block: a short headline, a supporting sentence, and a hint action ("Add your first item" or "Clear search"). Improve the panel empty state ("Select an inventory item to view details") with an icon placeholder and secondary text explaining what the panel will show. These changes reduce the disorientation new testers feel when facing an empty or filtered list.

**Files likely affected:**
- `src/features/inventory/components/InventoryTable.tsx`
- `src/features/inventory/components/InventoryDetailsPanel.tsx`
- `src/features/inventory/components/InventoryTable.test.tsx` *(update empty state text assertions)*

**Acceptance criteria:**
- Table empty state when no items exist shows a headline + hint to add an item
- Table empty state when search/filter produces zero results shows a "no results" message with a hint to clear filters
- Panel empty state is visually differentiated from the item detail view
- All existing empty-state tests pass with updated text assertions

---

### INV-007 — Controlled filters and active state indicators

**Priority:** Low  
**Estimated time:** ~1 h  
**Dependencies:** INV-004  
**Risk:** Low-Medium — changing filter inputs from uncontrolled (`defaultValue`) to controlled (`value`) is a safe refactor, but requires verifying no existing test relies on uncontrolled behavior.

**Description:**  
Convert all four filter inputs in `InventoryFilters` from uncontrolled `defaultValue` to controlled `value + onChange` props so that the parent (`InventoryPage`) is the single source of truth for all filter state. Add a compact "active filters" count indicator or visual highlight when non-default filter values are set. This makes the full filter bar consistently testable and eliminates the subtle state divergence between page state and DOM values.

**Files likely affected:**
- `src/features/inventory/components/InventoryFilters.tsx` *(all four inputs become controlled)*
- `src/pages/InventoryPage.tsx` *(pass sort values down as controlled props)*
- `src/features/inventory/components/InventoryFilters.test.tsx` *(update tests for controlled inputs)*

**Acceptance criteria:**
- All four filter inputs (warehouse, unit, sort field, sort direction) are controlled from `InventoryPage`
- Active filter count or highlight is shown when any non-default filter is applied
- A "Reset filters" action clears all filter state
- No controlled/uncontrolled input warnings in the browser console

---

## Recommended First Step

**Implement INV-001 next.**

It is the foundation of the entire roadmap. Every other task — badges, row selection, filter wiring, details panel data, improved empty states — depends on having varied, realistic mock data with a `status` field. It is also the safest step: additive type change, no UI risk, and it immediately makes the existing table more useful to a reviewer. Without it, testing any other improvement is limited to three nearly identical items.

---

## Progress

| ID | Title | Status |
|----|-------|--------|
| INV-001 | Expand mock data and add item status to domain | ⏳ Pending |
| INV-002 | Status badge in table and details panel | ⏳ Pending |
| INV-003 | Row click selection and item count display | ⏳ Pending |
| INV-004 | Wire Warehouse and Unit filters | ⏳ Pending |
| INV-005 | Details panel mock stock and movement data | ⏳ Pending |
| INV-006 | Improved empty states | ⏳ Pending |
| INV-007 | Controlled filters and active state indicators | ⏳ Pending |
