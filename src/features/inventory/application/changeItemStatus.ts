import type { Item } from '../types/domain'
import type { ChangeItemStatusCommand } from './commands'

/**
 * Applies a ChangeItemStatusCommand to an array of items.
 * Returns a new array with the target item's status updated.
 * All other items are returned unchanged (by reference).
 * If no item matches the id, the original array is returned unchanged.
 */
export function changeItemStatus(
  items: Item[],
  command: ChangeItemStatusCommand,
): Item[] {
  const index = items.findIndex((item) => item.id === command.itemId)
  if (index === -1) return items

  return items.map((item) =>
    item.id === command.itemId ? { ...item, status: command.newStatus } : item,
  )
}
