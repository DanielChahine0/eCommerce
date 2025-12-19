# PostgreSQL Migration Guide

## Start

**Run locally with PostgreSQL in Docker:**
```bash
cd backend
docker-compose up db -d
./mvnw spring-boot:run
```

**OR run it on Docker (recommended):**
```bash
cd backend
docker-compose up --build
```

## Commands

```bash
# View logs
docker-compose logs -f app

# Stop and clean up
docker-compose down -v

# Rebuild from scratch
docker-compose down -v && docker-compose build --no-cache && docker-compose up

# Access database
docker-compose exec db psql -U daniel -d postgres
```

## Database Migration Strategy

**Current Setup (Development):**
- Using `ddl-auto: update` for automatic schema updates
- Fast iteration, but not safe for production

**For Production (Recommended):**
Use Flyway migrations by setting:
```yaml
spring.jpa.hibernate.ddl-auto: validate
spring.flyway.enabled: true
```

Create migrations in `src/main/resources/db/migration/`:
- `V1__initial_schema.sql`
- `V2__add_products_table.sql`

## Problems
**Connection refused to localhost:5332**
- Check if db container is running: `docker-compose ps`
- Use service name `db` inside Docker, not `localhost`

**Table doesn't exist**
- Verify `ddl-auto` is set to `update` or `create`
- Check application logs for SQL execution

**Password authentication failed**
- Ensure credentials match in docker-compose.yml and application-docker.yml

**Port already in use**
```bash
# Windows
netstat -ano | findstr :5332
taskkill /PID <PID> /F
```

## Best Practices

1. Use profiles for different environments (local vs Docker)
2. Use environment variables for sensitive data
3. Use Flyway for production deployments
4. Use healthchecks in docker-compose.yml
5. Monitor logs with `docker-compose logs -f`
