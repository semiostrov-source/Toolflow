# Plan: Inventory UX Finalization

**Created:** 2026-03-17
**Orchestration:** orch-inv-ux-final
**Status:** ⏳ Pending
**Goal:** Remove UX inconsistencies in the Inventory feature before first testable version
**Total Tasks:** 6
**Priority:** High

---

## Context

Full code audit of the following files was performed:
- `src/pages/InventoryPage.tsx`
- `src/pages/InventoryPage.test.tsx`
- `src/features/inventory/components/InventoryTable.tsx`
- `src/features/inventory/components/InventoryTable.test.tsx`
- `src/features/inventory/components/InventoryToolbar.tsx`
- `src/features/inventory/components/InventoryBulkActionsBar.tsx`
- `src/features/inventory/components/InventoryDetailsPanel.tsx`
- `src/app/App.tsx`, `src/main.tsx`

---

## Tasks

- [ ] UX-001: Fix BulkActionsBar label inconsistencies (⏳ Pending)
- [ ] UX-002: Fix Escape key conflict between inline editor and details panel (⏳ Pending)
- [ ] UX-003: Implement focus return after closing details panel (⏳ Pending)
- [ ] UX-004: Add autoFocus to inline status select on open (⏳ Pending)
- [ ] UX-005: Remove React Router v6 future-flag warnings (⏳ Pending)
- [ ] UX-006: Fix fragile empty-items test and clean up test hygiene (⏳ Pending)

---

## Dependencies

- UX-004 can be done alongside UX-002 (both in `InventoryTable.tsx`)
- UX-001 is fully independent
- UX-003 requires touching `InventoryPage.tsx` and `InventoryTable.tsx` (different concern from UX-002/004)
- UX-005 is fully independent (`main.tsx` + test wrapper updates)
- UX-006 is fully independent (tests only, plus a tiny `InventoryPage.tsx` prop addition)

---

## Task Details

---

### UX-001 — Fix BulkActionsBar label inconsistencies

**Priority:** High
**Files:** `src/features/inventory/components/InventoryBulkActionsBar.tsx`, `InventoryBulkActionsBar.test.tsx`

**What was found:**

1. **Status option labels are raw values.** The `<select>` in `InventoryBulkActionsBar` shows
   option text as `available`, `in_use`, `maintenance`, `written_off` (lowercase with underscores).
   The inline status editor in `InventoryTable` shows `Available`, `In use`, `Maintenance`,
   `Written off` — same data, different presentation. Inconsistent.

2. **"Clear" vs "Clear selection" label.** The bulk actions bar has a `<button>Clear</button>`
   (line 73) that clears bulk selection. The toolbar renders a `<button>Clear selection</button>`
   (InventoryToolbar line 74–77) for the same action. Same action, two different labels shown
   simultaneously on the same page.

**What to change:**
- `InventoryBulkActionsBar.tsx` option text: `available` → `Available`, `in_use` → `In use`,
  `maintenance` → `Maintenance`, `written_off` → `Written off`
- `InventoryBulkActionsBar.tsx` clear button text: `Clear` → `Clear selection`
- `InventoryBulkActionsBar.test.tsx`: update `getByRole('button', { name: 'Clear' })` →
  `getByRole('button', { name: 'Clear selection' })`

**Acceptance criteria:**
- Both status selects (table inline editor and bulk bar) show identical human-readable labels
- All "clear bulk selection" buttons on the page read "Clear selection"
- `InventoryBulkActionsBar.test.tsx` passes after the label change
- `InventoryPage.test.tsx` unaffected (already uses "Clear selection" for the toolbar button)

---

### UX-002 — Fix Escape key conflict: inline status editor vs. details panel

**Priority:** High
**Files:** `src/features/inventory/components/InventoryTable.tsx`, `src/pages/InventoryPage.test.tsx`

**What was found:**

Both `InventoryTable` and `InventoryPage` register a `document.addEventListener('keydown')`
handler that fires on `Escape`. `InventoryTable` uses it to close the inline status editor
(`editingItemId`). `InventoryPage` uses it to close the details panel (`selectedItem`).

When a user has both the details panel open **and** the inline status editor active, pressing
`Escape` fires both handlers simultaneously: the editor closes **and** the details panel closes.
Only the editor should close on first Escape; a second Escape should then close the panel.

The toolbar's Escape handler correctly calls `event.stopPropagation()` to prevent the panel
from closing. The inline editor's handler does not.

**Root cause (exact code):**

```ts
// InventoryTable.tsx — inside useEffect for editingItemId
const handleKeyDown = (event: KeyboardEvent) => {
  if (event.key !== 'Escape') return
  setEditingItemId(null)   // ← never stops propagation
  setEditingStatus(null)
}
document.addEventListener('keydown', handleKeyDown)
```

**What to change:**
- In `InventoryTable.tsx` `handleKeyDown`, add `event.stopImmediatePropagation()` before
  clearing edit state. `stopImmediatePropagation` prevents subsequent same-event listeners
  on `document` from firing (unlike `stopPropagation` which only stops bubbling up the tree).

**New regression test in `InventoryPage.test.tsx`:**
- Open details panel → click status badge to open inline editor → press Escape
- Assert: inline editor is gone, details panel is **still open**

**Acceptance criteria:**
- Pressing Escape when inline editor is active closes only the editor; panel stays open
- Pressing Escape a second time (no editor open, panel open) closes the panel
- New regression test passes

---

### UX-003 — Implement focus return after closing details panel

**Priority:** Medium
**Files:** `src/pages/InventoryPage.tsx`, `src/features/inventory/components/InventoryTable.tsx`

**What was found:**

`handleCloseDetails` in `InventoryPage.tsx` (line 142–144) only calls `setSelectedItem(null)`.
There is no focus restoration. After the panel closes (button click or Escape), keyboard focus
is left wherever the close button was or drops to `<body>`. A user navigating by keyboard loses
their place in the table entirely.

**What to change:**

1. Add a `data-row-id` attribute to each `<tr>` in `InventoryTable.tsx` so rows can be
   retrieved by ID without storing per-row refs.
   ```tsx
   <tr key={item.id} data-row-id={item.id} ...>
   ```

2. In `InventoryPage.tsx`, store the selected item's id in a ref (`lastSelectedIdRef`) that is
   updated whenever `selectedItem` changes:
   ```tsx
   const lastSelectedIdRef = useRef<string | null>(null)
   useEffect(() => {
     if (selectedItem) lastSelectedIdRef.current = selectedItem.id
   }, [selectedItem])
   ```

3. Update `handleCloseDetails` to focus the corresponding row after state update:
   ```tsx
   const handleCloseDetails = () => {
     const id = lastSelectedIdRef.current
     setSelectedItem(null)
     if (id) {
       // Defer until after re-render clears the panel
       requestAnimationFrame(() => {
         const row = document.querySelector<HTMLElement>(`[data-row-id="${id}"]`)
         row?.focus()
       })
     }
   }
   ```

**Acceptance criteria:**
- After clicking "Close details panel", keyboard focus is on the row that was selected
- After pressing Escape (panel-level), focus returns to the same row
- Existing close-panel tests still pass

---

### UX-004 — Add autoFocus to inline status select on open

**Priority:** Medium
**Files:** `src/features/inventory/components/InventoryTable.tsx`

**What was found:**

When a user clicks the status badge button (`inventory-table-status-button`) to enter inline
editing mode, the button is replaced by a `<select>` element. The button disappears from the
DOM, so browser focus is implicitly dropped to `<body>`. The user must Tab or click again to
interact with the select — a focus trap/loss on every status edit.

**What to change:**

Add `autoFocus` to the status `<select>` rendered in edit mode (line 164 of `InventoryTable.tsx`):

```tsx
<select
  autoFocus
  className="inventory-table-status-select"
  ...
>
```

React calls `.focus()` on the element after it mounts, restoring focus correctly.

**Acceptance criteria:**
- After clicking the status badge, the inline `<select>` immediately has keyboard focus
- Typing or using arrow keys to change the status works without an extra Tab/click
- Existing inline-editing tests pass unchanged

---

### UX-005 — Remove React Router v6 future-flag warnings

**Priority:** High
**Files:** `src/main.tsx`, `src/pages/InventoryPage.test.tsx`, `src/app/App.test.tsx`

**What was found:**

React Router v6.28 (used in this project — `"react-router-dom": "^6.28.0"`) emits console
warnings about v7 breaking changes unless the corresponding future flags are opted in:

- `v7_startTransition` — wraps state updates from router in `React.startTransition`
- `v7_relativeSplatPath` — changes relative routing inside splat routes

`src/main.tsx` uses `<BrowserRouter>` with no `future` prop.
Test files use `<MemoryRouter>` with no `future` prop — warnings appear in the test output.

**What to change:**

`main.tsx`:
```tsx
<BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
```

`InventoryPage.test.tsx` — `renderInventoryPage` helper:
```tsx
<MemoryRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }} initialEntries={['/inventory']}>
```

`App.test.tsx` — both `render(...)` calls:
```tsx
<MemoryRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
<MemoryRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }} initialEntries={['/']}>
```

**Acceptance criteria:**
- No React Router future-flag warnings in `npm run dev` console output
- No React Router future-flag warnings in `npm test` / `vitest` output
- All existing tests continue to pass

---

### UX-006 — Fix fragile empty-items test and clean up test hygiene

**Priority:** Medium
**Files:** `src/pages/InventoryPage.tsx`, `src/pages/InventoryPage.test.tsx`

**What was found:**

The test *"shows the true empty state without a contextual reset action when there are no items
at all"* (line 663–690 of `InventoryPage.test.tsx`) uses a fragile pattern:

```ts
vi.useFakeTimers()       // ← not needed, nothing async in this test
vi.resetModules()        // ← resets the entire module registry
vi.doMock('../features/inventory', async () => { ... })
const { InventoryPage: EmptyInventoryPage } = await import('./InventoryPage')
```

Problems:
1. `vi.useFakeTimers()` is called but no timer is advanced — dead code that slows test isolation.
2. `vi.resetModules()` nukes the module cache for all subsequent tests in the file if cleanup
   is not perfect. The `afterEach(() => vi.useRealTimers())` does not restore modules.
3. `vi.doMock` with a dynamic `await import()` is order-sensitive and can produce
   non-deterministic results depending on test run order.

**What to change:**

1. Add an optional `initialItems` prop to `InventoryPage`:
   ```tsx
   // InventoryPage.tsx
   export function InventoryPage({ initialItems = mockItems }: { initialItems?: Item[] }) {
     const [items, setItems] = useState<Item[]>(initialItems)
     ...
   }
   ```

2. Replace the doMock test with a direct prop injection:
   ```tsx
   it('shows the true empty state without a contextual reset action when there are no items at all', () => {
     render(
       <MemoryRouter future={...} initialEntries={['/inventory']}>
         <InventoryPage initialItems={[]} />
       </MemoryRouter>,
     )
     expect(screen.getByText('No inventory items yet')).toBeInTheDocument()
     expect(
       screen.queryByRole('button', { name: 'Clear search' }),
     ).not.toBeInTheDocument()
   })
   ```
   No fake timers, no dynamic imports, no module resets.

3. Add `afterEach(() => vi.resetModules())` as a safety net only if doMock remains anywhere,
   otherwise remove it.

**Acceptance criteria:**
- The empty-items state test passes without any module mocking
- No `vi.resetModules()` or `vi.doMock()` remains in `InventoryPage.test.tsx`
- `vi.useFakeTimers()` is only present in tests that actually advance timers
- All other `InventoryPage` tests pass unaffected

---

## Execution Order

Tasks can be executed in any order. Suggested grouping for efficiency:

**Batch A (InventoryTable changes):**
- UX-002 + UX-004 together (both modify `InventoryTable.tsx`)

**Batch B (independent single-file changes):**
- UX-001 (BulkActionsBar only)
- UX-005 (main.tsx + test wrappers only)

**Batch C (InventoryPage changes):**
- UX-003 (InventoryPage + InventoryTable `data-row-id`)
- UX-006 (InventoryPage prop + test rewrite)

---

## Progress

| Task    | Status   | Notes |
|---------|----------|-------|
| UX-001  | ⏳ Pending |       |
| UX-002  | ⏳ Pending |       |
| UX-003  | ⏳ Pending |       |
| UX-004  | ⏳ Pending |       |
| UX-005  | ⏳ Pending |       |
| UX-006  | ⏳ Pending |       |
