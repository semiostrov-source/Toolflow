# Inventory Domain Model

**Location**: `src/features/inventory/types/domain.ts`  
**Exported from**: `src/features/inventory/index.ts`  
**Status**: ✅ Initial implementation

## Core Domain Types

### `Item`
Represents a catalog item in the inventory system.
- `id` (string): Unique identifier
- `name` (string): Display name
- `sku` (string): Stock keeping unit for external systems
- `unit` (string): Unit of measure (e.g., "kg", "pcs", "m")
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
