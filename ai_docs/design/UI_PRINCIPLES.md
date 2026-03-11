# ToolFlow UI Principles

## 1. Purpose

This document defines the visual, interaction, and usability principles for ToolFlow.

It exists to ensure that the product remains:

- modern
- clean
- practical
- fast
- mobile-first
- business-focused
- scalable

All UI decisions should be checked against this document.

---

## 2. Product Design Direction

ToolFlow is not a marketing website and not a decorative consumer app.

It is a modern internal operational product for construction and field workflows.

The UI should feel:

- professional
- structured
- reliable
- calm
- clear
- fast
- efficient

The product should combine the visual discipline of modern world-class products with the practical needs of industrial workflows.

Reference inspiration:

- Apple — clarity, restraint, quality feel
- Stripe — polished layout and visual system
- Linear — speed, density, sharp product thinking
- Notion — clean structure and readability
- GitHub — strong tables, lists, statuses, admin patterns
- Airbnb — clear forms and user flow quality

ToolFlow should not imitate any of these products directly.
Instead, it should apply the best principles from them in a more industrial, operational, field-oriented context.

---

## 3. Core UX Principles

### 3.1 Clarity First
Every important action, state, and screen purpose must be immediately understandable.

Users should not need to guess:
- what screen they are on
- what item they are viewing
- what action is primary
- what status means
- what happens next

---

### 3.2 Action-Oriented Design
The product exists to help users perform operational tasks quickly.

The UI must prioritize actions such as:
- find item
- transfer item
- return item
- view status
- create record
- approve action
- review history

Actions should be obvious and easy to reach.

---

### 3.3 Low Cognitive Load
The interface should reduce mental effort.

Avoid:
- cluttered layouts
- too many competing buttons
- decorative noise
- complex wording
- nested complexity without clear benefit

Prefer:
- short labels
- clean grouping
- predictable actions
- consistent patterns

---

### 3.4 Mobile-First by Default
The product must be designed for mobile use first, then expanded for desktop.

This is especially important because many workflows happen in:
- warehouses
- field locations
- project sites
- poor connectivity environments

Mobile-first means:
- large touch targets
- simple navigation
- compact but readable layouts
- minimal unnecessary typing
- easy one-hand usage where possible

---

### 3.5 Speed Is Part of UX
The product must feel fast.

Perceived speed matters as much as technical speed.

UI should avoid:
- heavy initial screens
- slow transitions
- oversized media
- unnecessary re-rendering
- overloaded dashboards

Users should feel that the system responds immediately.

---

## 4. Visual Style Principles

### 4.1 Modern Minimal Enterprise UI
The visual style should be modern and clean, but not flashy.

Use:
- restrained layouts
- generous alignment discipline
- clear spacing
- calm surfaces
- strong hierarchy
- meaningful color use

Avoid:
- gradients used as decoration
- oversized shadows
- noisy backgrounds
- gaming-style UI
- overly playful components
- excessive animations

---

### 4.2 Industrial Professional Tone
The interface should feel appropriate for tool, warehouse, and site operations.

The product should not feel:
- childish
- trendy for the sake of trendiness
- sales-like
- luxurious in a consumer-brand way

It should feel:
- dependable
- operational
- serious
- efficient
- modern without being soft or vague

---

### 4.3 Clean Hierarchy
Visual hierarchy must always be obvious.

Each screen must clearly show:
- page title
- current context
- primary action
- secondary actions
- status information
- data blocks

Users should instantly understand what matters most on the screen.

---

## 5. Layout Principles

### 5.1 Simple Screen Structure
Most screens should follow a predictable structure:

1. page title / context
2. essential filters or controls
3. primary action area
4. main content
5. secondary details if needed

Avoid chaotic layouts with many unrelated sections competing for attention.

---

### 5.2 Reusable Structural Patterns
Use consistent layout patterns across the system:

- list pages
- details pages
- forms
- dashboard cards
- modals
- confirmation dialogs
- history/journal entries

Do not invent a new layout approach for every feature.

---

### 5.3 Density with Readability
ToolFlow is an operational system, so it may contain a lot of information.

The UI should be information-efficient, but never cramped.

Aim for:
- compact layouts
- readable line lengths
- clear spacing between groups
- no visual suffocation

---

## 6. Navigation Principles

### 6.1 Navigation Must Be Predictable
Users should always know:
- where they are
- where they can go next
- how to return
- where to find the core workflows

Navigation should remain stable across pages.

---

### 6.2 Focus on Core Product Areas
Navigation should prioritize only the most important areas, such as:

- Dashboard
- Inventory
- Warehouses
- Objects
- Movements
- Journal / History
- Users
- Roles / Admin
- Settings

Do not overload the main navigation with low-priority sections.

---

### 6.3 Mobile Navigation Must Be Efficient
On mobile, navigation must remain simple and easy to reach.

It should avoid:
- deep hidden nesting
- tiny tap areas
- too many menu levels
- overloaded headers

---

## 7. Lists, Tables, and Cards

### 7.1 Operational Data Must Be Easy to Scan
Inventory lists and history views are core product surfaces.

They must support quick scanning of:
- item name
- status
- location / holder
- type
- quantity
- last movement
- problem indicators

---

### 7.2 Use the Right Container
Choose presentation format based on context:

- table: dense desktop operational data
- cards: mobile surfaces or higher-level summaries
- list rows: history, movement feeds, action logs

Do not force the same format everywhere.

---

### 7.3 Status Visibility
Status must always be easy to recognize.

Use status styles consistently for things like:
- available
- issued
- maintenance
- broken
- inactive
- pending approval
- approved
- rejected
- written off

Status should not rely only on color.
Use label text and clear visual treatment.

---

## 8. Forms and Input Principles

### 8.1 Forms Must Be Easy to Complete
Forms should minimize friction.

Prefer:
- short forms
- logical grouping
- sensible defaults
- clear labels
- clear required fields
- validation near the field

Avoid:
- long intimidating forms
- unclear field purpose
- hidden requirements
- confusing error messages

---

### 8.2 Mobile Form Design
Forms must work well on phones.

Requirements:
- large inputs
- enough spacing between fields
- appropriate keyboard types
- minimal typing where possible
- easy save / submit actions

---

### 8.3 Destructive or Important Actions
Important actions such as:
- write-off
- delete
- deactivate user
- approve disposal
- major transfer confirmation

must have strong confirmation UX.

Confirmation should be:
- explicit
- understandable
- not overly verbose
- appropriate to the risk level

---

## 9. Feedback and States

### 9.1 Every Important Action Needs Feedback
The user should always understand the result of an action.

Important states include:
- loading
- success
- validation error
- backend error
- empty result
- permission denied

---

### 9.2 Empty States Must Be Useful
An empty state should help the user move forward.

Examples:
- no items yet
- no search results
- no recent movements
- no service requests

Empty states should explain what the user can do next.

---

### 9.3 Error States Must Be Calm and Clear
Errors should never feel chaotic.

Error messages should:
- explain the issue in plain language
- suggest a next step when possible
- avoid technical noise for normal users

---

## 10. Performance and Connectivity UX

### 10.1 Lightweight by Design
The product must remain lightweight.

Prefer:
- optimized assets
- restrained media usage
- efficient lists
- progressive loading
- simple visual effects

---

### 10.2 Weak Internet Tolerance
The product must behave reasonably well under unstable network conditions.

Design should support:
- visible loading states
- retry clarity
- prevention of accidental duplicate submissions
- clear save/submit states
- reduced dependence on heavy assets

---

### 10.3 Fast Critical Workflows
The fastest workflows should include:
- login
- search
- open item
- transfer item
- return item
- review status
- submit service request

These flows should remain as short as possible.

---

## 11. Accessibility Principles

The product should be accessible in practical terms.

Requirements:
- readable font sizes
- strong contrast
- keyboard-friendly interaction where relevant
- visible focus states
- large touch areas
- consistent labels
- no critical color-only meaning

Accessibility is not optional. It is part of product quality.

---

## 12. Component Principles

UI components should be:

- reusable
- simple
- predictable
- composable
- visually consistent

Priority reusable components may include:
- buttons
- inputs
- selects
- textareas
- search bars
- filter blocks
- status badges
- cards
- table rows
- modals
- confirmation dialogs
- tabs
- empty states
- toasts / notices

Do not create many one-off components when a reusable pattern is possible.

---

## 13. Writing and Content Principles

UI text should be:

- short
- direct
- practical
- unambiguous

Avoid:
- decorative copywriting
- overly technical jargon for normal users
- long instructions inside UI
- inconsistent naming

Prefer:
- clear labels
- concise actions
- predictable terminology

---

## 14. Things to Avoid

The ToolFlow UI should avoid:

- visual clutter
- decorative gradients
- excessive animation
- oversized hero sections
- consumer-app fluff
- startup-style landing page patterns inside the app
- inconsistent spacing
- mixed component styles
- deeply nested navigation
- hidden primary actions
- overloaded dashboards
- hard-to-tap controls
- tiny text on mobile
- excessive modal chains

---

## 15. Final Quality Standard

A screen in ToolFlow is acceptable only if it is:

- clear at first glance
- visually calm
- fast to use
- easy on mobile
- appropriate for field operations
- consistent with the rest of the system
- supportive of real operational work

If a design decision makes the product look more impressive but less practical, practicality wins.