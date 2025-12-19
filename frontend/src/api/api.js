// Initialize token from localStorage on module load
let AUTH_TOKEN = null
const BASE_URL = 'http://localhost:8080'

// Load token from localStorage when module is first imported
if (typeof window !== 'undefined') {
  AUTH_TOKEN = localStorage.getItem('authToken')
}

export function setAuthToken(token) {
  AUTH_TOKEN = token
  if (token) {
    localStorage.setItem('authToken', token)
  } else {
    localStorage.removeItem('authToken')
  }
}

export function getAuthToken() {
  return AUTH_TOKEN
}

export async function api(path, options = {}) {
  const headers = { 'Content-Type': 'application/json' }
  if (AUTH_TOKEN) {
    headers.Authorization = `Bearer ${AUTH_TOKEN}`
  }

  const res = await fetch(`${BASE_URL}${path}`, {
    ...options,
    headers: {
      ...headers,
      ...options.headers,
    },
  })

  if (!res.ok) {
    const errorText = await res.text()
    throw new Error(errorText || `HTTP ${res.status}: ${res.statusText}`)
  }
  return res.json()
}