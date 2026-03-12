# PageHeader Component & Page Skeleton

## Overview

The `PageHeader` component provides a reusable, mobile-first header for all application pages. Combined with a `.page-section` content block, it forms a consistent page skeleton used across the app.

**Component Location:** `src/shared/ui/PageHeader.tsx`  
**Styles Location:** `src/index.css` (app-shell section)

## PageHeader Component

### Purpose

`PageHeader` renders a semantic `<header>` element with consistent styling and layout. It supports:
- **Title** (required) — main page heading
- **Description** (optional) — brief subheading or context
- **Actions** (optional) — buttons, controls, or other interactive elements

### Props

```typescript
type PageHeaderProps = {
  title: string              // Required: page title
  description?: string       // Optional: secondary text
  actions?: React.ReactNode  // Optional: action buttons/controls
}
```

### Basic Usage

```tsx
import { PageHeader } from '../shared/ui'

export function MyPage() {
  return (
    <>
      <PageHeader 
        title="Inventory"
        description="Manage warehouse stock levels"
      />
      <section className="page-section">
        {/* Page content here */}
      </section>
    </>
  )
}
```

### With Actions

```tsx
<PageHeader
  title="Requests"
  description="Monitor incoming and outgoing shipments"
  actions={
    <button className="btn">Create Request</button>
  }
/>
```

### Responsive Behavior

- **Mobile (< 640px):** Stacked layout (title, description, actions)
- **Desktop (≥ 640px):** Horizontal layout with actions aligned right

## Page Skeleton

### Pattern

All pages follow a simple two-part structure:

```tsx
<>
  <PageHeader title="..." description="..." actions={...} />
  <section className="page-section">
    {/* Page-specific content */}
  </section>
</>
```

### Current Pages Using Skeleton

- `DashboardPage` — High-level overview
- `InventoryPage` — Stock management (placeholder)
- `WarehousesPage` — Location management (placeholder)
- `RequestsPage` — Shipment tracking (placeholder)

## Adding a New Page

Follow this checklist to create a new page with the standard skeleton:

1. **Create page file** in `src/pages/MyPage.tsx`
2. **Import PageHeader** from `'../shared/ui'`
3. **Add PageHeader** with `title` and optional `description`
4. **Add content section** with `className="page-section"` for the main content area
5. **Add PageHeader tests** to verify title and description render correctly (optional, matches `DashboardPage.test.tsx` pattern)
6. **Run tests** to ensure lint and test suite pass

## Styling

All PageHeader and page-section styles are defined in `src/index.css` under the "Page shell" section:

- `.page-header` — flex container, responsive direction
- `.page-header-main` — title and description wrapper
- `.page-header-title` — the `<h1>` element
- `.page-header-description` — optional subtitle
- `.page-header-actions` — actions container
- `.page-section` — white card-like container for page content

Both light and dark mode variants are included. No additional CSS is needed when using the standard skeleton.
