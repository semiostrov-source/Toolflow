# Feature: Inventory Application Layer

**Status:** ✅ Implemented  
**Date:** 2026-03-17  
**Report:** `ai_docs/develop/reports/2026-03-17-inventory-actions-architecture-completion.md`  
**Architecture:** `ai_docs/develop/architecture/inventory-command-pattern.md`

---

## Overview

The Inventory Application Layer is a pure-function-based command execution system that handles inventory business operations independently of React UI concerns. It provides type-safe, immutable state transformations for:

- **Single-item operations** — Change individual item status
- **Bulk operations** — Change status for multiple items
- **Selection synchronization** — Keep detail-panel selection in sync with state changes

### Key Properties
- ✅ **Pure functions** — No side effects, no React imports
- ✅ **Immutable** — All operations return new objects
- ✅ **Type-safe** — Discriminated unions with exhaustive TypeScript checking
- ✅ **Testable** — Trivial unit tests (no mocks, no setup)
- ✅ **Extensible** — Command pattern scales for new operations

---

## Architecture

```
src/features/inventory/
├── application/
│   ├── commands.ts              ← Command type definitions (discriminated union)
│   ├── changeItemStatus.ts      ← Single-item status change (pure fn)
│   ├── bulkChangeStatus.ts      ← Bulk status change (pure fn)
│   ├── syncSelectedItem.ts      ← Selection sync utility (pure fn)
│   ├── index.ts                 ← Barrel export (public API)
│   ├── changeItemStatus.test.ts ← 5 unit tests
│   ├── bulkChangeStatus.test.ts ← 6 unit tests
│   └── syncSelectedItem.test.ts ← 7 unit tests
├── components/                  ← UI components (InventoryTable, etc.)
├── types/                       ← Domain types (Item, ItemStatus, etc.)
├── mock/                        ← Mock data generators
└── index.ts                     ← Feature public API
```

---

## API Reference

### Commands

#### ChangeItemStatusCommand
Single-item status change operation.

```typescript
interface ChangeItemStatusCommand {
  type: 'changeItemStatus'
  itemId: string
  newStatus: ItemStatus
}
```

**Usage:**
```typescript
const command: ChangeItemStatusCommand = {
  type: 'changeItemStatus',
  itemId: 'item-123',
  newStatus: 'active',
}
```

#### BulkChangeStatusCommand
Bulk status change operation for multiple items.

```typescript
interface BulkChangeStatusCommand {
  type: 'bulkChangeStatus'
  itemIds: string[]
  newStatus: ItemStatus
}
```

**Usage:**
```typescript
const command: BulkChangeStatusCommand = {
  type: 'bulkChangeStatus',
  itemIds: ['item-1', 'item-2', 'item-3'],
  newStatus: 'archived',
}
```

#### InventoryCommand
Discriminated union of all command types. Used for exhaustive type checking.

```typescript
type InventoryCommand = ChangeItemStatusCommand | BulkChangeStatusCommand
```

---

### Use Cases (Pure Functions)

#### changeItemStatus
Changes the status of a single item in an array.

```typescript
export function changeItemStatus(
  items: Item[],
  command: ChangeItemStatusCommand,
): Item[]
```

**Parameters:**
- `items` — Array of items to update
- `command` — ChangeItemStatusCommand with itemId and new status

**Returns:**
- New array with matching item's status updated
- Unchanged items return same object reference (identity preserved)
- If item not found, returns original array unchanged

**Properties:**
- Pure: same inputs → same output
- Immutable: doesn't modify input array
- Efficient: reuses object references for unchanged items

**Example:**
```typescript
const items = [
  { id: '1', status: 'pending', name: 'Item 1' },
  { id: '2', status: 'pending', name: 'Item 2' },
]

const command: ChangeItemStatusCommand = {
  type: 'changeItemStatus',
  itemId: '1',
  newStatus: 'active',
}

const updated = changeItemStatus(items, command)
// Returns:
// [
//   { id: '1', status: 'active', name: 'Item 1' },   ← new object
//   { id: '2', status: 'pending', name: 'Item 2' },  ← same reference
// ]
```

**Test Coverage:**
- ✅ Updates matching item's status
- ✅ Preserves object references for non-matching items
- ✅ Handles empty array gracefully
- ✅ Handles unknown itemId (not found)
- ✅ Maintains array length

---

#### bulkChangeStatus
Changes the status of multiple items matching IDs in a set.

```typescript
export function bulkChangeStatus(
  items: Item[],
  command: BulkChangeStatusCommand,
): Item[]
```

**Parameters:**
- `items` — Array of items to update
- `command` — BulkChangeStatusCommand with itemIds array and new status

**Returns:**
- New array with all matching items' status updated
- Unchanged items return same object reference (identity preserved)
- If no items match, returns original array unchanged

**Properties:**
- Pure: same inputs → same output
- Immutable: doesn't modify input array
- Set-based: uses array.includes() for O(n) matching

**Example:**
```typescript
const items = [
  { id: '1', status: 'pending', name: 'Item 1' },
  { id: '2', status: 'pending', name: 'Item 2' },
  { id: '3', status: 'active', name: 'Item 3' },
]

const command: BulkChangeStatusCommand = {
  type: 'bulkChangeStatus',
  itemIds: ['1', '2'],
  newStatus: 'archived',
}

const updated = bulkChangeStatus(items, command)
// Returns:
// [
//   { id: '1', status: 'archived', name: 'Item 1' }, ← new object
//   { id: '2', status: 'archived', name: 'Item 2' }, ← new object
//   { id: '3', status: 'active', name: 'Item 3' },   ← same reference
// ]
```

**Test Coverage:**
- ✅ Updates all matching items' status
- ✅ Preserves object references for non-matching items
- ✅ Handles empty itemIds array (no change)
- ✅ Handles empty items array gracefully
- ✅ Handles itemIds with no matches

---

#### syncSelectedItem
Re-applies command to selected item independently, keeping selection in sync.

```typescript
export function syncSelectedItem(
  selectedItem: Item | null,
  command: InventoryCommand,
): Item | null
```

**Parameters:**
- `selectedItem` — Currently selected item (from detail panel) or null
- `command` — InventoryCommand to apply

**Returns:**
- Updated selected item if it was affected by the command
- Same object reference if no update needed
- null if selectedItem was null

**Properties:**
- Pure: same inputs → same output
- Works with both command types via discriminated union switch
- Exhaustive: TypeScript enforces all command types handled

**Example:**
```typescript
// Single-item command
const selectedItem = { id: 'item-1', status: 'pending', name: 'Item 1' }
const command: ChangeItemStatusCommand = {
  type: 'changeItemStatus',
  itemId: 'item-1',
  newStatus: 'active',
}
const updated = syncSelectedItem(selectedItem, command)
// Returns: { id: 'item-1', status: 'active', name: 'Item 1' } (new object)

// Bulk command
const selectedItem = { id: 'item-2', status: 'pending', name: 'Item 2' }
const command: BulkChangeStatusCommand = {
  type: 'bulkChangeStatus',
  itemIds: ['item-1', 'item-2', 'item-3'],
  newStatus: 'archived',
}
const updated = syncSelectedItem(selectedItem, command)
// Returns: { id: 'item-2', status: 'archived', name: 'Item 2' } (new object)

// No match
const selectedItem = { id: 'item-5', status: 'active', name: 'Item 5' }
const command: BulkChangeStatusCommand = {
  type: 'bulkChangeStatus',
  itemIds: ['item-1', 'item-2'],
  newStatus: 'archived',
}
const updated = syncSelectedItem(selectedItem, command)
// Returns: same selectedItem (no new object created)

// Null handling
const updated = syncSelectedItem(null, command)
// Returns: null
```

**Implementation Details:**
```typescript
switch (command.type) {
  case 'changeItemStatus':
    return selectedItem.id === command.itemId
      ? { ...selectedItem, status: command.newStatus }
      : selectedItem

  case 'bulkChangeStatus':
    return command.itemIds.includes(selectedItem.id)
      ? { ...selectedItem, status: command.newStatus }
      : selectedItem

  default:
    const _exhaustive: never = command
    return _exhaustive // TypeScript error if command type not handled
}
```

**Test Coverage:**
- ✅ Returns null when selectedItem is null (both command types)
- ✅ Updates item when it matches changeItemStatus command
- ✅ Returns same reference when item doesn't match changeItemStatus
- ✅ Updates item when it's in bulkChangeStatus itemIds set
- ✅ Returns same reference when item not in bulkChangeStatus itemIds
- ✅ Identity check: unchanged items never create new objects

---

## Integration with InventoryPage

### Before Application Layer
```typescript
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

### After Application Layer
```typescript
import type { ChangeItemStatusCommand, BulkChangeStatusCommand } from '../features/inventory'
import { changeItemStatus, bulkChangeStatus, syncSelectedItem } from '../features/inventory'

const handleChangeItemStatus = (itemId: string, status: ItemStatus) => {
  const command: ChangeItemStatusCommand = {
    type: 'changeItemStatus',
    itemId,
    newStatus: status,
  }
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

  // UI teardown stays in page (not business logic)
  setBulkSelectedItemIds([])
  setBulkStatus('')
}
```

**Benefits:**
- ✅ State mutation logic extracted to pure functions
- ✅ Application logic testable without React component setup
- ✅ Handler intent clear: build command, apply transformations
- ✅ Behavior identical to before (zero breaking changes)

---

## Usage Examples

### Single-Item Status Change

```typescript
import { changeItemStatus, syncSelectedItem } from '../features/inventory'

const items = [...] // current items array
const selectedItem = {...} // currently selected item

const command: ChangeItemStatusCommand = {
  type: 'changeItemStatus',
  itemId: 'item-42',
  newStatus: 'active',
}

// Apply to items array
const updatedItems = changeItemStatus(items, command)

// Sync selection if needed
const updatedSelected = syncSelectedItem(selectedItem, command)

// Use with React setState
setItems(prev => changeItemStatus(prev, command))
setSelectedItem(prev => syncSelectedItem(prev, command))
```

### Bulk Status Change

```typescript
import { bulkChangeStatus, syncSelectedItem } from '../features/inventory'

const command: BulkChangeStatusCommand = {
  type: 'bulkChangeStatus',
  itemIds: selectedIds, // array of IDs to update
  newStatus: 'archived',
}

// Update all matching items
setItems(prev => bulkChangeStatus(prev, command))

// Keep selection in sync
setSelectedItem(prev => syncSelectedItem(prev, command))

// Clear bulk UI state
setSelectedIds([])
setBulkAction(null)
```

### Handling Both Command Types

```typescript
import { syncSelectedItem } from '../features/inventory'

function handleInventoryCommand(command: InventoryCommand) {
  // syncSelectedItem handles both command types via discriminated union
  setSelectedItem(prev => syncSelectedItem(prev, command))
}

// Can pass either command type without type errors
handleInventoryCommand({ type: 'changeItemStatus', itemId: '1', newStatus: 'active' })
handleInventoryCommand({ type: 'bulkChangeStatus', itemIds: ['1', '2'], newStatus: 'archived' })
```

---

## Testing

### Unit Tests
All functions tested with pure-function semantics:

```typescript
import { changeItemStatus, bulkChangeStatus, syncSelectedItem } from '../inventory/application'

describe('changeItemStatus', () => {
  it('updates item status by id', () => {
    const items = [{ id: '1', status: 'pending' }]
    const command: ChangeItemStatusCommand = {
      type: 'changeItemStatus',
      itemId: '1',
      newStatus: 'active',
    }
    const result = changeItemStatus(items, command)
    expect(result[0].status).toBe('active')
  })

  it('is pure with frozen objects', () => {
    const items = Object.freeze([Object.freeze({ id: '1', status: 'pending' })])
    const command: ChangeItemStatusCommand = {
      type: 'changeItemStatus',
      itemId: '1',
      newStatus: 'active',
    }
    expect(() => changeItemStatus(items, command)).not.toThrow()
  })
})
```

**Test Files:**
- `changeItemStatus.test.ts` — 5 tests
- `bulkChangeStatus.test.ts` — 6 tests
- `syncSelectedItem.test.ts` — 7 tests
- **Total:** 18 new tests, all passing

**Regression:**
- ✅ All 1,467 lines of `InventoryPage.test.tsx` pass without modification
- ✅ All component tests pass
- ✅ All existing domain tests pass
- **Total:** 110/110 tests passing

---

## Design Decisions

### Why Pure Functions?
- **Testable without React** — No component mount, mocks, or setup
- **Composable** — Can be chained or used in different contexts
- **Predictable** — Frozen object tests prove no side effects
- **Framework-agnostic** — Could migrate to Vue, Svelte, etc.

### Why Discriminated Unions?
- **Type-safe** — Compiler catches wrong command shapes
- **Extensible** — Adding new command types forces handler updates
- **Exhaustive** — `never` guard ensures all cases handled
- **Self-documenting** — Command type is operation registry

### Why Feature-Local?
- **Cohesion** — All inventory logic under one feature
- **Isolation** — No cross-feature dependencies
- **Maintainability** — Feature can be extracted or refactored independently
- **Clear boundaries** — Public API through feature barrel

### Why syncSelectedItem?
- **Derived state** — Selection updated from command, not full list lookup
- **Works with functional updaters** — `setSelectedItem(prev => syncSelectedItem(prev, cmd))`
- **Future-ready** — When service layer arrives, pattern becomes "get updated item from response"

---

## Known Limitations & Future Work

### Current Limitations
- No async operations (Phase 3+ with service layer)
- No runtime validation (Phase 3+ with Zod schemas)
- No persistence (Phase 3+ with backend API)
- No undo/redo (future enhancement)

### Phase 3+ Enhancements
- **Service layer** — Commands map to API calls
- **Persistence** — POST /api/inventory/commands endpoints
- **Validation** — Zod schemas for command runtime checks
- **Audit trail** — Log commands with timestamps/user IDs
- **Undo/redo** — Command history for user actions

### Extensibility
New inventory operations follow the same pattern:

```typescript
interface DeleteItemCommand {
  type: 'deleteItem'
  itemId: string
}

type InventoryCommand = 
  | ChangeItemStatusCommand 
  | BulkChangeStatusCommand 
  | DeleteItemCommand  // ← Add new command to union

export function deleteItem(items: Item[], command: DeleteItemCommand): Item[] {
  return items.filter(item => item.id !== command.itemId)
}

// syncSelectedItem switch statement updated:
case 'deleteItem':
  return selectedItem.id === command.itemId ? null : selectedItem
```

---

## Related Documentation

- **Plan:** `ai_docs/develop/plans/2026-03-17-inventory-actions-architecture.md`
- **Architecture Decision:** `ai_docs/develop/architecture/inventory-command-pattern.md`
- **Completion Report:** `ai_docs/develop/reports/2026-03-17-inventory-actions-architecture-completion.md`

---

## Quick Reference

| Export | Type | Purpose |
|--------|------|---------|
| `ChangeItemStatusCommand` | Interface | Single-item status change type |
| `BulkChangeStatusCommand` | Interface | Bulk status change type |
| `InventoryCommand` | Type Union | All command types (discriminated union) |
| `changeItemStatus()` | Function | Apply single-item status change |
| `bulkChangeStatus()` | Function | Apply bulk status change |
| `syncSelectedItem()` | Function | Sync selected item with command |

**Import from:**
```typescript
import type { ChangeItemStatusCommand, BulkChangeStatusCommand, InventoryCommand } from '../features/inventory'
import { changeItemStatus, bulkChangeStatus, syncSelectedItem } from '../features/inventory'
```

---

**Feature Status:** ✅ Production Ready  
**Test Coverage:** 110/110 tests passing (100%)  
**TypeScript:** 0 errors  
**Linter:** 0 errors  
**Last Updated:** 2026-03-17
