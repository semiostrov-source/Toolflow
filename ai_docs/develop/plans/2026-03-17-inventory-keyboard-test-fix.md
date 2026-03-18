# Plan: Inventory Keyboard Test Fix

**Created:** 2026-03-18
**Orchestration:** orch-inv-keyboard-fix
**Status:** 🟢 Ready

## Goal

Update the outdated keyboard interaction test(s) in `InventoryTable.test.tsx` to match the new contract:
- **Enter** on a focused row → calls `onSelectItem` with the row item
- **Space** on a focused row → calls `onToggleBulkSelect` with the row id (with `preventDefault`)

The production implementation in `InventoryTable.tsx` is already correct — only the tests need updating.

## Tasks

- [ ] INV-001: Update keyboard interaction tests in InventoryTable.test.tsx (⏳ Pending)
- [ ] INV-002: Verify all tests pass (⏳ Pending)

## Dependencies

- INV-002 requires INV-001

## Task Details

### INV-001: Update keyboard interaction tests

**Priority:** High  
**Complexity:** Simple  
**Files affected:**
- `src/features/inventory/components/InventoryTable.test.tsx` (update)
- `src/features/inventory/components/InventoryTable.tsx` (read-only reference)

**What to do:**
1. Read `InventoryTable.tsx` to confirm the exact keyboard handler logic (Enter → `onSelectItem`, Space → `onToggleBulkSelect` with `preventDefault`)
2. Read `InventoryTable.test.tsx` and find the failing test(s) that still expect Enter to call `onToggleBulkSelect`
3. Update/replace those tests so that:
   - One test fires `keyDown` with `{ key: 'Enter' }` on a focused row and asserts `onSelectItem` was called with the correct item
   - One test fires `keyDown` with `{ key: ' ' }` (Space) on a focused row and asserts `onToggleBulkSelect` was called with the correct id (and optionally that `preventDefault` was invoked)
4. Remove or fix any duplicate/conflicting assertions

**Acceptance criteria:**
- No test expects Enter to trigger `onToggleBulkSelect`
- Enter test asserts `onSelectItem` is called
- Space test asserts `onToggleBulkSelect` is called
- No duplicate keyboard-interaction test blocks

### INV-002: Verify all tests pass

**Priority:** High  
**Complexity:** Simple  
**Files affected:** None (read-only run)

**What to do:**
1. Run the test suite scoped to `InventoryTable.test.tsx`
2. Confirm zero failing tests
3. Confirm the broader test suite (`InventoryPage.test.tsx`) is still green

**Acceptance criteria:**
- All tests in `InventoryTable.test.tsx` pass
- No regressions in `InventoryPage.test.tsx`

## Architecture Decisions

- No production code changes — tests only
- Keep existing test structure; only patch the failing keyboard-interaction block(s)
