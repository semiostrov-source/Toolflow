import type { Item } from '../types/domain'
import type { BulkChangeStatusCommand } from './commands'

/**
 * Applies a BulkChangeStatusCommand to an array of items.
 * Returns a new array with all matching items' statuses updated.
 * Items not in command.itemIds are returned unchanged (by reference).
 * If no items match, the original array is returned unchanged.
 */
export function bulkChangeStatus(
  items: Item[],
  command: BulkChangeStatusCommand,
): Item[] {
  if (command.itemIds.length === 0) return items

  const targetIds = new Set(command.itemIds)
  const hasMatch = items.some((item) => targetIds.has(item.id))

  if (!hasMatch) return items

  return items.map((item) =>
    targetIds.has(item.id) ? { ...item, status: command.newStatus } : item,
  )
}
