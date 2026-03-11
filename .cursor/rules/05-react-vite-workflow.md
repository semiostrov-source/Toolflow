# React + Vite Project Workflow Rules

## Purpose

These rules define how AI agents should work inside the ToolFlow project.

ToolFlow is an existing React + TypeScript + Vite application.
It is not a plain HTML/CSS/JS starter project.

All implementation decisions must respect:
- the current stack
- the existing repository structure
- the AI documentation in `ai_docs`
- the project roadmap
- the product scope

The goal is to keep development structured, safe, and scalable.

---

## Source of Truth

Before implementing anything, always treat the following files as the primary source of truth:

- `ai_docs/develop/PRODUCT.md`
- `ai_docs/develop/MVP.md`
- `ai_docs/develop/ROADMAP.md`
- `ai_docs/design/UI_PRINCIPLES.md`

If implementation ideas conflict with these documents, the documents take priority.

Do not invent major features outside the documented product scope without explicit instruction.

---

## Project Context

This project is being developed as:

- a real internal operational system
- a multi-company-ready platform
- a React + TypeScript + Vite application
- a product with real authentication, roles, permissions, and backend direction
- a mobile-first operational interface for field and warehouse workflows

Do not treat this repository as:
- a static website
- a landing page project
- a design-only prototype
- a mock-only toy app
- a plain HTML/CSS/JS codebase

---

## General Development Behavior

Always work in small, controlled, reviewable steps.

Prefer:
- one focused task at a time
- small diffs
- minimal safe edits
- clear file boundaries
- incremental improvement

Avoid:
- large uncontrolled rewrites
- broad speculative refactors
- touching unrelated files
- mixing architecture changes with many feature changes at once
- introducing unapproved abstractions

Every change should be easy to understand, review, and revert if needed.

---

## Required Workflow

For every meaningful task, follow this order:

1. understand the request
2. check relevant AI docs
3. inspect the existing code structure
4. propose or infer the smallest safe implementation step
5. implement only that step
6. keep naming and file structure consistent
7. avoid unrelated cleanup unless necessary
8. leave the project in a working state

If a task is too broad, break it into smaller implementation steps.

---

## Architecture Rules

Respect layered project structure.

Prefer organizing code into logical areas such as:

- `app`
- `pages`
- `entities`
- `features`
- `shared`
- `api`

Do not place unrelated logic into one large component or one large file.

Keep responsibilities separated:
- page composition
- UI components
- domain types
- feature logic
- API interaction
- utility functions

Avoid creating tangled files that mix:
- layout
- business logic
- data mapping
- API calls
- validation
- styling
- routing

---

## React and TypeScript Rules

Use React and TypeScript idiomatically.

Prefer:
- functional components
- explicit prop typing
- clear domain types
- small reusable components
- predictable state handling
- composable hooks where justified

Avoid:
- unnecessary complexity
- oversized components
- hidden side effects
- weak naming
- ambiguous types
- `any` unless absolutely unavoidable

When defining domain models, keep naming consistent with project entities such as:
- Company
- User
- Role
- Warehouse
- Object
- Item
- Stock
- Movement
- ServiceRequest
- WriteOffApproval

Use English names in code.

---

## Vite and Project Structure Rules

Respect the existing Vite project setup.

Do not:
- rebuild the project as a plain static site
- replace React entry structure with manual HTML page architecture
- introduce alternate framework structure without instruction

Preserve the role of:
- `src/` for application code
- `public/` for static assets
- config files already used by Vite / TypeScript / Vitest / ESLint

Do not create redundant root-level folders if an appropriate place already exists.

---

## Scope Control Rules

Implement only what is requested or clearly required for the current roadmap phase.

Do not:
- add future features early
- “helpfully” implement half of the roadmap in one go
- introduce advanced analytics before core workflows
- add decorative UI that is not functionally necessary
- add full integrations unless explicitly required

Focus on the current phase and the smallest useful next step.

---

## UI Implementation Rules

All UI implementation must follow `ai_docs/design/UI_PRINCIPLES.md`.

The UI must be:
- clean
- modern
- practical
- mobile-first
- fast
- business-focused

Avoid:
- decorative landing-page patterns
- random visual experiments
- cluttered layouts
- tiny mobile controls
- excessive animation
- noisy color usage

For operational screens, prioritize:
- clarity
- speed
- scanability
- action visibility
- readable status communication

---

## Mobile-First Rules

Assume important workflows will happen on phones in field conditions.

Therefore:
- prioritize touch-friendly controls
- avoid fragile hover-dependent interaction
- keep forms compact and clear
- reduce unnecessary typing
- design for unstable network tolerance
- avoid layouts that only work comfortably on large desktop screens

Desktop support should expand mobile-first logic, not replace it.

---

## Performance and Reliability Rules

Treat performance as a product requirement.

Prefer:
- lightweight components
- efficient rendering
- restrained asset usage
- safe async flows
- clear loading states
- clear error states

Avoid:
- oversized dependencies without strong reason
- unnecessary rerenders
- huge image-heavy UI
- slow, overloaded dashboard screens
- duplicate requests caused by careless action handling

The app should remain practical under weak connectivity conditions.

---

## Data and Backend Direction Rules

This project is moving toward real backend integration.

Therefore:
- structure frontend code so it can work with real API contracts
- avoid mock-only assumptions baked deep into UI
- keep data models clear and backend-compatible
- separate API logic from UI rendering
- prepare for authentication, authorization, and multi-company isolation

Do not hardcode product assumptions that would block real backend usage later.

---

## Permissions and Security Awareness

Always respect role and permission boundaries in implementation.

Dangerous or restricted actions must never be treated as universally available.

Examples include:
- user management
- role management
- destructive deletion
- final write-off / disposal approval
- company-level administration

Current product direction requires final disposal authority to remain restricted to:
- administrator
- director
- accountant

Do not assign this authority to warehouse roles unless explicitly instructed.

---

## Forms and Validation Rules

Forms must be simple, explicit, and operationally practical.

Prefer:
- clear labels
- grouped fields
- useful defaults
- immediate validation feedback
- concise error messages

Avoid:
- overly long forms
- hidden requirements
- vague field names
- complex flows for simple actions

Destructive or high-risk actions should use explicit confirmation patterns.

---

## Naming Rules

Use:
- English for code entities, modules, types, functions, and components
- clear, descriptive names
- consistent names across files and layers

Avoid:
- mixed language naming in code
- vague component names
- one-letter abstractions
- inconsistent naming for the same entity

Examples:
- `ItemListPage`
- `MovementHistory`
- `CreateWarehouseForm`
- `useCurrentUser`
- `mapItemStatusToBadge`

---

## Documentation Awareness

When implementing a new significant module or changing an important product rule, keep related AI docs aligned when appropriate.

Examples:
- roadmap phase completion
- new architectural constraints
- clarified domain behavior
- confirmed permission changes

Do not rewrite documentation unnecessarily, but do not let important implementation drift silently away from documented decisions.

---

## Testing and Safety Mindset

Even when not explicitly writing tests in the current task, code should be written in a way that is testable.

Prefer:
- predictable functions
- isolated logic
- clear inputs and outputs
- minimal side effects

Do not introduce brittle patterns that will be hard to validate later.

---

## What to Do When Unclear

If the requested behavior is ambiguous, do not invent critical product rules silently.

Instead:
- infer only low-risk implementation details
- preserve flexibility where possible
- avoid locking the project into arbitrary assumptions
- flag conflicts when they affect architecture, permissions, or business behavior

If there is a conflict between old code and current AI docs, prefer the current AI docs and avoid reinforcing outdated behavior.

---

## Final Standard

Every implementation should move ToolFlow toward being:

- a real product, not a demo
- structured, not chaotic
- scalable, not patched together
- mobile-first, not desktop-dependent
- operationally practical, not decorative
- aligned with documented product goals