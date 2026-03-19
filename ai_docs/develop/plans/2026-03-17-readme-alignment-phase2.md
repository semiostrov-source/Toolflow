# Plan: README Alignment (Phase 2)

**Created:** 2026-03-17
**Orchestration:** orch-readme-phase2
**Goal:** Update README.md to accurately reflect the current project state — Frontend MVP UI complete, inventory application layer in place, Phase 2 (Architecture Refactor) done, no backend yet.
**Total Tasks:** 1
**Priority:** High

---

## Audit: What Is Stale or Wrong in the Current README

### 1. `# Project Status` section — stale pre-development baseline

**Current content:**
- Says branch is `main`, references `checkpoint-pre-build-start` tag
- Describes this as "the clean project state before active development begins"

**Reality:**
- Active development is well underway
- Frontend MVP UI is complete (InventoryPage, InventoryTable, InventoryDetailsPanel, InventoryToolbar, InventoryFilters, InventoryBulkActionsBar all exist)
- Inventory application layer is implemented (commands, changeItemStatus, bulkChangeStatus, syncSelectedItem)
- Phase 2 of the ROADMAP (Architecture Refactor) is done: feature-based layout, src/features/, src/pages/, src/shared/ separation

---

### 2. `# Development Phases` section — phase names do not match ROADMAP.md

**Current content:**
```
Phase 1 --- Application shell and base UI structure
Phase 2 --- Core domain entities and inventory model
```

**Reality (from ROADMAP.md):**
- Phase 1: Foundation and Alignment ✅
- Phase 2: Architecture Refactor ✅
- Phase 3: Backend and Data Architecture (not started)
- Phase 6: Inventory Model — item statuses partially done (INV-001A ✓)
- Phases 4–15: not started

The README describes phases that simply don't exist in the ROADMAP.

---

### 3. Missing: Architecture overview

The README has no mention of:
- Feature-based frontend structure (`src/features/`, `src/pages/`, `src/shared/`)
- The application layer pattern inside `src/features/inventory/application/`
- No backend yet (all data is mock via `mockItems`)
- No global state management (no Redux, Zustand, or Context for inventory state; InventoryPage owns state locally)

---

### 4. Missing: Inventory feature snapshot

No mention of the inventory application layer that actually exists:
- Typed command interfaces (`ChangeItemStatusCommand`, `BulkChangeStatusCommand`, `InventoryCommand`)
- Pure use-case functions (`changeItemStatus`, `bulkChangeStatus`, `syncSelectedItem`)
- UI (InventoryPage) delegates mutations to these functions — no direct state mutation in component handlers

---

### 5. Missing: Development workflow specifics

The `# Development Approach` section lists generic principles but omits the actual working conventions:
- Batch-based development (one batch = one commit)
- Tests and build must pass before committing
- Explicit `git add <file>` per changed file — no `git add .`

---

### 6. Missing: Source of truth — what each doc covers

The `# Documentation (Source of Truth)` section lists files but says nothing about what each one covers. A developer opening the project has no idea which file to read first or what it answers.

---

### 7. Missing: Current non-goals (Phase 2 scope)

No section states what is explicitly out of scope right now:
- No backend integration
- No global state management
- No new UI features in Phase 2
- No auth flows yet

---

### 8. Project structure tree — does not reflect src/ internals

The tree shows only top-level structure. `src/` is listed without showing `src/features/`, `src/pages/`, `src/shared/` which are the architectural units the project is built around.

---

## Tasks

- [ ] README-001: Update README.md for Phase 2 current state (⏳ Pending)

---

## Task: README-001

**Title:** Update README.md for Phase 2 current state

**Priority:** High
**Complexity:** Simple
**Files affected:** `README.md` only

### Sections to ADD (do not exist yet)

1. **Current Status** — Frontend MVP UI complete, inventory application layer done, Phase 2 architecture refactor done, no backend yet.
2. **Architecture Overview** — feature-based frontend (`src/features/`, `src/pages/`, `src/shared/`); inventory application layer (commands + pure use-case functions); no global state; no backend.
3. **Inventory Feature Snapshot** — typed commands, pure use-case functions, UI delegates to application layer.
4. **Current Non-Goals** — no backend, no global state, no new UI in Phase 2.

### Sections to UPDATE (exist but stale)

5. **Project Status** — Remove pre-development baseline wording. Replace with actual progress: phases done, what's next.
6. **Development Phases** — Replace incorrect phase names with the actual ROADMAP phase names. Mark Phase 1 and Phase 2 as complete. Note Phase 3 (backend) is next.
7. **Development Approach / Workflow** — Add batch-based workflow rules: one batch = one commit; tests + build must be green; explicit git adds only.
8. **Documentation (Source of Truth)** — Add one-line description for each key doc so the reader knows what it answers.
9. **Project Structure** — Expand `src/` to show `features/`, `pages/`, `shared/` subdirectories.

### Sections to KEEP (accurate, no changes needed)

- Project overview paragraph
- Core Principles
- Tech Stack
- Local Development commands
- Domain Notes (roles, entities)
- Core Entities list
- Cursor AI Workflow section

### Acceptance Criteria

- [ ] `README.md` compiles with no broken references
- [ ] Every section in the task spec above is present and accurate
- [ ] No invented APIs, no future architecture described as current
- [ ] No modifications to any file other than `README.md`
- [ ] Wording is concise and practical — not a product spec
- [ ] Phase names match `ai_docs/develop/ROADMAP.md` exactly

---

## Dependencies Graph

None — single task, no dependencies.

## Progress (updated by orchestrator)

- ⏳ README-001: Update README.md for Phase 2 current state (Pending)
