# Quick Start Guide - Football Team Treasury Backend

## ✅ Completed Steps

### Step 1: NestJS + Docker Setup ✓
- NestJS application initialized
- Docker containerization with hot-reload
- PostgreSQL 17 database with sample schema
- Development and production Dockerfiles
- Docker Compose orchestration

### Step 2: Swagger Documentation ✓
- Swagger/OpenAPI fully configured
- Interactive API documentation at `/api`
- Global validation pipes
- CORS enabled
- Health check endpoint

## 🚀 Quick Commands

### Start the Application
```bash
cd backend
docker compose up -d
```

### View Logs
```bash
docker compose logs -f backend
```

### Stop the Application
```bash
docker compose down
```

### Rebuild After Changes
```bash
docker compose down
docker compose up -d --build
```

### Access Database
```bash
docker compose exec postgres psql -U football_admin -d football_treasury
```

## 📍 Important URLs

- **API**: http://localhost:3000
- **Swagger UI**: http://localhost:3000/api
- **Health Check**: http://localhost:3000
- **Swagger JSON**: http://localhost:3000/api-json

## 🗄️ Database Info

- **Host**: localhost (or `postgres` from Docker)
- **Port**: 5432
- **Database**: football_treasury
- **User**: football_admin
- **Password**: football_password_2025

## 📦 Installed Packages

- @nestjs/core
- @nestjs/common
- @nestjs/swagger
- class-validator
- class-transformer
- TypeScript

## 🔜 Next Steps

**Step 3: Setup TypeORM/Prisma**
- Choose ORM (TypeORM recommended for NestJS)
- Create database entities matching the schema
- Setup migrations
- Configure database module

**Step 4: Implement CRUD Modules**
- Members module
- Fields module
- Categories module
- Sessions module
- Attendance module
- Transactions module

## 📝 Useful SQL Queries

```sql
-- View all tables
\dt

-- View table structure
\d members

-- Check member data
SELECT * FROM members;

-- Check categories
SELECT * FROM categories;
```

## 🐛 Troubleshooting

### Container won't start
```bash
docker compose logs backend
docker compose logs postgres
```

### Reset everything
```bash
docker compose down -v  # WARNING: Deletes all data
docker compose up -d --build
```

### Port already in use
Edit `.env` and change PORT or DB_PORT

## 🎯 Current Status

✅ Step 1: NestJS + Docker  
✅ Step 2: Swagger Documentation  
⏳ Step 3: Database ORM Setup (Next)

---

**Note**: The database schema is already created in `init-db.sql` and loaded automatically when PostgreSQL starts for the first time.
