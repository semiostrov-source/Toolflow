import type { ItemStatus } from '../types/domain';

export interface ChangeItemStatusCommand {
  type: 'changeItemStatus';
  itemId: string;
  newStatus: ItemStatus;
}

export interface BulkChangeStatusCommand {
  type: 'bulkChangeStatus';
  itemIds: string[];
  newStatus: ItemStatus;
}

export type InventoryCommand = ChangeItemStatusCommand | BulkChangeStatusCommand;
