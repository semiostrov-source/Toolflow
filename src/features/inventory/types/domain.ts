/**
 * Inventory movement directions within the system.
 */
export type MovementType = 'IN' | 'OUT' | 'TRANSFER' | 'WRITE_OFF';

/**
 * Core catalog item definition.
 */
export interface Item {
  id: string;
  name: string;
  sku: string;
  unit: string;
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

