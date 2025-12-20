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

// Cache configuration
const CACHE_CONFIG = {
  enabled: true,
  ttl: 5 * 60 * 1000, // 5 minutes
  maxSize: 50, // Maximum number of cached items
};

// In-memory cache for faster access
const memoryCache = new Map();

// Cache utility functions
const CacheManager = {
  set(key, data, ttl = CACHE_CONFIG.ttl) {
    if (!CACHE_CONFIG.enabled) return;
    
    const cacheItem = {
      data,
      timestamp: Date.now(),
      ttl,
    };
    
    // Store in memory cache
    memoryCache.set(key, cacheItem);
    
    // Store in localStorage with size limit check
    try {
      const cacheKey = `api_cache_${key}`;
      localStorage.setItem(cacheKey, JSON.stringify(cacheItem));
      
      // Clean old cache entries if too many
      this.cleanup();
    } catch (e) {
      console.warn('Cache storage failed:', e);
    }
  },
  
  get(key) {
    if (!CACHE_CONFIG.enabled) return null;
    
    // Check memory cache first (faster)
    let cacheItem = memoryCache.get(key);
    
    // If not in memory, check localStorage
    if (!cacheItem) {
      try {
        const cacheKey = `api_cache_${key}`;
        const stored = localStorage.getItem(cacheKey);
        if (stored) {
          cacheItem = JSON.parse(stored);
          // Restore to memory cache
          memoryCache.set(key, cacheItem);
        }
      } catch (e) {
        return null;
      }
    }
    
    if (!cacheItem) return null;
    
    // Check if expired
    const age = Date.now() - cacheItem.timestamp;
    if (age > cacheItem.ttl) {
      this.delete(key);
      return null;
    }
    
    return cacheItem.data;
  },
  
  delete(key) {
    memoryCache.delete(key);
    try {
      localStorage.removeItem(`api_cache_${key}`);
    } catch (e) {
      // Ignore errors
    }
  },
  
  cleanup() {
    // Clean up old entries from localStorage
    try {
      const keys = Object.keys(localStorage);
      const cacheKeys = keys.filter(k => k.startsWith('api_cache_'));
      
      if (cacheKeys.length > CACHE_CONFIG.maxSize) {
        // Sort by timestamp and remove oldest
        const entries = cacheKeys
          .map(key => {
            try {
              const item = JSON.parse(localStorage.getItem(key));
              return { key, timestamp: item.timestamp };
            } catch {
              return { key, timestamp: 0 };
            }
          })
          .sort((a, b) => a.timestamp - b.timestamp);
        
        // Remove oldest 25%
        const toRemove = Math.floor(entries.length * 0.25);
        entries.slice(0, toRemove).forEach(({ key }) => {
          localStorage.removeItem(key);
          memoryCache.delete(key.replace('api_cache_', ''));
        });
      }
    } catch (e) {
      console.warn('Cache cleanup failed:', e);
    }
  },
  
  clear() {
    memoryCache.clear();
    try {
      const keys = Object.keys(localStorage);
      keys.filter(k => k.startsWith('api_cache_')).forEach(k => {
        localStorage.removeItem(k);
      });
    } catch (e) {
      // Ignore errors
    }
  },
  
  // Invalidate cache for specific patterns
  invalidate(pattern) {
    const regex = new RegExp(pattern);
    
    // Clear memory cache
    for (const key of memoryCache.keys()) {
      if (regex.test(key)) {
        memoryCache.delete(key);
      }
    }
    
    // Clear localStorage cache
    try {
      const keys = Object.keys(localStorage);
      keys.filter(k => k.startsWith('api_cache_') && regex.test(k.replace('api_cache_', '')))
        .forEach(k => localStorage.removeItem(k));
    } catch (e) {
      // Ignore errors
    }
  }
};

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
  const method = options.method || 'GET';
  const cacheKey = `${method}_${path}`;
  
  // Check cache for GET requests only
  if (method === 'GET') {
    const cached = CacheManager.get(cacheKey);
    if (cached) {
      console.log('📦 Cache Hit:', path);
      return cached;
    }
  }
  
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
  
  // Cache GET requests
  if (method === 'GET') {
    CacheManager.set(cacheKey, data);
  }
  
  // Invalidate related cache on mutations
  if (['POST', 'PUT', 'PATCH', 'DELETE'].includes(method)) {
    // Invalidate cache for the resource being modified
    const resourceMatch = path.match(/\/api\/(\w+)/);
    if (resourceMatch) {
      CacheManager.invalidate(`GET_/api/${resourceMatch[1]}`);
    }
  }
  
  console.group('✅ API Response');
  console.log('URL:', url);
  console.log('Data:', data);
  console.groupEnd();
  return data
}

// Export cache manager for manual cache control
export { CacheManager };