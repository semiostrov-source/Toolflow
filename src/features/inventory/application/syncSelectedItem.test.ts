import { describe, expect, it } from 'vitest'
import type { Item } from '../types/domain'
import type { BulkChangeStatusCommand, ChangeItemStatusCommand } from './commands'
import { syncSelectedItem } from './syncSelectedItem'

const itemA: Item = {
  id: 'item-a',
  name: 'Widget A',
  sku: 'SKU-A',
  unit: 'pcs',
  status: 'available',
  createdAt: '2024-01-01T00:00:00.000Z',
}

const itemB: Item = {
  id: 'item-b',
  name: 'Widget B',
  sku: 'SKU-B',
  unit: 'pcs',
  status: 'in_use',
  createdAt: '2024-01-02T00:00:00.000Z',
}

describe('syncSelectedItem', () => {
  describe('when selectedItem is null', () => {
    it('returns null for a changeItemStatus command', () => {
      const command: ChangeItemStatusCommand = {
        type: 'changeItemStatus',
        itemId: itemA.id,
        newStatus: 'maintenance',
      }

      expect(syncSelectedItem(null, command)).toBeNull()
    })

    it('returns null for a bulkChangeStatus command', () => {
      const command: BulkChangeStatusCommand = {
        type: 'bulkChangeStatus',
        itemIds: [itemA.id, itemB.id],
        newStatus: 'written_off',
      }

      expect(syncSelectedItem(null, command)).toBeNull()
    })
  })

  describe('changeItemStatus', () => {
    it('returns a new object with updated status when selectedItem matches the command', () => {
      const command: ChangeItemStatusCommand = {
        type: 'changeItemStatus',
        itemId: itemA.id,
        newStatus: 'maintenance',
      }

      const result = syncSelectedItem(itemA, command)

      expect(result).not.toBe(itemA)
      expect(result?.status).toBe('maintenance')
      expect(result?.id).toBe(itemA.id)
    })

    it('returns the same reference when selectedItem does not match the command', () => {
      const command: ChangeItemStatusCommand = {
        type: 'changeItemStatus',
        itemId: itemB.id,
        newStatus: 'maintenance',
      }

      const result = syncSelectedItem(itemA, command)

      expect(result).toBe(itemA)
    })
  })

  describe('bulkChangeStatus', () => {
    it('returns a new object with updated status when selectedItem id is in itemIds', () => {
      const command: BulkChangeStatusCommand = {
        type: 'bulkChangeStatus',
        itemIds: [itemA.id, itemB.id],
        newStatus: 'written_off',
      }

      const result = syncSelectedItem(itemA, command)

      expect(result).not.toBe(itemA)
      expect(result?.status).toBe('written_off')
      expect(result?.id).toBe(itemA.id)
    })

    it('returns the same reference when selectedItem id is NOT in itemIds', () => {
      const command: BulkChangeStatusCommand = {
        type: 'bulkChangeStatus',
        itemIds: [itemB.id],
        newStatus: 'written_off',
      }

      const result = syncSelectedItem(itemA, command)

      expect(result).toBe(itemA)
    })

    it('returns the same reference when itemIds is empty', () => {
      const command: BulkChangeStatusCommand = {
        type: 'bulkChangeStatus',
        itemIds: [],
        newStatus: 'maintenance',
      }

      const result = syncSelectedItem(itemA, command)

      expect(result).toBe(itemA)
    })
  })
})
