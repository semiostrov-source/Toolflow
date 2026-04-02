# Authentication System Architecture

**Date:** 2026-04-02  
**Status:** ✅ Implemented  
**Version:** 1.0.0

## Overview

The ToolFlow authentication system is a custom implementation that uses Supabase as the backend database for user credentials and permissions. The system follows a client-side authentication pattern with localStorage persistence.

## System Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                     React Application                       │
│                                                             │
│  ┌──────────────────────────────────────────────────────┐  │
│  │               AuthProvider (Context)                 │  │
│  │                                                      │  │
│  │  Wraps entire app, manages auth state in React      │  │
│  │  - Hydrates from localStorage on mount              │  │
│  │  - Provides login/logout methods                    │  │
│  │  - Supplies user data to all child components       │  │
│  └──────────────────────────────────────────────────────┘  │
│           ↓                                      ↓           │
│  ┌────────────────────────┐          ┌─────────────────┐   │
│  │  ProtectedRoute Guard  │          │ PublicRoute     │   │
│  │                        │          │ Guard           │   │
│  │ - Check user exists    │          │                 │   │
│  │ - Redirect if missing  │          │ - Redirect if   │   │
│  │   to /login            │          │   logged in     │   │
│  └────────────────────────┘          └─────────────────┘   │
│                                                             │
│  ┌──────────────────────────────────────────────────────┐  │
│  │         useAuth() Hook                               │  │
│  │  Access auth context from any component             │  │
│  └──────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
           ↓
┌─────────────────────────────────────────────────────────────┐
│                  Supabase Backend                           │
│                                                             │
│  ┌──────────────────────────────────────────────────────┐  │
│  │             public.users Table                       │  │
│  │                                                      │  │
│  │  id, login, password_hash, status, is_admin, ...    │  │
│  │  + 12 permission columns (can_create_edit_cards,    │  │
│  │    can_transfer, can_manage_users, etc.)            │  │
│  └──────────────────────────────────────────────────────┘  │
│           ↓                                      ↓           │
│  ┌────────────────────────┐          ┌─────────────────┐   │
│  │ RPC verify_user_        │          │ RPC check_user_ │   │
│  │ password (pgcrypto)     │          │ login           │   │
│  │                        │          │ (fallback)      │   │
│  │ Verifies password hash  │          │                 │   │
│  └────────────────────────┘          └─────────────────┘   │
└─────────────────────────────────────────────────────────────┘
           ↓
┌─────────────────────────────────────────────────────────────┐
│           Browser localStorage                             │
│                                                             │
│  Key: "toolflow_user"                                       │
│  Value: { id, login, permissions, ... }                    │
│  (Cleared on logout)                                        │
└─────────────────────────────────────────────────────────────┘
```

## Key Design Decisions

### 1. Custom Authentication (Not Supabase Auth)

**Decision:** Query `public.users` table directly instead of using Supabase Auth service

**Rationale:**
- Supabase Auth is optimized for standard user management (email/password)
- ToolFlow has custom user fields (permissions, status, roles)
- Existing user data in `public.users` table
- Greater control over login logic and error messages

**Trade-offs:**
- More responsibility for password verification
- Must implement own session management
- Requires careful RPC implementation for password checking

### 2. Server-Side Password Verification via RPC

**Decision:** Use Supabase RPC with pgcrypto for password verification

**Rationale:**
- Never send plain passwords through RPC in production
- pgcrypto extension provides secure bcrypt hashing
- RPC executes in PostgreSQL context with full database access
- Fallback RPC (`check_user_login`) for compatibility

**Implementation:**
```sql
-- Primary RPC: verify_user_password
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

-- Fallback RPC: check_user_login
CREATE OR REPLACE FUNCTION check_user_login(input_login text, input_password text)
RETURNS boolean as $$
BEGIN
  -- Legacy implementation or alternative verification
  RETURN EXISTS(
    SELECT 1 FROM public.users
    WHERE login = input_login
    AND password_hash = crypt(input_password, password_hash)
  );
END;
$$ LANGUAGE plpgsql;
```

### 3. Client-Side State with localStorage Persistence

**Decision:** Store authenticated user in React Context + localStorage

**Rationale:**
- Survives page refreshes
- No need for backend session storage
- Available to all components via `useAuth()` hook
- Clear separation: UI state (React) + persistence (localStorage)

**Trade-offs:**
- Token/user data is in browser (vulnerable if not HTTPS)
- localStorage limitations (no expiration, only 5-10MB)
- Requires manual logout to clear

### 4. Permission-Based Access Control

**Decision:** Store all 12 permission columns on user object

**Rationale:**
- Fine-grained control over features (create, transfer, manage, etc.)
- Permissions loaded once on login, reused throughout session
- No need for additional API calls to check permissions
- Supports complex role hierarchies

**Permissions:**
- `can_create_edit_cards` - Create/edit inventory cards
- `can_see_own_only` - Restrict view to own items
- `can_transfer` - Transfer items between users
- `can_transfer_without_confirmation` - Transfer without approval
- `can_transfer_for_others` - Transfer on behalf of others
- `can_manage_warehouse` - Warehouse management
- `can_confirm_writeoff` - Confirm item writeoff
- `can_dispose` - Mark items as disposed
- `can_replenish_quantity` - Adjust quantities
- `can_create_reports` - Generate reports
- `can_manage_warehouses_objects` - Manage warehouse objects
- `can_manage_users` - User administration

### 5. Route-Level Access Control

**Decision:** Use `ProtectedRoute` and `PublicRoute` wrapper components

**Rationale:**
- Prevents unauthorized access to protected pages
- Automatic redirect for unauthenticated users
- Clean separation: public pages (login) vs protected pages (app)
- Loading state handled gracefully

**Implementation:**
- `ProtectedRoute` - Requires authentication, redirects to `/login`
- `PublicRoute` - Requires no authentication, redirects to `/inventory` if logged in

## Data Flow

### Login Flow

```
1. User enters credentials in LoginPage
2. Form calls context.login(login, password)
3. AuthContext calls authService.loginUser()
4. loginUser():
   a. Query users table by login
   b. Call RPC verify_user_password()
   c. Check user status (must be 'active')
   d. Return complete User object with permissions
5. AuthContext saves user to localStorage
6. AuthContext updates React state
7. User redirected to /inventory
8. ProtectedRoute allows access to app
```

### Session Hydration Flow

```
1. App mounts (App.tsx)
2. AuthProvider initializes
3. useEffect in AuthProvider runs:
   a. Calls getUserFromStorage()
   b. Parses localStorage['toolflow_user']
   c. Sets user in React state
   d. Sets isLoading = false
4. All child components receive user via context
5. Route guards check isLoading to prevent flash
```

### Logout Flow

```
1. User clicks logout (in InventoryPage or similar)
2. Component calls context.logout()
3. AuthContext calls clearUserFromStorage()
4. AuthContext clears user state (sets to null)
5. ProtectedRoute detects user is null
6. Redirects to /login
7. localStorage['toolflow_user'] removed
```

## Component Responsibilities

### AuthProvider (`src/features/auth/AuthContext.tsx`)

Manages the authentication state and provides it to all child components via React Context.

**Responsibilities:**
- Initialize user from localStorage on mount
- Provide `login()` method
- Provide `logout()` method
- Expose `user`, `isLoading` state

**Context Shape:**
```typescript
interface AuthContextType {
  user: User | null
  isLoading: boolean
  login: (login: string, password: string) => Promise<void>
  logout: () => void
}
```

### useAuth Hook (`src/features/auth/useAuth.ts`)

Custom hook to access authentication context from any component.

**Usage:**
```typescript
const { user, isLoading, login, logout } = useAuth()
```

**Safety:** Throws error if used outside AuthProvider

### ProtectedRoute (`src/app/ProtectedRoute.tsx`)

Route guard that requires authentication.

**Behavior:**
- If loading: return null (prevents flash)
- If not authenticated: redirect to `/login`
- If authenticated: render child routes

### PublicRoute (`src/app/PublicRoute.tsx`)

Route guard that requires no authentication (for login page).

**Behavior:**
- If loading: return null
- If authenticated: redirect to `/inventory`
- If not authenticated: render child routes

### authService (`src/features/auth/authService.ts`)

Encapsulates authentication business logic.

**Functions:**
- `loginUser(login, password)` - Authenticate and fetch user
- `verifyPassword(login, password)` - Call RPC for password check
- `saveUserToStorage(user)` - Persist user to localStorage
- `getUserFromStorage()` - Retrieve and validate stored user
- `clearUserFromStorage()` - Remove user from localStorage

### Supabase Client (`src/shared/lib/supabase.ts`)

Singleton Supabase client with validated environment variables.

**Initialization:**
- Reads `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY`
- Throws error if either is missing
- Exported as singleton for use throughout app

## Security Considerations

### Current Implementation
- ✅ Password verification via server-side RPC (not exposed to client)
- ✅ User status check (active/inactive)
- ✅ Environment variables for Supabase credentials
- ✅ localStorage cleared on logout

### Recommendations for Production

1. **HTTPS Only**
   - Require HTTPS in production
   - localStorage data is visible in browser dev tools

2. **Token-Based Sessions**
   - Implement JWT or session tokens with expiration
   - Refresh tokens periodically
   - Invalidate on server logout

3. **CORS Configuration**
   - Restrict Supabase API access to your domain
   - Validate RPC calls are from authorized origins

4. **Rate Limiting**
   - Implement login attempt rate limiting
   - Prevent brute force attacks
   - Track failed login attempts

5. **Password Hashing**
   - Verify `public.users.password_hash` uses bcrypt or similar
   - Hash new passwords server-side before storing
   - Never store plain passwords

6. **Audit Logging**
   - Log all login attempts (success/failure)
   - Log permission changes
   - Track user modifications

7. **Session Timeout**
   - Add configurable session timeout
   - Force re-authentication after inactivity
   - Implement "remember me" carefully (expiring tokens only)

## Related Files

- **Login UI:** `src/pages/LoginPage.tsx`
- **App Root:** `src/app/App.tsx`
- **Types:** `src/features/auth/types.ts`
- **Supabase Client:** `src/shared/lib/supabase.ts`
- **Environment Setup:** `.env.example`

## Future Enhancements

1. **Multi-Factor Authentication (MFA)**
   - Add TOTP or SMS verification
   - Store MFA secrets in users table

2. **Session Management**
   - Implement token refresh
   - Add session revocation
   - Device tracking and management

3. **Social Authentication**
   - OAuth2 integration (Google, Microsoft)
   - Use Supabase Auth for SSO

4. **Audit Trail**
   - Log all authentication events
   - Track user permission changes
   - Implement compliance reporting

5. **Password Policy**
   - Enforce strong password requirements
   - Implement password expiration
   - Prevent password reuse
