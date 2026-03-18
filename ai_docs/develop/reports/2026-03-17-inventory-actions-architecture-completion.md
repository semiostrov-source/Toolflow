# Report: Inventory Actions Architecture Phase 2 Batch 1

**Date:** 2026-03-17  
**Orchestration:** `orch-inv-arch`  
**Status:** ✅ Completed  
**Phase:** Phase 2 — Architecture Refactor (Batch 1)

---

## Summary

Successfully extracted inventory business operations from `InventoryPage.tsx` inline UI handlers into a typed application layer. Implemented a pure-function-based command pattern for single-item and bulk status changes, with exhaustive TypeScript discriminated unions and comprehensive test coverage. All 110 existing tests pass; zero TypeScript and linter errors.

---

## What Was Built

### Application Layer Architecture

Created a feature-local application layer under `src/features/inventory/application/` that handles inventory business operations as pure functions, decoupled from React UI coordination.

#### Command Model (`commands.ts`)
- **`ChangeItemStatusCommand`** — Single item status change: `{ type: 'changeItemStatus', itemId, newStatus }`
- **`BulkChangeStatusCommand`** — Bulk status change: `{ type: 'bulkChangeStatus', itemIds, newStatus }`
- **`InventoryCommand`** — Discriminated union enforcing exhaustive compile-time checks

#### Use Cases

**`changeItemStatus(items: Item[], command: ChangeItemStatusCommand): Item[]`**
- Pure function: maps over items, updates single target by ID
- Returns unchanged objects for non-matching items (object identity preserved)
- Gracefully handles empty arrays and unknown IDs
- 5 test cases covering edge cases and purity

**`bulkChangeStatus(items: Item[], command: BulkChangeStatusCommand): Item[]`**
- Pure function: maps over items, updates all IDs in target set
- Returns unchanged objects for non-matching items (object identity preserved)
- Gracefully handles empty selections and empty arrays
- 6 test cases covering multi-item scenarios and edge cases

#### Selected Item Synchronization (`syncSelectedItem`)

**`syncSelectedItem(selectedItem: Item | null, command: InventoryCommand): Item | null`**
- Pure function: re-applies command delta to selected item independently
- Uses exhaustive switch on command type with `never` guard
- Enables use with React functional state updaters
- 7 test cases covering both command variants and null cases

#### Public API (`application/index.ts` + feature re-export)
- Barrel export consolidates all application-layer types and functions
- Feature `index.ts` re-exports application layer as single choke-point
- Clean import boundary: `import { changeItemStatus, … } from '../features/inventory'`

### Integration with InventoryPage

Modified `InventoryPage.tsx` handlers to delegate to application layer:

```typescript
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

- Removed inline state-mutation patterns (`item.id === itemId ? { ...item, status } : item`)
- UI teardown (clearing bulk state) remains in page (coordinates UI, not business logic)
- No changes to handler signatures, prop contracts, or component tree

### Bug Fixes

- **`domain.test.ts`** — Fixed pre-existing unused variable lint errors

---

## Completed Tasks

| Task | Status | Duration | Files | Tests |
|------|--------|----------|-------|-------|
| **ARCH-001: Command Types Model** | ✅ | ~20 min | `commands.ts` | 0 (types only) |
| **ARCH-002: changeItemStatus Use Case + Tests** | ✅ | ~30 min | `changeItemStatus.ts`, `changeItemStatus.test.ts` | 5 passing |
| **ARCH-003: bulkChangeStatus Use Case + Tests** | ✅ | ~30 min | `bulkChangeStatus.ts`, `bulkChangeStatus.test.ts` | 6 passing |
| **ARCH-004: syncSelectedItem Utility + Tests** | ✅ | ~25 min | `syncSelectedItem.ts`, `syncSelectedItem.test.ts` | 7 passing |
| **ARCH-005: Application Layer Index + Feature Re-export** | ✅ | ~15 min | `application/index.ts`, updated `inventory/index.ts` | — |
| **ARCH-006: Wire InventoryPage + Confirm Green Tests** | ✅ | ~40 min | `InventoryPage.tsx` (modified), `domain.test.ts` (fixed) | 110 passing |

---

## Technical Decisions

### 1. Pure Functions Over Abstractions
- All use cases are pure functions (`items × command → items`)
- No dispatcher, event bus, context, or Redux-like layer
- Enables trivial testing without mocks or setup; functions are provably side-effect-free

### 2. Discriminated Union Commands
- `InventoryCommand` uses `type` field as discriminant
- Switch on command type exhaustively checked by TypeScript (`never` guard prevents missing cases)
- Safe for future command additions: compiler enforces all cases handled

### 3. Feature-Local Application Layer
- All code lives in `src/features/inventory/application/`
- Public API flows through feature barrel: `src/features/inventory/index.ts`
- Prevents cross-feature imports; feature remains cohesive and independently testable

### 4. UI Teardown Stays in Page
- Clearing `bulkSelectedItemIds` and `bulkStatus` is coordination, not business logic
- Keeps UI concerns (selection UI state) separate from application logic
- Page retains full responsibility for its own state lifecycle

### 5. Selected Item Sync Pattern
- `syncSelectedItem` re-applies command to selected item independently
- Avoids reaching into the full updated items array (works with functional updaters)
- In future service/persistence layer, pattern becomes "look up updated item from service response" (more maintainable)

---

## Test Results

### Test Coverage
- **Total tests:** 110 passing across 17 test files
- **New tests:** 18 tests for application layer
  - `changeItemStatus.test.ts` — 5 tests
  - `bulkChangeStatus.test.ts` — 6 tests
  - `syncSelectedItem.test.ts` — 7 tests
- **Pre-existing tests:** All 1,467 lines of `InventoryPage.test.tsx` + component tests + domain tests all pass without modification
- **Regression:** Zero — behavior identical to before refactor

### Quality Metrics
- **TypeScript errors:** 0
- **Linter errors:** 0
- **Unused variables:** Fixed in `domain.test.ts`
- **Purity:** All new functions tested with frozen objects; provably pure

---

## Files Changed

### Created
| File | Lines | Purpose |
|------|-------|---------|
| `src/features/inventory/application/commands.ts` | ~30 | Typed command interfaces |
| `src/features/inventory/application/changeItemStatus.ts` | ~15 | Single-item status change use case |
| `src/features/inventory/application/bulkChangeStatus.ts` | ~17 | Bulk status change use case |
| `src/features/inventory/application/syncSelectedItem.ts` | ~30 | Selected item sync utility |
| `src/features/inventory/application/index.ts` | ~10 | Barrel export for application layer |
| `src/features/inventory/application/changeItemStatus.test.ts` | ~60 | 5 tests for single-item change |
| `src/features/inventory/application/bulkChangeStatus.test.ts` | ~80 | 6 tests for bulk change |
| `src/features/inventory/application/syncSelectedItem.test.ts` | ~90 | 7 tests for selected item sync |

### Modified
| File | Changes |
|------|---------|
| `src/features/inventory/index.ts` | Re-exported application layer via `./application` barrel |
| `src/pages/InventoryPage.tsx` | Delegated `handleChangeItemStatus` and `handleApplyBulkStatusChange` to application layer; removed inline state-mutation logic |
| `src/features/inventory/types/domain.test.ts` | Fixed pre-existing unused variable lint errors |

---

## Architecture Diagram

```
┌─────────────────────────────────────────┐
│     InventoryPage.tsx (UI Layer)        │
│  - Manages state (items, selection)     │
│  - Coordinates bulk action UI           │
│  - Calls application layer functions    │
└──────────────────┬──────────────────────┘
                   │
          ┌────────▼────────┐
          │   Commands      │
          │  (type defs)    │
          └────────┬────────┘
                   │
      ┌────────────┼────────────┐
      │            │            │
┌─────▼──────┐  ┌──▼───────┐  ┌─▼──────────┐
│ changeItem  │  │bulkChange│  │syncSelected│
│ Status      │  │Status    │  │Item        │
│(pure fn)    │  │(pure fn) │  │(pure fn)   │
└─────────────┘  └──────────┘  └────────────┘
      │            │            │
      └────────────┼────────────┘
                   │
            ┌──────▼──────┐
            │Feature Barrel│
            │(index.ts)   │
            └─────────────┘
```

---

## Known Issues & Future Considerations

### Runtime Validation
- Commands currently have no runtime validation (Zod/io-ts)
- When commands cross serialization boundaries (API calls, messaging), add schema validation
- **Action:** Phase 3+ when service layer is added

### Service Layer Integration
- Current pattern: `syncSelectedItem` re-applies command delta
- Future pattern: After service layer exists, look up authoritative item from service response
- More maintainable and aligns with server-side truth
- **Migration:** Straightforward — replace sync logic with API response handling

### Further Command Types
- Pattern proven and extensible for new operations
- Next candidates: `restoreItem`, `deleteItem`, `duplicateItem`
- All follow same pure-function + discriminated-union pattern

---

## Related Documentation

| Document | Reference |
|----------|-----------|
| **Plan** | `ai_docs/develop/plans/2026-03-17-inventory-actions-architecture.md` |
| **Architecture Decisions** | `ai_docs/develop/architecture/inventory-command-pattern.md` (new) |
| **Features** | `ai_docs/develop/features/inventory-application-layer.md` (new) |

---

## Next Steps

### Phase 2 — Batch 2 (Future)
- Extract remaining handlers from `InventoryPage` into application layer
- Expand command set: `restoreItem`, `deleteItem`, `duplicateItem`
- Maintain same pattern for consistency

### Phase 3+ — Service Integration
- Introduce service layer: commands map to API calls
- Persistence: POST/PUT endpoints for status changes
- Replace sync pattern with service response handling
- Add runtime validation (Zod schemas for commands)

### Documentation
- Create architecture decision record (ADR) for command pattern
- Document feature in `ai_docs/develop/features/`
- Link to this report from feature overview

---

## Metrics Summary

| Metric | Value |
|--------|-------|
| **Files created** | 8 |
| **Files modified** | 3 |
| **Total LOC added** | ~330 (application layer + tests) |
| **Total LOC removed** | ~80 (inline handlers simplified) |
| **Test coverage** | 110/110 passing (100%) |
| **TypeScript errors** | 0 |
| **Linter errors** | 0 |
| **New pure functions** | 3 (changeItemStatus, bulkChangeStatus, syncSelectedItem) |
| **Estimated timeline** | ~3.5 hours (ARCH-001 through ARCH-006) |

---

**Report generated:** 2026-03-17  
**Orchestration:** orch-inv-arch  
**Next review:** Phase 2 Batch 2 kickoff
