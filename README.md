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

# Project Structure

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
│ ├ api
│ ├ architecture
│ ├ audits
│ ├ components
│ ├ features
│ ├ issues
│ ├ plans
│ ├ reports
│ ├ MVP.md
│ ├ PRODUCT.md
│ └ ROADMAP.md
│
├ public
├ src
│
├ index.html
├ package.json
├ tsconfig.json
├ vite.config.ts
└ README.md

------------------------------------------------------------------------

# Documentation (Source of Truth)

Project documentation is stored in:

ai_docs/

Main documentation files:

-   ai_docs/develop/PRODUCT.md
-   ai_docs/develop/MVP.md
-   ai_docs/develop/ROADMAP.md
-   ai_docs/design/UI_PRINCIPLES.md

Additional development documentation may appear in:

-   ai_docs/develop/plans
-   ai_docs/develop/reports
-   ai_docs/develop/issues
-   ai_docs/develop/architecture
-   ai_docs/develop/features
-   ai_docs/develop/api
-   ai_docs/develop/components
-   ai_docs/develop/audits

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

# Project Status

Current branch: **main**

Baseline checkpoint tag before development start:

checkpoint-pre-build-start

This tag represents the clean project state before active development
begins.

------------------------------------------------------------------------

# Development Phases

Development phases are defined in:

ai_docs/develop/ROADMAP.md

Current focus:

Phase 1 --- Application shell and base UI structure\
Phase 2 --- Core domain entities and inventory model

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

# Development Approach

Development must follow these principles:

-   follow documentation in ai_docs
-   work in small safe steps
-   avoid destructive refactors
-   keep architecture clean
-   maintain mobile-first usability
-   align UI with UI_PRINCIPLES.md

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
