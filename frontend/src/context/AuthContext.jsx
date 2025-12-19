import { createContext, useContext, useEffect, useState } from 'react'
import { api, setAuthToken } from '../api/api'


const AuthContext = createContext()


export function AuthProvider({ children }) {
const [user, setUser] = useState(null)
const [token, setToken] = useState(localStorage.getItem('token'))


useEffect(() => {
if (token) {
setAuthToken(token)
api('/api/auth/validate')
.then(setUser)
.catch(() => logout())
}
}, [token])


function login(data) {
localStorage.setItem('token', data.token)
setToken(data.token)
setUser(data.user)
}


function logout() {
localStorage.removeItem('token')
setToken(null)
setUser(null)
setAuthToken(null)
}


return (
<AuthContext.Provider value={{ user, token, login, logout }}>
{children}
</AuthContext.Provider>
)
}


export const useAuth = () => useContext(AuthContext)