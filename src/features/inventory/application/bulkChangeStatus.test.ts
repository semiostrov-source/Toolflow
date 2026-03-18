import { describe, expect, it } from 'vitest'
import { mockItems } from '../mock/items'
import { bulkChangeStatus } from './bulkChangeStatus'
import type { BulkChangeStatusCommand } from './commands'

describe('bulkChangeStatus', () => {
  it('updates the status of all targeted items', () => {
    const command: BulkChangeStatusCommand = {
      type: 'bulkChangeStatus',
      itemIds: ['item-1', 'item-3'],
      newStatus: 'maintenance',
    }

    const result = bulkChangeStatus(mockItems, command)

    expect(result.find((i) => i.id === 'item-1')?.status).toBe('maintenance')
    expect(result.find((i) => i.id === 'item-3')?.status).toBe('maintenance')
  })

  it('returns a new array and does not mutate the original', () => {
    const command: BulkChangeStatusCommand = {
      type: 'bulkChangeStatus',
      itemIds: ['item-2'],
      newStatus: 'written_off',
    }

    const originalStatuses = mockItems.map((i) => i.status)
    const result = bulkChangeStatus(mockItems, command)

    expect(result).not.toBe(mockItems)
    mockItems.forEach((item, index) => {
      expect(item.status).toBe(originalStatuses[index])
    })
  })

  it('leaves non-targeted items unchanged by reference', () => {
    const command: BulkChangeStatusCommand = {
      type: 'bulkChangeStatus',
      itemIds: ['item-1'],
      newStatus: 'in_use',
    }

    const result = bulkChangeStatus(mockItems, command)

    const untargeted = mockItems.filter((i) => i.id !== 'item-1')
    untargeted.forEach((originalItem) => {
      const resultItem = result.find((i) => i.id === originalItem.id)
      expect(resultItem).toBe(originalItem)
    })
  })

  it('returns the original array when itemIds is empty', () => {
    const command: BulkChangeStatusCommand = {
      type: 'bulkChangeStatus',
      itemIds: [],
      newStatus: 'available',
    }

    const result = bulkChangeStatus(mockItems, command)

    expect(result).toBe(mockItems)
  })

  it('returns the original array when no ids match any item', () => {
    const command: BulkChangeStatusCommand = {
      type: 'bulkChangeStatus',
      itemIds: ['nonexistent-id-1', 'nonexistent-id-2'],
      newStatus: 'available',
    }

    const result = bulkChangeStatus(mockItems, command)

    expect(result).toBe(mockItems)
  })

  it('only updates items present in itemIds, not all items', () => {
    const command: BulkChangeStatusCommand = {
      type: 'bulkChangeStatus',
      itemIds: ['item-8'],
      newStatus: 'available',
    }

    const result = bulkChangeStatus(mockItems, command)

    expect(result.find((i) => i.id === 'item-8')?.status).toBe('available')

    const unchanged = result.filter((i) => i.id !== 'item-8')
    unchanged.forEach((resultItem) => {
      const original = mockItems.find((i) => i.id === resultItem.id)!
      expect(resultItem.status).toBe(original.status)
    })
  })
})
