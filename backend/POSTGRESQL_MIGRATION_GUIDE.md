# PostgreSQL Migration Guide

## 🎯 Migration Summary

Successfully migrated from H2 in-memory database to PostgreSQL with Docker support.

## 📦 What Changed

### Removed:
- ❌ H2 database dependency
- ❌ H2 console configuration
- ❌ H2 JDBC driver and dialect
- ❌ `application.properties` (backed up as `application.properties.h2-backup`)

### Added:
- ✅ PostgreSQL JDBC driver
- ✅ Flyway migration support
- ✅ Multi-stage Dockerfile
- ✅ Updated docker-compose.yml with app + database
- ✅ Profile-based configuration (application.yml + application-docker.yml)
- ✅ Environment variable support

---

## 🚀 Quick Start Commands

### Option 1: Run Locally (Direct PostgreSQL Connection)

```bash
# 1. Start PostgreSQL only
cd backend
docker-compose up db -d

# 2. Wait for PostgreSQL to be ready (healthcheck)
docker-compose ps

# 3. Run Spring Boot locally
./mvnw spring-boot:run

# Access: http://localhost:8080
```

### Option 2: Run Everything in Docker (Recommended)

```bash
# 1. Build and start all services
cd backend
docker-compose up --build

# Or run in detached mode
docker-compose up --build -d

# 2. View logs
docker-compose logs -f app

# Access: http://localhost:8080
```

### Option 3: Rebuild from Scratch

```bash
# Clean everything and rebuild
cd backend
docker-compose down -v  # Remove volumes
docker-compose build --no-cache
docker-compose up
```

---

## 📋 Common Docker Commands

```bash
# Check service status
docker-compose ps

# View logs
docker-compose logs -f app    # App logs
docker-compose logs -f db     # Database logs
docker-compose logs -f        # All logs

# Stop services
docker-compose stop

# Stop and remove containers
docker-compose down

# Stop and remove containers + volumes (data loss!)
docker-compose down -v

# Restart a single service
docker-compose restart app

# Execute command in running container
docker-compose exec app sh
docker-compose exec db psql -U daniel -d postgres

# View database data
docker-compose exec db psql -U daniel -d postgres -c "SELECT * FROM users;"
```

---

## 🔧 Database Migration Strategy

### Option A: `ddl-auto` (Current Setup - Development)

**Current Configuration:** `ddl-auto: update`

**Pros:**
- ✅ Fast development iteration
- ✅ Auto-creates/updates tables
- ✅ No manual migration files needed

**Cons:**
- ❌ Not safe for production
- ❌ Can cause data loss
- ❌ No version control of schema changes
- ❌ Can't rollback changes

**Settings:**
- `create`: Drop and recreate schema on startup (data loss!)
- `create-drop`: Drop schema on shutdown (data loss!)
- `update`: Update schema automatically (risky in production)
- `validate`: Only validate schema (safe, but no auto-creation)
- `none`: Do nothing (use with Flyway)

### Option B: Flyway (Recommended for Production)

**Already included in pom.xml** - just enable it!

#### 1. Enable Flyway

Edit `application.yml` or set environment variable:
```yaml
spring:
  jpa:
    hibernate:
      ddl-auto: validate  # or 'none'
  flyway:
    enabled: true
```

Or via Docker:
```bash
docker-compose up -e FLYWAY_ENABLED=true -e DDL_AUTO=validate
```

#### 2. Create Migration Files

Create directory structure:
```bash
mkdir -p src/main/resources/db/migration
```

Create your first migration: `V1__initial_schema.sql`
```sql
-- V1__initial_schema.sql
CREATE TABLE IF NOT EXISTS users (
    id BIGSERIAL PRIMARY KEY,
    username VARCHAR(255) NOT NULL UNIQUE,
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS roles (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(50) NOT NULL UNIQUE
);

-- Add more tables as needed...
```

#### 3. Naming Convention

- `V{version}__{description}.sql` (e.g., `V1__initial_schema.sql`)
- `V2__add_products_table.sql`
- `V3__add_user_roles.sql`

#### 4. Generate Initial Schema from Hibernate

```bash
# 1. Set ddl-auto to 'create' temporarily
# 2. Enable SQL logging
# 3. Copy generated SQL from logs
# 4. Create V1__initial_schema.sql
# 5. Switch to Flyway
```

**Pros:**
- ✅ Version-controlled migrations
- ✅ Safe for production
- ✅ Rollback support
- ✅ Team collaboration
- ✅ Auditable changes

**Cons:**
- ❌ More setup required
- ❌ Manual migration file creation

---

## 🌍 Environment Variables

Create `.env` file in `backend/` directory:

```bash
# Database Configuration
DB_HOST=db
DB_PORT=5432
DB_NAME=postgres
DB_USERNAME=daniel
DB_PASSWORD=your_secure_password_here

# Application Configuration
APP_PORT=8080
SPRING_PROFILES_ACTIVE=docker

# JPA Configuration
DDL_AUTO=update
FLYWAY_ENABLED=false

# JWT Configuration
JWT_SECRET=your_very_long_secure_random_string_here
JWT_EXPIRATION=86400000

# Logging
LOGGING_LEVEL_ROOT=INFO
```

Then reference in docker-compose.yml:
```yaml
services:
  app:
    env_file:
      - .env
```

---

## ⚠️ Common Mistakes to Avoid

### 1. **Wrong Database Hostname**
❌ **WRONG:**
```yaml
spring.datasource.url=jdbc:postgresql://localhost:5432/postgres
```
✅ **CORRECT (in Docker):**
```yaml
spring.datasource.url=jdbc:postgresql://db:5432/postgres
```
📌 **Why?** Inside Docker network, use service name (`db`), not `localhost`.

### 2. **Wrong Port Mapping**
❌ **WRONG:**
```yaml
ports:
  - "5332:5332"  # Container also needs to listen on 5332
```
✅ **CORRECT:**
```yaml
ports:
  - "5332:5432"  # Host:Container
```
📌 **Why?** PostgreSQL always listens on 5432 inside container. Map host port 5332 → container port 5432.

### 3. **Wrong Dialect**
❌ **WRONG:**
```yaml
spring.jpa.database-platform=org.hibernate.dialect.H2Dialect
```
✅ **CORRECT:**
```yaml
spring.jpa.database-platform=org.hibernate.dialect.PostgreSQLDialect
```

### 4. **Missing Driver Class**
❌ **WRONG:** (missing driver)
✅ **CORRECT:**
```yaml
spring.datasource.driver-class-name=org.postgresql.Driver
```

### 5. **Using `ddl-auto=create` in Production**
❌ **NEVER DO THIS IN PRODUCTION:**
```yaml
spring.jpa.hibernate.ddl-auto=create  # Drops all data on startup!
```
✅ **PRODUCTION:**
```yaml
spring.jpa.hibernate.ddl-auto=validate
spring.flyway.enabled=true
```

### 6. **Not Waiting for Database to Start**
❌ **WRONG:**
```yaml
depends_on:
  - db  # Starts after db container starts, not when it's ready!
```
✅ **CORRECT:**
```yaml
depends_on:
  db:
    condition: service_healthy  # Waits for healthcheck
```

### 7. **Hardcoded Credentials**
❌ **WRONG:**
```yaml
spring.datasource.password=password123
```
✅ **CORRECT:**
```yaml
spring.datasource.password=${DB_PASSWORD}
```

### 8. **Not Using Profiles**
❌ **WRONG:** Same config for local and Docker
✅ **CORRECT:** Use `application.yml` (local) + `application-docker.yml` (Docker)

### 9. **Missing PostgreSQL Dependency**
❌ **WRONG:** Forgot to add to pom.xml
```xml
<!-- Missing! -->
```
✅ **CORRECT:**
```xml
<dependency>
    <groupId>org.postgresql</groupId>
    <artifactId>postgresql</artifactId>
</dependency>
```

### 10. **Volume Data Conflicts**
If you get schema errors after migration:
```bash
docker-compose down -v  # Remove old H2 volumes
docker-compose up --build
```

---

## 🧪 Testing the Setup

### 1. Test Database Connection

```bash
# From host machine
psql -h localhost -p 5332 -U daniel -d postgres

# From Docker container
docker-compose exec db psql -U daniel -d postgres
```

### 2. Test Spring Boot Application

```bash
# Health check (requires Spring Actuator)
curl http://localhost:8080/actuator/health

# Test your endpoints
curl http://localhost:8080/api/users
```

### 3. Verify Tables Created

```sql
-- Connect to database
docker-compose exec db psql -U daniel -d postgres

-- List all tables
\dt

-- Describe a table
\d users

-- Query data
SELECT * FROM users;
```

---

## 🐛 Troubleshooting

### Issue: "Connection refused to localhost:5332"

**Solution:** Database not started or not ready yet.
```bash
docker-compose ps  # Check if db is healthy
docker-compose logs db  # Check database logs
```

### Issue: "Database 'estore' does not exist"

**Solution:** PostgreSQL doesn't auto-create databases with different names. Use environment variable:
```yaml
environment:
  POSTGRES_DB: estore
```

### Issue: "Table doesn't exist"

**Solutions:**
1. Check `ddl-auto` is set to `update` or `create`
2. Check application logs for SQL execution
3. Manually run schema creation with Flyway

### Issue: "Password authentication failed"

**Solution:** Check credentials match in:
- docker-compose.yml (POSTGRES_USER/PASSWORD)
- application-docker.yml (datasource username/password)

### Issue: "Port already in use"

**Solution:**
```bash
# Windows
netstat -ano | findstr :5332
taskkill /PID <PID> /F

# Or change port in docker-compose.yml
ports:
  - "5333:5432"
```

---

## 📊 File Structure After Migration

```
backend/
├── .dockerignore
├── Dockerfile
├── docker-compose.yml
├── pom.xml (updated)
├── src/
│   └── main/
│       ├── java/...
│       └── resources/
│           ├── application.yml (NEW - local config)
│           ├── application-docker.yml (NEW - Docker config)
│           ├── application.properties.h2-backup (OLD - backed up)
│           └── db/
│               └── migration/ (for Flyway)
│                   ├── V1__initial_schema.sql
│                   └── V2__add_products.sql
```

---

## 🎓 Best Practices

1. **Use Profiles**: Separate local and Docker configurations
2. **Use Environment Variables**: Never hardcode sensitive data
3. **Use Flyway for Production**: Version control your schema
4. **Use Healthchecks**: Ensure services are ready before dependent services start
5. **Use Named Volumes**: Persist data across container restarts
6. **Use Multi-Stage Builds**: Smaller, more secure Docker images
7. **Use Non-Root User**: Security best practice in Dockerfile
8. **Use `.dockerignore`**: Faster builds, smaller images
9. **Use Connection Pooling**: Already configured in Spring Boot
10. **Monitor Logs**: Use `docker-compose logs -f` to catch issues early

---

## 📚 Additional Resources

- [Spring Boot Database Initialization](https://docs.spring.io/spring-boot/docs/current/reference/html/howto.html#howto.data-initialization)
- [Flyway Documentation](https://flywaydb.org/documentation/)
- [PostgreSQL Docker Hub](https://hub.docker.com/_/postgres)
- [Docker Compose Documentation](https://docs.docker.com/compose/)
- [Spring Boot with PostgreSQL](https://spring.io/guides/gs/accessing-data-jpa/)

---

## 🎉 Migration Complete!

Your application is now configured to use PostgreSQL instead of H2. Choose your workflow and start developing!

**Questions?** Check the troubleshooting section or examine the logs with `docker-compose logs -f`.
