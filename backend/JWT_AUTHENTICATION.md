# JWT Authentication Setup

This application now uses JWT (JSON Web Token) for stateless authentication.

## Overview

The JWT authentication system provides:
- **Stateless authentication**: No server-side session storage needed
- **Secure password storage**: Passwords are encrypted using BCrypt
- **Token-based authorization**: Each request includes a JWT token for authentication
- **Role-based access control**: Users have roles that determine their permissions

## Components

### 1. Security Configuration
- **Location**: `src/main/java/com/example/config/SecurityConfig.java`
- Configures Spring Security with JWT authentication
- Defines public and protected endpoints
- Sets up password encoding with BCrypt

### 2. JWT Utilities
- **Location**: `src/main/java/com/example/security/JwtUtil.java`
- Generates JWT tokens
- Validates and extracts information from tokens
- Token expiration: 24 hours (86400000 ms)

### 3. Authentication Filter
- **Location**: `src/main/java/com/example/security/JwtAuthenticationFilter.java`
- Intercepts all requests to validate JWT tokens
- Automatically authenticates users based on valid tokens

### 4. Authentication Endpoints
- **Location**: `src/main/java/com/example/controller/AuthController.java`
- `/api/auth/register` - Register new users
- `/api/auth/login` - Login and receive JWT token
- `/api/auth/validate` - Validate token and get user info

## Configuration

The JWT configuration is in `application.properties`:

```properties
jwt.secret=YOUR_SECRET_KEY
jwt.expiration=86400000  # 24 hours in milliseconds
```

**Important**: Change the `jwt.secret` in production! Generate a secure key using:
```bash
openssl rand -base64 64
```

## Usage

### 1. Register a New User

```http
POST http://localhost:8080/api/auth/register
Content-Type: application/json

{
  "username": "johndoe",
  "email": "john@example.com",
  "password": "password123",
  "roleId": 1,
  "phoneNumber": "123-456-7890",
  "address": {
    "zip": "12345",
    "country": "USA",
    "street": "123 Main St",
    "province": "NY"
  }
}
```

**Response**:
```json
{
  "token": "eyJhbGciOiJIUzI1NiJ9...",
  "type": "Bearer",
  "user": {
    "id": 1,
    "username": "johndoe",
    "email": "john@example.com",
    "role": {...},
    "phoneNumber": "123-456-7890",
    "address": {...}
  }
}
```

### 2. Login

```http
POST http://localhost:8080/api/auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "password123"
}
```

**Response**: Same as registration - returns token and user info

### 3. Access Protected Endpoints

Include the JWT token in the `Authorization` header:

```http
GET http://localhost:8080/api/products
Authorization: Bearer eyJhbGciOiJIUzI1NiJ9...
```

### 4. Validate Token

Check if a token is still valid and get user information:

```http
GET http://localhost:8080/api/auth/validate
Authorization: Bearer eyJhbGciOiJIUzI1NiJ9...
```

## Public vs Protected Endpoints

### Public Endpoints (No authentication required)
- `/api/auth/register` - User registration
- `/api/auth/login` - User login
- `/h2-console/**` - H2 database console

### Protected Endpoints (Authentication required)
- All other `/api/**` endpoints require a valid JWT token

## Security Features

1. **Password Encryption**: All passwords are hashed using BCrypt before storage
2. **Token Validation**: Every request validates the JWT token
3. **Token Expiration**: Tokens expire after 24 hours
4. **Stateless Sessions**: No server-side session storage
5. **CSRF Protection**: Disabled for stateless API (using JWT)

## Client Integration

### JavaScript Example

```javascript
// Login
const loginResponse = await fetch('http://localhost:8080/api/auth/login', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    email: 'john@example.com',
    password: 'password123'
  })
});

const { token, user } = await loginResponse.json();

// Store token (e.g., in localStorage)
localStorage.setItem('token', token);

// Use token for authenticated requests
const productsResponse = await fetch('http://localhost:8080/api/products', {
  headers: {
    'Authorization': `Bearer ${localStorage.getItem('token')}`
  }
});

const products = await productsResponse.json();
```

### React Example with Axios

```javascript
import axios from 'axios';

// Set up axios with base URL and interceptor
const api = axios.create({
  baseURL: 'http://localhost:8080/api'
});

// Add token to all requests
api.interceptors.request.use(config => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Login
const login = async (email, password) => {
  const response = await api.post('/auth/login', { email, password });
  localStorage.setItem('token', response.data.token);
  return response.data.user;
};

// Get products
const getProducts = async () => {
  const response = await api.get('/products');
  return response.data;
};
```

## Error Handling

### Invalid Credentials
```json
{
  "status": 401,
  "message": "Invalid email or password"
}
```

### Expired Token
```json
{
  "status": 401,
  "message": "Invalid token"
}
```

### Duplicate User
```json
{
  "status": 400,
  "message": "User already exists with email: 'john@example.com'"
}
```

## Testing

Use the provided `auth.http` file in the `backend/http endpoints/` directory to test the authentication endpoints in VS Code (requires REST Client extension).

## Database Changes

The `User` entity now includes a `password` field that stores the BCrypt-encrypted password. When the application starts with `ddl-auto=create-drop`, the database schema will be automatically updated.

## Migration Notes

If you have existing users in the database:
1. All existing endpoints now require authentication
2. Existing users need to be updated with encrypted passwords
3. Consider creating a migration script to add default passwords for existing users

## Troubleshooting

### "Access Denied" on all endpoints
- Ensure you're including the `Authorization: Bearer <token>` header
- Check that the token hasn't expired (24 hours)
- Verify the token format is correct

### "Invalid token"
- The token may have expired - login again to get a new token
- The secret key may have changed - tokens are invalidated when the secret changes
- The token format may be incorrect - ensure "Bearer " prefix

### CORS Issues
- If accessing from a frontend, you may need to configure CORS in Spring Boot
- Add `@CrossOrigin` annotation to controllers or configure globally

## Next Steps

1. **Add CORS Configuration**: If you're building a frontend application
2. **Implement Refresh Tokens**: For longer-lived sessions
3. **Add Password Reset**: Email-based password recovery
4. **Enhance Role-Based Access**: Add method-level security with `@PreAuthorize`
5. **Add Token Blacklisting**: For logout functionality
6. **Implement Rate Limiting**: Prevent brute-force attacks on login endpoint
