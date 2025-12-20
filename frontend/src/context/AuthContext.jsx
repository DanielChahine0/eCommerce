import { createContext, useContext, useEffect, useState, useCallback } from 'react'
import { api, setAuthToken } from '../api/api'


const AuthContext = createContext()


export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [token, setToken] = useState(localStorage.getItem('authToken'))
  const [loading, setLoading] = useState(true)

  const logout = useCallback(() => {
    localStorage.removeItem('authToken')
    setToken(null)
    setUser(null)
    setAuthToken(null)
  }, [])

  useEffect(() => {
    async function validateToken() {
      if (token) {
        setAuthToken(token)
        try {
          const userData = await api('/api/auth/validate')
          setUser(userData)
          console.log('User data:', userData)
        } catch (error) {
          // Token is invalid or expired, clear it
          console.log('Token validation failed, clearing authentication')
          localStorage.removeItem('authToken')
          setToken(null)
          setAuthToken(null)
        }
      }
      setLoading(false)
    }

    validateToken()
  }, [token])

  function login(data) {
    localStorage.setItem('authToken', data.token)
    setToken(data.token)
    setUser(data.user)
  }


return (
<AuthContext.Provider value={{ user, token, login, logout, loading }}>
{children}
</AuthContext.Provider>
)
}


export const useAuth = () => useContext(AuthContext)