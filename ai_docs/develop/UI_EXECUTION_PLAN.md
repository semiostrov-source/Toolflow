# UI Execution Plan

## Purpose

This document defines how ToolFlow UI, UX, product flows, and logic must evolve from now on.

The goal is not to build a generic admin dashboard.

The goal is to build a mobile-first operational product for real daily work with inventory, transfers, service flows, write-off flows, and role-based actions.

---

## Product Direction

ToolFlow must evolve as a:

- mobile-first operational system
- action-oriented product
- clear and fast daily work tool
- role-aware enterprise interface
- future-ready multi-company system

ToolFlow must NOT evolve as a:

- generic desktop admin template
- dashboard-first analytics product
- page-shell with disconnected placeholder screens
- table-only CRUD system

---

## Core UX Model

The main user experience must be based on:

- fast access to actions
- clear statuses
- simple navigation
- minimum cognitive load
- mobile-first interaction patterns
- predictable screen behavior
- focused operational flows

Primary navigation modes:

1. All items
2. My items
3. Create
4. Info
5. Panel

These are not decorative pages.
They are core working modes of the product.

---

## Execution Rules

From this point forward, every UI-related batch must be:

- visually observable
- narrow in scope
- commit-ready
- safe for architecture
- aligned with the operational product direction

Each batch must improve at least one of:

- interface clarity
- action clarity
- information hierarchy
- workflow speed
- role-based visibility
- state readability

Do not implement broad redesigns.
Do not mix multiple unrelated UI problems in one batch.
Do not introduce placeholder-heavy structures unless they support the final product model.

---

## Batch Design Principle

Each batch must follow this structure:

1. visible user-facing improvement
2. minimal required logic support
3. test/build verification
4. commit-ready diff

Do not build logic in isolation for future UI.
Do not build screens that do not fit the operational model.

---

## Current UI Priorities

Current UI polishing order:

### Batch 1. Header and control bar
Goal:
- improve the top area of the Inventory screen
- make primary action obvious
- improve search and top-level hierarchy

### Batch 2. Filters block
Goal:
- make filters readable
- reduce visual clutter
- improve layout and grouping

### Batch 3. Inventory row design
Goal:
- make each row easier to scan
- reduce action noise
- move from “table overload” toward “operational item row”

### Batch 4. Item actions
Goal:
- define and expose the real primary actions
- align actions with product logic
- avoid weak generic actions like View / Edit / More as the main interaction model

### Batch 5. States and feedback
Goal:
- improve empty, loading, selected, disabled, and success/error states

### Batch 6. Role-based flows
Goal:
- expose different actions and screens based on role
- prepare UI for admin/director/accountant/warehouse logic

---

## Functional Direction

UI and functionality must evolve together.

We are not polishing visuals in isolation.

Every important screen must gradually reflect the real business logic, including:

- unit and bulk items
- warehouse and object context
- transfer flows
- receiving flows
- service flows
- write-off flows
- journal/history
- role-based permissions
- future multi-company support

---

## Language Direction

For now:
- internal code and structure remain in English
- visual text may later move to localization/i18n
- Russian discussion is allowed in planning and review

Do not introduce rushed i18n before the main UX model is stable.

---

## Design Quality Principles

ToolFlow UI should feel:

- modern
- clean
- calm
- operational
- professional
- lightweight
- clear under pressure

Reference principles:
- Apple: quality and calmness
- Linear: speed and focus
- GitHub: clarity in lists, statuses, and actions
- Notion: structure and simplicity

This does NOT mean copying their visuals directly.
It means borrowing principles of interface quality.

---

## Change Control

Before any UI batch:
- confirm clean git baseline
- confirm exact batch scope
- avoid unrelated changes
- avoid speculative future architecture

After any UI batch:
- review visually
- review diff
- run tests
- run build
- prepare commit

---

## Current Operating Rule

ToolFlow development must now proceed through controlled visual batches.

The product must become better step by step on screen, not only in architecture.

## Current Accepted Baseline

The following is the accepted current baseline for UI evolution:

- bottom navigation is the primary navigation model
- Inventory is the current main operational surface
- the previous desktop-sidebar-centered dashboard model is deprecated as the primary UX
- current UI work must refine the new shell, not revert to the old one

## Out of Scope for Current UI Polishing

The current UI polishing sequence does not include:

- backend implementation
- full auth implementation
- complete role engine
- analytics expansion
- dashboard-first redesign
- broad visual redesign of all screens at once

## Next Screen Priority After Inventory

After the current Inventory polishing sequence, the next UI priorities are expected to be:

1. Create flow
2. Info / journal surface
3. Panel / role-aware admin entry points

## UI Decision Rule

When making UI decisions:

- prefer clarity over completeness
- prefer fewer actions over many weak actions
- prefer obvious primary action over multiple equal options
- prefer readable layout over dense information
- prefer operational usefulness over visual symmetry

If a UI choice makes the interface:
- harder to scan
- harder to understand
- slower to act

it is considered a wrong direction, even if technically correct.

## Current UI Language

For the current development stage:

- UI text may be in Russian for better product understanding and faster iteration
- code, types, and architecture must remain in English
- full i18n support will be introduced later after core UX is stable