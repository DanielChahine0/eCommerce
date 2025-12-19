# Sample Data Initialization

This document describes the sample data that has been populated in the database for development and testing purposes.

## Overview

Two approaches are available for populating the database with sample data:

1. **Spring Boot CommandLineRunner** (Currently Active) - Automatically runs on application startup
2. **Flyway Migration** (Alternative) - Can be enabled by setting `spring.flyway.enabled=true`

## Sample Data Details

### Roles (3 roles)
- **ROLE_ADMIN** - Administrator with full access
- **ROLE_USER** - Regular user with standard access
- **ROLE_GUEST** - Guest user with limited access

### Categories (8 categories)
- Electronics
- Clothing
- Books
- Home & Garden
- Sports & Outdoors
- Toys & Games
- Food & Beverages
- Health & Beauty

### Brands (10 brands)
- TechMaster
- FashionHub
- ReadWell
- HomeComfort
- SportPro
- PlayTime
- FreshChoice
- BeautyGlow
- SmartLife
- ActiveWear

### Sample Users (5 users)

All users have the password: **`password123`**

| Username    | Email                  | Role        | Phone Number      | Location            |
|-------------|------------------------|-------------|-------------------|---------------------|
| admin       | admin@estore.com       | ROLE_ADMIN  | +1-416-555-0101   | Toronto, ON         |
| john_doe    | john.doe@email.com     | ROLE_USER   | +1-604-555-0102   | Vancouver, BC       |
| jane_smith  | jane.smith@email.com   | ROLE_USER   | +1-514-555-0103   | Montreal, QC        |
| bob_wilson  | bob.wilson@email.com   | ROLE_USER   | +1-403-555-0104   | Calgary, AB         |
| guest_user  | guest@estore.com       | ROLE_GUEST  | +1-613-555-0105   | Ottawa, ON          |

### Sample Products (22 products)

#### Electronics (4 products)
1. **Smart Watch Pro** - Advanced smartwatch with health tracking and GPS (50 in stock)
2. **Wireless Headphones** - Noise-canceling wireless headphones (75 in stock)
3. **4K Smart TV** - 55-inch 4K Ultra HD Smart LED TV (25 in stock)
4. **Laptop Computer** - High-performance laptop with 16GB RAM (30 in stock)

#### Clothing (3 products)
5. **Classic T-Shirt** - Comfortable cotton t-shirt (200 in stock)
6. **Denim Jeans** - Classic fit denim jeans (150 in stock)
7. **Running Shoes** - Lightweight running shoes (100 in stock)

#### Books (2 products)
8. **The Art of Programming** - Programming guide (80 in stock)
9. **Mystery Novel Collection** - 3-book bundle (60 in stock)

#### Home & Garden (3 products)
10. **Coffee Maker** - Programmable coffee maker (45 in stock)
11. **Garden Tool Set** - 10-piece tool set (35 in stock)
12. **LED Desk Lamp** - Adjustable desk lamp (90 in stock)

#### Sports & Outdoors (3 products)
13. **Yoga Mat** - Premium non-slip yoga mat (120 in stock)
14. **Camping Tent** - 4-person weatherproof tent (40 in stock)
15. **Basketball** - Official size basketball (85 in stock)

#### Toys & Games (2 products)
16. **Building Blocks Set** - 500-piece creative set (110 in stock)
17. **Board Game Collection** - Classic games pack (70 in stock)

#### Food & Beverages (2 products)
18. **Organic Coffee Beans** - Premium organic beans 1kg (95 in stock)
19. **Green Tea Collection** - 20 bags assorted varieties (130 in stock)

#### Health & Beauty (3 products)
20. **Skincare Set** - Complete daily routine (65 in stock)
21. **Electric Toothbrush** - Rechargeable with multiple modes (55 in stock)
22. **Fitness Tracker** - Water-resistant with heart rate monitor (80 in stock)

## How to Use

### Method 1: Spring Boot CommandLineRunner (Default)

The `DataInitializer` class will automatically populate the database when the application starts if the database is empty.

**Features:**
- Automatic initialization on startup
- Checks if data exists before insertion (prevents duplicates)
- Logs the initialization process
- Displays sample credentials in console

**Configuration:**
No configuration needed. The class is in:
```
backend/src/main/java/com/example/config/DataInitializer.java
```

### Method 2: Flyway Migration (Alternative)

To use Flyway migrations instead:

1. Enable Flyway in `application.yml`:
```yaml
spring:
  flyway:
    enabled: true
    baseline-on-migrate: true
    locations: classpath:db/migration
```

2. The migration files are located in:
```
backend/src/main/resources/db/migration/V2__insert_sample_data.sql
```

3. Comment out or remove the `@Configuration` annotation from `DataInitializer.java`

## Testing the Sample Data

### Login Test
Use any of the sample user credentials to test authentication:
```bash
POST http://localhost:8080/api/auth/login
Content-Type: application/json

{
  "username": "admin",
  "password": "password123"
}
```

### Browse Products
Get all products:
```bash
GET http://localhost:8080/api/products
```

### Filter by Category
Get electronics products:
```bash
GET http://localhost:8080/api/products?category=Electronics
```

## Resetting Sample Data

### Option 1: Drop and Recreate Database
If using PostgreSQL:
```sql
DROP DATABASE IF EXISTS postgres;
CREATE DATABASE postgres;
```

### Option 2: Change ddl-auto (Development Only)
Temporarily change in `application.yml`:
```yaml
spring:
  jpa:
    hibernate:
      ddl-auto: create-drop
```
⚠️ **Warning**: This will drop and recreate all tables on restart!

### Option 3: Manual Deletion
Delete data in the correct order to respect foreign key constraints:
```sql
DELETE FROM orders;
DELETE FROM baskets;
DELETE FROM products;
DELETE FROM users;
DELETE FROM addresses;
DELETE FROM brands;
DELETE FROM categories;
DELETE FROM roles;
```

## Notes

- Images use Unsplash URLs for product photos (require internet connection)
- Passwords are securely hashed using BCrypt
- The initialization checks if data exists before inserting to prevent duplicates
- Basket and Order data are not pre-populated as they are typically created through user interactions

## Troubleshooting

**Q: The data is not being inserted**
- Check the logs for "Database already contains data. Skipping initialization."
- Ensure the database is empty or delete existing data
- Verify database connection in `application.yml`

**Q: Getting foreign key constraint errors**
- Ensure the initialization order is maintained (roles → categories → brands → addresses → users → products)

**Q: Users cannot log in**
- Verify the password is exactly `password123`
- Check that the password encoder bean is configured correctly
