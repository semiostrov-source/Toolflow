# ToolFlow

ToolFlow is an internal operational web system for managing tools,
equipment, warehouses, and inventory flows.

The system is designed for real operational environments: - construction
sites - warehouses - field teams

The goal is to build a modern internal enterprise web application with
high‑quality UX inspired by products like Linear, Stripe, Notion, and
GitHub, but adapted for industrial workflows and tool management.

------------------------------------------------------------------------

# Core Principles

The system must be:

-   mobile-first
-   fast
-   simple
-   enterprise-grade
-   optimized for weak internet environments
-   suitable for real operational usage

The interface follows a **modern minimal enterprise UI approach**.

UI rules are defined in:

ai_docs/design/UI_PRINCIPLES.md

------------------------------------------------------------------------

# Tech Stack

Frontend stack:

-   React
-   TypeScript
-   Vite

The project was initialized using **Vite**.

------------------------------------------------------------------------

# Current Status

-   Frontend MVP: complete — all inventory interactions working
-   Phase 1 complete: product definition, architecture, and conventions
    established
-   Phase 2 in progress: Inventory Actions Architecture implemented
    (Batch 1 done)
-   Application layer added to inventory feature
-   No backend integration yet

------------------------------------------------------------------------

# Architecture Overview

-   Feature-based structure: `src/features/`, `src/pages/`, `src/shared/`
-   Inventory feature contains UI components and a typed application layer
-   Pages delegate all state mutations to pure use-case functions
-   No backend, no global state manager

------------------------------------------------------------------------

# Project Structure

```
ToolFlow
├ .cursor
│ ├ agents
│ ├ commands
│ ├ rules
│ ├ skills
│ └ workspace
│
├ ai_docs
│ ├ changelog
│ ├ design
│ │ └ UI_PRINCIPLES.md
│ │
│ └ develop
│   ├ api
│   ├ architecture
│   ├ audits
│   ├ components
│   ├ features
│   ├ issues
│   ├ plans
│   ├ reports
│   ├ MVP.md
│   ├ PRODUCT.md
│   └ ROADMAP.md
│
├ public
├ src
│ ├ features
│ │ └ inventory
│ │   ├ application
│ │   ├ components
│ │   ├ mock
│ │   └ types
│ ├ pages
│ │ └ InventoryPage.tsx
│ └ shared
│   └ ui
│
├ index.html
├ package.json
├ tsconfig.json
├ vite.config.ts
└ README.md
```

------------------------------------------------------------------------

# Inventory Feature Snapshot

Implemented in Phase 2 — Batch 1:

**Typed commands** (`src/features/inventory/application/commands.ts`):

-   `ChangeItemStatusCommand` — change status of a single item
-   `BulkChangeStatusCommand` — change status of multiple items at once
-   `InventoryCommand` — union type of all inventory commands

**Pure use-case functions** (`src/features/inventory/application/`):

-   `changeItemStatus` — applies a `ChangeItemStatusCommand` to the item
    list
-   `bulkChangeStatus` — applies a `BulkChangeStatusCommand` to the item
    list
-   `syncSelectedItem` — keeps the selected item in sync after state
    changes

`InventoryPage` imports these functions and delegates all state mutations
to them.

------------------------------------------------------------------------

# Documentation & Source of Truth

Project documentation is stored in `ai_docs/`. `ai_docs/` is the written
source of truth for all product, architecture, and development decisions.
Code is the final authority on implementation details.

Main files:

-   `ai_docs/develop/PRODUCT.md` — what ToolFlow is, who uses it, domain
    entities, permission model
-   `ai_docs/develop/MVP.md` — what the MVP delivers, scope, exclusions,
    success criteria
-   `ai_docs/develop/ROADMAP.md` — phases, batches, what is complete
-   `ai_docs/design/UI_PRINCIPLES.md` — visual and interaction design
    rules

Additional documentation:

-   `ai_docs/develop/plans/` — per-batch implementation plans
-   `ai_docs/develop/reports/` — per-batch completion reports
-   `ai_docs/develop/issues/` — tracked issues and known problems
-   `ai_docs/develop/architecture/` — architecture decisions and notes
-   `ai_docs/develop/features/` — per-feature documentation
-   `ai_docs/develop/api/` — API contracts and definitions
-   `ai_docs/develop/components/` — shared component documentation
-   `ai_docs/develop/audits/` — code and security audit reports

------------------------------------------------------------------------

# Cursor AI Workflow

Cursor project configuration is stored in:

.cursor/

Important directories:

-   .cursor/agents
-   .cursor/commands
-   .cursor/rules
-   .cursor/skills

Main commands:

-   /implement --- simple implementation workflow
-   /orchestrate --- full feature workflow
-   /refactor --- safe refactoring workflow
-   /review --- code review workflow
-   /audit --- project health and security review

The project uses **AI subagent orchestration** for development tasks.

Development should follow the rules defined in:

.cursor/rules

------------------------------------------------------------------------

# Development Phases

Development phases are defined in:

ai_docs/develop/ROADMAP.md

**Phase 1 — Foundation and Alignment** ✓ complete

Delivered:

-   Product definition, MVP scope, and roadmap established
-   Folder architecture and project conventions aligned
-   Naming standards and permission model boundaries confirmed
-   Multi-company direction confirmed across backend and frontend

**Phase 2 — Architecture Refactor** ✓ Batch 1 complete

Delivered:

-   Feature-based frontend structure: `src/features/`, `src/pages/`,
    `src/shared/`
-   Inventory feature with UI components and typed application layer
-   Starter-template leftovers removed
-   Reusable UI primitives isolated in `src/shared/ui`

**Phase 3 — Backend and Data Architecture** — not started

**Phase 4 — Authentication and Access Control** — not started

**Phase 5 — Core Reference Data** — not started

**Phase 6 — Inventory Model** — not started

**Phase 7 — Inventory Interface** — not started

**Phase 8 — Movement Workflows** — not started

**Phase 9 — History and Journal** — not started

**Phase 10 — Service and Write-Off** — not started

**Phase 11 — Dashboard** — not started

**Phase 12 — Performance and Field Reliability** — not started

**Phase 13 — UX Polish and Consistency** — not started

**Phase 14 — Reporting Baseline** — not started

**Phase 15 — Release Readiness** — not started

------------------------------------------------------------------------

# Local Development

Install dependencies:

npm install

Run development server:

npm run dev

Build the project:

npm run build

Run lint:

npm run lint

------------------------------------------------------------------------

# Development Workflow

Development follows these principles:

-   follow documentation in `ai_docs` before writing code
-   work in small safe steps
-   avoid destructive refactors
-   keep architecture clean and feature-isolated
-   maintain mobile-first usability
-   align UI with `UI_PRINCIPLES.md`

**Batch-based workflow:**

-   development proceeds in named batches (e.g. Batch 1, Batch 2)
-   one batch = one commit
-   tests and build must be green before committing
-   stage files explicitly: `git add <file>` per file — never `git add .`

------------------------------------------------------------------------

# Current Non-Goals

-   no backend integration (frontend-only at this stage)
-   no global state library (local React state only)
-   no new UI features in Phase 2
-   no authentication or authorization
-   no multi-user support

------------------------------------------------------------------------

# Domain Notes

## Main Roles

-   Administrator
-   Director
-   Accountant
-   Warehouse
-   Worker

Important rule:

Final write-off / disposal approval is allowed only for:

-   administrator
-   director
-   accountant

Warehouse users cannot perform final disposal actions.

------------------------------------------------------------------------

# Core Entities

The system includes the following domain entities:

-   Company
-   User
-   Role
-   Warehouse
-   Object
-   Item
-   Stock
-   Movement
-   ServiceRequest
-   WriteOffApproval

The system must support:

-   unit inventory
-   bulk inventory

Bulk inventory must support **partial transfer**.

------------------------------------------------------------------------

# Development Goal

The goal of the project is to build a modern operational web system for
managing tools, equipment, warehouses, and operational inventory flows
in real industrial environments.
