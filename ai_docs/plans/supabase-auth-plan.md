# Plan: Supabase Auth Integration

**Created:** 2026-04-02
**Orchestration:** orch-supabase-auth
**Status:** 🟢 Ready
**Goal:** Connect Supabase and implement a full login/auth flow for ToolFlow
**Total Tasks:** 5
**Priority:** Critical

---

## Goal

Integrate `@supabase/supabase-js` with the ToolFlow React app, implement a `/login`
page matching the UX spec, persist authenticated user in `localStorage`, protect all
existing routes, and expose auth state via a global React context.

---

## Context

- **Stack:** React 19 + TypeScript + Vite, react-router-dom v6, BEM-style global CSS
- **Supabase URL:** `https://sgxvydwaxjtvazauyvrr.supabase.co`
- **Table:** `public.users` — fields: `login`, `password_hash`, `status`, `is_admin`, `can_*`
- **Password storage:** bcrypt via `pgcrypto` (server-side comparison required)
- **Auth state key:** `toolflow_user` in `localStorage`
- **No existing auth** — everything is created from scratch

---

## Tasks

- [ ] AUTH-001: Install @supabase/supabase-js and configure .env (⏳ Pending)
- [ ] AUTH-002: Supabase client + auth service (⏳ Pending)
- [ ] AUTH-003: AuthContext / AuthProvider (⏳ Pending)
- [ ] AUTH-004: LoginPage UI (⏳ Pending)
- [ ] AUTH-005: Route protection (ProtectedRoute + PublicRoute) (⏳ Pending)

---

## Task Details

### AUTH-001 — Install @supabase/supabase-js and configure .env
**Priority:** Critical  
**Complexity:** Simple  
**Dependencies:** None  
**Estimated time:** ~20 min

**What to do:**
1. Run `npm install @supabase/supabase-js` in the project root
2. Create `.env` with:
   ```
   VITE_SUPABASE_URL=https://sgxvydwaxjtvazauyvrr.supabase.co
   VITE_SUPABASE_ANON_KEY=sb_publishable_zYbu3Fd1oUf8YejGsSkUow_kQWt9LAZ
   ```
3. Create `.env.example` with the same keys but empty values (safe to commit)
4. Verify `.env` is listed in `.gitignore`

**Files affected:**
- `.env` (new)
- `.env.example` (new)
- `.gitignore` (update if needed)
- `package.json` / `package-lock.json`

**Acceptance criteria:**
- `npm install` succeeds, `@supabase/supabase-js` appears in `package.json`
- `.env` present and readable by Vite (`import.meta.env.VITE_SUPABASE_URL`)
- `.env` is gitignored, `.env.example` is committed

---

### AUTH-002 — Supabase client + auth service
**Priority:** Critical  
**Complexity:** Simple  
**Dependencies:** AUTH-001  
**Estimated time:** ~30 min

**What to do:**
1. Create `src/shared/lib/supabase.ts` — initialise and export the Supabase client
2. Create `src/features/auth/authService.ts` — export `loginUser(login, password)`:
   - Query `public.users` where `login = ?`
   - If no row → throw `"Неверный логин или пароль"`
   - Compare `password` with `password_hash`:
     - Supabase stores bcrypt hashes via `pgcrypto`; use a Supabase RPC
       `verify_password(login, password)` **if it exists**, otherwise call
       `supabase.rpc('check_user_password', { p_login, p_password })` —
       check the actual DB; if no RPC exists, use client-side `bcryptjs`
       (`npm install bcryptjs @types/bcryptjs`)
   - If password mismatch → throw `"Неверный логин или пароль"`
   - If `status === 'inactive'` → throw `{ code: 'INACTIVE' }`
   - On success → return the full user row object

**Files affected:**
- `src/shared/lib/supabase.ts` (new)
- `src/features/auth/authService.ts` (new)
- `src/features/auth/index.ts` (new barrel)

**Acceptance criteria:**
- `loginUser` resolves with user object on valid credentials
- `loginUser` throws correct error strings on bad login/password/inactive

---

### AUTH-003 — AuthContext / AuthProvider
**Priority:** Critical  
**Complexity:** Moderate  
**Dependencies:** AUTH-002  
**Estimated time:** ~30 min

**What to do:**
1. Create `src/features/auth/AuthContext.tsx`:
   - Context shape: `{ user: UserType | null, login, logout, isLoading }`
   - On mount: read `localStorage.getItem('toolflow_user')`, parse JSON, set as initial user
   - `login(login, password)`: calls `loginUser`, saves to `localStorage`, sets context state
   - `logout()`: clears `localStorage`, nulls user state, redirects to `/login`
2. Create `src/features/auth/types.ts` — `UserType` interface matching `public.users` columns
3. Wrap `<App>` with `<AuthProvider>` in `src/main.tsx`

**Files affected:**
- `src/features/auth/AuthContext.tsx` (new)
- `src/features/auth/types.ts` (new)
- `src/features/auth/index.ts` (update barrel)
- `src/main.tsx` (wrap with AuthProvider)

**Acceptance criteria:**
- `useAuth()` hook returns current user everywhere in the tree
- After page refresh, user stays logged in (restored from localStorage)
- `logout()` clears state and redirects

---

### AUTH-004 — LoginPage UI
**Priority:** Critical  
**Complexity:** Moderate  
**Dependencies:** AUTH-003  
**Estimated time:** ~60 min

**What to do:**
1. Create `src/pages/LoginPage.tsx`:
   - BEM class names (`login`, `login__form`, `login__field`, `login__btn`, etc.)
   - Two inputs: `login` (text) and `password` (password, with show/hide toggle)
   - Submit button "Войти"
   - Link/button "Забыли пароль?" → opens modal
   - On submit: calls `useAuth().login(...)` 
   - Error state: show red block `.login__error` with message
   - `inactive` status: show `.login__banner` "Доступ запрещён" (instead of the error)
   - Loading state: disable form while request is in-flight
2. Create `src/pages/LoginPage.css` with all BEM styles (match existing app style)
3. Create `src/components/ForgotPasswordModal.tsx` + CSS — modal with message
   "Для восстановления доступа обратитесь к администратору" and "Закрыть" button

**Files affected:**
- `src/pages/LoginPage.tsx` (new)
- `src/pages/LoginPage.css` (new)
- `src/components/ForgotPasswordModal.tsx` (new)
- `src/components/ForgotPasswordModal.css` (new)

**Acceptance criteria:**
- Login form renders at `/login`
- Red error appears for wrong credentials; "Доступ запрещён" banner for inactive
- "Забыли пароль?" opens modal correctly
- On success, user is redirected to `/inventory`

---

### AUTH-005 — Route protection (ProtectedRoute + PublicRoute)
**Priority:** Critical  
**Complexity:** Simple  
**Dependencies:** AUTH-003 AUTH-004  
**Estimated time:** ~30 min

**What to do:**
1. Create `src/app/ProtectedRoute.tsx`:
   - If `isLoading` → render spinner / null
   - If no `user` → `<Navigate to="/login" replace />`
   - Otherwise → `<Outlet />`
2. Create `src/app/PublicRoute.tsx`:
   - If `isLoading` → render spinner / null
   - If `user` exists → `<Navigate to="/inventory" replace />`
   - Otherwise → `<Outlet />`
3. Update `src/app/App.tsx`:
   - Wrap all existing routes (`/inventory`, `/my-items`, `/create`, `/info`, `/panel`)
     inside a `<Route element={<ProtectedRoute />}>` parent
   - Wrap `/login` inside a `<Route element={<PublicRoute />}>` parent
   - Add `<Route path="/" element={<Navigate to="/inventory" replace />}>`
   - Add `<Route path="*" element={<Navigate to="/inventory" replace />}>`

**Files affected:**
- `src/app/ProtectedRoute.tsx` (new)
- `src/app/PublicRoute.tsx` (new)
- `src/app/App.tsx` (update routing)

**Acceptance criteria:**
- Unauthenticated visit to `/inventory` → redirects to `/login`
- Authenticated visit to `/login` → redirects to `/inventory`
- All existing routes still work after login

---

## Dependencies Graph

```
AUTH-001
  └── AUTH-002
        └── AUTH-003
              ├── AUTH-004
              └── AUTH-005 (also needs AUTH-004 for /login route)
```

Sequential execution — no parallelisation (each step builds on the previous).

---

## Architecture Decisions

| Decision | Choice | Reason |
|---|---|---|
| Password verification | bcryptjs client-side (fallback) or Supabase RPC | Supabase anon key cannot call `pgcrypto` directly; check for RPC first |
| Auth state storage | `localStorage` (key: `toolflow_user`) | Per product spec; no server session needed for MVP |
| Auth state propagation | React Context + custom hook `useAuth()` | Simple, no extra libs; matches existing project patterns |
| Route guard pattern | `ProtectedRoute` / `PublicRoute` components with `<Outlet>` | React Router v6 idiomatic |
| CSS | BEM global CSS, new files per component | Matches existing app conventions (no Tailwind) |

---

## Risk Notes

- **bcrypt verification:** if the DB has no RPC to compare hashes, install `bcryptjs`
  and compare client-side. This is acceptable for an internal MVP tool.
- **Anon key exposure:** the Supabase anon key is published in the client bundle.
  This is normal for Supabase (RLS is the security layer), but ensure Row Level
  Security is enabled on `public.users` for production.
- **localStorage persistence:** no automatic session expiry. Log out manually or add
  a `lastLogin` check if needed in a later iteration.

---

## Progress (updated by orchestrator)

- ⏳ AUTH-001: Install @supabase/supabase-js and configure .env
- ⏳ AUTH-002: Supabase client + auth service
- ⏳ AUTH-003: AuthContext / AuthProvider
- ⏳ AUTH-004: LoginPage UI
- ⏳ AUTH-005: Route protection (ProtectedRoute + PublicRoute)
