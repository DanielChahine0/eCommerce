# eCommerce Backend API Documentation

## Overview
This is a comprehensive RESTful API backend for an eCommerce platform built with Spring Boot following MVC architecture with clear separation of concerns.

## Architecture

### Layers
1. **Controller Layer** (`controller/`): Handles HTTP requests/responses
2. **Service Layer** (`service/`): Contains business logic
3. **Repository Layer** (`repository/`): Data access using Spring Data JPA
4. **Model Layer** (`model/`): Entity definitions
5. **DTO Layer** (`dto/`): Data transfer objects for API
6. **Exception Layer** (`exception/`): Custom exceptions and global error handling

## API Endpoints

### User API (`/api/users`)

#### Create User
- **POST** `/api/users`
- **Body**: 
```json
{
  "username": "john_doe",
  "email": "john@example.com",
  "role": "customer",
  "address": {
    "zip": "12345",
    "country": "USA",
    "street": "123 Main St",
    "province": "CA"
  }
}
```
- **Response**: `201 Created` with UserDTO

#### Get User by ID
- **GET** `/api/users/{id}`
- **Response**: `200 OK` with UserDTO

#### Get User by Email
- **GET** `/api/users/email/{email}`
- **Response**: `200 OK` with UserDTO

#### Get All Users
- **GET** `/api/users`
- **Response**: `200 OK` with List<UserDTO>

#### Get Users by Role
- **GET** `/api/users/role/{role}`
- **Response**: `200 OK` with List<UserDTO>

#### Update User
- **PUT** `/api/users/{id}`
- **Body**: CreateUserRequest
- **Response**: `200 OK` with UserDTO

#### Delete User
- **DELETE** `/api/users/{id}`
- **Response**: `204 No Content`

---

### Product API (`/api/products`)

#### Create Product
- **POST** `/api/products`
- **Body**:
```json
{
  "name": "Laptop",
  "quantity": 50,
  "description": "High-performance laptop",
  "image": "laptop.jpg",
  "brandId": 1,
  "categoryId": 1
}
```
- **Response**: `201 Created` with ProductDTO

#### Get Product by ID
- **GET** `/api/products/{id}`
- **Response**: `200 OK` with ProductDTO

#### Get All Products
- **GET** `/api/products?availableOnly=true`
- **Query Params**: 
  - `availableOnly` (optional): boolean - filter only available products
- **Response**: `200 OK` with List<ProductDTO>

#### Get Products by Brand
- **GET** `/api/products/brand/{brandId}`
- **Response**: `200 OK` with List<ProductDTO>

#### Get Products by Category
- **GET** `/api/products/category/{categoryId}`
- **Response**: `200 OK` with List<ProductDTO>

#### Search Products by Name
- **GET** `/api/products/search?name={searchTerm}`
- **Response**: `200 OK` with List<ProductDTO>

#### Filter Products
- **GET** `/api/products/filter?brandId={brandId}&categoryId={categoryId}`
- **Response**: `200 OK` with List<ProductDTO>

#### Update Product
- **PUT** `/api/products/{id}`
- **Body**: CreateProductRequest
- **Response**: `200 OK` with ProductDTO

#### Update Product Quantity
- **PATCH** `/api/products/{id}/quantity?quantity={newQuantity}`
- **Response**: `200 OK` with ProductDTO

#### Delete Product
- **DELETE** `/api/products/{id}`
- **Response**: `204 No Content`

---

### Basket API (`/api/basket`)

#### Add to Basket
- **POST** `/api/basket`
- **Body**:
```json
{
  "userId": 1,
  "productId": 5,
  "quantity": 2
}
```
- **Response**: `201 Created` with BasketItemDTO

#### Get User's Basket
- **GET** `/api/basket/user/{userId}`
- **Response**: `200 OK` with List<BasketItemDTO>

#### Get Basket Item Count
- **GET** `/api/basket/user/{userId}/count`
- **Response**: `200 OK` with count

#### Update Basket Item Quantity
- **PATCH** `/api/basket/{basketItemId}?quantity={newQuantity}`
- **Response**: `200 OK` with BasketItemDTO

#### Remove Item from Basket
- **DELETE** `/api/basket/{basketItemId}`
- **Response**: `204 No Content`

#### Clear User's Basket
- **DELETE** `/api/basket/user/{userId}`
- **Response**: `204 No Content`

---

### Order API (`/api/orders`)

#### Create Order (Checkout)
- **POST** `/api/orders`
- **Body**:
```json
{
  "userId": 1,
  "addressId": 1
}
```
- **Response**: `201 Created` with OrderDTO
- **Note**: This converts the user's basket into an order and clears the basket

#### Get Order by ID
- **GET** `/api/orders/{id}`
- **Response**: `200 OK` with OrderDTO

#### Get All Orders
- **GET** `/api/orders`
- **Response**: `200 OK` with List<OrderDTO>

#### Get User's Orders
- **GET** `/api/orders/user/{userId}`
- **Response**: `200 OK` with List<OrderDTO> (sorted by date descending)

#### Get Orders by Status
- **GET** `/api/orders/status/{status}`
- **Status values**: PENDING, PROCESSING, SHIPPED, DELIVERED, CANCELLED
- **Response**: `200 OK` with List<OrderDTO>

#### Update Order Status
- **PATCH** `/api/orders/{id}/status?status={newStatus}`
- **Response**: `200 OK` with OrderDTO

#### Cancel Order
- **DELETE** `/api/orders/{id}`
- **Response**: `204 No Content`
- **Note**: Only pending/processing orders can be cancelled. Inventory is restored.

---

## Error Handling

The API uses a global exception handler that returns consistent error responses:

```json
{
  "timestamp": "2023-12-13T10:30:00",
  "status": 400,
  "error": "Bad Request",
  "message": "Detailed error message",
  "path": "/api/products/1",
  "validationErrors": {
    "fieldName": "error message"
  }
}
```

### HTTP Status Codes
- `200 OK`: Successful GET/PUT/PATCH request
- `201 Created`: Successful POST request
- `204 No Content`: Successful DELETE request
- `400 Bad Request`: Invalid input or business rule violation
- `404 Not Found`: Resource not found
- `409 Conflict`: Duplicate resource
- `500 Internal Server Error`: Unexpected error

---

## Business Rules

### Product Management
- Product quantity cannot be negative
- Products must have valid brand and category

### Basket Management
- Cannot add more items than available in stock
- Quantity must be positive
- If product already in basket, quantities are combined
- Stock is validated when adding/updating basket items

### Order Management
- Cannot create order with empty basket
- Stock is validated before order creation
- Inventory is reduced when order is created
- Basket is cleared after successful order
- Order status transitions are validated
- Cannot cancel shipped/delivered orders
- Cancelling an order restores inventory

### User Management
- Email must be unique
- Username must be unique
- Valid email format required

---

## Data Models

### Product
- id, name, quantity, description, image
- brand (Brand entity)
- category (Category entity)

### User
- id, username, email, role
- address (Address entity)

### Basket
- id, quantity
- user (User entity)
- product (Product entity)

### Order
- id, status, total, timeCreated
- user (User entity)
- address (Address entity)
- basket (Basket entity - contains order items)

### OrderStatus Enum
- PENDING
- PROCESSING
- SHIPPED
- DELIVERED
- CANCELLED

---

## Running the Application

1. Build the project:
```bash
mvn clean install
```

2. Run the application:
```bash
mvn spring-boot:run
```

3. Access the API at: `http://localhost:8080/api`

4. H2 Database Console: `http://localhost:8080/h2-console`
   - JDBC URL: `jdbc:h2:mem:testdb`
   - Username: `sa`
   - Password: (leave blank)
