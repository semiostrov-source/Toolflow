# Authentication Feature Documentation

**Status:** ✅ Implemented  
**Date:** 2026-04-02  
**Type:** Core Feature  
**Priority:** Critical

## Overview

The authentication feature provides secure user login and session management for the ToolFlow inventory application. Users authenticate against a Supabase-backed user database with role-based access control.

## Features

### Core Authentication
- ✅ Login with username and password
- ✅ Server-side password verification via RPC
- ✅ Session persistence across page refreshes
- ✅ Automatic logout capability
- ✅ Loading state handling

### Access Control
- ✅ Route-level protection for authenticated pages
- ✅ Automatic redirect for unauthorized access
- ✅ Role-based permission system
- ✅ Public route protection (prevents logged-in users from accessing login page)

### User Management
- ✅ User status validation (active/inactive)
- ✅ Admin flag support
- ✅ 12 granular permission columns
- ✅ User profile fields (name, phone, position, avatar)

## How It Works

### Step 1: Login

User navigates to `/login` and submits credentials:

```
Login Page (public)
  ↓
Enter login/password
  ↓
Click "Sign In"
  ↓
Form calls context.login(login, password)
```

### Step 2: Authentication

Backend verifies credentials:

```
authService.loginUser(login, password)
  ↓
Query Supabase: SELECT * FROM users WHERE login = ?
  ↓
Call RPC: verify_user_password(login, password)
  ↓
Check password_hash using pgcrypto (server-side)
  ↓
Verify user.status === 'active'
  ↓
Return User object with all fields + permissions
```

### Step 3: Session Storage

Authenticated user is stored:

```
saveUserToStorage(user)
  ↓
localStorage['toolflow_user'] = JSON.stringify(user)
  ↓
React state updated: setUser(user)
  ↓
isLoading set to false
```

### Step 4: Navigation

Route guards grant access:

```
User redirected to /inventory
  ↓
ProtectedRoute checks user exists
  ↓
Route guard passes, MobileLayout rendered
  ↓
All child components can access user via useAuth()
```

### Step 5: Logout

User clicks logout:

```
logout() called
  ↓
clearUserFromStorage()
  ↓
localStorage['toolflow_user'] removed
  ↓
React state cleared: setUser(null)
  ↓
ProtectedRoute detects null user
  ↓
Automatic redirect to /login
```

## Usage in Components

### Basic Hook Usage

```typescript
import { useAuth } from '@/features/auth'

export function MyComponent() {
  const { user, isLoading, login, logout } = useAuth()

  if (isLoading) {
    return <div>Loading...</div>
  }

  if (!user) {
    return <div>Not authenticated</div>
  }

  return (
    <div>
      <p>Welcome, {user.login}</p>
      <button onClick={() => logout()}>Logout</button>
    </div>
  )
}
```

### Permission Checking

```typescript
import { useAuth } from '@/features/auth'

export function InventoryActions() {
  const { user } = useAuth()

  return (
    <div>
      {user?.can_create_edit_cards && (
        <button>Create New Card</button>
      )}
      
      {user?.can_transfer && (
        <button>Transfer Item</button>
      )}
      
      {user?.can_manage_users && (
        <button>Manage Users</button>
      )}
    </div>
  )
}
```

### Admin Check

```typescript
import { useAuth } from '@/features/auth'

export function AdminPanel() {
  const { user } = useAuth()

  if (!user?.is_admin) {
    return <div>Access Denied</div>
  }

  return <div>Admin Content</div>
}
```

## API Integration

### Environment Variables

Set in `.env` (create from `.env.example`):

```env
VITE_SUPABASE_URL=https://sgxvydwaxjtvazauyvrr.supabase.co
VITE_SUPABASE_ANON_KEY=your_anon_key_here
```

### Supabase Client

Located at `src/shared/lib/supabase.ts`:

```typescript
import { supabase } from '@/shared/lib'

// Already initialized and ready to use
// Singleton pattern - same instance throughout app
```

### RPC Functions Required

Two RPC functions must exist in Supabase:

#### 1. verify_user_password (Primary)

```sql
CREATE OR REPLACE FUNCTION verify_user_password(p_login text, p_password text)
RETURNS boolean as $$
BEGIN
  RETURN EXISTS(
    SELECT 1 FROM public.users
    WHERE login = p_login
    AND crypt(p_password, password_hash) = password_hash
  );
END;
$$ LANGUAGE plpgsql;
```

**Parameters:**
- `p_login` (text) - Username to verify
- `p_password` (text) - Plain text password to check

**Returns:** `boolean` - true if password matches, false otherwise

**Requires:** pgcrypto extension (CREATE EXTENSION IF NOT EXISTS pgcrypto)

#### 2. check_user_login (Fallback)

```sql
CREATE OR REPLACE FUNCTION check_user_login(input_login text, input_password text)
RETURNS boolean as $$
BEGIN
  -- Your implementation or alias to verify_user_password
  RETURN EXISTS(
    SELECT 1 FROM public.users
    WHERE login = input_login
    AND crypt(input_password, password_hash) = password_hash
  );
END;
$$ LANGUAGE plpgsql;
```

**Purpose:** Fallback function for compatibility/redundancy

**Note:** Can be identical to verify_user_password or provide alternative verification logic

## Database Schema

### users Table

Required columns:

```sql
CREATE TABLE public.users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  login TEXT NOT NULL UNIQUE,
  password_hash TEXT NOT NULL,
  status TEXT CHECK (status IN ('active', 'inactive')) DEFAULT 'active',
  is_admin BOOLEAN DEFAULT false,
  
  -- Permissions
  can_create_edit_cards BOOLEAN DEFAULT false,
  can_see_own_only BOOLEAN DEFAULT false,
  can_transfer BOOLEAN DEFAULT false,
  can_transfer_without_confirmation BOOLEAN DEFAULT false,
  can_transfer_for_others BOOLEAN DEFAULT false,
  can_manage_warehouse BOOLEAN DEFAULT false,
  can_confirm_writeoff BOOLEAN DEFAULT false,
  can_dispose BOOLEAN DEFAULT false,
  can_replenish_quantity BOOLEAN DEFAULT false,
  can_create_reports BOOLEAN DEFAULT false,
  can_manage_warehouses_objects BOOLEAN DEFAULT false,
  can_manage_users BOOLEAN DEFAULT false,
  
  -- Profile fields (optional)
  first_name TEXT,
  last_name TEXT,
  middle_name TEXT,
  phone TEXT,
  position TEXT,
  avatar_url TEXT,
  
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

### Row Level Security (RLS)

Current configuration:
- ✅ Anon key can read from `users` (for login queries)
- ✅ RPC functions accessible to anon key
- ⚠️ Verify RLS policies match your security requirements

Recommended RLS policies:

```sql
-- Allow anyone to read specific user by login
CREATE POLICY "allow_read_by_login"
  ON public.users FOR SELECT
  USING (true);  -- Only for login verification

-- Restrict direct updates (use RPC instead)
CREATE POLICY "no_direct_updates"
  ON public.users FOR UPDATE
  USING (false);
```

## Testing

### Environment Setup for Tests

```typescript
// src/app/App.test.tsx

beforeEach(() => {
  // Mock localStorage
  const store: Record<string, string> = {}
  
  const mockLocalStorage = {
    getItem: (key: string) => store[key] ?? null,
    setItem: (key: string, value: string) => {
      store[key] = value.toString()
    },
    removeItem: (key: string) => {
      delete store[key]
    },
    clear: () => {
      Object.keys(store).forEach(key => delete store[key])
    },
  }
  
  Object.defineProperty(window, 'localStorage', {
    value: mockLocalStorage,
    writable: true,
  })
})
```

### Test Login Flow

```typescript
test('user can login', async () => {
  // Mock Supabase
  vi.mock('@/shared/lib/supabase', () => ({
    supabase: {
      from: () => ({
        select: () => ({
          eq: () => ({
            single: async () => ({
              data: mockUser,
              error: null,
            }),
          }),
        }),
      }),
      rpc: async () => ({ data: true, error: null }),
    },
  }))

  // Render app
  // Simulate login
  // Assert user is stored in localStorage
  // Assert user is accessible via useAuth()
})
```

## Troubleshooting

### "useAuth must be used within an AuthProvider"

**Cause:** Using `useAuth()` in a component that's not wrapped by `AuthProvider`

**Solution:** Ensure component is a child of `<AuthProvider>` in App.tsx

### "Missing VITE_SUPABASE_URL or VITE_SUPABASE_ANON_KEY"

**Cause:** Environment variables not set

**Solution:**
1. Copy `.env.example` to `.env`
2. Fill in Supabase credentials
3. Restart dev server

### Password verification always fails

**Cause:** RPC functions not created or incorrect implementation

**Solution:**
1. Check `verify_user_password` exists in Supabase
2. Verify pgcrypto extension is installed: `CREATE EXTENSION IF NOT EXISTS pgcrypto`
3. Test RPC directly in Supabase dashboard
4. Ensure password_hash column contains bcrypt hashes

### User stays logged in after page refresh

**This is intended behavior.** localStorage persists user data across page refreshes.

To logout: Click logout button or call `logout()` from useAuth()

## Permissions Reference

| Permission | Description | Use Case |
|-----------|-------------|----------|
| `can_create_edit_cards` | Create and modify inventory cards | Content creators |
| `can_see_own_only` | Restrict view to own items | Limited visibility |
| `can_transfer` | Transfer items between users | Logistics staff |
| `can_transfer_without_confirmation` | Skip transfer approval | Admin transfers |
| `can_transfer_for_others` | Transfer on behalf of others | Managers |
| `can_manage_warehouse` | Manage warehouse operations | Warehouse managers |
| `can_confirm_writeoff` | Approve item writeoff | Supervisors |
| `can_dispose` | Mark items as disposed | Cleanup staff |
| `can_replenish_quantity` | Adjust item quantities | Stock managers |
| `can_create_reports` | Generate analytics reports | Analysts |
| `can_manage_warehouses_objects` | Manage warehouse objects | System admins |
| `can_manage_users` | Create/edit/delete users | Administrators |

## Related Documentation

- **Architecture:** `ai_docs/develop/architecture/auth-system.md`
- **Setup Guide:** `ai_docs/develop/features/authentication-setup.md`
- **Component Reference:** `ai_docs/develop/components/auth/`
- **Type Definitions:** `src/features/auth/types.ts`

## Changelog

### [1.0.0] - 2026-04-02

**Added:**
- Core authentication system with Supabase backend
- AuthProvider context and useAuth() hook
- ProtectedRoute and PublicRoute guards
- Login page UI with error handling
- User persistence via localStorage
- 12 granular permission columns
- Server-side password verification via RPC
- Support for user status (active/inactive)
- Admin flag support
- User profile fields (name, phone, position, avatar)
