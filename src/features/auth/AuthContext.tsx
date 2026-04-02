import { createContext, useEffect, useState } from 'react'
import type { ReactNode } from 'react'
import type { User } from './types'
import { loginUser, saveUserToStorage, getUserFromStorage, clearUserFromStorage } from './authService'

interface AuthContextType {
  user: User | null
  isLoading: boolean
  login: (login: string, password: string) => Promise<void>
  logout: () => void
}

// eslint-disable-next-line react-refresh/only-export-components
export const AuthContext = createContext<AuthContextType | null>(null)

interface AuthProviderProps {
  children: ReactNode
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    setUser(getUserFromStorage())
    setIsLoading(false)
  }, [])

  async function login(login: string, password: string): Promise<void> {
    const loggedInUser = await loginUser(login, password)
    saveUserToStorage(loggedInUser)
    setUser(loggedInUser)
  }

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
