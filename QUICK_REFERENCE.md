# Quick Reference Guide - eCommerce Backend

## 🚀 Getting Started

### Start the Application
```bash
cd estore
mvn spring-boot:run
```

The application will start on **http://localhost:8080**

### Database Console
- **URL**: http://localhost:8080/h2-console
- **JDBC URL**: `jdbc:h2:mem:testdb`
- **Username**: `sa`
- **Password**: (leave blank)

---

## 📋 Sample API Requests (Postman/cURL)

### 1. Get All Products
```bash
GET http://localhost:8080/api/products
```

### 2. Get Product by ID
```bash
GET http://localhost:8080/api/products/1
```

### 3. Search Products
```bash
GET http://localhost:8080/api/products/search?name=iPhone
```

### 4. Create a New User
```bash
POST http://localhost:8080/api/users
Content-Type: application/json

{
  "username": "test_user",
  "email": "test@example.com",
  "role": "customer",
  "address": {
    "zip": "12345",
    "country": "USA",
    "street": "123 Test St",
    "province": "NY"
  }
}
```

### 5. Add Product to Basket
```bash
POST http://localhost:8080/api/basket
Content-Type: application/json

{
  "userId": 1,
  "productId": 1,
  "quantity": 2
}
```

### 6. View User's Basket
```bash
GET http://localhost:8080/api/basket/user/1
```

### 7. Create Order (Checkout)
```bash
POST http://localhost:8080/api/orders
Content-Type: application/json

{
  "userId": 1,
  "addressId": 1
}
```

### 8. Get User's Orders
```bash
GET http://localhost:8080/api/orders/user/1
```

### 9. Update Order Status
```bash
PATCH http://localhost:8080/api/orders/1/status?status=PROCESSING
```

### 10. Cancel Order
```bash
DELETE http://localhost:8080/api/orders/1
```

---

## 🎯 Testing Workflow

### Complete Purchase Flow:
1. **Browse Products**: `GET /api/products`
2. **Add to Cart**: `POST /api/basket` (userId: 2, productId: 1, quantity: 1)
3. **View Cart**: `GET /api/basket/user/2`
4. **Checkout**: `POST /api/orders` (userId: 2, addressId: 2)
5. **View Orders**: `GET /api/orders/user/2`

### Admin Workflow:
1. **View All Orders**: `GET /api/orders`
2. **Update Order Status**: `PATCH /api/orders/{id}/status?status=SHIPPED`
3. **Add New Product**: `POST /api/products`
4. **Update Product Stock**: `PATCH /api/products/{id}/quantity?quantity=100`

---

## 📊 Sample Data (Pre-loaded)

### Users
| ID | Username | Email | Role |
|----|----------|-------|------|
| 1 | admin | admin@estore.com | admin |
| 2 | john_doe | john@example.com | customer |
| 3 | jane_smith | jane@example.com | customer |

### Products
| ID | Name | Quantity | Brand | Category |
|----|------|----------|-------|----------|
| 1 | iPhone 15 Pro | 100 | Apple | Electronics |
| 2 | MacBook Pro M3 | 50 | Apple | Electronics |
| 3 | Samsung Galaxy S24 | 75 | Samsung | Electronics |
| 4 | Nike Air Max | 200 | Nike | Sports |
| 5 | Adidas Ultraboost | 150 | Adidas | Sports |
| 6 | Nike Sportswear T-Shirt | 300 | Nike | Clothing |

### Brands: Apple, Samsung, Nike, Adidas
### Categories: Electronics, Clothing, Sports, Books

---

## ❌ Common Error Responses

### Product Not Found (404)
```json
{
  "timestamp": "2023-12-13T10:30:00",
  "status": 404,
  "error": "Not Found",
  "message": "Product not found with id: '999'",
  "path": "/api/products/999"
}
```

### Insufficient Stock (400)
```json
{
  "timestamp": "2023-12-13T10:30:00",
  "status": 400,
  "error": "Bad Request",
  "message": "Insufficient stock for product 'iPhone 15 Pro'. Available: 5, Requested: 10",
  "path": "/api/basket"
}
```

### Validation Error (400)
```json
{
  "timestamp": "2023-12-13T10:30:00",
  "status": 400,
  "error": "Validation Failed",
  "message": "Invalid input data",
  "path": "/api/users",
  "validationErrors": {
    "email": "Email must be valid",
    "username": "Username is required"
  }
}
```

### Duplicate Email (409)
```json
{
  "timestamp": "2023-12-13T10:30:00",
  "status": 409,
  "error": "Conflict",
  "message": "User already exists with email: 'test@example.com'",
  "path": "/api/users"
}
```

---

## 🔧 Configuration Options

### Disable Sample Data
To disable automatic data initialization, remove or comment out the `DataInitializer.java` file.

### Change Port
In `application.properties`:
```properties
server.port=9090
```

### Enable SQL Logging
Already enabled in `application.properties`:
```properties
spring.jpa.show-sql=true
spring.jpa.properties.hibernate.format_sql=true
```

---

## 🐛 Troubleshooting

### Application won't start
1. Check Java version: `java -version` (should be 17+)
2. Clean and rebuild: `mvn clean install`
3. Check port 8080 is not in use

### Database issues
1. Access H2 console to verify data
2. Check logs for SQL errors
3. Database recreates on each restart (in-memory)

### API returning errors
1. Check request body format (JSON)
2. Verify required fields are provided
3. Check entity IDs exist in database
4. Review error message for details

---

## 📚 Additional Resources

- **Full API Documentation**: See `API_DOCUMENTATION.md`
- **Architecture Guide**: See `BACKEND_ARCHITECTURE.md`
- **Spring Boot Docs**: https://spring.io/projects/spring-boot
- **Spring Data JPA**: https://spring.io/projects/spring-data-jpa

---

**Happy Coding! 🚀**
