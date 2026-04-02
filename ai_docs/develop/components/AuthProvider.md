# AuthProvider Component

**Type:** Context Provider  
**Location:** `src/features/auth/AuthContext.tsx`  
**Status:** ✅ Implemented  
**Last Updated:** 2026-04-02

## Purpose

Wraps the entire React application and manages authentication state. Provides the `AuthContext` that all child components can access via the `useAuth()` hook.

## Props

```typescript
interface AuthProviderProps {
  children: ReactNode
}
```

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| `children` | ReactNode | Yes | React components to wrap |

## Context Value

```typescript
interface AuthContextType {
  user: User | null
  isLoading: boolean
  login: (login: string, password: string) => Promise<void>
  logout: () => void
}
```

| Property | Type | Description |
|----------|------|-------------|
| `user` | User \| null | Current authenticated user or null |
| `isLoading` | boolean | True while hydrating from localStorage, false after |
| `login` | function | Async function to authenticate user |
| `logout` | function | Function to clear session |

## How It Works

### Initialization

When the app mounts, `AuthProvider` runs an effect to hydrate from localStorage:

```
1. Component renders with isLoading = true
2. useEffect runs on mount
3. Calls getUserFromStorage()
4. localStorage['toolflow_user'] is parsed
5. setUser() updates state
6. setIsLoading(false) completes hydration
7. All child components can now access user
```

### Login Process

When a user submits login credentials:

```
1. Component calls context.login(login, password)
2. authService.loginUser() queries Supabase
3. Password verified via RPC
4. saveUserToStorage(user) persists to localStorage
5. setUser(user) updates React state
6. Component receives updated context
7. ProtectedRoute recognizes authenticated user
8. Automatic redirect to /inventory
```

### Logout Process

When a user clicks logout:

```
1. Component calls context.logout()
2. clearUserFromStorage() removes localStorage entry
3. setUser(null) clears React state
4. All components receive null user
5. ProtectedRoute detects null user
6. Automatic redirect to /login
```

## Usage

### Wrap App

```typescript
// src/app/App.tsx

import { AuthProvider } from '@/features/auth'

export function App() {
  return (
    <AuthProvider>
      <Routes>
        {/* Routes here */}
      </Routes>
    </AuthProvider>
  )
}
```

### Access in Components

```typescript
import { useAuth } from '@/features/auth'

export function UserProfile() {
  const { user, login, logout, isLoading } = useAuth()

  if (isLoading) {
    return <div>Loading authentication...</div>
  }

  return (
    <div>
      {user ? (
        <>
          <p>Welcome, {user.login}</p>
          <button onClick={logout}>Logout</button>
        </>
      ) : (
        <p>Not authenticated</p>
      )}
    </div>
  )
}
```

## Implementation Details

### State Management

```typescript
export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  // Hydrate from localStorage on mount
  useEffect(() => {
    setUser(getUserFromStorage())
    setIsLoading(false)
  }, [])

  // Login and save to storage
  async function login(login: string, password: string): Promise<void> {
    const loggedInUser = await loginUser(login, password)
    saveUserToStorage(loggedInUser)
    setUser(loggedInUser)
  }

  // Clear session
  function logout(): void {
    clearUserFromStorage()
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, isLoading, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}
```

### Error Handling

Errors thrown by `loginUser()` are not caught by AuthProvider. They propagate to calling components:

```typescript
try {
  await context.login(login, password)
} catch (err) {
  // Handle error in component
  // Examples: "Неверный логин или пароль", "ACCESS_DENIED"
}
```

## Common Patterns

### Check if Loading

```typescript
const { isLoading } = useAuth()

if (isLoading) {
  return <div>Loading...</div>
}
```

### Access User Data

```typescript
const { user } = useAuth()

return (
  <div>
    ID: {user?.id}
    Name: {user?.first_name} {user?.last_name}
    Position: {user?.position}
  </div>
)
```

### Check Permissions

```typescript
const { user } = useAuth()

return (
  <div>
    {user?.can_create_edit_cards && <CreateButton />}
    {user?.can_manage_users && <UsersPanel />}
    {user?.is_admin && <AdminPanel />}
  </div>
)
```

### Login Form

```typescript
import { useAuth } from '@/features/auth'
import { useState } from 'react'

export function LoginForm() {
  const { login } = useAuth()
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const login_val = (e.target as HTMLFormElement).login.value
    const password = (e.target as HTMLFormElement).password.value

    try {
      await login(login_val, password)
      // Redirect happens automatically via ProtectedRoute
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Login failed')
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      {error && <div className="error">{error}</div>}
      <input name="login" type="text" placeholder="Username" required />
      <input name="password" type="password" placeholder="Password" required />
      <button type="submit">Sign In</button>
    </form>
  )
}
```

### Logout Button

```typescript
import { useAuth } from '@/features/auth'

export function LogoutButton() {
  const { logout, user } = useAuth()

  return (
    <button onClick={logout}>
      Logout ({user?.login})
    </button>
  )
}
```

## Related Components

- **useAuth Hook:** `src/features/auth/useAuth.ts`
- **ProtectedRoute:** `src/app/ProtectedRoute.tsx`
- **PublicRoute:** `src/app/PublicRoute.tsx`
- **LoginPage:** `src/pages/LoginPage.tsx`

## Performance Considerations

### Optimization: Memoization

If many components use `useAuth()`, consider memoizing context value:

```typescript
const value = useMemo(
  () => ({ user, isLoading, login, logout }),
  [user, isLoading]
)

return (
  <AuthContext.Provider value={value}>
    {children}
  </AuthContext.Provider>
)
```

### Why Memoize?

- Prevents unnecessary re-renders of all child components
- Context value changes only when user or isLoading changes
- Without memoization: new object created on every render

## Testing

### Mock Setup

```typescript
import { render } from '@testing-library/react'
import { AuthProvider } from '@/features/auth'

// Mock localStorage
const mockLocalStorage = (() => {
  let store: Record<string, string> = {}
  return {
    getItem: (key: string) => store[key] ?? null,
    setItem: (key: string, value: string) => {
      store[key] = value.toString()
    },
    removeItem: (key: string) => {
      delete store[key]
    },
    clear: () => {
      store = {}
    },
  }
})()

Object.defineProperty(window, 'localStorage', {
  value: mockLocalStorage,
})

// Mock Supabase
vi.mock('@/shared/lib/supabase', () => ({
  supabase: {
    from: vi.fn(() => ({
      select: vi.fn(() => ({
        eq: vi.fn(() => ({
          single: vi.fn(async () => ({
            data: mockUser,
            error: null,
          })),
        })),
      })),
    })),
    rpc: vi.fn(async () => ({ data: true, error: null })),
  },
}))
```

### Test Cases

```typescript
test('hydrates user from localStorage on mount', () => {
  localStorage.setItem('toolflow_user', JSON.stringify(mockUser))
  
  render(
    <AuthProvider>
      <TestComponent />
    </AuthProvider>
  )

  // Assert user is available via useAuth()
})

test('login stores user in localStorage', async () => {
  const { getByRole } = render(
    <AuthProvider>
      <LoginButton />
    </AuthProvider>
  )

  fireEvent.click(getByRole('button', { name: /login/i }))
  await waitFor(() => {
    expect(localStorage.getItem('toolflow_user')).toBeDefined()
  })
})

test('logout clears localStorage', async () => {
  // Setup: user logged in
  const { getByRole } = render(
    <AuthProvider>
      <LogoutButton />
    </AuthProvider>
  )

  fireEvent.click(getByRole('button', { name: /logout/i }))
  
  expect(localStorage.getItem('toolflow_user')).toBeNull()
})
```

## Troubleshooting

### "useAuth must be used within an AuthProvider"

**Problem:** Using `useAuth()` in a component not wrapped by `AuthProvider`

**Solution:** Ensure the component tree includes `<AuthProvider>`:

```typescript
// ✅ Correct
<AuthProvider>
  <MyComponent /> {/* Can use useAuth() */}
</AuthProvider>

// ❌ Wrong
<MyComponent /> {/* Error: not in AuthProvider */}
<AuthProvider>...</AuthProvider>
```

### User Lost After Page Refresh

**Problem:** User is null after refresh even though localStorage has data

**Solution:** Check if `getUserFromStorage()` is working:

```typescript
// Test in console
console.log(localStorage.getItem('toolflow_user'))
// Should return JSON string of user

// If nothing: localStorage was cleared
// If JSON: authService might be failing to parse
```

### Context Not Updating

**Problem:** Component doesn't re-render when user changes

**Solution:** Ensure using `useAuth()` hook, not accessing context directly:

```typescript
// ✅ Correct - will re-render
const { user } = useAuth()

// ❌ Wrong - won't re-render on changes
const context = useContext(AuthContext)
```

## Documentation

- **Feature Overview:** `ai_docs/develop/features/authentication.md`
- **Architecture:** `ai_docs/develop/architecture/auth-system.md`
- **API Reference:** `ai_docs/develop/api/authentication.md`
- **Setup Guide:** `ai_docs/develop/features/authentication-setup.md`
