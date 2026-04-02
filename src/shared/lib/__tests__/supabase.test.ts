import { describe, it, expect, vi } from 'vitest'
import { createClient } from '@supabase/supabase-js'

// Mock the supabase-js library so the client can be instantiated
// without real env vars or a network connection
vi.mock('@supabase/supabase-js', () => ({
  createClient: vi.fn(() => ({
    from: vi.fn(),
    rpc: vi.fn(),
    auth: {},
    storage: {},
  })),
}))

import { supabase } from '../supabase'

describe('supabase client', () => {
  it('is exported and is not null', () => {
    expect(supabase).not.toBeNull()
  })

  it('is exported and is not undefined', () => {
    expect(supabase).toBeDefined()
  })

  it('is created via createClient', () => {
    expect(createClient).toHaveBeenCalledTimes(1)
  })

  it('is created with two string arguments (url and anon key)', () => {
    expect(createClient).toHaveBeenCalledWith(
      expect.any(String),
      expect.any(String),
    )
  })

  it('exposes a "from" method on the client', () => {
    expect(typeof (supabase as { from: unknown }).from).toBe('function')
  })

  it('exposes an "rpc" method on the client', () => {
    expect(typeof (supabase as { rpc: unknown }).rpc).toBe('function')
  })
})
