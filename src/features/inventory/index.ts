// Inventory feature public API boundary.
// Export inventory-related types, components, and utilities from here as they are implemented.

export type {
  Item,
  Stock,
  Movement,
  MovementType,
  ItemStatus,
} from './types/domain';

export { InventoryTable } from './components/InventoryTable';
export { InventoryDetailsPanel } from './components/InventoryDetailsPanel';
export { mockItems } from './mock/items';
export { InventoryToolbar } from './components/InventoryToolbar';
export { InventoryFilters } from './components/InventoryFilters';
export { InventoryBulkActionsBar } from './components/InventoryBulkActionsBar';
