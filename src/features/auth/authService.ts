import { supabase } from '../../shared/lib/supabase'
import type { User } from './types'

const STORAGE_KEY = 'toolflow_user'

async function verifyPassword(login: string, password: string): Promise<boolean> {
  const { data: verified, error: verifyError } = await supabase
    .rpc('verify_user_password', { p_login: login, p_password: password })

  if (!verifyError && verified !== null) return verified === true

  const { data: checked, error: checkError } = await supabase
    .rpc('check_user_login', { input_login: login, input_password: password })

  if (!checkError && checked !== null) return checked === true

  const reason = verifyError?.message ?? checkError?.message ?? 'unknown'
  throw new Error(`SERVICE_ERROR: ${reason}`)
}

export async function loginUser(login: string, password: string): Promise<User> {
  const { data, error } = await supabase
    .from('users')
    .select('*')
    .eq('login', login)
    .single()

  if (error || !data) {
    throw new Error('Неверный логин или пароль')
  }

  let isPasswordValid: boolean
  try {
    isPasswordValid = await verifyPassword(login, password)
  } catch (err) {
    const message = err instanceof Error ? err.message : 'unknown'
    if (message.startsWith('SERVICE_ERROR:')) {
      throw new Error('Сервис временно недоступен. Попробуйте позже.')
    }
    throw new Error('Неверный логин или пароль')
  }

  if (!isPasswordValid) {
    throw new Error('Неверный логин или пароль')
  }

  if (data.status === 'inactive') {
    throw new Error('ACCESS_DENIED')
  }

  return data as User
}

export function saveUserToStorage(user: User): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(user))
}

export function getUserFromStorage(): User | null {
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (!stored) return null
    const parsed = JSON.parse(stored)
    if (!parsed || typeof parsed.login !== 'string') return null
    return parsed as User
  } catch {
    return null
  }
}

export function clearUserFromStorage(): void {
  localStorage.removeItem(STORAGE_KEY)
}
