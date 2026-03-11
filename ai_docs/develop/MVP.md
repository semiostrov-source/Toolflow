# ToolFlow MVP Definition

## 1. MVP Purpose

The MVP is the first real working version of ToolFlow.

It is not a visual prototype. It is a functional internal system with real authentication, role-based access, backend data persistence, and operational workflows for inventory movement.

The MVP must be small enough to build safely, but complete enough to be useful in real company operations.

---

## 2. MVP Principles

The MVP must be:

- functional, not fake
- mobile-first
- multi-company ready
- backend-connected
- role-aware
- operationally practical
- visually clean and modern
- fast on weak internet
- limited to essential workflows only

---

## 3. MVP Scope

The MVP includes the following modules.

### 3.1 Authentication

The MVP must support:

- login
- authenticated session
- protected routes
- user status validation
- blocked access for inactive users

The product should support real backend authentication.

---

### 3.2 Companies

The MVP must include the company concept in the backend and access model.

Requirements:

- user belongs to a company
- company data is isolated
- users cannot access another company’s data
- architecture supports multiple companies from the start

The MVP does not require a polished super-admin SaaS control panel yet, but the data model must already support tenancy correctly.

---

### 3.3 Users and Roles

The MVP must support:

- users
- roles
- permissions
- active / inactive status
- assignment of actions to specific responsible users

At minimum, the system must support role-aware behavior in UI and backend authorization.

---

### 3.4 Warehouses

The MVP must support warehouse entities.

Requirements:

- create warehouse
- view warehouse
- assign inventory to warehouse
- use warehouse as movement origin or destination

---

### 3.5 Objects

The MVP must support project objects / work sites.

Requirements:

- create object
- view object
- assign inventory to object
- use object as movement origin or destination

---

### 3.6 Inventory

The MVP must support both:

- unit items
- bulk items

Required capabilities:

- create item
- edit item
- view item list
- search items
- filter items
- view item details
- track status
- track current holder
- store photos
- store category
- store notes

Bulk item support must include:
- quantity
- unit of measure
- partial transfer

Unit item support must include:
- unique identity
- optional serial / inventory number
- full-unit transfer logic

---

### 3.7 Movements

The MVP must support real movement records.

Required flows:

- warehouse -> employee
- employee -> employee
- warehouse -> object
- employee -> warehouse
- object -> warehouse

Movement record must support:

- source
- destination
- item
- quantity if applicable
- comment
- timestamp
- author
- photo evidence when required

---

### 3.8 History / Journal

The MVP must contain a clear and queryable movement history.

Required capabilities:

- item history
- chronological log
- movement metadata
- status changes
- service records
- write-off records

This journal is one of the central system features.

---

### 3.9 Service and Write-Off

The MVP must support:

- service request creation
- maintenance / repair / consumables replacement records
- write-off request creation
- approval workflow for final disposal

Final write-off / disposal permission must be limited to:
- administrator
- director
- accountant

Warehouse users must not have final disposal authority in the current product definition.

---

### 3.10 Dashboard

The MVP should include a simple but real dashboard.

Required widgets:

- total items
- available items
- issued items
- problematic items
- recent movements
- service / write-off highlights

The dashboard should remain simple and operational.

---

## 4. MVP UI Scope

The MVP UI should include at least:

- login screen
- main inventory screen
- search
- filters
- item details screen
- create item screen
- movement screen / modal
- service / write-off actions
- history / journal views
- basic admin views
- basic dashboard

Navigation should remain simple and mobile-first.

---

## 5. MVP Technical Scope

The MVP must include:

- frontend application
- backend API
- persistent database
- authentication mechanism
- role and permission enforcement
- company data isolation
- file/photo handling strategy
- environment configuration
- error handling for important flows

Recommended technical direction may evolve, but the MVP must not remain in mock-only mode.

---

## 6. Explicitly Included in MVP

The following are explicitly included:

- real authentication
- backend persistence
- multi-company-ready data model
- roles and permissions
- warehouses
- objects
- unit items
- bulk items
- partial transfer for bulk items
- movement history
- service and write-off flows
- modern mobile-first UI

---

## 7. Explicitly Excluded from MVP

The following are not required in the first working version:

- advanced analytics
- complex BI dashboards
- public website
- external marketplace functionality
- advanced notification ecosystem
- deep external integrations
- full offline mode
- QR workflows as a finished feature
- highly complex super-admin SaaS tooling
- polished billing/subscription system

The architecture may prepare for these later, but they are not part of the MVP delivery target.

---

## 8. MVP Success Criteria

The MVP is successful if:

- users can log in securely
- roles and permissions affect behavior correctly
- company data is isolated
- inventory can be created and edited
- both unit and bulk items are supported
- bulk quantities can be partially transferred
- movements are recorded reliably
- warehouses and objects participate in real flows
- write-off approval is controlled
- dashboard gives basic operational visibility
- the app works well on phone and desktop
- the system is usable in real field conditions