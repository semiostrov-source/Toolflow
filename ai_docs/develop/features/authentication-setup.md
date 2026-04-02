# Authentication Setup Guide

**Date:** 2026-04-02  
**Version:** 1.0.0  
**Status:** Complete

## Quick Start

Follow these steps to set up authentication in your ToolFlow application.

## Step 1: Configure Environment Variables

### Create `.env` file

Copy `.env.example` to `.env`:

```bash
cp .env.example .env
```

### Fill in Supabase credentials

```env
VITE_SUPABASE_URL=https://sgxvydwaxjtvazauyvrr.supabase.co
VITE_SUPABASE_ANON_KEY=your_anon_key_here
```

**Where to find these:**
1. Go to [Supabase Dashboard](https://supabase.com/dashboard)
2. Select your project
3. Settings → API
4. Copy "URL" and "anon public" key

**Important:** Never commit `.env` to version control. It's in `.gitignore`.

## Step 2: Set Up Supabase Database

### Enable pgcrypto Extension

In Supabase SQL Editor, run:

```sql
CREATE EXTENSION IF NOT EXISTS pgcrypto;
```

This enables bcrypt password hashing used by the RPC functions.

### Create Users Table

```sql
CREATE TABLE IF NOT EXISTS public.users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  login TEXT NOT NULL UNIQUE,
  password_hash TEXT NOT NULL,
  status TEXT CHECK (status IN ('active', 'inactive')) DEFAULT 'active',
  is_admin BOOLEAN DEFAULT false,
  
  -- Permissions (12 columns)
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
  
  -- Profile fields
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

### Create RPC Function: verify_user_password

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

**What it does:**
- Takes username and password
- Queries users table
- Uses pgcrypto's `crypt()` to verify password
- Returns true if password matches, false otherwise

**Test it:**
1. In Supabase SQL Editor, click "Functions"
2. Find `verify_user_password`
3. Click "Test" and provide test parameters

### Create RPC Function: check_user_login (Fallback)

```sql
CREATE OR REPLACE FUNCTION check_user_login(input_login text, input_password text)
RETURNS boolean as $$
BEGIN
  RETURN EXISTS(
    SELECT 1 FROM public.users
    WHERE login = input_login
    AND crypt(input_password, password_hash) = password_hash
  );
END;
$$ LANGUAGE plpgsql;
```

This is a fallback function. Used if `verify_user_password` fails. Can have different logic or be identical.

### Enable Row Level Security (RLS)

```sql
-- Enable RLS on users table
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

-- Allow anonymous reads (for login query)
CREATE POLICY "allow_read_for_login"
  ON public.users FOR SELECT
  USING (true);

-- Prevent direct updates (use RPC instead)
CREATE POLICY "no_direct_updates"
  ON public.users FOR UPDATE
  USING (false);

-- Prevent direct deletes
CREATE POLICY "no_direct_deletes"
  ON public.users FOR DELETE
  USING (false);
```

### Create Test User

```sql
INSERT INTO public.users (
  login,
  password_hash,
  status,
  is_admin,
  can_create_edit_cards,
  can_transfer,
  can_manage_users,
  first_name,
  last_name,
  position
) VALUES (
  'john.doe',
  crypt('password123', gen_salt('bf')),
  'active',
  true,
  true,
  true,
  true,
  'John',
  'Doe',
  'Administrator'
);
```

**Note:** `crypt('password123', gen_salt('bf'))` creates bcrypt hash of password

**Test credentials:**
- Username: `john.doe`
- Password: `password123`

## Step 3: Verify Installation

### Start Development Server

```bash
npm install
npm run dev
```

### Test Login Flow

1. Navigate to `http://localhost:5173/login`
2. Enter test credentials:
   - Login: `john.doe`
   - Password: `password123`
3. Click "Sign In"
4. Should redirect to `/inventory` if successful

### Check Storage

1. Open browser DevTools (F12)
2. Go to "Application" → "Local Storage"
3. Look for `toolflow_user` key
4. Should contain JSON of logged-in user

### Test Logout

1. Click logout button
2. Should redirect to `/login`
3. `toolflow_user` should be removed from localStorage

## Step 4: Testing Authentication

### Create Test Users

```sql
-- Admin user
INSERT INTO public.users (
  login, password_hash, status, is_admin,
  can_create_edit_cards, can_transfer, can_manage_users,
  first_name, last_name
) VALUES (
  'admin',
  crypt('admin123', gen_salt('bf')),
  'active', true,
  true, true, true,
  'Admin', 'User'
);

-- Regular user
INSERT INTO public.users (
  login, password_hash, status,
  can_create_edit_cards, can_transfer,
  first_name, last_name
) VALUES (
  'user',
  crypt('user123', gen_salt('bf')),
  'active',
  true, false,
  'Regular', 'User'
);

-- Inactive user (should fail login)
INSERT INTO public.users (
  login, password_hash, status,
  first_name, last_name
) VALUES (
  'inactive_user',
  crypt('pass123', gen_salt('bf')),
  'inactive',
  'Inactive', 'User'
);
```

### Test Error Handling

1. **Wrong password:**
   - Login: `john.doe`
   - Password: `wrong_password`
   - Expected: "Неверный логин или пароль"

2. **Wrong username:**
   - Login: `nonexistent`
   - Password: `password123`
   - Expected: "Неверный логин или пароль"

3. **Inactive user:**
   - Login: `inactive_user`
   - Password: `pass123`
   - Expected: "ACCESS_DENIED" error

4. **Service error (if RPC not found):**
   - Expected: "Сервис временно недоступен. Попробуйте позже."

## Step 5: Using Auth in Components

### Access Current User

```typescript
import { useAuth } from '@/features/auth'

export function MyComponent() {
  const { user, isLoading } = useAuth()

  if (isLoading) return <div>Loading...</div>
  if (!user) return <div>Not logged in</div>

  return <div>Welcome, {user.login}</div>
}
```

### Check Permissions

```typescript
import { useAuth } from '@/features/auth'

export function InventoryActions() {
  const { user } = useAuth()

  return (
    <div>
      {user?.can_create_edit_cards && (
        <button onClick={createCard}>Create Card</button>
      )}
      
      {user?.can_manage_users && (
        <button onClick={manageUsers}>Manage Users</button>
      )}
    </div>
  )
}
```

### Login (in LoginPage)

```typescript
import { useAuth } from '@/features/auth'
import { useNavigate } from 'react-router-dom'

export function LoginForm() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (login: string, password: string) => {
    try {
      await useAuth().login(login, password)
      // No need to navigate - ProtectedRoute handles it
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Login failed')
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      {error && <p className="error">{error}</p>}
      {/* Form fields */}
    </form>
  )
}
```

### Logout

```typescript
import { useAuth } from '@/features/auth'

export function LogoutButton() {
  const { logout } = useAuth()

  return (
    <button onClick={logout}>
      Logout
    </button>
  )
}
```

## Step 6: Production Checklist

### Security

- [ ] HTTPS enabled on production domain
- [ ] Environment variables set on server
- [ ] `.env` file in `.gitignore` (never committed)
- [ ] Supabase credentials rotated
- [ ] RLS policies reviewed and tested
- [ ] Rate limiting enabled on Supabase

### Database

- [ ] Backup strategy configured
- [ ] Password hashes use bcrypt (minimum 10 rounds)
- [ ] All required columns exist in users table
- [ ] RPC functions deployed and tested
- [ ] pgcrypto extension enabled

### Application

- [ ] Login page styled and tested
- [ ] Error messages user-friendly
- [ ] Loading states visible
- [ ] Logout works correctly
- [ ] Session persists across refreshes

### Testing

- [ ] Login with valid credentials
- [ ] Login with invalid credentials
- [ ] Login with inactive user
- [ ] Logout clears storage
- [ ] Protected routes redirect
- [ ] Public route redirects logged-in users
- [ ] Permissions prevent/allow actions
- [ ] Mobile responsiveness verified

## Troubleshooting

### "VITE_SUPABASE_URL or VITE_SUPABASE_ANON_KEY is missing"

**Cause:** Environment variables not set

**Solution:**
```bash
# 1. Create .env file
cp .env.example .env

# 2. Add Supabase credentials
# Edit .env and fill in the values

# 3. Restart dev server
npm run dev
```

### "verify_user_password does not exist"

**Cause:** RPC function not created in Supabase

**Solution:**
1. Go to Supabase Dashboard → SQL Editor
2. Run the SQL to create the function (see Step 2)
3. Restart dev server

### "Password verification always fails"

**Cause:** 
- RPC not using correct password hash algorithm
- Password not hashed with bcrypt when inserted
- pgcrypto extension not installed

**Solution:**
```bash
# 1. Verify pgcrypto is enabled
# In Supabase: SELECT * FROM pg_extension WHERE extname = 'pgcrypto';

# 2. Verify password was hashed with bcrypt
# In Supabase: SELECT * FROM public.users LIMIT 1;
# password_hash should start with $2a$, $2b$, or $2y$

# 3. If not, re-hash existing passwords:
UPDATE public.users SET password_hash = crypt('newpassword', gen_salt('bf'));
```

### "User stays logged in after page refresh"

**This is intended behavior.** The system uses localStorage to persist sessions.

To prevent this, add a logout endpoint or session timeout (future enhancement).

### "Login page keeps redirecting to /inventory"

**Cause:** User is already logged in

**Solution:**
1. Click logout button
2. Or clear localStorage: Open DevTools → Application → Local Storage → Delete `toolflow_user`

### "useAuth must be used within an AuthProvider"

**Cause:** Component is not wrapped by AuthProvider

**Solution:** Ensure your component is a child of `<AuthProvider>` in `src/app/App.tsx`

## Next Steps

1. **Create admin panel** - Manage users and permissions
2. **Add password reset** - Email-based password recovery
3. **Implement session timeout** - Auto-logout after inactivity
4. **Add 2FA** - Two-factor authentication with TOTP
5. **Audit logging** - Track all login attempts and changes
6. **Session management** - Device tracking and revocation

## File Reference

| File | Purpose |
|------|---------|
| `.env` | Supabase credentials (create from .env.example) |
| `.env.example` | Template for environment variables |
| `src/shared/lib/supabase.ts` | Supabase client singleton |
| `src/features/auth/types.ts` | TypeScript interfaces (User, AuthState) |
| `src/features/auth/authService.ts` | Login logic and storage |
| `src/features/auth/AuthContext.tsx` | React context and provider |
| `src/features/auth/useAuth.ts` | Hook to access context |
| `src/features/auth/index.ts` | Barrel export |
| `src/app/ProtectedRoute.tsx` | Auth guard for protected pages |
| `src/app/PublicRoute.tsx` | Auth guard for public pages |
| `src/pages/LoginPage.tsx` | Login UI component |
| `src/pages/LoginPage.css` | Login page styles |

## Documentation

- **Architecture:** `ai_docs/develop/architecture/auth-system.md`
- **Features:** `ai_docs/develop/features/authentication.md`
- **API Reference:** `ai_docs/develop/api/authentication.md`
- **Components:** `ai_docs/develop/components/auth/`

---

**Last Updated:** 2026-04-02  
**Maintained By:** Documentation Specialist
