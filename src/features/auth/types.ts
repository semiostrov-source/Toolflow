export interface User {
  id: string
  login: string
  password_hash: string
  status: 'active' | 'inactive'
  is_admin: boolean
  // permissions
  can_create_edit_cards: boolean
  can_see_own_only: boolean
  can_transfer: boolean
  can_transfer_without_confirmation: boolean
  can_transfer_for_others: boolean
  can_manage_warehouse: boolean
  can_confirm_writeoff: boolean
  can_dispose: boolean
  can_replenish_quantity: boolean
  can_create_reports: boolean
  can_manage_warehouses_objects: boolean
  can_manage_users: boolean
  // optional profile fields
  first_name?: string
  last_name?: string
  middle_name?: string
  phone?: string
  position?: string
  avatar_url?: string
}

export interface AuthState {
  user: User | null
  isLoading: boolean
  error: string | null
}
