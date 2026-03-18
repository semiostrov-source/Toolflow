import { describe, expect, it } from 'vitest'
import { mockItems } from '../mock/items'
import type { ChangeItemStatusCommand } from './commands'
import { changeItemStatus } from './changeItemStatus'

const [itemA, itemB, itemC] = mockItems as [
  (typeof mockItems)[0],
  (typeof mockItems)[1],
  (typeof mockItems)[2],
]

const fixtures = [itemA, itemB, itemC]

describe('changeItemStatus', () => {
  it('updates the target item status', () => {
    const command: ChangeItemStatusCommand = {
      type: 'changeItemStatus',
      itemId: itemA.id,
      newStatus: 'maintenance',
    }

    const result = changeItemStatus(fixtures, command)
    const updated = result.find((item) => item.id === itemA.id)

    expect(updated?.status).toBe('maintenance')
  })

  it('returns a new array and does not mutate the original', () => {
    const command: ChangeItemStatusCommand = {
      type: 'changeItemStatus',
      itemId: itemA.id,
      newStatus: 'in_use',
    }

    const result = changeItemStatus(fixtures, command)

    expect(result).not.toBe(fixtures)
    expect(itemA.status).toBe('available') // mockItems[0] starts as 'available'
  })

  it('leaves all other items unchanged by reference', () => {
    const command: ChangeItemStatusCommand = {
      type: 'changeItemStatus',
      itemId: itemA.id,
      newStatus: 'written_off',
    }

    const result = changeItemStatus(fixtures, command)

    expect(result[1]).toBe(itemB)
    expect(result[2]).toBe(itemC)
  })

  it('returns the original array reference when no item matches the id', () => {
    const command: ChangeItemStatusCommand = {
      type: 'changeItemStatus',
      itemId: 'non-existent-id',
      newStatus: 'available',
    }

    const result = changeItemStatus(fixtures, command)

    expect(result).toBe(fixtures)
  })

  it('the command type discriminant is correctly typed as changeItemStatus', () => {
    const command: ChangeItemStatusCommand = {
      type: 'changeItemStatus',
      itemId: itemB.id,
      newStatus: 'available',
    }

    expect(command.type).toBe('changeItemStatus')
  })
})
