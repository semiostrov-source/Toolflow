# Features Layer Architecture

## Overview

The `src/features/` directory organizes domain-specific functionality into self-contained feature modules. This architecture supports scalability, maintainability, and clear ownership as ToolFlow grows.

Each feature module encapsulates its own components, types, and domain logic, with a public API boundary defined by `index.ts`. This approach keeps related concerns together and makes dependencies between features explicit and manageable.

## Why Features?

- **Scalability**: Add new features without touching existing code.
- **Clarity**: Each feature has a single, well-defined responsibility.
- **Testability**: Features can be tested and developed in isolation.
- **Onboarding**: New team members understand the structure quickly.
- **Refactoring**: Moving or removing a feature is straightforward.

---

## Current Feature Modules

### Inventory

**Location**: `src/features/inventory/`

**Responsibility**: Managing items and their movements across the system—stock levels, incoming and outgoing item flows, and basic tracking for the MVP.

**Contents**:
- `index.ts` – Public API boundary
- `components/` – Inventory-specific UI (item lists, movement tables, filters, detail panels)
- `types/` – Domain types (items, stock levels, movements)

**Scope**: Encapsulates all inventory-related logic and presentation. Will evolve to support movement history, reconciliation workflows, and integrations with warehouse and request flows.

---

### Warehouses

**Location**: `src/features/warehouses/`

**Responsibility**: Representing storage locations, their structure, capacity, and high-level status.

**Contents**:
- `index.ts` – Public API boundary
- `components/` – Warehouse-specific UI (warehouse browsers, capacity views, location panels)
- `types/` – Domain types (locations, zones, capacity, status)

**Scope**: Encapsulates warehouse-centric workflows. Will expand to include zone-level views, capacity signals, and cross-linking with inventory and request flows.

---

### Requests

**Location**: `src/features/requests/`

**Responsibility**: Service, write-off, and related operational flows that act on inventory and warehouses.

**Contents**:
- `index.ts` – Public API boundary
- `components/` – Request-specific UI (request creators, reviewers, trackers)
- `types/` – Domain types (request types, lifecycle, validation rules)

**Scope**: Encapsulates the request lifecycle and business rules. Will support richer request workflows, status transitions, and cross-linking with inventory and warehouse data.

---

## Structure and Usage

### `index.ts` — Public API Boundary

The `index.ts` file is the single entry point for importing anything from a feature module:

```typescript
// Good: Import from public boundary
import { InventoryItem, InventoryList } from '@/features/inventory';

// Bad: Bypass the boundary
import { InventoryList } from '@/features/inventory/components';
```

**Guidelines**:
- Export all public types, components, and utilities from `index.ts`.
- Keep implementation details private (don't export internal helpers).
- Update `index.ts` as the feature grows to maintain a clean public API.

### `components/` — Feature UI

React components that present domain-specific data and interactions.

**Guidelines**:
- Store only components specific to this feature.
- Name components clearly (e.g., `InventoryList`, `WarehousePanel`).
- Keep shared or cross-feature UI primitives in `src/shared/components`.
- Document component purpose in component-level comments or a `components/README.md`.

### `types/` — Domain Types

TypeScript types and interfaces describing the feature's domain.

**Guidelines**:
- Define core data structures (e.g., `Item`, `StockLevel`, `Movement`).
- Keep types independent of API or storage details.
- Reuse shared types from `src/shared/types` when appropriate.
- Use descriptive names and document complex types with JSDoc comments.

### Additional Directories

As features mature, other directories may be added:

- `utils/` – Helper functions and domain logic.
- `hooks/` – React hooks for feature-specific state or side effects.
- `stores/` – State management (if using Zustand, Jotai, etc.).
- `api/` – API calls and server communication (optional; may live in `src/api/`).
- `__tests__/` – Unit and integration tests for the feature.

---

## Adding a New Feature Module

### Step 1: Create the Directory Structure

```
src/features/[feature-name]/
├── index.ts
├── README.md
├── components/
│   └── README.md
└── types/
    └── README.md
```

### Step 2: Write READMEs

**`README.md`** (root):
Brief description of the feature's responsibility and scope. Align with MVP and roadmap goals.

**`components/README.md`**:
Explain what kinds of components live here and why. Clarify the distinction from shared components.

**`types/README.md`**:
Describe the domain types and domain-specific concepts this feature encapsulates.

### Step 3: Start with `index.ts`

```typescript
// [Feature name] feature public API boundary.
// Export [feature]-related types, components, and utilities from here as they are implemented.
export {};
```

Update `export {}` as you add components and types.

### Step 4: Build Out Components and Types

- Add components to `components/` with clear, focused purposes.
- Define types in `types/` to represent the domain.
- Update `index.ts` to export them.

### Example: A Simple Feature

```
src/features/reports/
├── index.ts
├── README.md
├── components/
│   ├── README.md
│   ├── ReportTable.tsx
│   └── ReportFilters.tsx
├── types/
│   ├── README.md
│   └── report.ts (exports Report, ReportFilter, etc.)
```

`index.ts`:
```typescript
export { ReportTable, ReportFilters } from './components/ReportTable';
export type { Report, ReportFilter } from './types/report';
```

---

## Key Principles

1. **One Responsibility Per Feature**: Each feature should have a single, well-defined domain concern.
2. **Clear Boundaries**: Use `index.ts` to enforce a public API; don't import from subdirectories.
3. **Minimal Cross-Feature Dependencies**: Features should depend on shared code and minimal coupling between features.
4. **Documentation**: Keep READMEs up-to-date as features evolve.
5. **Scalability**: Add directories (`utils/`, `hooks/`, `api/`) as needed without changing the structure.

---

## Related Documentation

- [Product Definition](../PRODUCT.md)
- [MVP Definition](../MVP.md)
- [Development Roadmap](../ROADMAP.md)
