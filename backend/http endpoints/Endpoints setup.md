# API Testing Guide

HTTP request files for testing all API endpoints with JWT authentication.

## Files

- **auth.http** - Authentication (register, login, validate)
- **users.http** - User management
- **roles.http** - Role management
- **products.http** - Product catalog
- **basket.http** - Shopping basket
- **orders.http** - Order management

## Quick Start

### Prerequisites
- REST Client extension for VS Code
- Backend running on `http://localhost:8080`

### Authentication Setup

1. **Login/Register** - Open [auth.http](auth.http) and execute login or register request
2. **Copy Token** - From the response, copy the JWT token value
3. **Update Files** - In each `.http` file, replace `YOUR_TOKEN_HERE` with your token:
   ```http
   @token = eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
   ```

### Making Requests
Click "Send Request" above any request or press `Ctrl+Alt+R`

## Common Workflows

**User Journey:**
```
auth.http (login) → products.http (browse) → basket.http (add items) → orders.http (checkout)
```

**Admin Setup:**
```
auth.http (login) → roles.http (create roles) → products.http (create products) → users.http (manage users)
```

## Troubleshooting

- **401 Unauthorized** - Update `@token` with fresh token from login
- **404 Not Found** - Verify resource ID exists in database
- **400 Bad Request** - Check request body format and required fields
- **500 Server Error** - Check backend logs

## Notes

- All endpoints except register/login require JWT authentication
- Replace placeholder IDs with actual IDs from your database
- Update `@userId` variable in basket.http and orders.http

For detailed documentation, see [API_DOCUMENTATION.md](../API_DOCUMENTATION.md)
