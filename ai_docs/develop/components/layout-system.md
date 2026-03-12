# Layout System

**Last updated:** 2025-03-12

This document describes the application layout: the shell (AppLayout), Sidebar, PageContainer, routing, and styling. No external UI library is used; layout and components are implemented with React and CSS in the project.

---

## Overview

The layout provides a consistent shell for all main pages: a **Header** at the top, a **Sidebar** for navigation, and a **main content area** where route content is rendered inside **PageContainer** via React Router’s **Outlet**.

- **AppLayout** (`src/app/AppLayout.tsx`) — Root shell: Header, Sidebar, overlay (on small screens), and main area. It owns sidebar open/close state and passes it to Header and Sidebar.
- **Sidebar** (`src/shared/ui/Sidebar.tsx`) — Navigation with `NavLink` and active-state styling. Optional `open` and `onClose` props for mobile behaviour.
- **PageContainer** (`src/shared/ui/PageContainer.tsx`) — Wraps page content with a max-width and padding so every page has consistent horizontal bounds and spacing.

---

## How They Work Together

1. **App.tsx** defines a **layout route**: the route at `path="/"` has `element={<AppLayout />}`. All child routes (index, `inventory`, `warehouses`, `requests`) render inside that layout.
2. **AppLayout** renders `<Header>`, the **Sidebar**, an optional **overlay**, and `<div className="app-main">`. Inside `app-main` it renders `<PageContainer><Outlet /></PageContainer>`.
3. The **Outlet** is where React Router injects the matched child route (e.g. Dashboard, Inventory). So every page automatically gets the same header, sidebar, and padded main area.
4. **Sidebar** receives `open={sidebarOpen}` and `onClose={() => setSidebarOpen(false)}` from AppLayout so it can be shown/hidden on small screens and closed when the user taps a link or the overlay.

---

## Responsive Behaviour

- **Breakpoint:** 768px. Below that, the layout is “mobile”; from 768px up, it’s “desktop”.
- **Sidebar (small screens):**
  - Sidebar is **off-canvas** (fixed, translated off-screen). It slides in when `open` is true.
  - A **menu button** in the Header toggles the sidebar; it is only visible below 768px.
  - An **overlay** is rendered when the sidebar is open. Clicking it or pressing Escape closes the sidebar. The overlay is hidden from 768px up.
  - Sidebar has an optional close button (×) on small screens; `onClose` is used for that and for overlay/link clicks.
- **Sidebar (768px and up):**
  - Sidebar is always visible in a vertical column to the left of the main content. The menu button and overlay are hidden. `open`/`onClose` have no visual effect; the close button is not shown.
- **Navigation links:** Use `NavLink` with `className={({ isActive }) => ... }` so the current route is highlighted (e.g. `.app-sidebar-link.active`). Sidebar items: Dashboard (`/`), Inventory (`/inventory`), Warehouses (`/warehouses`), Requests (`/requests`).

---

## Styling

- **Location:** All layout and shell styles live in **`src/index.css`**.
- **No external UI library:** Layout, sidebar, overlay, menu button, and dark mode are implemented with plain CSS (no Tailwind/Chakra/MUI etc. in this layout).
- **Classes used:**  
  App shell: `.app`, `.app-header`, `.app-layout`, `.app-main`.  
  Sidebar: `.app-sidebar`, `.app-sidebar--open`, `.app-sidebar-overlay`, `.app-sidebar-nav`, `.app-sidebar-link`, `.app-sidebar-close`.  
  Header: `.app-menu-btn`, `.app-brand`, `.app-nav`, `.app-nav-link`.  
  Content: `.page-container`.
- **Dark mode:** Handled in `index.css` with `@media (prefers-color-scheme: dark)` for colours and borders.

---

## For Developers

### How the layout route works

- In **`src/app/App.tsx`**, a single parent route uses `element={<AppLayout />}`. All actual pages are **child routes** of that parent.
- **AppLayout** renders once and stays mounted when switching between Dashboard, Inventory, etc. Only the **Outlet** content changes. So the header and sidebar do not remount on navigation.

### How to add a new page

1. **Create the page component** (e.g. in `src/pages/`) and export it (e.g. from `src/pages/index.ts` if you use a barrel).
2. **Add a child route** in `App.tsx` inside the same `<Route path="/" element={<AppLayout />}>`:
   - `index` → Dashboard (already there).
   - For a new path, e.g. `settings`:  
     `<Route path="settings" element={<SettingsPage />} />`
3. **Add a Sidebar link** in `src/shared/ui/Sidebar.tsx`: extend the `navItems` array with e.g. `{ to: '/settings', label: 'Settings', end: false }`.
4. The new page will automatically render inside the existing layout (Header + Sidebar + PageContainer). No change to AppLayout is required.

### Optional: page without layout

If you ever need a route that does **not** use AppLayout (e.g. a full-screen login page), define it as a **sibling** of the layout route in `App.tsx`, e.g. `<Route path="/login" element={<LoginPage />} />` outside the `element={<AppLayout />}` route. That route will not have the shell or PageContainer.
