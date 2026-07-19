import { createContext, useContext, useState } from 'react'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try {
      const s = localStorage.getItem('salon_user')
      return s ? JSON.parse(s) : null
    } catch {
      return null
    }
  })

  const login = (userData) => {
    localStorage.setItem('salon_token', userData.token)
    localStorage.setItem('salon_refresh_token', userData.refreshToken) 
    localStorage.setItem('salon_user', JSON.stringify(userData))
    setUser(userData)
  }

  const logout = () => {
    localStorage.removeItem('salon_token')
    localStorage.removeItem('salon_refresh_token') 
    localStorage.removeItem('salon_user')
    setUser(null)
    window.location.href = '/login' 
  }

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)