import type { Item } from '../types/domain'
import type { InventoryCommand } from './commands'

/**
 * Given the currently selected item (or null) and an inventory command
 * that was just applied, returns the updated selectedItem state.
 *
 * - If selectedItem is null, returns null.
 * - If the command did not affect the selected item, returns the same reference.
 * - If the command affected the selected item, returns a new object with
 *   the updated status.
 */
export function syncSelectedItem(
  selectedItem: Item | null,
  command: InventoryCommand,
): Item | null {
  if (selectedItem === null) return null

  switch (command.type) {
    case 'changeItemStatus': {
      if (selectedItem.id !== command.itemId) return selectedItem
      return { ...selectedItem, status: command.newStatus }
    }
    case 'bulkChangeStatus': {
      if (!command.itemIds.includes(selectedItem.id)) return selectedItem
      return { ...selectedItem, status: command.newStatus }
    }
    default: {
      const _exhaustive: never = command
      return _exhaustive
    }
  }
}
