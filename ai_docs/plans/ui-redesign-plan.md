# Plan: UI Redesign — Mobile-First ToolFlow Interface

**Created:** 2026-04-02
**Orchestration:** orch-ui-redesign
**Status:** 🔵 Ready
**Goal:** Redesign the ToolFlow mobile web app to a minimalist, Russian-language, card-based interface using Tailwind CSS v4 and Manrope font
**Total Tasks:** 5
**Estimated Time:** ~7–9 hours

---

## Tasks Overview

- [ ] UI-001: Install and configure Tailwind CSS v4 + Manrope font (⏳ Pending)
- [ ] UI-002: Global layout + BottomNavigation Russian labels (⏳ Pending)
- [ ] UI-003: Create ToolCard component (⏳ Pending)
- [ ] UI-004: Rebuild InventoryPage with card list (⏳ Pending)
- [ ] UI-005: Update stub pages with Russian placeholder content (⏳ Pending)

---

## Dependencies Graph

```
UI-001 → UI-002 → UI-003 → UI-004
                         ↘ UI-005
```

All tasks depend on UI-001 completing first (Tailwind available).
UI-003 must complete before UI-004 (ToolCard used in InventoryPage).
UI-005 can run in parallel with UI-003 and UI-004 once UI-002 is done.

---

## Task Details

### UI-001 — Install and configure Tailwind CSS v4 + Manrope font

**Priority:** Critical  
**Estimated time:** 1 hour  
**Dependencies:** None  
**Complexity:** Simple

**Goal:** Add Tailwind CSS v4 to the project and configure Manrope as the default font, keeping all existing tests green (CSS changes do not affect Vitest/JSDOM tests).

**Files affected:**
- `package.json` — add `tailwindcss`, `@tailwindcss/vite`
- `vite.config.ts` — register `@tailwindcss/vite` plugin
- `src/index.css` — add `@import "tailwindcss"` directive and `@font-face` / Google Fonts import for Manrope; set `font-family: 'Manrope', sans-serif` on `body`
- `index.html` — add `<link>` preconnect + stylesheet for Google Fonts Manrope (weights 400, 500, 600, 700, 800)

**Acceptance criteria:**
- `npm run dev` starts without errors
- `npm run build` succeeds without errors
- All 21 existing tests remain green (`npm test`)
- Tailwind utility classes (e.g. `className="flex"`) work in any component
- Browser renders Manrope font on body text

**Implementation notes:**
- Use Tailwind CSS v4 (not v3): the `@tailwindcss/vite` plugin replaces the old `postcss` approach
- Tailwind v4 uses `@import "tailwindcss"` in CSS (not `@tailwind base/components/utilities`)
- Coexist with the existing BEM CSS: Tailwind utilities supplement rather than replace the existing `src/index.css` BEM classes; no BEM class should be removed in this task
- Vitest config uses `jsdom` environment — Tailwind changes are invisible to tests, zero risk

---

### UI-002 — Global layout + BottomNavigation Russian labels

**Priority:** Critical  
**Estimated time:** 1.5 hours  
**Dependencies:** UI-001  
**Complexity:** Moderate

**Goal:** Update the mobile container layout for max-width 430px centered layout, and change all BottomNavigation tab labels from English to Russian. Update the corresponding tests.

**Files affected:**
- `src/shared/ui/BottomNavigation.tsx` — change labels: All items→Все, My items→Мои, Create→Создать, Info→Инфо, Panel→Панель
- `src/shared/ui/BottomNavigation.test.tsx` — **update** all label matchers to Russian: `/Все/`, `/Мои/`, `/Создать/`, `/Инфо/`, `/Панель/`
- `src/app/MobileLayout.tsx` — ensure wrapper structure supports centered 430px constraint
- `src/index.css` — update `.mobile-layout` BEM block: `max-width: 430px; margin: 0 auto; min-height: 100dvh`; update `.bottom-nav` for the new minimalist style (dark bg, icon+label vertical stack, active state highlight)
- Optionally introduce Tailwind utilities on the layout wrappers in place of some BEM CSS

**Acceptance criteria:**
- All 5 nav tabs display Russian labels in the browser
- Active tab highlight works correctly (class `bottom-nav__tab--active` still applied)
- `BottomNavigation.test.tsx` — all 3 tests pass with Russian label matchers
- `MobileLayout.test.tsx` — all 2 tests pass (nav role + outlet child both present)
- App content is capped at 430px max-width and horizontally centered on wider screens

**Implementation notes:**
- The test `'renders all five navigation tabs'` uses `getByRole('link', { name: /.../ })` — the regex must be updated to match Russian text: `/Все/`, `/Мои/`, `/Создать/`, `/Инфо/`, `/Панель/`
- The test `'highlights the active tab'` checks for class `bottom-nav__tab--active` on the `/inventory` route link — the label accessor must change to `/Все/`
- The test `'links point to correct routes'` must also use Russian label accessors but href values (`/inventory`, `/my-items`, etc.) stay unchanged
- `MobileLayout.test.tsx` only checks for `role="navigation"` with `aria-label="Main navigation"` and outlet content — these don't depend on label language, no changes needed
- Keep `aria-label="Main navigation"` on `<nav>` unchanged (used in MobileLayout test)

---

### UI-003 — Create ToolCard component

**Priority:** High  
**Estimated time:** 2 hours  
**Dependencies:** UI-001, UI-002  
**Complexity:** Moderate

**Goal:** Create a new `ToolCard` component that renders a single inventory tool in the card format specified by the design spec.

**Files affected:**
- `src/features/inventory/components/ToolCard.tsx` — new component
- `src/features/inventory/index.ts` — export `ToolCard`
- `src/index.css` — add `.tool-card` BEM block styles (or use Tailwind utilities inline)

**Component interface:**
```typescript
interface ToolCardProps {
  item: Item           // existing domain type from features/inventory/types
  onTransfer?: (id: string) => void   // Передать action
  onService?: (id: string) => void    // Сервис action
  onJournal?: (id: string) => void    // Журнал action
}
```

**Card layout (top → bottom):**
1. **Image area** — `item.photo` or placeholder grey rectangle; category chip (top-left overlay); status chip (top-right overlay, uses `StatusBadge` or equivalent)
2. **Tool name** — large bold Manrope text
3. **Inventory number (SKU)** — monospace font (`font-mono`), smaller, muted color
4. **Owner row** — small avatar circle with initials + owner name text
5. **Action buttons row** — three full-width or evenly-spaced buttons: `Передать` / `Сервис` / `Журнал`

**Acceptance criteria:**
- Component renders without errors
- Tool name, SKU, and status are visible in rendered output
- Three action buttons render with correct Russian labels
- Status chip uses the existing `StatusBadge` component or mirrors its logic
- Component is exported from `src/features/inventory/index.ts`
- No existing tests break (ToolCard is a new file)

**Implementation notes:**
- `Item` type lives in `src/features/inventory/types/domain.ts` — check current fields: `id`, `name`, `sku`, `status`, `createdAt`, `unit`. Fields like `photo`, `category`, `owner` may not exist yet; use optional chaining or fallback placeholders for missing fields
- If `photo`, `category`, `owner` are not on the `Item` type, add them as optional fields to the type (`photo?: string`, `category?: string`, `owner?: string`) — this is non-breaking
- Reuse `StatusBadge` component for the status chip
- Card background: white (`bg-white`), border-radius 16px, subtle shadow
- Font sizes: name ~18px/font-semibold, SKU ~12px/font-mono, owner ~13px

---

### UI-004 — Rebuild InventoryPage with card list

**Priority:** Critical  
**Estimated time:** 2.5 hours  
**Dependencies:** UI-003  
**Complexity:** Complex

**Goal:** Replace the table-based `InventoryPage` layout with a vertical scrollable list of `ToolCard` components. Keep all search/filter/sort domain logic. Update the page-level tests to cover the new card UI.

**Files affected:**
- `src/pages/InventoryPage.tsx` — major rewrite of JSX output; preserve state logic
- `src/pages/InventoryPage.test.tsx` — major update: replace table-specific queries with card-specific queries
- `src/index.css` — add `.inventory-card-list` BEM block styles

**New InventoryPage layout:**
```
<div class="inventory-page">
  <header>              ← page title "Инвентарь" + search input
  <div class="inventory-card-list">
    <ToolCard /> × N   ← rendered for each sortedItems entry
  </div>
  <EmptyState />        ← shown when sortedItems.length === 0
</div>
```

**State to preserve** (all search/sort/filter logic stays unchanged):
- `items`, `searchQuery`, `searchInput`, `sortField`, `sortDirection`
- `filteredItems` memo, `sortedItems` derived sort
- `handleChangeItemStatus`, `handleClearSearch`
- Debounce logic (300ms)

**Remove from JSX** (replace with card list):
- `<PageHeader>` (replace with inline `<h1>Инвентарь</h1>`)
- `<InventoryToolbar>` (inline a simplified `<input>` search in the page header area)
- `<InventoryFilters>` (defer sorting to a later phase or keep as hidden functionality)
- `<InventoryBulkActionsBar>` (mobile card UI doesn't use bulk selection)
- `<InventoryTable>` (replaced by ToolCard list)
- `<InventoryDetailsPanel>` (details shown via card actions, not a side panel)
- Bulk selection state (`bulkSelectedItemIds`, `bulkStatus`, related handlers)

**Test update strategy — InventoryPage.test.tsx:**

Tests to REMOVE (table-specific, no longer applicable):
- `'renders the inventory table header'` — `getByRole('columnheader', { name: 'Name' })`
- `'renders View, Edit, and More actions for at least one row'`
- `'shows the empty details state before any item is selected'`
- `'closes the details panel when the close button is clicked'`
- `'closes the details panel when Escape is pressed'`
- `'returns focus to the row after closing the details panel'`
- `'shows item details and highlights the selected row when View is clicked'`
- `'shows item details when a row is clicked'`
- `'does not open item details when the row checkbox is clicked'`
- `'selects all visible rows via the header checkbox'`
- `'clears selection for all visible rows...'`
- `'shows the indeterminate state on the header checkbox...'`
- `'allows selecting multiple rows via checkboxes...'`
- `'clears bulk selection state when Clear selection is clicked'`
- `'allows changing status in bulk...'`
- `'updates the details panel status when selected item is changed via bulk...'`
- `'enters inline status edit mode when the status badge is clicked'`
- `'updates the status badge when a new status is selected inline'`
- `'cancels inline status editing when clicking outside the editor'`
- `'cancels inline status editing when Escape is pressed'`
- `'closes inline status editor without closing details panel when Escape is pressed'`

Tests to UPDATE (logic preserved, selector updated):
- `'renders the Inventory page header'` — update to find Russian heading `'Инвентарь'`
- `'filters items by name using the search input with debounced search'` — same logic, update placeholder text if changed; cards show item names as text
- `'clears the search input and restores all items when Escape is pressed...'` — update placeholder text
- `'shows and uses a clear button for the search input'` — same
- `'filters items by SKU when searching'` — update to find SKU text within cards
- `'matches SKU search case-insensitively'` — update selectors
- `'shows the empty table state when no items match...'` — update to check card-based empty state text
- `'clears search from the contextual empty state...'` — update selectors
- `'clears the selected item when it is filtered out...'` — remove details-panel assertions, verify card disappearance
- `'does not apply filters before the debounce delay elapses'` — same logic, card-based selectors
- `'sorts items by Name...'` — update to read card names instead of table cells
- `'sorts items by Created...'` — update to read card names
- `'keeps selected item selected after sorting when still present'` — adapt if card selection is implemented
- `'shows the true empty state without a contextual reset action when there are no items at all'` — update empty-state text
- `'deselects items hidden by search filter'` — simplify (no checkboxes); verify filtered cards only
- `'preserves bulk selection after sorting changes'` — simplify or remove if bulk not in MVP cards
- `'shows result count when search is active'` — same aria-live behaviour
- `'Escape key clears search and keeps focus on the search input'` — same

Tests to ADD (new card behaviours):
- `'renders a ToolCard for each item'` — verify N cards rendered
- `'renders tool name and SKU in each card'`
- `'action button Передать is present on each card'`

**Acceptance criteria:**
- `InventoryPage` renders ToolCard items for all mock items
- Search input (debounced 300ms) filters the visible cards
- Empty state message shown when no items match
- Page heading is "Инвентарь"
- All updated/new tests pass; removed tests are deleted from the file
- Existing domain unit tests unaffected (`changeItemStatus.test.ts`, `bulkChangeStatus.test.ts`, `syncSelectedItem.test.ts`, `InventoryTable.test.tsx`, etc.)

**Implementation notes:**
- The InventoryTable, InventoryToolbar, InventoryFilters, InventoryBulkActionsBar, InventoryDetailsPanel components and their individual test files are **NOT deleted** — they continue to exist and their own tests remain green. InventoryPage simply stops importing/rendering them.
- Sort controls: keep `sortField` / `sortDirection` state and `sortedItems` logic, but the UI sort controls can be a simple `<select>` at the top or omitted in the first pass (cards will still be sorted by default)
- The `Item` type may need `photo`, `category`, `owner` optional fields added (see UI-003 notes)
- Use BEM class `.inventory-card-list` for the cards wrapper with `display: flex; flex-direction: column; gap: 12px; padding: 0 16px 100px` (bottom padding to clear BottomNav)

---

### UI-005 — Update stub pages with Russian placeholder content

**Priority:** Medium  
**Estimated time:** 30 minutes  
**Dependencies:** UI-002  
**Complexity:** Simple

**Goal:** Update the four stub pages to display Russian placeholder content consistent with the new design language.

**Files affected:**
- `src/pages/MyItemsPage.tsx` — Russian heading + placeholder
- `src/pages/CreatePage.tsx` — Russian heading + placeholder
- `src/pages/InfoPage.tsx` — Russian heading + placeholder
- `src/pages/PanelPage.tsx` — Russian heading + placeholder

**Russian content per page:**
- `MyItemsPage` — `<h1>Мои инструменты</h1>` + `<p>Здесь будут отображаться инструменты, закреплённые за вами.</p>`
- `CreatePage` — `<h1>Добавить инструмент</h1>` + `<p>Форма создания нового инструмента появится здесь.</p>`
- `InfoPage` — `<h1>Инфо</h1>` + `<p>Справочная информация о системе.</p>`
- `PanelPage` — `<h1>Панель управления</h1>` + `<p>Административные функции будут доступны здесь.</p>`

**Acceptance criteria:**
- Each stub page renders the correct Russian heading and paragraph
- Pages are accessible via bottom navigation routes
- No test regressions (`DashboardPage.test.tsx` and similar are unaffected)

**Implementation notes:**
- Apply consistent layout: each page wrapped in a `<div className="page-content">` with `padding: 16px`
- Use `<h1>` for the main heading (matching the design spec's hierarchy)
- No tests currently cover these stub pages, so no test updates required

---

## Architecture Decisions

- **Tailwind v4 + BEM coexistence:** Tailwind utilities are added alongside existing BEM classes. BEM remains the primary system for component-level styles; Tailwind utilities are used for layout and spacing on new components (ToolCard, InventoryPage card list). This avoids a full CSS migration scope.
- **Table components preserved:** `InventoryTable.tsx` and related components are not deleted. InventoryPage just stops importing them. This keeps 10+ existing tests green at zero cost.
- **No new domain types for MVP:** `photo`, `category`, `owner` fields added as optional on `Item` to avoid breaking domain tests. Mock data provides sensible fallbacks.
- **No bulk selection in card UI:** The mobile card UX does not include bulk-select checkboxes (MVP scope). All bulk-selection tests for `InventoryPage.test.tsx` are removed rather than updated.
- **BottomNavigation tests updated, not deleted:** Switching labels from English to Russian is a breaking label change — the tests are updated (not removed) to test the same behavior with correct Russian matchers.

---

## Risk Assessment

| Risk | Severity | Mitigation |
|------|----------|-----------|
| Tailwind v4 vite plugin incompatibility | Medium | Use exact `@tailwindcss/vite` package; check peer deps against current Vite version |
| InventoryPage tests: large test file rewrite | High | Detailed per-test migration plan in UI-004; keep domain tests untouched |
| Missing `Item` type fields (photo, owner, category) | Low | Add as optional fields; use fallback placeholders in ToolCard |
| BEM + Tailwind class conflicts | Low | Tailwind utilities don't conflict with BEM class names; purge is content-based |
| Manrope font loading in tests (JSDOM) | None | JSDOM ignores fonts; no test impact |
