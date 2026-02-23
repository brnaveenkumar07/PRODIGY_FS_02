# Employee Management System (EMS) - Complete Setup Guide

## 🚀 Overview

This is a production-ready Employee Management System built with:
- **Next.js 16.1.6** (App Router)
- **TypeScript** for type safety
- **Prisma ORM** with PostgreSQL
- **JWT Authentication** with HttpOnly cookies
- **Role-Based Access Control** (Admin only)
- **shadcn/ui** components
- **Zod** validation
- **bcryptjs** for password hashing

## 📋 Architecture

### Folder Structure
```
src/
├── app/
│   ├── api/
│   │   ├── auth/
│   │   │   ├── login/route.ts          # Login endpoint
│   │   │   └── logout/route.ts         # Logout endpoint
│   │   └── employees/
│   │       ├── route.ts                # List & Create employees
│   │       └── [id]/route.ts           # Get, Update, Delete employee
│   ├── dashboard/
│   │   ├── layout.tsx                  # Dashboard layout with sidebar
│   │   ├── page.tsx                    # Dashboard home
│   │   └── employees/
│   │       └── page.tsx                # Employee management page
│   ├── login/
│   │   └── page.tsx                    # Login page
│   ├── globals.css                     # Global styles
│   ├── layout.tsx                      # Root layout
│   └── page.tsx                        # Home page (redirects to dashboard)
├── components/
│   ├── ui/                             # shadcn/ui components
│   ├── Providers.tsx                   # Client providers
│   ├── EmployeeFormDialog.tsx          # Add/Edit employee modal
│   ├── EmployeeTable.tsx               # Employee list table
│   └── DeleteConfirmDialog.tsx         # Delete confirmation modal
├── hooks/
│   ├── useToggle.ts                    # Toggle state hook (existing)
│   └── useApi.ts                       # API call hook
├── lib/
│   ├── prisma.ts                       # Prisma client singleton
│   ├── auth.ts                         # Auth utilities (JWT, bcrypt)
│   └── validators.ts                   # Zod validation schemas
├── types/
│   └── index.ts                        # TypeScript type definitions
├── utils/
│   └── format.ts                       # Utility functions
└── middleware.ts                       # Auth middleware

prisma/
├── schema.prisma                       # Prisma schema
└── seed.ts                             # Database seed script

public/
├── icons/
└── images/
```

## 🔧 Setup Instructions

### 1. **Install Dependencies**
```bash
npm install
```

### 2. **Environment Variables**
Create `.env.local` in the root directory:

```env
# Database (PostgreSQL)
DATABASE_URL="postgresql://user:password@localhost:5432/ems_db"

# JWT Configuration
JWT_SECRET="generate-a-strong-random-string-here"
JWT_EXPIRATION=7
```

**Generate a secure JWT_SECRET:**
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

### 3. **Database Setup**

**Option A: Using Docker (Recommended)**
```bash
# Pull PostgreSQL image
docker pull postgres:16

# Run PostgreSQL container
docker run --name ems-postgres \
  -e POSTGRES_USER=user \
  -e POSTGRES_PASSWORD=password \
  -e POSTGRES_DB=ems_db \
  -p 5432:5432 \
  -d postgres:16
```

**Option B: Local PostgreSQL Installation**
- Install PostgreSQL 14 or higher
- Create database: `createdb ems_db`
- Update `DATABASE_URL` in `.env.local`

### 4. **Initialize Database**

```bash
# Create database schema from Prisma model
npm run db:push

# Seed the database with admin user
npm run db:seed
```

**Default Admin Credentials:**
- Email: `admin@ems.com`
- Password: `Admin@123`

⚠️ **IMPORTANT:** Change the password after first login!

### 5. **Run Development Server**
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.
- You'll be redirected to dashboard, then to login
- Login with admin credentials

## 📚 API Documentation

### Authentication APIs

#### Login
```bash
POST /api/auth/login
Content-Type: application/json

{
  "email": "admin@ems.com",
  "password": "Admin@123"
}

# Response 200
{
  "message": "Login successful",
  "user": {
    "id": "user_id",
    "email": "admin@ems.com",
    "role": "ADMIN"
  }
}
```

#### Logout
```bash
POST /api/auth/logout

# Response 200
{
  "message": "Logout successful"
}
```

### Employee APIs

#### List Employees (Paginated & Searchable)
```bash
GET /api/employees?page=1&limit=10&search=john&sortBy=firstName&sortOrder=asc

# Response 200
{
  "data": [
    {
      "id": "emp_123",
      "firstName": "John",
      "lastName": "Doe",
      "email": "john@company.com",
      "phone": "+1 (555) 123-4567",
      "department": "IT",
      "position": "Senior Developer",
      "salary": 95000,
      "createdAt": "2025-02-22T10:30:00Z",
      "updatedAt": "2025-02-22T10:30:00Z"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 25,
    "totalPages": 3
  }
}
```

#### Get Single Employee
```bash
GET /api/employees/:id

# Response 200
{
  "data": {
    "id": "emp_123",
    "firstName": "John",
    "lastName": "Doe",
    "email": "john@company.com",
    "phone": "+1 (555) 123-4567",
    "department": "IT",
    "position": "Senior Developer",
    "salary": 95000,
    "createdAt": "2025-02-22T10:30:00Z",
    "updatedAt": "2025-02-22T10:30:00Z"
  }
}
```

#### Create Employee
```bash
POST /api/employees
Content-Type: application/json

{
  "firstName": "Jane",
  "lastName": "Smith",
  "email": "jane@company.com",
  "phone": "+1 (555) 987-6543",
  "department": "HR",
  "position": "HR Manager",
  "salary": 85000
}

# Response 201
{
  "message": "Employee created successfully",
  "data": { ... }
}
```

#### Update Employee
```bash
PUT /api/employees/:id
Content-Type: application/json

{
  "position": "Lead Developer",
  "salary": 110000
}

# Response 200
{
  "message": "Employee updated successfully",
  "data": { ... }
}
```

#### Delete Employee
```bash
DELETE /api/employees/:id

# Response 200
{
  "message": "Employee deleted successfully"
}
```

## 🔐 Security Features

### ✅ Implemented
- **Password Hashing**: bcryptjs with salt rounds 10
- **JWT Authentication**: Secure token-based auth
- **HttpOnly Cookies**: Tokens stored securely (not accessible via JS)
- **Middleware Protection**: All routes protected at middleware level
- **Role-Based Access Control**: ADMIN role required
- **Input Validation**: Zod schema validation for all inputs
- **CORS**: Configured for API endpoints
- **SQL Injection Prevention**: Using Prisma ORM (parameterized queries)
- **CSRF Protection**: Same-Site cookie attribute configured

### 🔒 Best Practices Implemented
- No sensitive data in API responses (passwords never returned)
- Consistent error messages (doesn't leak user existence)
- Request validation before database queries
- Error handling with proper HTTP status codes
- Environment variables for secrets
- TypeScript strict mode enabled

## 🧪 Testing API Endpoints

### Using cURL
```bash
# Login
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@ems.com","password":"Admin@123"}'

# List employees
curl http://localhost:3000/api/employees \
  -H "Cookie: auth_token=<your_token>"

# Create employee
curl -X POST http://localhost:3000/api/employees \
  -H "Content-Type: application/json" \
  -H "Cookie: auth_token=<your_token>" \
  -d '{
    "firstName":"John",
    "lastName":"Doe",
    "email":"john@company.com",
    "department":"IT",
    "position":"Developer",
    "salary":75000
  }'
```

### Using Postman
1. Import the provided Postman collection (if available)
2. Set `base_url` to `http://localhost:3000`
3. Run Login request first to get auth token
4. Use token in subsequent requests

## 📊 Database Schema

### User Model
```prisma
model User {
  id        String     @id @default(cuid())
  email     String     @unique
  password  String     (hashed with bcryptjs)
  role      String     @default("ADMIN")
  createdAt DateTime   @default(now())
  updatedAt DateTime   @updatedAt
  employees Employee[]  (one-to-many relationship)
}
```

### Employee Model
```prisma
model Employee {
  id        String   @id @default(cuid())
  firstName String
  lastName  String
  email     String   @unique
  phone     String?
  department String
  position  String
  salary    Float
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
  createdBy String   (user id who created employee)
  user      User     @relation(fields: [createdBy], references: [id])
}
```

## 🚀 Deployment

### Vercel (Recommended for Next.js)

1. **Push code to GitHub**
```bash
git init
git add .
git commit -m "Initial commit: EMS"
git push origin main
```

2. **Connect to Vercel**
   - Go to [vercel.com](https://vercel.com)
   - Click "New Project"
   - Select your GitHub repository
   - Configure settings

3. **Set Environment Variables** in Vercel Dashboard
   - `DATABASE_URL`: Your PostgreSQL connection string
   - `JWT_SECRET`: Your secret key
   - `JWT_EXPIRATION`: 7

4. **Deploy**
   - Vercel automatically deploys on push to `main`
   - Run migrations: `npm run db:push` in production

### Using Railway (Alternative)

1. Create account at [railway.app](https://railway.app)
2. Create new PostgreSQL database
3. Deploy Next.js application
4. Set environment variables
5. Watch deployment logs

### Using Docker (Self-hosted)

**Dockerfile:**
```dockerfile
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production

COPY . .
RUN npm run build

EXPOSE 3000

CMD ["npm", "start"]
```

**build and run:**
```bash
docker build -t ems-app .
docker run -p 3000:3000 \
  -e DATABASE_URL="postgresql://..." \
  -e JWT_SECRET="..." \
  ems-app
```

## 📝 Database Migrations

### Creating a Migration
```bash
# After modifying schema.prisma
npm run db:push

# Or for a named migration (recommended for production)
npx prisma migrate dev --name "add_new_field"
```

### Resetting Database (Development Only)
```bash
npx prisma migrate reset
```

## 🔄 CI/CD Pipeline (GitHub Actions)

Create `.github/workflows/deploy.yml`:
```yaml
name: Deploy to Vercel

on:
  push:
    branches: [main]

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      - run: npm ci
      - run: npm run lint
      - run: npm run build
      - name: Deploy to Vercel
        run: npm run deploy
```

## 🆘 Troubleshooting

### Database Connection Error
```
Error: P1000 Authentication failed
```
**Solution**: Check `DATABASE_URL` and PostgreSQL server is running
```bash
# Test connection
npx prisma db execute --stdin < ./test.sql
```

### JWT Token Invalid
```
Error: Unauthorized - Invalid token
```
**Solution**: 
- Check `JWT_SECRET` matches between login and request
- Check JWT_EXPIRATION environment variable

### Middleware Not Protecting Routes
```
Protected routes accessible without login
```
**Solution**: 
- Verify middleware.ts is in `src/` directory
- Check `matcher` config in middleware.ts
- Restart dev server

### Build Errors
```bash
# Clear build cache
rm -rf .next
npm run build

# Clear modules and reinstall
rm -rf node_modules package-lock.json
npm install
npm run build
```

## 📋 Checklist for Production

- [ ] Change default admin password
- [ ] Update `JWT_SECRET` to strong random value
- [ ] Enable HTTPS/SSL certificates
- [ ] Configure PostgreSQL backups
- [ ] Set up monitoring/logging
- [ ] Enable rate limiting on auth endpoints
- [ ] Configure CORS properly
- [ ] Set up error tracking (Sentry)
- [ ] Enable database connection pooling
- [ ] Review security headers
- [ ] Test all API endpoints
- [ ] Set up automated testing

## 📞 Support & Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [Prisma Documentation](https://www.prisma.io/docs/)
- [Zod Documentation](https://zod.dev)
- [shadcn/ui Documentation](https://ui.shadcn.com)
- [PostgreSQL Documentation](https://www.postgresql.org/docs/)

## 📄 License

MIT License - Feel free to use this for your projects!
