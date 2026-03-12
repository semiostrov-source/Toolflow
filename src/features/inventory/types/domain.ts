/**
 * Inventory movement directions within the system.
 */
export type MovementType = 'IN' | 'OUT' | 'TRANSFER' | 'WRITE_OFF';

/**
 * High-level lifecycle status for an inventory item.
 *
 * This is intentionally coarse-grained and focused on operational availability,
 * not detailed maintenance workflows.
 */
export type ItemStatus = 'available' | 'in_use' | 'maintenance' | 'written_off';

/**
 * Core catalog item definition.
 */
export interface Item {
  id: string;
  name: string;
  sku: string;
  unit: string;
  /**
   * Operational status of the item within the inventory catalog.
   */
  status: ItemStatus;
  /**
   * ISO-8601 timestamp string representing when the item was created.
   */
  createdAt: string;
}

/**
 * Current stock level for an item in a specific warehouse.
 */
export interface Stock {
  itemId: string;
  warehouseId: string;
  quantity: number;
}

/**
 * Immutable record of a stock movement.
 */
export interface Movement {
  id: string;
  itemId: string;
  warehouseId: string;
  quantity: number;
  type: MovementType;
  /**
   * ISO-8601 timestamp string representing when the movement was created.
   */
  createdAt: string;
  createdBy: string;
}

