# Environment Variables Setup

This guide explains how to configure environment variables for both frontend and backend.

## Backend Environment Variables

### Setup Instructions

1. Navigate to the `backend` directory
2. Copy the `.env.example` file to `.env`:
   ```bash
   cp .env.example .env
   ```
3. Update the `.env` file with your actual configuration values

### Environment Variables

| Variable | Description | Example |
|----------|-------------|---------|
| `DB_HOST` | Database host | `localhost` or `db` (for Docker) |
| `DB_PORT` | Database port | `5432` |
| `DB_NAME` | Database name | `postgres` |
| `DB_USERNAME` | Database username | `your_username` |
| `DB_PASSWORD` | Database password | `your_password` |
| `JWT_SECRET` | Secret key for JWT token generation (min 256 bits) | `your-secret-key-here` |
| `JWT_EXPIRATION` | JWT token expiration time in milliseconds | `86400000` (24 hours) |
| `SERVER_PORT` | Application server port | `8080` |
| `DDL_AUTO` | Hibernate DDL auto mode | `update`, `create`, `validate`, etc. |
| `FLYWAY_ENABLED` | Enable/disable Flyway migrations | `false` or `true` |

### Docker Environment

For Docker deployments, the `application-docker.yml` file uses these same environment variables with default fallback values. You can override them in your `docker-compose.yml` file.

## Frontend Environment Variables

### Setup Instructions

1. Navigate to the `frontend` directory
2. Copy the `.env.example` file to `.env`:
   ```bash
   cp .env.example .env
   ```
3. Update the `.env` file with your actual configuration values

### Environment Variables

| Variable | Description | Example |
|----------|-------------|---------|
| `VITE_API_BASE_URL` | Backend API base URL | `http://localhost:8080` |

### Production Configuration

For production deployments, update `VITE_API_BASE_URL` to point to your production backend URL:
```
VITE_API_BASE_URL=https://your-production-api.com
```

## Security Notes

⚠️ **IMPORTANT**:
- Never commit `.env` files to version control
- The `.env` files are already listed in `.gitignore`
- Always use `.env.example` files as templates
- Keep your secrets secure and rotate them regularly
- Use strong, random values for `JWT_SECRET` (at least 256 bits)

## Running the Application

### Backend
```bash
cd backend
# Make sure .env file is configured
./mvnw spring-boot:run
```

### Frontend
```bash
cd frontend
# Make sure .env file is configured
npm run dev
```

## Docker Deployment

When using Docker Compose, you can set environment variables directly in the `docker-compose.yml` file or use an `.env` file in the same directory as `docker-compose.yml`.

Example `docker-compose.yml` configuration:
```yaml
services:
  backend:
    environment:
      - DB_HOST=db
      - DB_PORT=5432
      - DB_NAME=postgres
      - DB_USERNAME=${DB_USERNAME}
      - DB_PASSWORD=${DB_PASSWORD}
      - JWT_SECRET=${JWT_SECRET}
```
