import React, { createContext, useContext, useState, useEffect } from 'react'

const AuthContext = createContext(null)

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/auth/check', { credentials: 'same-origin', cache: 'no-store' })
      .then(async response => { if (response.ok) setUser((await response.json()).data) })
      .catch(() => setUser(null)).finally(() => setLoading(false))
  }, [])

  const login = async (email, password) => {
    try {
      const response = await fetch('/api/auth/login', { method: 'POST', credentials: 'same-origin',
        headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ email, password }) })
      const result = await response.json()
      if (response.ok && result.success) setUser(result.data)
      return result
    } catch { return { success: false, message: 'Unable to sign in. Please try again.' } }
  }
  const logout = async () => {
    const response = await fetch('/api/auth/logout', { method: 'POST', credentials: 'same-origin' })
    if (response.ok || response.status === 401) setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within an AuthProvider')
  return ctx
}

export default AuthContext