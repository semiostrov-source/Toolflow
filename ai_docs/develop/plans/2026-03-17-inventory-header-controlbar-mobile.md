# Plan: Inventory Header + Control Bar — Mobile Pass

**Batch**: UI Execution Plan — Batch 1 (Header and control bar)
**Scope**: CSS-only mobile pass on `PageHeader` and `InventoryToolbar`
**Files changed**: `src/index.css` only (no component changes expected)

---

## Current State Findings

### PageHeader (`src/shared/ui/PageHeader.tsx`)

Renders:
```
<header class="page-header">
  <div class="page-header-main">
    <h1 class="page-header-title">{title}</h1>
    <p class="page-header-description">{description}</p>   ← optional
  </div>
  <div class="page-header-actions">{actions}</div>          ← optional
</header>
```

InventoryPage passes: `title="Inventory"`, `description="List of items and stock..."`, no `actions`.

**Current CSS problems on mobile:**
- `.page-header` has **no horizontal padding**. InventoryPage does not use `.page-container` (which carries `padding: 1rem`). `mobile-layout__content` also has no horizontal padding. Result: the `h1` and description text touch the screen edge.
- `margin-bottom: 1rem` is fine.
- The `@media (min-width: 640px)` breakpoint switches to `flex-direction: row` for title + actions — fine for desktop, but mobile (column) path has no padding.
- `page-header-title` has no explicit font size — uses browser `h1` default (~2rem), which is large for a small mobile screen.
- `page-header-description` is `0.9rem` — fine.

---

### InventoryToolbar (`src/features/inventory/components/InventoryToolbar.tsx`)

Renders:
```
<section class="page-section inventory-toolbar">
  <div class="inventory-toolbar-main">

    <div class="inventory-toolbar-search">
      <input type="search" class="inventory-toolbar-search-input" placeholder="Search items" />
      <button class="inventory-toolbar-search-clear-button">Clear</button>  ← only when query non-empty
    </div>

    <div class="inventory-toolbar-actions">
      <button class="inventory-toolbar-add-button">Add Item</button>
      <div class="inventory-toolbar-bulk-selection"> ... </div>  ← only when bulk > 0
    </div>

  </div>
</section>
```

**Inherited from `.page-section`**: `padding: 0.75rem 1rem`, `border-radius: 8px`, `background: #fff`, `border: 1px solid #e6edf0`.

**Current CSS problems on mobile (`< 640px`):**
- `.inventory-toolbar-main` is `flex-direction: column` (search stacked over actions) — this is a reasonable starting point but the "Add Item" button ends up left-aligned in a separate row under the search input with no clear visual relationship.
- `.inventory-toolbar-actions` has `justify-content: flex-start` on mobile — "Add Item" button is left-aligned with no width constraint (renders as a compact label-wide button).
- `.inventory-toolbar-add-button` has no `min-height` — tap target may be under 44px on some browsers.
- No `width: 100%` on the "Add Item" button on mobile — a full-width primary CTA would be more discoverable and better as the primary action on a small screen.
- At `≥ 640px`: `.inventory-toolbar-main` switches to `flex-direction: row`, "Add Item" aligns to `flex-end` — good for tablet/desktop.

---

### InventoryPage composition (`src/pages/InventoryPage.tsx`)

Renders as a fragment `<>`:
1. `<PageHeader title="Inventory" description="..." />`
2. `<InventoryToolbar ... />`
3. `<InventoryFilters ... />`
4. `<InventoryBulkActionsBar ... />` (conditional)
5. `<div class="inventory-workspace"> ... </div>`

**No `.page-container` wrapper** — so no inherited `padding: 1rem` around the header. The `mobile-layout__content` provides only `padding-bottom` for the nav bar, no horizontal/top padding.

---

## Task Breakdown

### HDR-001 — Mobile CSS pass: page header

**File**: `src/index.css`
**Target classes**: `.page-header`, `.page-header-title`, `.page-header-description`

**Planned changes:**

1. Add `padding: 0.75rem 1rem 0` to `.page-header` so the title/description have horizontal breathing room matching the toolbar card's side padding. Remove `margin-bottom: 1rem` in favour of bottom padding or keep it — check visual alignment.
2. Tighten `font-size` on `.page-header-title` for mobile: set `font-size: 1.375rem` (22px) — avoids the oversized browser `h1` default on small screens. At `≥ 640px` can step up to `1.5rem`.
3. Reduce `.page-header-description` `margin-top` slightly to `0` (gap already covered by flex `gap`), and make color consistent (`#57606a` — already correct).
4. No changes needed to `.page-header-actions` (not used in InventoryPage currently).

---

### HDR-002 — Mobile CSS pass: toolbar / control bar

**File**: `src/index.css`
**Target classes**: `.inventory-toolbar-main`, `.inventory-toolbar-actions`, `.inventory-toolbar-add-button`, `.inventory-toolbar-search-input`

**Planned changes:**

1. On mobile (base / no media query): set `.inventory-toolbar-add-button` to `width: 100%` and `min-height: 44px` — makes the primary CTA a full-width tap target on mobile, which is the expected pattern in mobile-first operational apps.
2. Set `.inventory-toolbar-actions` `width: 100%` on mobile so the button can stretch to fill it.
3. Add `box-sizing: border-box` to `.inventory-toolbar-search-input` if not already inherited (it is via `*` selector — no extra rule needed).
4. At `≥ 640px` (existing breakpoint): restore `.inventory-toolbar-add-button` to `width: auto` and `.inventory-toolbar-actions` to `width: auto` — this is already handled by `justify-content: flex-end` at that breakpoint; only `width` needs to be reversed.
5. Increase `.inventory-toolbar-search-input` `min-height` to `44px` for a proper touch target (currently just `padding: 0.5rem 0.75rem` which may be ~36–38px depending on font).

---

### HDR-003 — Verify tests / update if needed

**Files reviewed**: `src/pages/InventoryPage.test.tsx`, `src/features/inventory/components/InventoryToolbar.test.tsx`

**Analysis:**

All test assertions for the header and toolbar use semantic queries:
- `screen.getByRole('heading', { name: 'Inventory' })` — checks the `h1` text, unaffected by CSS.
- `screen.getByPlaceholderText('Search items')` — checks input `placeholder`, unaffected by CSS.
- `screen.getByRole('button', { name: 'Add Item' })` — checks button accessible name, unaffected by CSS.

**Expected outcome**: No test changes required. HDR-003 is a confirmation task — run `vitest run` and `tsc --noEmit` after HDR-001 and HDR-002 to confirm zero regressions.

If for any reason a structural tweak was needed (e.g., adding a wrapper element), revisit this task.

---

## Hard Constraints

- Changes go only in `src/index.css`
- No changes to `InventoryPage.tsx` business logic
- No changes to filter, table, actions, or details panel
- No new component files
- CSS-first, targeted, commit-ready

---

## Success Criteria

After HDR-001 + HDR-002:
- [ ] Page header text has horizontal padding; no text touching screen edges at 375px viewport
- [ ] "Add Item" button is full-width on mobile (< 640px), normal width on desktop
- [ ] All touch targets ≥ 44px for search input and "Add Item" button
- [ ] `vitest run` passes with zero failures
- [ ] `tsc --noEmit` passes

---

## Related Files

| File | Role |
|---|---|
| `src/index.css` | Only file to be modified |
| `src/shared/ui/PageHeader.tsx` | Read-only reference |
| `src/features/inventory/components/InventoryToolbar.tsx` | Read-only reference |
| `src/pages/InventoryPage.tsx` | Read-only reference |
| `src/pages/InventoryPage.test.tsx` | Verify no regressions |
| `src/features/inventory/components/InventoryToolbar.test.tsx` | Verify no regressions |
