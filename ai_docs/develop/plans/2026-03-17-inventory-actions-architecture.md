# Plan: Inventory Actions Architecture

**Created:** 2026-03-17
**Orchestration:** orch-inv-arch
**Status:** 🟢 Ready
**Phase:** Phase 2 — Architecture Refactor (Batch 1)

## Goal

Move inventory business operations out of `InventoryPage.tsx` inline UI handlers into a typed
application layer under `src/features/inventory/application/`. The page should call typed
use-case functions instead of performing direct state mutations.

**In scope:**
- Single item status change (`handleChangeItemStatus`)
- Bulk status change (`handleApplyBulkStatusChange`)

**Out of scope:** backend integration, global state, new routes, visual changes, unrelated components.

---

## Context: What Exists Today

### State mutations in `InventoryPage.tsx` that must move

**1. `handleChangeItemStatus` (lines 185–198)**
```ts
const handleChangeItemStatus = (itemId: string, status: ItemStatus) => {
  setItems((previousItems) =>
    previousItems.map((item) =>
      item.id === itemId ? { ...item, status } : item,
    ),
  )
  setSelectedItem((previousSelected) => {
    if (!previousSelected) return previousSelected
    if (previousSelected.id !== itemId) return previousSelected
    return { ...previousSelected, status }
  })
}
```
Called by: `InventoryTable` via `onChangeItemStatus` prop (inline status editor select).

**2. `handleApplyBulkStatusChange` (lines 124–146)**
```ts
const handleApplyBulkStatusChange = () => {
  if (!bulkStatus) return
  setItems((previousItems) =>
    previousItems.map((item) =>
      bulkSelectedItemIds.includes(item.id) ? { ...item, status: bulkStatus } : item,
    ),
  )
  setSelectedItem((previousSelected) => {
    if (!previousSelected) return previousSelected
    if (!bulkSelectedItemIds.includes(previousSelected.id)) return previousSelected
    return { ...previousSelected, status: bulkStatus }
  })
  setBulkSelectedItemIds([])
  setBulkStatus('')
}
```
Called by: `InventoryBulkActionsBar` via `onApplyStatusChange` prop.

---

## Target Architecture

```
src/features/inventory/
├── application/
│   ├── commands.ts            ← typed command interfaces (ARCH-001)
│   ├── changeItemStatus.ts    ← single-item use case (ARCH-002)
│   ├── bulkChangeStatus.ts    ← bulk use case (ARCH-003)
│   ├── syncSelectedItem.ts    ← selected-item sync utility (ARCH-004)
│   └── index.ts               ← application layer public API (ARCH-005)
├── components/                ← unchanged
├── mock/                      ← unchanged
├── types/                     ← unchanged
└── index.ts                   ← re-exports application layer (ARCH-005)
```

### Design Decisions

- **Pure functions**: All use-case functions are pure (`items × command → items`). No side effects,
  no React imports, no framework coupling.
- **Discriminated union commands**: `InventoryCommand = ChangeItemStatusCommand | BulkChangeStatusCommand`
  — makes adding future commands safe and explicit.
- **selectedItem sync utility**: `syncSelectedItem(selectedItem, command)` — derived from the
  command parameters, not requiring the full updated list, enabling use with React functional updaters.
- **No new abstraction layers**: No dispatcher, no event bus. The page calls use-case functions
  directly and calls `setState` with the results.

### Wired InventoryPage (after ARCH-006)
```ts
const handleChangeItemStatus = (itemId: string, status: ItemStatus) => {
  const command: ChangeItemStatusCommand = { type: 'changeItemStatus', itemId, newStatus: status }
  setItems((prev) => changeItemStatus(prev, command))
  setSelectedItem((prev) => syncSelectedItem(prev, command))
}

const handleApplyBulkStatusChange = () => {
  if (!bulkStatus) return
  const command: BulkChangeStatusCommand = {
    type: 'bulkChangeStatus',
    itemIds: bulkSelectedItemIds,
    newStatus: bulkStatus,
  }
  setItems((prev) => bulkChangeStatus(prev, command))
  setSelectedItem((prev) => syncSelectedItem(prev, command))
  setBulkSelectedItemIds([])
  setBulkStatus('')
}
```

---

## Tasks

### ARCH-001: Command Types Model
- [ ] ARCH-001: Command Types Model (⏳ Pending)

**Priority:** Critical  
**Dependencies:** None  
**Complexity:** Simple  
**Estimated time:** ~20 min

**Files to create:**
- `src/features/inventory/application/commands.ts`

**What to implement:**
- `ChangeItemStatusCommand` — `{ type: 'changeItemStatus'; itemId: string; newStatus: ItemStatus }`
- `BulkChangeStatusCommand` — `{ type: 'bulkChangeStatus'; itemIds: string[]; newStatus: ItemStatus }`
- `InventoryCommand` — discriminated union of the two above
- JSDoc describing the purpose of each type
- No logic, types only

**Acceptance criteria:**
- All three types are exported
- `InventoryCommand` is a proper discriminated union (`type` field is the discriminant)
- TypeScript: assigning an invalid command shape causes a compile error
- No runtime code (types only file, zero bundle cost)

---

### ARCH-002: changeItemStatus Use Case + Tests
- [ ] ARCH-002: changeItemStatus Use Case + Tests (⏳ Pending)

**Priority:** Critical  
**Dependencies:** ARCH-001  
**Complexity:** Simple  
**Estimated time:** ~30 min

**Files to create:**
- `src/features/inventory/application/changeItemStatus.ts`
- `src/features/inventory/application/changeItemStatus.test.ts`

**What to implement:**
```ts
export function changeItemStatus(items: Item[], command: ChangeItemStatusCommand): Item[]
```
- Returns a new array where the item with `command.itemId` has `status` set to `command.newStatus`
- Items not matching `itemId` are returned unchanged (same object reference, not re-spread)
- If no item matches `itemId`, returns the original array unchanged
- Pure function — no mutation, no side effects

**Tests must cover:**
- Changes status of matching item
- Returns unchanged objects for non-matching items
- Handles empty array gracefully
- Handles unknown `itemId` (item not found) — returns original array
- Result array length is always equal to input array length

**Acceptance criteria:**
- Function is pure (provable by testing with frozen objects)
- All test cases pass
- TypeScript: function signature enforces `Item[]` and `ChangeItemStatusCommand`

---

### ARCH-003: bulkChangeStatus Use Case + Tests
- [ ] ARCH-003: bulkChangeStatus Use Case + Tests (⏳ Pending)

**Priority:** Critical  
**Dependencies:** ARCH-001  
**Complexity:** Simple  
**Estimated time:** ~30 min

**Files to create:**
- `src/features/inventory/application/bulkChangeStatus.ts`
- `src/features/inventory/application/bulkChangeStatus.test.ts`

**What to implement:**
```ts
export function bulkChangeStatus(items: Item[], command: BulkChangeStatusCommand): Item[]
```
- Returns a new array where every item whose `id` is in `command.itemIds` has `status` set to `command.newStatus`
- Items not in `command.itemIds` are returned unchanged (same object reference)
- If `command.itemIds` is empty, returns the original array unchanged
- Pure function

**Tests must cover:**
- Changes status of all matching items
- Returns unchanged objects for non-matching items
- Handles empty `itemIds` — returns array unchanged
- Handles empty items array gracefully
- Handles `itemIds` with no matches — returns original array

**Acceptance criteria:**
- Function is pure
- All test cases pass
- TypeScript: function signature enforces `Item[]` and `BulkChangeStatusCommand`

---

### ARCH-004: syncSelectedItem Utility + Tests
- [ ] ARCH-004: syncSelectedItem Utility + Tests (⏳ Pending)

**Priority:** High  
**Dependencies:** ARCH-001  
**Complexity:** Simple  
**Estimated time:** ~25 min

**Files to create:**
- `src/features/inventory/application/syncSelectedItem.ts`
- `src/features/inventory/application/syncSelectedItem.test.ts`

**What to implement:**
```ts
export function syncSelectedItem(
  selectedItem: Item | null,
  command: ChangeItemStatusCommand | BulkChangeStatusCommand,
): Item | null
```
- If `selectedItem` is `null`, returns `null`
- For `changeItemStatus`: if `selectedItem.id === command.itemId`, returns `{ ...selectedItem, status: command.newStatus }`; otherwise returns `selectedItem` unchanged
- For `bulkChangeStatus`: if `command.itemIds.includes(selectedItem.id)`, returns `{ ...selectedItem, status: command.newStatus }`; otherwise returns `selectedItem` unchanged
- Uses `switch (command.type)` to dispatch by discriminant — exhaustive by TypeScript
- Pure function

**Tests must cover:**
- Returns `null` when `selectedItem` is `null` for both command types
- `changeItemStatus`: updates selectedItem when IDs match
- `changeItemStatus`: returns selectedItem unchanged when IDs do not match
- `bulkChangeStatus`: updates selectedItem when its ID is in `command.itemIds`
- `bulkChangeStatus`: returns selectedItem unchanged when its ID is not in `command.itemIds`
- Same object reference returned when no update is needed (identity check)

**Acceptance criteria:**
- Function handles both command variants correctly
- Switch is exhaustive — adding a new command type without a case causes a TS error
- All test cases pass

---

### ARCH-005: Application Layer Index + Feature Re-export
- [ ] ARCH-005: Application Layer Index + Feature Re-export (⏳ Pending)

**Priority:** High  
**Dependencies:** ARCH-001, ARCH-002, ARCH-003, ARCH-004  
**Complexity:** Simple  
**Estimated time:** ~15 min

**Files to create:**
- `src/features/inventory/application/index.ts`

**Files to modify:**
- `src/features/inventory/index.ts`

**What to implement:**

`application/index.ts`:
- Re-exports `ChangeItemStatusCommand`, `BulkChangeStatusCommand`, `InventoryCommand` from `./commands`
- Re-exports `changeItemStatus` from `./changeItemStatus`
- Re-exports `bulkChangeStatus` from `./bulkChangeStatus`
- Re-exports `syncSelectedItem` from `./syncSelectedItem`

`features/inventory/index.ts`:
- Add exports for the application layer public API (types and functions above)
- Imports stay feature-local — no cross-feature imports added

**Acceptance criteria:**
- All application-layer exports are accessible via `import { … } from '../features/inventory'`
- No circular dependencies introduced
- `features/inventory/index.ts` remains the single public API boundary for the feature

---

### ARCH-006: Wire InventoryPage + Confirm Green Tests
- [ ] ARCH-006: Wire InventoryPage + Confirm Green Tests (⏳ Pending)

**Priority:** Critical  
**Dependencies:** ARCH-001, ARCH-002, ARCH-003, ARCH-004, ARCH-005  
**Complexity:** Moderate  
**Estimated time:** ~40 min

**Files to modify:**
- `src/pages/InventoryPage.tsx`

**What to implement:**

Replace the two inline mutation handlers with application-layer calls:

1. **`handleChangeItemStatus`** — import `changeItemStatus` + `syncSelectedItem`; replace the two `setState` bodies with use-case calls
2. **`handleApplyBulkStatusChange`** — import `bulkChangeStatus` + `syncSelectedItem`; replace the two `setState` bodies with use-case calls; keep the `setBulkSelectedItemIds([])` and `setBulkStatus('')` calls in the page (UI teardown responsibility belongs to the page)

Add imports at the top of `InventoryPage.tsx`:
```ts
import type { ChangeItemStatusCommand, BulkChangeStatusCommand } from '../features/inventory'
import { changeItemStatus, bulkChangeStatus, syncSelectedItem } from '../features/inventory'
```

The following must NOT change:
- Handler signatures (`handleChangeItemStatus(itemId, status)`, `handleApplyBulkStatusChange()`)
- Props passed to child components
- Bulk selection clear / bulkStatus clear after apply
- All other handlers remain untouched

**Acceptance criteria:**
- `InventoryPage.tsx` no longer contains inline `item.id === itemId ? { ...item, status } : item` patterns
- All 1467 lines of `InventoryPage.test.tsx` pass without modification
- All existing component tests in `src/features/inventory/components/` continue to pass
- `domain.test.ts` continues to pass
- No TypeScript errors introduced
- Behavior is identical to before the refactor

---

## Dependencies Graph

```
ARCH-001 (commands)
    ├── ARCH-002 (changeItemStatus)
    ├── ARCH-003 (bulkChangeStatus)
    └── ARCH-004 (syncSelectedItem)
                └── ARCH-005 (index)
                            └── ARCH-006 (wire page)
```

ARCH-002, ARCH-003, ARCH-004 can be implemented in parallel after ARCH-001.

---

## Progress

- ⏳ ARCH-001: Command Types Model (Pending)
- ⏳ ARCH-002: changeItemStatus Use Case + Tests (Pending)
- ⏳ ARCH-003: bulkChangeStatus Use Case + Tests (Pending)
- ⏳ ARCH-004: syncSelectedItem Utility + Tests (Pending)
- ⏳ ARCH-005: Application Layer Index + Feature Re-export (Pending)
- ⏳ ARCH-006: Wire InventoryPage + Confirm Green Tests (Pending)
