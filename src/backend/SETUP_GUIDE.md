# Backend Setup Guide - PostgreSQL

## Prerequisites

### 1. Install Node.js
- Download from: https://nodejs.org/
- Version: 18+ required
- Verify: `node --version` and `npm --version`

### 2. Install PostgreSQL
- **Windows**: Download from https://www.postgresql.org/download/windows/
- **Mac**: `brew install postgresql`
- **Ubuntu**: `sudo apt-get install postgresql postgresql-contrib`

### 3. Create Database
```bash
# Method 1: Using createdb command
createdb hospitality_management

# Method 2: Using psql
psql -U postgres
CREATE DATABASE hospitality_management;
\q
```

## Setup Steps

### Step 1: Navigate to Backend Directory
```bash
cd C:\Projects\hospitality-management-system\src\backend
```

### Step 2: Install Dependencies
```bash
npm install
```

### Step 3: Create Environment File
Create `.env` file in `src/backend/` with:

```env
# Server Configuration
NODE_ENV=development
PORT=3000
API_VERSION=v1

# PostgreSQL Configuration
DATABASE_URL=postgresql://postgres:password@localhost:5432/hospitality_management
DB_HOST=localhost
DB_PORT=5432
DB_NAME=hospitality_management
DB_USER=postgres
DB_PASSWORD=your_postgres_password
DB_SSL=false

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-change-in-production
JWT_EXPIRE=7d
JWT_REFRESH_SECRET=your-refresh-token-secret
JWT_REFRESH_EXPIRE=30d

# Redis Configuration (Optional)
REDIS_HOST=localhost
REDIS_PORT=6379
REDIS_PASSWORD=
REDIS_URL=redis://localhost:6379

# Application URLs
FRONTEND_URL=http://localhost:3000
API_BASE_URL=http://localhost:3000/api/v1
MENU_BASE_URL=http://localhost:3000/menu

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100

# Logging
LOG_LEVEL=info

# Feature Flags
ENABLE_ANALYTICS=true
ENABLE_BILLING=false
```

### Step 4: Start the Server
```bash
npm run dev
```

## Verification

### 1. Check Server Status
- Server should start on: http://localhost:3000
- Health check: http://localhost:3000/api/v1/health

### 2. Check Database Connection
Look for these logs:
```
PostgreSQL Connected successfully
Database models initialized
Server running on port 3000 in development mode
```

### 3. Test API Endpoints
```bash
# Health check
curl http://localhost:3000/api/v1/health

# Should return:
{
  "success": true,
  "message": "API is running",
  "timestamp": "2024-..."
}
```

## Troubleshooting

### Common Issues

#### 1. PostgreSQL Connection Error
```
Error: connect ECONNREFUSED 127.0.0.1:5432
```
**Solution:**
- Ensure PostgreSQL is running: `pg_ctl status`
- Start PostgreSQL: `pg_ctl start`
- Check credentials in `.env`

#### 2. Database Does Not Exist
```
Error: database "hospitality_management" does not exist
```
**Solution:**
```bash
createdb hospitality_management
```

#### 3. Authentication Failed
```
Error: password authentication failed for user "postgres"
```
**Solution:**
- Update `DB_PASSWORD` in `.env`
- Reset PostgreSQL password if needed

#### 4. Port Already in Use
```
Error: listen EADDRINUSE :::3000
```
**Solution:**
- Change `PORT=3001` in `.env`
- Or kill process using port 3000

### Database Tables
On first run, Sequelize will automatically create these tables:
- `tenants`
- `admin_users`
- `restaurants`
- `categories`
- `dishes`
- `qr_codes`
- `analytics`

## Available Scripts

```bash
# Development server with auto-reload
npm run dev

# Production server
npm start

# Run tests
npm test

# Run tests with coverage
npm test -- --coverage

# Lint code
npm run lint
```

## API Testing

### Register a New Tenant
```bash
curl -X POST http://localhost:3000/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@restaurant.com",
    "password": "Password123",
    "tenantName": "My Restaurant Group",
    "restaurantName": "My Restaurant"
  }'
```

### Login
```bash
curl -X POST http://localhost:3000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@restaurant.com",
    "password": "Password123"
  }'
```

## Next Steps

1. **Test the API** - Use the curl commands above
2. **Check database** - Verify tables were created
3. **Optional**: Install Redis for caching
4. **Optional**: Configure AWS S3 for image uploads
5. **Optional**: Configure Stripe for billing

## Support

If you encounter issues:
1. Check the console logs for error details
2. Verify PostgreSQL is running and accessible
3. Ensure all environment variables are set correctly
4. Check the `POSTGRESQL_MIGRATION.md` for migration details
