# JWT Authentication Implementation - Spring Boot 3 + Spring Security 6

## Overview
Clean JWT authentication implementation using Spring Boot 3 and Spring Security 6 with stateless session management.

## Components

### 1. JwtService
**Location:** `backend/src/main/java/com/example/security/JwtService.java`

**Purpose:** Handles JWT token generation, validation, and extraction.

**Key Methods:**
- `generateToken(UserDetails)` - Generate JWT token for authenticated user
- `extractUsername(String token)` - Extract username from token
- `isTokenValid(String token, UserDetails)` - Validate token against user details
- `extractClaim(String token, Function<Claims, T>)` - Extract specific claims

**Configuration:** Uses `jwt.secret` and `jwt.expiration` from application.properties

### 2. JwtAuthenticationFilter
**Location:** `backend/src/main/java/com/example/security/JwtAuthenticationFilter.java`

**Purpose:** OncePerRequestFilter that intercepts requests and validates JWT tokens.

**Flow:**
1. Skips `/api/auth/**` endpoints (no authentication required)
2. Extracts JWT from `Authorization: Bearer <token>` header
3. Validates token and loads user details
4. Sets authentication in SecurityContext
5. Continues filter chain

**Error Handling:** Logs errors and allows Spring Security to handle unauthorized access

### 3. JwtAuthenticationEntryPoint
**Location:** `backend/src/main/java/com/example/security/JwtAuthenticationEntryPoint.java`

**Purpose:** Returns 401 Unauthorized response with JSON error details.

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
**Location:** `backend/src/main/java/com/example/config/SecurityConfig.java`

**Purpose:** Spring Security configuration with JWT integration.

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

## Authentication Flow

### Registration (`POST /api/auth/register`)
1. Create user with encoded password
2. Authenticate user
3. Generate JWT token
4. Return token + user details

### Login (`POST /api/auth/login`)
1. Authenticate with email/password
2. Generate JWT token
3. Return token + user details

### Protected Endpoints (`/api/**`)
1. Client sends request with `Authorization: Bearer <token>`
2. JwtAuthenticationFilter extracts and validates token
3. Sets authentication in SecurityContext
4. Endpoint executes with authenticated user
5. If token invalid/missing → 401 Unauthorized

## Configuration

**application.properties:**
```properties
jwt.secret=<base64-encoded-secret-key>
jwt.expiration=86400000  # 24 hours in milliseconds
```

## Dependencies (pom.xml)

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

## Testing

**Login Request:**
```http
POST http://localhost:8080/api/auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123"
}
```

**Protected Request:**
```http
GET http://localhost:8080/api/users
Authorization: Bearer <your-jwt-token>
```

## Security Features

✅ **Stateless Authentication** - No server-side session storage  
✅ **Token Expiration** - Configurable token lifetime  
✅ **Secure Token Generation** - HMAC-SHA256 signing  
✅ **401 Handling** - Custom unauthorized response  
✅ **CORS Support** - Configured for frontend origins  
✅ **Password Encryption** - BCrypt hashing  
✅ **Public/Protected Routes** - Clear endpoint access control  

## Notes

- Tokens are validated on every request to protected endpoints
- No authentication required for `/api/auth/**`
- UserDetailsService loads user by email (username field)
- Authentication uses email + password
- Token contains user email as subject
- Filter logs JWT errors but doesn't expose details to client
