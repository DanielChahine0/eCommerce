// Initialize token from localStorage on module load
let AUTH_TOKEN = null
// Use environment variable for API base URL

const BASE_URL = import.meta.env.VITE_DEVELOPMENT === 'production' 
  ? 'http://localhost:8080'
  : (import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080');

console.log('API Base URL:', BASE_URL);

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
  console.group('🚀 API Request');
  console.log('URL:', url);
  console.log('Method:', config.method || 'GET');
  console.log('Headers:', config.headers);
  console.log('Body:', options.body ? JSON.parse(options.body) : null);
  console.groupEnd();

  let res;
  try {
    res = await fetch(url, config)
  } catch (fetchError) {
    console.group('❌ API Fetch Error');
    console.error('Network Error:', fetchError.message);
    console.error('URL:', url);
    console.error('Stack Trace:', fetchError.stack);
    console.error('Possible causes:');
    console.error('  1. Backend server is not running');
    console.error('  2. Backend is running on a different port');
    console.error('  3. CORS configuration issue');
    console.error('  4. Network connectivity problem');
    console.groupEnd();
    
    throw new Error(`Network error: ${fetchError.message}. Please ensure the backend server is running on ${BASE_URL}`);
  }

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
    
    console.group('⚠️ API Error Response');
    console.error('Status:', res.status, res.statusText);
    console.error('URL:', url);
    console.error('Message:', errorMessage);
    if (validationErrors) {
      console.error('Validation Errors:', validationErrors);
    }
    console.groupEnd();
    
    const error = new Error(errorMessage || `HTTP ${res.status}: ${res.statusText}`)
    error.status = res.status;
    error.statusText = res.statusText;
    error.validationErrors = validationErrors
    error.url = url;
    throw error
  }
  
  const data = await res.json()
  console.group('✅ API Response');
  console.log('URL:', url);
  console.log('Data:', data);
  console.groupEnd();
  return data
}