import type { Item, ItemStatus } from '..'
import { describe, it, expect } from 'vitest'
import { mockItems } from '../mock/items'

type Equal<A, B> =
  (<T>() => T extends A ? 1 : 2) extends (<T>() => T extends B ? 1 : 2)
    ? true
    : false

type Expect<T extends true> = T

type HasKey<T, K extends PropertyKey> = K extends keyof T ? true : false

export type _ItemStatus_is_exact =
  Expect<Equal<ItemStatus, 'available' | 'in_use' | 'maintenance' | 'written_off'>>

export type _Item_has_required_status_key = Expect<HasKey<Item, 'status'>>
export type _Item_status_is_ItemStatus = Expect<Equal<Item['status'], ItemStatus>>

// @ts-expect-error status must be provided for Item
const _itemWithoutStatusIsInvalid: Item = {
  id: 'test-item',
  name: 'Test',
  sku: 'TEST-001',
  unit: 'pcs',
  createdAt: '2025-01-01T00:00:00.000Z',
}

// @ts-expect-error status must be a valid ItemStatus literal
const _invalidStatus: ItemStatus = 'invalid'

describe('inventory domain', () => {
  it('provides a finite set of allowed item statuses', () => {
    const allowed: ItemStatus[] = [
      'available',
      'in_use',
      'maintenance',
      'written_off',
    ]

    expect(allowed).toHaveLength(4)
  })

  it('provides 12 mock items with valid status values', () => {
    const allowedStatuses: ItemStatus[] = [
      'available',
      'in_use',
      'maintenance',
      'written_off',
    ]

    expect(mockItems).toHaveLength(12)

    const seenStatuses = new Set<ItemStatus>()

    for (const item of mockItems) {
      expect(allowedStatuses).toContain(item.status)
      seenStatuses.add(item.status)
    }

    // Ensure we have at least one example for each allowed status
    for (const status of allowedStatuses) {
      expect(seenStatuses.has(status)).toBe(true)
    }
  })
})

