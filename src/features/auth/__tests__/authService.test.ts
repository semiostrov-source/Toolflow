import { describe, it, expect, beforeEach, vi } from 'vitest'
import type { User } from '../types'

// vi.hoisted runs before any imports, making these variables available
// inside the vi.mock factory below
const { mockSingle, mockRpc, mockFrom } = vi.hoisted(() => {
  const mockSingle = vi.fn()
  const mockEq = vi.fn(() => ({ single: mockSingle }))
  const mockSelect = vi.fn(() => ({ eq: mockEq }))
  const mockFrom = vi.fn(() => ({ select: mockSelect }))
  const mockRpc = vi.fn()

  return { mockSingle, mockRpc, mockFrom }
})

vi.mock('../../../shared/lib/supabase', () => ({
  supabase: {
    from: mockFrom,
    rpc: mockRpc,
  },
}))

import {
  loginUser,
  saveUserToStorage,
  getUserFromStorage,
  clearUserFromStorage,
} from '../authService'

// ---------------------------------------------------------------------------
// Fixtures
// ---------------------------------------------------------------------------

const activeUser: User = {
  id: 'user-1',
  login: 'testuser',
  password_hash: 'hashed_password',
  status: 'active',
  is_admin: false,
  can_create_edit_cards: false,
  can_see_own_only: false,
  can_transfer: false,
  can_transfer_without_confirmation: false,
  can_transfer_for_others: false,
  can_manage_warehouse: false,
  can_confirm_writeoff: false,
  can_dispose: false,
  can_replenish_quantity: false,
  can_create_reports: false,
  can_manage_warehouses_objects: false,
  can_manage_users: false,
}

const inactiveUser: User = { ...activeUser, status: 'inactive' }

// ---------------------------------------------------------------------------
// loginUser
// ---------------------------------------------------------------------------

describe('loginUser', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('returns user object on successful login', async () => {
    mockSingle.mockResolvedValue({ data: activeUser, error: null })
    mockRpc.mockResolvedValue({ data: true, error: null })

    const result = await loginUser('testuser', 'password')

    expect(result).toEqual(activeUser)
  })

  it('calls supabase.from with "users" table', async () => {
    mockSingle.mockResolvedValue({ data: activeUser, error: null })
    mockRpc.mockResolvedValue({ data: true, error: null })

    await loginUser('testuser', 'password')

    expect(mockFrom).toHaveBeenCalledWith('users')
  })

  it('calls verify_user_password rpc with correct arguments', async () => {
    mockSingle.mockResolvedValue({ data: activeUser, error: null })
    mockRpc.mockResolvedValue({ data: true, error: null })

    await loginUser('testuser', 'secret')

    expect(mockRpc).toHaveBeenCalledWith('verify_user_password', {
      p_login: 'testuser',
      p_password: 'secret',
    })
  })

  it('throws "Неверный логин или пароль" when user is not found', async () => {
    mockSingle.mockResolvedValue({ data: null, error: { message: 'not found' } })

    await expect(loginUser('unknown', 'pass')).rejects.toThrow(
      'Неверный логин или пароль',
    )
  })

  it('throws "Неверный логин или пароль" when DB returns error with no data', async () => {
    mockSingle.mockResolvedValue({ data: null, error: { message: 'DB connection error' } })

    await expect(loginUser('testuser', 'password')).rejects.toThrow(
      'Неверный логин или пароль',
    )
  })

  it('does not call rpc when the DB query fails', async () => {
    mockSingle.mockResolvedValue({ data: null, error: { message: 'DB error' } })

    await expect(loginUser('testuser', 'password')).rejects.toThrow()

    expect(mockRpc).not.toHaveBeenCalled()
  })

  it('throws "Неверный логин или пароль" when verify_user_password returns false', async () => {
    mockSingle.mockResolvedValue({ data: activeUser, error: null })
    mockRpc.mockResolvedValue({ data: false, error: null })

    await expect(loginUser('testuser', 'wrongpass')).rejects.toThrow(
      'Неверный логин или пароль',
    )
  })

  it('throws "ACCESS_DENIED" for an inactive user with valid password', async () => {
    mockSingle.mockResolvedValue({ data: inactiveUser, error: null })
    mockRpc.mockResolvedValue({ data: true, error: null })

    await expect(loginUser('testuser', 'password')).rejects.toThrow('ACCESS_DENIED')
  })

  it('does not throw ACCESS_DENIED for an active user', async () => {
    mockSingle.mockResolvedValue({ data: activeUser, error: null })
    mockRpc.mockResolvedValue({ data: true, error: null })

    await expect(loginUser('testuser', 'password')).resolves.not.toThrow()
  })

  // ---
  // verifyPassword fallback behaviour
  // ---

  it('falls back to check_user_login when verify_user_password errors', async () => {
    mockSingle.mockResolvedValue({ data: activeUser, error: null })
    // Primary RPC errors → fallback RPC succeeds
    mockRpc
      .mockResolvedValueOnce({ data: null, error: { message: 'rpc not found' } })
      .mockResolvedValueOnce({ data: true, error: null })

    const result = await loginUser('testuser', 'password')

    expect(result).toEqual(activeUser)
    expect(mockRpc).toHaveBeenCalledTimes(2)
    expect(mockRpc).toHaveBeenNthCalledWith(
      1,
      'verify_user_password',
      { p_login: 'testuser', p_password: 'password' },
    )
    expect(mockRpc).toHaveBeenNthCalledWith(
      2,
      'check_user_login',
      { input_login: 'testuser', input_password: 'password' },
    )
  })

  it('falls back to check_user_login when verify_user_password returns null data', async () => {
    mockSingle.mockResolvedValue({ data: activeUser, error: null })
    mockRpc
      .mockResolvedValueOnce({ data: null, error: null })
      .mockResolvedValueOnce({ data: true, error: null })

    const result = await loginUser('testuser', 'password')

    expect(result).toEqual(activeUser)
    expect(mockRpc).toHaveBeenCalledTimes(2)
  })

  it('throws "Сервис временно недоступен. Попробуйте позже." when both rpc calls fail', async () => {
    mockSingle.mockResolvedValue({ data: activeUser, error: null })
    mockRpc.mockResolvedValue({ data: null, error: { message: 'rpc unavailable' } })

    await expect(loginUser('testuser', 'wrongpass')).rejects.toThrow('Сервис временно недоступен. Попробуйте позже.')
    expect(mockRpc).toHaveBeenCalledTimes(2)
  })

  it('throws "Неверный логин или пароль" when fallback rpc also returns false', async () => {
    mockSingle.mockResolvedValue({ data: activeUser, error: null })
    mockRpc
      .mockResolvedValueOnce({ data: null, error: { message: 'rpc error' } })
      .mockResolvedValueOnce({ data: false, error: null })

    await expect(loginUser('testuser', 'password')).rejects.toThrow(
      'Неверный логин или пароль',
    )
  })
})

// ---------------------------------------------------------------------------
// saveUserToStorage
// ---------------------------------------------------------------------------

describe('saveUserToStorage', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  it('saves user to localStorage under "toolflow_user" key', () => {
    saveUserToStorage(activeUser)

    expect(localStorage.getItem('toolflow_user')).toBe(JSON.stringify(activeUser))
  })

  it('overwrites a previously stored user', () => {
    const updatedUser: User = { ...activeUser, login: 'updated_login' }

    saveUserToStorage(activeUser)
    saveUserToStorage(updatedUser)

    expect(JSON.parse(localStorage.getItem('toolflow_user')!)).toEqual(updatedUser)
  })
})

// ---------------------------------------------------------------------------
// getUserFromStorage
// ---------------------------------------------------------------------------

describe('getUserFromStorage', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  it('returns the stored user when the key exists', () => {
    localStorage.setItem('toolflow_user', JSON.stringify(activeUser))

    const result = getUserFromStorage()

    expect(result).toEqual(activeUser)
  })

  it('returns null when "toolflow_user" key is absent', () => {
    const result = getUserFromStorage()

    expect(result).toBeNull()
  })

  it('returns null when stored value is invalid JSON', () => {
    localStorage.setItem('toolflow_user', 'not-valid-json{{{')

    const result = getUserFromStorage()

    expect(result).toBeNull()
  })

  it('returns null when stored value is an empty string', () => {
    localStorage.setItem('toolflow_user', '')

    const result = getUserFromStorage()

    expect(result).toBeNull()
  })
})

// ---------------------------------------------------------------------------
// clearUserFromStorage
// ---------------------------------------------------------------------------

describe('clearUserFromStorage', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  it('removes "toolflow_user" from localStorage', () => {
    localStorage.setItem('toolflow_user', JSON.stringify(activeUser))

    clearUserFromStorage()

    expect(localStorage.getItem('toolflow_user')).toBeNull()
  })

  it('does not throw when the key is not present', () => {
    expect(() => clearUserFromStorage()).not.toThrow()
  })

  it('does not affect other localStorage keys', () => {
    localStorage.setItem('toolflow_user', JSON.stringify(activeUser))
    localStorage.setItem('other_key', 'other_value')

    clearUserFromStorage()

    expect(localStorage.getItem('other_key')).toBe('other_value')
  })
})
