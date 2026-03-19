# ToolFlow Development Roadmap

## Phase 1 — Foundation and Alignment

Goal:
Establish the correct product and technical foundation before active feature development.

Tasks:

- [ ] Finalize product definition
- [ ] Finalize MVP definition
- [ ] Finalize UI and UX principles
- [ ] Align folder architecture and project conventions
- [ ] Remove or archive outdated prototype-only assumptions
- [ ] Define naming standards for entities and modules
- [ ] Confirm permission model boundaries
- [ ] Confirm multi-company direction across backend and frontend

Expected Result:

A stable shared understanding of what ToolFlow is, what the MVP includes, and how the project should evolve.

---

## Phase 2 — Architecture Refactor

Goal:
Refactor the current codebase into a scalable application structure.

Tasks:

- [ ] Review current React/Vite codebase
- [ ] Separate app, pages, entities, features, shared, and api layers
- [ ] Remove starter-template leftovers
- [ ] Isolate reusable UI primitives
- [ ] Prepare route structure
- [ ] Prepare auth-aware layout structure
- [ ] Prepare admin-aware navigation structure

Expected Result:

A cleaner and more scalable frontend architecture suitable for long-term development.

---

## Phase 3 — Backend and Data Architecture

Goal:
Create the backend and persistence foundation.

Tasks:

- [ ] Select backend architecture
- [ ] Define database schema
- [ ] Define company-based tenancy model
- [ ] Define authentication model
- [ ] Define authorization and permission model
- [ ] Define item, stock, movement, warehouse, and object schemas
- [ ] Define service and write-off approval schemas
- [ ] Define file/photo storage strategy
- [ ] Define API contracts for core entities

Expected Result:

A backend-ready system model with persistent storage and clear contracts.

---

## Phase 4 — Authentication and Access Control

Goal:
Implement secure access and role-aware behavior.

Tasks:

- [ ] Implement login flow
- [ ] Implement protected routes
- [ ] Implement current-user session logic
- [ ] Enforce active/inactive user status
- [ ] Implement role and permission checks
- [ ] Restrict dangerous actions by permission
- [ ] Restrict final write-off / disposal to administrator, director, and accountant roles

Expected Result:

The application has real access control, not only visual role simulation.

---

## Phase 5 — Core Reference Data

Goal:
Implement the core administrative entities required for operations.

Tasks:

- [ ] Implement companies in backend model
- [ ] Implement users
- [ ] Implement roles
- [ ] Implement warehouses
- [ ] Implement objects
- [ ] Implement categories
- [ ] Implement admin screens for managing these entities

Expected Result:

The system has the structural data needed for real operations.

---

## Phase 6 — Inventory Model

Goal:
Implement the core item model for both unit and bulk inventory.

Tasks:

- [ ] Implement item type model
- [ ] Support unit items
- [ ] Support bulk items
- [ ] Support quantity and unit-of-measure fields
- [ ] Support serial and inventory identifiers where applicable
- [x] Implement item statuses ✓ (INV-001A)
- [ ] Implement item ownership / holder logic
- [ ] Implement item create flow
- [ ] Implement item edit flow
- [ ] Implement item details view

Expected Result:

The platform can represent real inventory correctly.

---

## Phase 7 — Inventory Interface

Goal:
Build the main working inventory UI.

Tasks:

- [ ] Build authenticated main screen
- [ ] Implement item list
- [ ] Implement search
- [ ] Implement filters
- [ ] Implement status indicators
- [ ] Implement responsible holder display
- [ ] Implement item detail page
- [ ] Implement create item screen
- [ ] Implement permission-aware action visibility

Expected Result:

Users can browse and manage inventory in a practical interface.

---

## Phase 8 — Movement Workflows

Goal:
Implement operational movement flows.

Tasks:

- [ ] Implement warehouse -> employee transfer
- [ ] Implement employee -> employee transfer
- [ ] Implement warehouse -> object transfer
- [ ] Implement employee -> warehouse return
- [ ] Implement object -> warehouse return
- [ ] Implement partial transfer for bulk items
- [ ] Implement movement validation rules
- [ ] Implement movement comments
- [ ] Implement movement photo evidence support
- [ ] Update stock and holder state after movements

Expected Result:

The system can track real operational item movement.

---

## Phase 9 — History and Journal

Goal:
Provide transparent and reliable operational traceability.

Tasks:

- [ ] Implement item-level history
- [ ] Implement movement journal
- [ ] Implement service records in history
- [ ] Implement write-off records in history
- [ ] Implement useful filtering and viewing options
- [ ] Show who performed each action and when

Expected Result:

Every important inventory action becomes traceable.

---

## Phase 10 — Service and Write-Off

Goal:
Implement lifecycle handling beyond simple transfers.

Tasks:

- [ ] Implement service request creation
- [ ] Implement maintenance records
- [ ] Implement repair records
- [ ] Implement consumables replacement records
- [ ] Implement write-off request flow
- [ ] Implement approval logic for write-off
- [ ] Restrict final disposal approval by role
- [ ] Reflect lifecycle events in item status and history

Expected Result:

The platform supports service and controlled disposal workflows.

---

## Phase 11 — Dashboard

Goal:
Provide operational visibility for managers and administrators.

Tasks:

- [ ] Implement total inventory metric
- [ ] Implement available inventory metric
- [ ] Implement issued inventory metric
- [ ] Implement problematic inventory metric
- [ ] Implement recent movement feed
- [ ] Implement service / write-off highlights
- [ ] Keep dashboard practical and lightweight

Expected Result:

The system provides quick operational insight without becoming overly complex.

---

## Phase 12 — Performance and Field Reliability

Goal:
Improve usability in real site conditions.

Tasks:

- [ ] Reduce page weight
- [ ] Optimize mobile performance
- [ ] Improve loading behavior
- [ ] Improve error handling
- [ ] Prepare retry-safe action patterns
- [ ] Prepare architecture for future caching and offline-friendly improvements
- [ ] Improve behavior under unstable network conditions

Expected Result:

The app is more reliable in real construction-site usage.

---

## Phase 13 — UX Polish and Consistency

Goal:
Raise product quality and consistency.

Tasks:

- [ ] Standardize spacing and typography
- [ ] Standardize action hierarchy
- [ ] Standardize status colors and labels
- [ ] Improve empty states
- [ ] Improve form validation
- [ ] Improve destructive-action confirmations
- [ ] Improve accessibility and touch ergonomics
- [ ] Align interface with design principles

Expected Result:

The UI feels cleaner, clearer, and more professional.

---

## Phase 14 — Reporting Baseline

Goal:
Introduce only the minimum reporting needed for operations.

Tasks:

- [ ] Implement basic downloadable reports
- [ ] Support responsible-holder view
- [ ] Support full inventory export
- [ ] Keep reporting lightweight and operational

Expected Result:

Users can extract essential operational data without adding BI complexity too early.

---

## Phase 15 — Release Readiness

Goal:
Prepare the first real internal release.

Tasks:

- [ ] Finalize key workflows
- [ ] Remove critical blockers
- [ ] Review permissions
- [ ] Review company isolation
- [ ] Review data consistency
- [ ] Review mobile-first usability
- [ ] Review production configuration
- [ ] Prepare internal release documentation

Expected Result:

ToolFlow becomes ready for first real internal deployment and controlled use.

## UI Execution Alignment

Current active execution focus:
- Phase 7 — Inventory Interface
- Current UI batch sequence starts from Header and control bar

UI implementation must follow the active mobile-first operational product direction.

Execution order for the current inventory interface work:

1. Header and control bar
2. Filters block
3. Inventory rows
4. Item actions
5. Details and states
6. Role-based UI behavior
7. Create flows

Detailed UI execution rules and batch constraints are defined in:
- ai_docs/develop/UI_EXECUTION_PLAN.md
- ai_docs/design/UI_PRINCIPLES.md

Execution constraint:

Do not move to later roadmap phases (backend, movements, service, etc.)
until the current UI batch sequence for Inventory is completed.

UI clarity has priority over early feature expansion.