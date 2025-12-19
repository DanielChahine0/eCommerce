# Quick Reference: Sample Data Credentials

## 🔑 Login Credentials

All users use the same password: **`password123`**

### Admin Account
- **Username**: `admin`
- **Email**: `admin@estore.com`
- **Role**: ROLE_ADMIN
- **Password**: `password123`

### Regular Users
| Username    | Email                  |
|-------------|------------------------|
| john_doe    | john.doe@email.com     |
| jane_smith  | jane.smith@email.com   |
| bob_wilson  | bob.wilson@email.com   |

### Guest Account
- **Username**: `guest_user`
- **Email**: `guest@estore.com`
- **Role**: ROLE_GUEST

## 📊 Sample Data Summary

- **5** Users (1 admin, 3 regular users, 1 guest)
- **3** Roles
- **8** Categories
- **10** Brands
- **22** Products across all categories
- **5** Addresses

## 🚀 How to Initialize

The sample data will be **automatically loaded** when you start the application for the first time.

### Check if data is loaded:
```bash
# Get all products
curl http://localhost:8080/api/products

# Get all categories
curl http://localhost:8080/api/categories

# Get all brands
curl http://localhost:8080/api/brands
```

### Test login:
```bash
curl -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"password123"}'
```

## 📝 Data Files

1. **Java Initializer** (Active): 
   - `backend/src/main/java/com/example/config/DataInitializer.java`
   
2. **SQL Migration** (Alternative):
   - `backend/src/main/resources/db/migration/V2__insert_sample_data.sql`
   
3. **Documentation**:
   - `backend/SAMPLE_DATA.md`

## ⚠️ Important Notes

- Data is only inserted if the database is empty
- All passwords are securely hashed with BCrypt
- Product images use Unsplash URLs
- To reset: drop the database and restart the application
