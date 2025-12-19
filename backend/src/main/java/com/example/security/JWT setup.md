# JWT Setup and Authentication Guide

## Overview

This application uses JWT (JSON Web Token) for stateless authentication with Spring Boot 3 and Spring Security 6. The JWT authentication system provides:

- **Stateless authentication**: No server-side session storage needed
- **Secure password storage**: Passwords are encrypted using BCrypt
- **Token-based authorization**: Each request includes a JWT token for authentication
- **Role-based access control**: Users have roles that determine their permissions

## Implementation Components

### 1. JwtService
**Location:** `src/main/java/com/example/security/JwtService.java`

Handles JWT token generation, validation, and extraction.

**Key Methods:**
- `generateToken(UserDetails)` - Generate JWT token for authenticated user
- `extractUsername(String token)` - Extract username from token
- `isTokenValid(String token, UserDetails)` - Validate token against user details
- `extractClaim(String token, Function<Claims, T>)` - Extract specific claims

### 2. JwtAuthenticationFilter
**Location:** `src/main/java/com/example/security/JwtAuthenticationFilter.java`

OncePerRequestFilter that intercepts requests and validates JWT tokens.

**Flow:**
1. Skips `/api/auth/**` endpoints (no authentication required)
2. Extracts JWT from `Authorization: Bearer <token>` header
3. Validates token and loads user details
4. Sets authentication in SecurityContext
5. Continues filter chain

**Error Handling:** Logs errors and allows Spring Security to handle unauthorized access

### 3. JwtAuthenticationEntryPoint
**Location:** `src/main/java/com/example/security/JwtAuthenticationEntryPoint.java`

Returns 401 Unauthorized response with JSON error details.

**Response Format:**
```json
{
  "status": 401,
  "error": "Unauthorized",
  "message": "Full authentication is required",
  "path": "/api/..."
}
```

### 4. SecurityConfig
**Location:** `src/main/java/com/example/config/SecurityConfig.java`

Spring Security configuration with JWT integration.

**Key Configuration:**
- **Stateless Session:** `SessionCreationPolicy.STATELESS`
- **Public Endpoints:** `/api/auth/**`, `/h2-console/**`
- **Protected Endpoints:** `/api/**` (requires authentication)
- **CORS:** Configured for localhost origins (3000, 4200, 5173)
- **CSRF:** Disabled (stateless JWT)
- **Filter Chain:** JwtAuthenticationFilter before UsernamePasswordAuthenticationFilter

**Beans:**
- `PasswordEncoder` - BCrypt password encoder
- `AuthenticationProvider` - DAO authentication with UserDetailsService
- `AuthenticationManager` - From AuthenticationConfiguration
- `SecurityFilterChain` - Main security configuration

### 5. CustomUserDetailsService
**Location:** `src/main/java/com/example/security/CustomUserDetailsService.java`

Loads user details for Spring Security authentication.

### 6. AuthController
**Location:** `src/main/java/com/example/controller/AuthController.java`

Handles authentication endpoints:
- `/api/auth/register` - Register new users
- `/api/auth/login` - Login and receive JWT token
- `/api/auth/validate` - Validate token and get user info

### 7. AuthService
**Location:** `src/main/java/com/example/service/AuthService.java`

Business logic for authentication and user registration with password encoding.

### 8. CorsConfig
**Location:** `src/main/java/com/example/config/CorsConfig.java`

CORS configuration for frontend integration.

## Configuration

### application.properties

```properties
jwt.secret=<base64-encoded-secret-key>
jwt.expiration=86400000  # 24 hours in milliseconds
```

**IMPORTANT:** Change the `jwt.secret` in production! Generate a secure key using:
```bash
openssl rand -base64 64
```

### Token Expiration
Default: 24 hours (86400000 ms) - configurable via `jwt.expiration` property

## Dependencies

Add to `pom.xml`:

```xml
<!-- Spring Security -->
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-security</artifactId>
</dependency>

<!-- JWT (jjwt 0.12.5) -->
<dependency>
    <groupId>io.jsonwebtoken</groupId>
    <artifactId>jjwt-api</artifactId>
    <version>0.12.5</version>
</dependency>
<dependency>
    <groupId>io.jsonwebtoken</groupId>
    <artifactId>jjwt-impl</artifactId>
    <version>0.12.5</version>
    <scope>runtime</scope>
</dependency>
<dependency>
    <groupId>io.jsonwebtoken</groupId>
    <artifactId>jjwt-jackson</artifactId>
    <version>0.12.5</version>
    <scope>runtime</scope>
</dependency>

<!-- Jackson for JSON -->
<dependency>
    <groupId>com.fasterxml.jackson.core</groupId>
    <artifactId>jackson-databind</artifactId>
</dependency>
```

## Authentication Flow

### Registration Flow
1. User submits registration request to `/api/auth/register`
2. Password is encrypted using BCrypt
3. User is created and saved to database
4. User is automatically authenticated
5. JWT token is generated
6. Token and user details are returned

### Login Flow
1. User submits credentials to `/api/auth/login`
2. Email and password are validated
3. If valid, JWT token is generated
4. Token and user details are returned

### Protected Endpoint Access
1. Client sends request with `Authorization: Bearer <token>` header
2. JwtAuthenticationFilter extracts and validates token
3. Authentication is set in SecurityContext
4. Endpoint executes with authenticated user
5. If token is invalid/missing, returns 401 Unauthorized

## API Usage

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

**Response:**
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

**Response:** Same as registration - returns token and user info

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

## Endpoint Access Control

### Public Endpoints (No Authentication Required)
- `/api/auth/register` - User registration
- `/api/auth/login` - User login
- `/h2-console/**` - H2 database console

### Protected Endpoints (Authentication Required)
- All other `/api/**` endpoints require a valid JWT token

## Security Features

- **Stateless Authentication** - No server-side session storage
- **Token Expiration** - Configurable token lifetime (default 24 hours)
- **Secure Token Generation** - HMAC-SHA256 signing
- **401 Handling** - Custom unauthorized response
- **CORS Support** - Configured for frontend origins
- **Password Encryption** - BCrypt hashing
- **Public/Protected Routes** - Clear endpoint access control

## Client Integration Examples

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

## Error Responses

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

**Example Test Request:**
```http
POST http://localhost:8080/api/auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123"
}
```

**Example Protected Request:**
```http
GET http://localhost:8080/api/users
Authorization: Bearer <your-jwt-token>
```

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
- Check that the token hasn't expired (24 hours default)
- Verify the token format is correct

### "Invalid token"
- The token may have expired - login again to get a new token
- The secret key may have changed - tokens are invalidated when the secret changes
- The token format may be incorrect - ensure "Bearer " prefix is included

### CORS Issues
- If accessing from a frontend, CORS is already configured for common ports
- Modify `SecurityConfig.corsConfigurationSource()` if you need different origins

### Can't login
- Ensure you've created a role in the database first
- Check that the password meets minimum requirements (6 characters)

### All endpoints return 401
- Make sure you're including the `Authorization: Bearer <token>` header
- Check if the token has expired

## Optional Enhancements

1. **Refresh Tokens** - Implement token refresh for longer-lived sessions
2. **Password Reset** - Add email-based password recovery
3. **Enhanced Roles** - Add method-level security with `@PreAuthorize`
4. **Token Blacklisting** - Implement logout functionality with token invalidation
5. **Rate Limiting** - Prevent brute-force attacks on login endpoint
6. **OAuth2 Integration** - Add Google/Facebook login support
7. **Multi-factor Authentication** - Add additional security layer

## Files Created/Modified

### New Files
- `JwtService.java` - JWT token utilities
- `JwtAuthenticationFilter.java` - Request filter for token validation
- `JwtAuthenticationEntryPoint.java` - Unauthorized error handling
- `CustomUserDetailsService.java` - User details loading
- `SecurityConfig.java` - Spring Security configuration
- `CorsConfig.java` - CORS configuration
- `AuthController.java` - Authentication endpoints
- `AuthService.java` - Authentication business logic
- `LoginRequest.java` - Login DTO
- `LoginResponse.java` - Login response DTO
- `RegisterRequest.java` - Registration DTO
- `auth.http` - Testing endpoints

### Modified Files
- `pom.xml` - Added Spring Security and JWT dependencies
- `User.java` - Added password field
- `UserService.java` - Added password encoding
- `CreateUserRequest.java` - Added password field
- `application.properties` - Added JWT configuration

## Quick Start Guide

1. **Start the application:**
   ```bash
   cd backend
   ./mvnw spring-boot:run
   ```

2. **Create a role** (if not exists):
   ```http
   POST http://localhost:8080/api/roles
   Content-Type: application/json
   
   {
     "name": "CUSTOMER"
   }
   ```

3. **Register a user:**
   ```http
   POST http://localhost:8080/api/auth/register
   Content-Type: application/json
   
   {
     "username": "testuser",
     "email": "test@example.com",
     "password": "password123",
     "roleId": 1
   }
   ```

4. **Copy the token from the response and use it for authenticated requests:**
   ```http
   GET http://localhost:8080/api/products
   Authorization: Bearer <paste-token-here>
   ```

## Security Best Practices

1. **Never commit JWT secret to version control** - Use environment variables in production
2. **Use HTTPS in production** - Prevent token interception
3. **Implement token refresh** - For better user experience with long sessions
4. **Add rate limiting** - Protect against brute-force attacks
5. **Log authentication failures** - Monitor for suspicious activity
6. **Validate token on every request** - Handled automatically by JwtAuthenticationFilter
7. **Use strong passwords** - Enforce password complexity requirements
8. **Regular token rotation** - Consider shorter expiration times with refresh tokens
