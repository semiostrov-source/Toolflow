# Plan: Navigation + App Structure Reset

**Created:** 2026-03-17
**Orchestration:** orch-nav-reset
**Status:** Ready
**Goal:** Replace sidebar-driven desktop layout with mobile-first bottom navigation app shell
**Total Tasks:** 5
**Priority:** High

---

## Current Structure (What Exists Now)

### App Shell
- **`App.tsx`** — `<Routes>` with 4 nested routes under `<AppLayout />`
  - `/` → DashboardPage
  - `/inventory` → InventoryPage
  - `/warehouses` → WarehousesPage
  - `/requests` → RequestsPage
- **`AppLayout.tsx`** — Desktop-first shell: Header (top bar) + Sidebar (left nav, collapsible on mobile with overlay) + main content area (`<Outlet />` inside `<PageContainer />`)
- **`main.tsx`** — `<BrowserRouter>` wrapping `<App />`

### Navigation
- **`Sidebar.tsx`** — Left sidebar with 4 `<NavLink>` items (Dashboard, Inventory, Warehouses, Requests). On mobile: slides in from left as a fixed panel with overlay
- **`Header.tsx`** — Top header with hamburger button (hidden on desktop 768px+) + "ToolFlow" brand link

### Pages
- **`DashboardPage.tsx`** — Placeholder ("metrics once the core workflows are in place")
- **`InventoryPage.tsx`** — **Full feature** (search, sort, bulk actions, details panel, status changes). Must NOT be modified
- **`WarehousesPage.tsx`** — Placeholder
- **`RequestsPage.tsx`** — Placeholder

### Styling
- **Single `index.css`** — Plain CSS, no framework, BEM-ish class naming
- Responsive breakpoints: 640px, 768px
- Light/dark theme via `prefers-color-scheme`
- All layout CSS (`.app`, `.app-layout`, `.app-sidebar`, `.app-main`, etc.) lives in `index.css`

### Testing
- Vitest + React Testing Library + jsdom
- `App.test.tsx` — Tests for brand text + 4 sidebar nav links + dashboard heading at `/`
- `AppLayout.test.tsx` — Tests for Header/Sidebar rendering, Outlet content, `.app`/`.app-layout`/`.app-main` structure
- `Sidebar.test.tsx` — Tests for 4 nav links + active state + aria-label
- `InventoryPage.test.tsx` — Inventory-specific tests (must remain green)

### Barrel Exports
- `src/pages/index.ts` — Exports DashboardPage, InventoryPage, WarehousesPage, RequestsPage
- `src/shared/ui/index.ts` — Exports Header, PageContainer, Sidebar, PageHeader

---

## Target Structure (What We're Building)

### New Navigation Model
5 bottom tabs replacing the sidebar:
1. **All items** (`/`) → Existing InventoryPage (no changes)
2. **My items** (`/my-items`) → New placeholder page
3. **Create** (`/create`) → New placeholder page
4. **Info** (`/info`) → New placeholder page
5. **Panel** (`/panel`) → New placeholder page

### New Components
- **`BottomNavigation`** — Fixed bottom bar with 5 tab buttons, mobile-first
- **`MobileLayout`** — Minimal shell: content area (with padding/scroll) + BottomNavigation at bottom, no sidebar

### What Gets Removed from Active Path
- `AppLayout.tsx` — No longer used as the route layout (file stays, just not imported in App.tsx)
- `Sidebar.tsx` — No longer rendered (file stays, just not used)
- `Header.tsx` — No longer rendered in the new layout (file stays)
- DashboardPage, WarehousesPage, RequestsPage — Replaced by new pages

---

## Tasks

- [ ] NAV-001: Create placeholder pages (Pending)
- [ ] NAV-002: Create BottomNavigation component (Pending)
- [ ] NAV-003: Create MobileLayout component (Pending)
- [ ] NAV-004: Rewire App.tsx routing (Pending)
- [ ] NAV-005: Update and create tests (Pending)

---

## Task Details

### NAV-001: Create placeholder pages + update barrel

**Priority:** High
**Complexity:** Simple
**Dependencies:** None

**Files to create:**
- `src/pages/MyItemsPage.tsx`
- `src/pages/CreatePage.tsx`
- `src/pages/InfoPage.tsx`
- `src/pages/PanelPage.tsx`

**Files to modify:**
- `src/pages/index.ts` — Add exports for 4 new pages

**What to implement:**
- Each page uses `<PageHeader>` with title + description, plus a `<section className="page-section">` with the operational placeholder text:
  - MyItemsPage: title "My Items", description "Items assigned to you", placeholder "Items assigned to you will appear here"
  - CreatePage: title "Create", description "Create new records", placeholder "Create new inventory items, movements, or requests"
  - InfoPage: title "Info", description "System information", placeholder "System information, help, and settings"
  - PanelPage: title "Panel", description "Operational dashboard", placeholder "Operational dashboard and quick actions"
- Follow exact pattern of existing DashboardPage / WarehousesPage / RequestsPage (import PageHeader, return fragment with PageHeader + section)
- Update `src/pages/index.ts` barrel to export all new pages

**Acceptance criteria:**
- 4 new page components exist and render without errors
- Each shows its title via PageHeader and placeholder text in a section
- Barrel export includes all new pages
- No changes to InventoryPage or any inventory code

---

### NAV-002: Create BottomNavigation component + CSS

**Priority:** High
**Complexity:** Moderate
**Dependencies:** None

**Files to create:**
- `src/shared/ui/BottomNavigation.tsx`

**Files to modify:**
- `src/shared/ui/index.ts` — Add BottomNavigation export
- `src/index.css` — Add bottom navigation CSS

**What to implement:**
- `BottomNavigation` component with 5 `<NavLink>` tabs:
  1. "All items" → `/` (end: true)
  2. "My items" → `/my-items`
  3. "Create" → `/create`
  4. "Info" → `/info`
  5. "Panel" → `/panel`
- Each tab: icon (use simple Unicode/emoji or inline SVG) + label text below icon
- Use `<nav>` with `aria-label="Main navigation"` for accessibility
- Active tab highlighted via NavLink `isActive` + CSS class
- Fixed to bottom of viewport, full width, safe-area-inset-bottom padding for notched devices

**CSS to add in `index.css`:**
- `.bottom-nav` — `position: fixed; bottom: 0; left: 0; right: 0; display: flex; background: #fff; border-top: 1px solid #e6edf0; z-index: 50; padding-bottom: env(safe-area-inset-bottom, 0)`
- `.bottom-nav-link` — Flex column, centered, equal width (`flex: 1`), tap target min 48px height, font-size 0.7rem for label
- `.bottom-nav-link.active` — Highlighted color
- `.bottom-nav-icon` — Icon sizing
- Dark mode variants

**Acceptance criteria:**
- BottomNavigation renders 5 tabs with correct labels and routes
- Active tab is visually highlighted
- Component is accessible (nav landmark, aria-label)
- CSS handles light and dark modes
- Exported from shared/ui barrel

---

### NAV-003: Create MobileLayout component + CSS

**Priority:** High
**Complexity:** Simple
**Dependencies:** NAV-002

**Files to create:**
- `src/app/MobileLayout.tsx`

**Files to modify:**
- `src/index.css` — Add mobile layout CSS

**What to implement:**
- `MobileLayout` component that renders:
  - A main content area (`<main>` with `className="mobile-content"`) containing `<PageContainer><Outlet /></PageContainer>`
  - `<BottomNavigation />` at the bottom
- No Header, no Sidebar — just content + bottom nav
- Content area must have bottom padding to clear the fixed bottom nav (~60-70px)

**CSS to add in `index.css`:**
- `.mobile-layout` — `min-height: 100vh; display: flex; flex-direction: column`
- `.mobile-content` — `flex: 1; overflow-y: auto; padding-bottom: 4rem` (clears bottom nav)

**Acceptance criteria:**
- MobileLayout renders content from Outlet inside PageContainer
- BottomNavigation is visible at the bottom
- Content area does not get hidden behind the bottom nav
- No sidebar or header visible

---

### NAV-004: Rewire App.tsx routing

**Priority:** High
**Complexity:** Simple
**Dependencies:** NAV-001, NAV-003

**Files to modify:**
- `src/app/App.tsx`

**What to implement:**
- Replace the `<AppLayout />` wrapper route with `<MobileLayout />`
- Replace 4 old routes with 5 new routes:
  1. `<Route index element={<InventoryPage />} />` — `/` shows All items (inventory)
  2. `<Route path="my-items" element={<MyItemsPage />} />`
  3. `<Route path="create" element={<CreatePage />} />`
  4. `<Route path="info" element={<InfoPage />} />`
  5. `<Route path="panel" element={<PanelPage />} />`
- Update imports: remove old page imports (DashboardPage, WarehousesPage, RequestsPage), add new page imports (MyItemsPage, CreatePage, InfoPage, PanelPage)
- Import MobileLayout instead of AppLayout

**Acceptance criteria:**
- `/` renders InventoryPage inside MobileLayout
- `/my-items`, `/create`, `/info`, `/panel` render their respective placeholder pages
- Bottom navigation is visible and functional on all routes
- No sidebar or header visible
- Old routes (`/inventory`, `/warehouses`, `/requests`) are gone
- InventoryPage itself is completely unchanged

---

### NAV-005: Update and create tests

**Priority:** High
**Complexity:** Moderate
**Dependencies:** NAV-001, NAV-002, NAV-003, NAV-004

**Files to modify:**
- `src/app/App.test.tsx` — Rewrite to test new routing structure
- `src/app/AppLayout.test.tsx` — Keep or skip (AppLayout still exists as a file, tests still valid in isolation)

**Files to create:**
- `src/shared/ui/BottomNavigation.test.tsx`
- `src/app/MobileLayout.test.tsx`
- `src/pages/MyItemsPage.test.tsx` (optional — simple smoke test)
- `src/pages/CreatePage.test.tsx` (optional — simple smoke test)
- `src/pages/InfoPage.test.tsx` (optional — simple smoke test)
- `src/pages/PanelPage.test.tsx` (optional — simple smoke test)

**What to implement:**

_App.test.tsx updates:_
- Test that `/` renders InventoryPage content (heading "Inventory")
- Test that bottom navigation is rendered with all 5 tabs
- Test navigation to `/my-items`, `/create`, `/info`, `/panel`
- Remove tests for old sidebar nav links (Dashboard, Inventory, Warehouses, Requests)

_BottomNavigation.test.tsx:_
- Renders 5 nav links with correct labels
- Correct link targets (/, /my-items, /create, /info, /panel)
- Active state works for each route
- Has `nav` landmark with aria-label

_MobileLayout.test.tsx:_
- Renders Outlet content
- Renders BottomNavigation
- Has `.mobile-layout` structure
- No sidebar or header elements

_Page smoke tests (optional):_
- Each placeholder page renders its heading and placeholder text

**Acceptance criteria:**
- All new tests pass
- All existing InventoryPage tests remain green (unchanged)
- Sidebar.test.tsx remains green (tests Sidebar in isolation — component still exists)
- AppLayout.test.tsx remains green (tests AppLayout in isolation — component still exists)
- No broken tests

---

## Dependencies Graph

```
NAV-001 (pages)  ───────────┐
                             ├──► NAV-004 (routing) ──► NAV-005 (tests)
NAV-002 (BottomNav) ──► NAV-003 (MobileLayout) ┘
```

- NAV-001 and NAV-002 can run **in parallel** (no mutual dependency)
- NAV-003 depends on NAV-002
- NAV-004 depends on NAV-001 + NAV-003
- NAV-005 depends on all prior tasks

---

## Architecture Decisions

- **Plain CSS only** — No CSS framework; follow existing BEM-ish pattern in `index.css`
- **No Header in new layout** — The BottomNavigation replaces all navigation; the "ToolFlow" brand is not shown in the new layout (can be added later)
- **Old components kept as files** — `AppLayout.tsx`, `Sidebar.tsx`, `Header.tsx` remain in the codebase (not deleted) but are no longer imported/rendered in the active layout path. Their tests remain valid in isolation.
- **`/` = InventoryPage** — The default route maps to the existing Inventory page, which is the primary operational view
- **Unicode icons** — Use simple Unicode symbols for bottom nav icons to avoid adding icon library dependencies. Can be upgraded to SVG icons later.
- **No global state** — All navigation is URL-based via react-router-dom NavLink

## Implementation Notes

- Use `react-router-dom` v6 features already in the project: `NavLink`, `Outlet`, `Routes`, `Route`
- Follow the existing `MemoryRouter` + `future` flags pattern in tests
- Maintain `env(safe-area-inset-bottom)` in CSS for iOS notch support
- Bottom nav height ~56-60px; content padding-bottom should match
