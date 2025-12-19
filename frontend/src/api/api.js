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

  const url = `${BASE_URL}${path}`
  const config = {
    ...options,
    headers: {
      ...headers,
      ...options.headers,
    },
  }

  // Log request details for debugging
  console.log('API Request:', {
    url,
    method: config.method || 'GET',
    body: options.body ? JSON.parse(options.body) : null
  })

  const res = await fetch(url, config)

  if (!res.ok) {
    let errorMessage
    let validationErrors = null
    try {
      // Try to parse as JSON first
      const errorData = await res.json()
      
      // Handle ErrorResponse structure from backend
      if (errorData.validationErrors) {
        validationErrors = errorData.validationErrors
        const errorList = Object.entries(errorData.validationErrors)
          .map(([field, msg]) => `${field}: ${msg}`)
          .join(', ')
        errorMessage = `${errorData.message || 'Validation failed'}: ${errorList}`
      } else {
        errorMessage = errorData.message || errorData.error || JSON.stringify(errorData)
      }
    } catch {
      // If not JSON, get as text
      errorMessage = await res.text()
    }
    
    console.error('API Error:', {
      status: res.status,
      statusText: res.statusText,
      message: errorMessage,
      validationErrors,
      url
    })
    
    const error = new Error(errorMessage || `HTTP ${res.status}: ${res.statusText}`)
    error.validationErrors = validationErrors
    throw error
  }
  
  const data = await res.json()
  console.log('API Response:', data)
  return data
}