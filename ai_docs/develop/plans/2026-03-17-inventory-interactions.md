# Plan: Inventory Table Interactions Unification

**Created:** 2026-03-17
**Orchestration:** orch-2026-03-17-inv-interactions
**Status:** ✅ Completed
**Goal:** Unify and stabilize all table interactions in Inventory (selection, row click, actions, sorting) as a single consistent UX system.
**Total Tasks:** 3
**Priority:** High

---

## Pre-Audit: Existing State vs Required Work

| Area | Status | Notes |
|------|--------|-------|
| Row click → opens details (`onSelectItem`) | ✅ Correct | `<tr onClick>` with button/input/menu guard |
| Checkbox click does NOT open details | ✅ Correct | `target.closest('input')` guard in row onClick |
| Action buttons blocked from row click | ✅ Correct | `target.closest('button')` guard in row onClick |
| Status badge `stopPropagation` | ✅ Correct | explicit `event.stopPropagation()` on status button |
| `tabIndex={0}` on rows | ✅ Correct | already set |
| `onKeyDown` — **Enter → open details** | ❌ **BROKEN** | Enter currently calls `onToggleBulkSelect`, not `onSelectItem` |
| `onKeyDown` — Space → toggle bulk select | ✅ Correct | Space already mapped to `onToggleBulkSelect` |
| Header checkbox selects only visible rows | ✅ Correct | `handleToggleSelectAllVisible` uses `visibleIds` |
| Details panel closes when item filtered out | ✅ Correct | `useEffect` on `filteredItems` in InventoryPage |
| Bulk selection cleared after bulk status change | ✅ Correct | `setBulkSelectedItemIds([])` in apply handler |
| Sorting doesn't reset selection or details panel | ✅ Correct | sort only changes display order |
| **Bulk selection sync on filter change** | ❌ **MISSING** | Hidden items stay in `bulkSelectedItemIds` when search filters |
| Test: row click opens details | ✅ Exists | "shows item details when a row is clicked" |
| Test: checkbox does NOT open details | ✅ Exists | "does not open item details when the row checkbox is clicked" |
| Test: action button does NOT trigger row click | ❌ **MISSING** | Not covered |
| Test: selection updates when search filters items | ❌ **MISSING** | Not covered |
| Test: selection persists after sorting | ❌ **MISSING** | Existing test only covers details panel, not bulk selection |
| Test: details panel closes when item filtered out | ✅ Exists | "clears the selected item when it is filtered out of the table" |

**Summary: 2 bugs, 3 missing tests.**

---

## Tasks

### INV-001 — Fix keyboard row navigation in InventoryTable
- **Status:** ✅ Completed
- **Priority:** High
- **Complexity:** Simple
- **File:** `src/features/inventory/components/InventoryTable.tsx`
- **Dependencies:** None

**Problem:** `onKeyDown` on `<tr>` currently maps `Enter` → `onToggleBulkSelect`. Per requirements Enter should open the details panel (same as row click), and Space should toggle bulk select.

**Change:** In the `onKeyDown` handler (lines 134-146):
- `Enter` → call `onSelectItem?.(item)` instead of `onToggleBulkSelect`
- `Space` / `Spacebar` → keep calling `onToggleBulkSelect?.(item.id)` (no change)

**Acceptance criteria:**
- Pressing Enter on a focused row opens the details panel
- Pressing Space on a focused row toggles its bulk selection checkbox
- No regression on existing tests

---

### INV-002 — Sync bulk selection with filtered items in InventoryPage
- **Status:** ✅ Completed
- **Priority:** High
- **Complexity:** Simple
- **File:** `src/pages/InventoryPage.tsx`
- **Dependencies:** None

**Problem:** When search filters items out, their IDs remain in `bulkSelectedItemIds`. This means the bulk selection count shows items the user can't see, and the header checkbox state is incorrect.

**Change:** Add a `useEffect` that watches `filteredItems` and removes from `bulkSelectedItemIds` any IDs that are no longer present in `filteredItems`:

```ts
useEffect(() => {
  const visibleIdSet = new Set(filteredItems.map((item) => item.id))
  setBulkSelectedItemIds((previous) =>
    previous.filter((id) => visibleIdSet.has(id)),
  )
}, [filteredItems])
```

Place after the existing `useEffect` that closes the details panel on filter change (currently at line 175).

**Acceptance criteria:**
- After applying a search that hides some items, those items are removed from bulk selection
- Items that remain visible keep their selection state
- Bulk count and header checkbox reflect only visible items

---

### INV-003 — Add missing tests to InventoryPage.test.tsx
- **Status:** ✅ Completed
- **Priority:** High
- **Complexity:** Moderate
- **File:** `src/pages/InventoryPage.test.tsx`
- **Dependencies:** INV-001, INV-002 (tests verify the fixed behaviors)

**Add 3 new tests** (check existing first, only add if not already covered):

**Test A — "action button click does NOT trigger row click"**
- Click the View button on a row
- Verify `onSelectItem` fires exactly once (details panel opens once)
- In practice: after clicking View, details panel shows; then click elsewhere to close; row count of `--selected` class = 1. Or verify the panel appears and no double-render/flicker.
- Simpler approach: after clicking View, verify details panel is shown (once), and no `console.error` / infinite loop.

**Test B — "selection updates when search filters items out"**
- Select Cardboard Box + Shipping Label checkboxes (2 items)
- Search for "label" (debounced) → only Shipping Label visible
- After debounce: verify `bulkSelectedItemIds` only contains Shipping Label's id
- Concretely: Cardboard Box checkbox is no longer in DOM, and toolbar shows "1 item selected"

**Test C — "selection persists after sorting"**
- Select Cardboard Box checkbox
- Change sort field or direction
- Verify Cardboard Box checkbox is still checked and toolbar still shows "1 item selected"

**Acceptance criteria:**
- All 3 new tests pass
- No existing tests broken

---

## Dependencies Graph

```
INV-001 ──┐
          ├──→ INV-003
INV-002 ──┘
```

INV-001 and INV-002 are independent and can be executed in parallel. INV-003 depends on both.

## Execution Order

1. **Parallel:** INV-001 + INV-002
2. **Sequential:** INV-003 (after both)

## Architecture Decisions

- No new components or state; changes are scoped to 3 existing files.
- `useEffect` for selection sync uses `filteredItems` (not `searchQuery`) as the dependency so it runs after React derives the filtered list — consistent with the existing details-panel-close effect.
- Keyboard Enter behavior aligns with ARIA APG pattern for `grid` role: row activation = open, Space = select.

## Progress (updated by orchestrator)

- ✅ INV-001: Fix keyboard row navigation (Completed)
- ✅ INV-002: Sync bulk selection with filter (Completed)
- ✅ INV-003: Add missing tests (Completed)
