# ToolFlow Product Definition

## 1. Product Overview

ToolFlow is a multi-company internal web platform for tool, equipment, and material tracking.

It is designed for construction and field operations where tools and materials move between warehouses, employees, and project sites. The system must provide operational visibility, accountability, and a clear movement history for every tracked item.

ToolFlow is not a simple inventory list. It is an operational system for real-world tool movement, responsibility assignment, service tracking, write-off approval, and company-level access control.

The product must work well on both mobile devices and desktop, with special focus on mobile-first workflows for field usage.

---

## 2. Product Vision

ToolFlow should become a practical, modern, fast, and reliable operational system for internal company use.

The product should feel:

- clean and modern
- fast and responsive
- simple to understand
- professional and business-focused
- optimized for real field work
- lightweight for unstable internet conditions

Design direction:

- modern enterprise UX
- minimal visual noise
- clear status communication
- strong emphasis on actions
- mobile-first interaction model
- scalable information architecture

The product should follow quality expectations inspired by top-tier product companies such as Apple, Stripe, Linear, Notion, GitHub, and Airbnb, while keeping a more industrial and operational tone suitable for construction workflows.

---

## 3. Core Business Problems

ToolFlow must solve the following problems:

1. Lack of visibility into where tools and materials currently are.
2. Unclear responsibility for issued tools.
3. Loss of inventory due to missing movement records.
4. Weak control over transfers between warehouse, employees, and sites.
5. No structured history of service, damage, or write-off events.
6. Difficulty managing both unit-based and quantity-based inventory in one system.
7. Poor usability of spreadsheets and manual tracking methods in field conditions.

---

## 4. Target Users

Primary user groups:

- Administrators
- Directors
- Accountants
- Warehouse staff
- Site managers
- Foremen
- Team leads
- Employees receiving or returning tools
- Company managers reviewing operational data

---

## 5. Multi-Company Scope

ToolFlow must be architected for multiple companies from the beginning.

Requirements:

- each company can access only its own data
- each company has its own users, roles, settings, warehouses, and objects
- the system architecture must support future scaling to many companies
- the first working version may remain operationally simple, but the information architecture and backend model must already be multi-company ready

This means the product is not built as a single-company app that will later be “patched” into multi-company mode. Multi-company support is a foundational architectural requirement.

---

## 6. Localization and Naming

The system should be designed with future multilingual support in mind.

Requirements:

- code-level entities and naming must be in English
- architecture should allow future localization
- user-facing content may initially be Russian, but internal development artifacts and system naming should remain consistent and scalable

---

## 7. Core Domain Entities

### Company
Represents a tenant / company in the platform.

Example fields:
- id
- name
- status
- settings
- createdAt

### User
Represents a company member.

Example fields:
- id
- companyId
- fullName
- roleId
- phone
- login
- passwordHash
- status
- permissions
- assignedWarehouseIds
- assignedObjectIds

### Role
Represents a permission template.

Example fields:
- id
- companyId
- name
- permissions

### Warehouse
Represents a storage location.

Example fields:
- id
- companyId
- name
- address
- status

### Object
Represents a project site / location / operational object.

Example fields:
- id
- companyId
- name
- address
- status

### Item
Represents an inventory position.

The system must support two item types:

- unit item
- bulk item

Example fields:
- id
- companyId
- type
- name
- categoryId
- status
- currentHolderType
- currentHolderId
- serialNumber
- inventoryNumber
- quantity
- unitOfMeasure
- photoUrl
- notes

### Category
Represents an item category.

### Stock
Represents current balance / ownership / amount in a specific holder context.

Example:
- warehouse stock
- employee stock
- object stock

### Movement
Represents item movement history.

Examples:
- warehouse -> employee
- employee -> employee
- warehouse -> object
- employee -> warehouse
- object -> warehouse

Fields may include:
- id
- companyId
- itemId
- movementType
- fromEntityType
- fromEntityId
- toEntityType
- toEntityId
- quantity
- comment
- photoBefore
- photoAfter
- createdBy
- createdAt
- status

### ServiceRequest
Represents repair, maintenance, consumables replacement, or write-off request.

### WriteOffApproval
Represents the approval process for final disposal.

Final write-off / disposal authority is restricted to:
- administrator
- director
- accountant

---

## 8. Item Types

ToolFlow must support two inventory models:

### Unit Items
Examples:
- hammer drill
- laser level
- grinder
- welding machine

Characteristics:
- unique physical item
- may have serial number or inventory number
- moves as a whole unit
- assigned to one responsible holder at a time

### Bulk Items
Examples:
- electrodes
- grinding discs
- wire
- scaffolding elements
- consumables

Characteristics:
- tracked by quantity
- can be partially transferred
- may use units such as pcs, packs, kg, m, sets, etc.
- can exist in balances across warehouses, employees, or objects

---

## 9. Core Operational Flows

The system must support:

- login and authenticated access
- company-level data isolation
- role-based access and permissions
- warehouse management
- object management
- user management
- inventory creation
- movement between holders
- movement history
- service workflows
- write-off requests
- write-off approval
- status tracking
- dashboard visibility

Main movement scenarios:

- warehouse ↔ employee
- employee ↔ employee
- warehouse ↔ object
- object ↔ warehouse
- employee ↔ warehouse

---

## 10. Permissions Model

The system must support role-based access with explicit permissions.

Examples of permission areas:

- create items
- edit items
- create warehouses
- create objects
- transfer items
- approve transfers
- create service requests
- approve write-off
- manage users
- manage roles
- view reports
- access admin panel

The UI must reflect permissions clearly:
- unavailable actions must not behave like enabled ones
- hidden or disabled actions must be consistent with product rules

---

## 11. Product UX Principles

The product must follow these UX principles:

- mobile-first
- fast interaction
- low cognitive load
- large tap targets
- simple navigation
- clear action hierarchy
- clear status communication
- lightweight pages
- stable behavior under weak internet conditions
- reduced visual clutter
- readable information density

The product should support future offline-friendly improvements such as local caching, retry logic, and protection against action loss in poor connectivity scenarios.

---

## 12. Non-Goals for Early Development

The early product should avoid unnecessary complexity such as:

- marketing website features
- public marketplace behavior
- overcomplicated dashboards
- startup-style decorative interactions
- premature integrations not required for core field operations

---

## 13. Product Success Criteria

ToolFlow is successful if:

- every company can work inside its own isolated workspace
- users can authenticate and operate within their role permissions
- inventory visibility is clear
- responsibility for tools and materials is explicit
- movement history is reliable
- service and write-off flows are controlled
- the system is practical in real field usage
- the interface feels modern, clean, and fast