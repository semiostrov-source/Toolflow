# Inventory Domain Model

**Location**: `src/features/inventory/types/domain.ts`  
**Exported from**: `src/features/inventory/index.ts`  
**Status**: ✅ Initial implementation

## Core Domain Types

### `ItemStatus`
A union type describing the operational availability of an inventory item.
- `'available'`: Item is in stock and ready for use
- `'in_use'`: Item is currently assigned to or held by a user or location
- `'maintenance'`: Item is undergoing repair or service
- `'written_off'`: Item has been removed from inventory (damaged, obsolete, etc.)

This status is intentionally coarse-grained and focused on **operational availability**, not detailed maintenance workflows. It answers: "Can I use this item right now?"

### `Item`
Represents a catalog item in the inventory system.
- `id` (string): Unique identifier
- `name` (string): Display name
- `sku` (string): Stock keeping unit for external systems
- `unit` (string): Unit of measure (e.g., "kg", "pcs", "m")
- `status` (ItemStatus): Operational lifecycle status of the item (required)
- `createdAt` (ISO string): When the item was created

### `Stock`
Represents the current quantity of an item in a specific warehouse.
- `itemId` (string): Reference to the item
- `warehouseId` (string): Reference to the warehouse location
- `quantity` (number): Current stock quantity

### `Movement`
An immutable, auditable record of a stock transaction.
- `id` (string): Unique movement identifier
- `itemId` (string): Item being moved
- `warehouseId` (string): Warehouse involved
- `quantity` (number): Amount moved
- `type` (MovementType): Direction/reason for the movement
- `createdAt` (ISO string): When the movement occurred
- `createdBy` (string): User or system that created the movement

### `MovementType`
A union type describing the direction of stock movement:
- `'IN'`: Stock received/added
- `'OUT'`: Stock shipped/consumed
- `'TRANSFER'`: Stock moved between warehouses
- `'WRITE_OFF'`: Stock removed from inventory (obsolete, damaged, etc.)

## Implementation Notes

- **Timestamps**: Currently represented as ISO 8601 strings. These may be backed by real `Date` objects or database-native timestamps in backend implementations.
- **Minimal model**: This is a foundational domain model that will evolve as business requirements grow—future phases may add:
  - Warehouse and location hierarchies
  - Employee/user references with more detailed audit trails
  - Batch/lot tracking
  - Additional movement types and validation rules
  - Expiration and shelf-life tracking
