# 🎓 COMPREHENSIVE SYSTEM OVERVIEW & TROUBLESHOOTING

## 📚 TABLE OF CONTENTS
1. [Architecture Overview](#-architecture-overview)
2. [File Responsibilities](#-file-responsibilities)
3. [Data Flow](#-data-flow)
4. [Common Issues & Solutions](#-common-issues--solutions)
5. [Performance Tips](#-performance-tips)
6. [Security Best Practices](#-security-best-practices)

---

## 🏗️ ARCHITECTURE OVERVIEW

### Technology Stack
```
┌─────────────────────────────────────────────┐
│         Frontend (Next.js)                    │
│   ├─ React 19 Components                     │
│   ├─ TypeScript                              │
│   ├─ shadcn/ui Components                    │
│   ├─ React Hook Form                         │
│   └─ Tailwind CSS                            │
└──────────────────┬──────────────────────────┘
                   │ HTTP/REST
┌──────────────────▼──────────────────────────┐
│      Backend (Next.js API Routes)            │
│   ├─ TypeScript                              │
│   ├─ Zod Validation                          │
│   ├─ JWT Authentication                      │
│   └─ Middleware Orchestration                │
└──────────────────┬──────────────────────────┘
                   │ SQL
┌──────────────────▼──────────────────────────┐
│     Database (PostgreSQL via Prisma)         │
│   ├─ User (Authentication)                   │
│   └─ Employee (Management)                   │
└──────────────────────────────────────────────┘
```

### Authentication Flow
```
┌─────────────┐
│   Login     │ → POST /api/auth/login
│  Form       │
└──────┬──────┘
       │
       ▼
┌─────────────────────┐
│ Validate            │ → Zod schema validation
│ - email format      │ → Check user exists
│ - password min 6ch  │ → Compare password hash
└──────┬──────────────┘
       │ ✅ Valid
       ▼
┌──────────────────────┐
│ Generate JWT Token   │ → Signed with JWT_SECRET
│ Payload:             │ → 7 days expiration
│ - userId             │ → HS256 algorithm
│ - email              │
│ - role               │
└──────┬───────────────┘
       │
       ▼
┌──────────────────────┐
│ Set HttpOnly Cookie  │ → HttpOnly (XSS protection)
│ auth_token           │ → Secure (HTTPS only in prod)
│                      │ → SameSite=Lax (CSRF protection)
└──────┬───────────────┘
       │
       ▼
┌──────────────────────┐
│ Return User Data     │ → { id, email, role }
│ (NO token in body)   │
└──────────────────────┘
```

### Request Authorization Flow
```
┌──────────────┐
│  Client      │
│  (Browser)   │
└──────┬───────┘
       │ Request with Cookie: auth_token
       ▼
┌──────────────────────┐
│  middleware.ts       │
│  ▪ Check public route│
│  ▪ Get token from    │
│    cookie            │
│  ▪ Verify JWT sign   │
│  ▪ Check expiration  │
│  ▪ Verify ADMIN role │
│  ▪ Add x-user-* hdrs │
└──────┬───────────────┘
       │ ✅ Valid
       ▼
┌──────────────────────┐
│  API Route Handler   │
│  ▪ Validate request  │ Zod schema
│  ▪ Query database    │ Prisma
│  ▪ Format response   │ Standard format
│  ▪ Return data       │ 200/201/400/etc
└──────┬───────────────┘
       │
       ▼
┌──────────────────────┐
│  Client Response     │
│  {                   │
│    success: true,    │
│    message: "...",   │
│    data: {...}       │
│  }                   │
└──────────────────────┘
```

---

## 📁 FILE RESPONSIBILITIES

### Core Files

#### [src/middleware.ts](src/middleware.ts)
**What**: Request interceptor and authorization
- Checks authentication on every request
- Validates JWT tokens
- Enforces ADMIN role on protected routes
- Adds user info to request headers

**Why**: Security - prevents unauthorized access to sensitive endpoints

**How to test**: 
```bash
# This should fail (no auth)
curl http://localhost:3000/api/employees

# This should succeed (with auth)
curl -H "Cookie: auth_token=..." http://localhost:3000/api/employees
```

---

#### [src/lib/auth.ts](src/lib/auth.ts)
**What**: Authentication utilities
- JWT generation with jose library
- JWT verification
- Password hashing with bcryptjs
- Cookie manipulation (get/set/clear)

**Why**: Secure, centralized auth logic - prevents duplication and vulnerabilities

**Key Functions**:
```typescript
generateToken(payload)     // Create signed JWT
verifyToken(token)         // Validate JWT signature & expiration
hashPassword(password)     // Hash with bcrypt salt=10
comparePassword(pwd, hash) // Timing-safe comparison
setAuthCookie(token)       // Set HttpOnly cookie
getAuthCookie()            // Read from cookies
clearAuthCookie()          // Delete on logout
```

**How to test**:
```typescript
import { generateToken, verifyToken } from "@/lib/auth";

const token = await generateToken({ userId: "123", email: "test@test.com", role: "ADMIN" });
const payload = await verifyToken(token);
console.log(payload); // { userId, email, role, iat, exp }
```

---

#### [src/lib/validators.ts](src/lib/validators.ts)
**What**: Zod schemas for input validation
- Login/Register schemas
- Employee CRUD schemas
- Pagination & search schemas
- All with type inference

**Why**: Type-safe validation - catches errors before database queries

**Key Schemas**:
- `LoginSchema` - email + password (6+ chars)
- `CreateEmployeeSchema` - all employee fields required
- `UpdateEmployeeSchema` - partial (all optional)
- `EmployeeQuerySchema` - pagination & search

**How to test**:
```typescript
import { CreateEmployeeSchema } from "@/lib/validators";

try {
  const result = CreateEmployeeSchema.parse({
    firstName: "John",
    lastName: "Doe",
    email: "invalid-email", // Will throw
    // ...
  });
} catch (error) {
  console.log(error.format());
}
```

---

#### [src/lib/api-response.ts](src/lib/api-response.ts) ⭐ **NEW**
**What**: Standardized API response wrapper
- Consistent format for all responses
- Type-safe success/error responses
- Pagination metadata
- Zod error formatting

**Why**: Consistency - client always knows response structure

**Example**:
```typescript
// Success response
successResponse(employee, "Employee created", 201)
// ↓ Returns:
// { success: true, message: "...", data: {...} }

// Error response  
errorResponse("Not found", 404)
// ↓ Returns:
// { success: false, error: "Not found" }

// Validation error
validationErrorResponse(zodError)
// ↓ Returns:
// { success: false, error: "Validation failed", details: {...} }
```

---

#### [src/lib/prisma.ts](src/lib/prisma.ts)
**What**: Prisma ORM singleton instance
- Prevents multiple Prisma Client instances
- Configures logging in development
- Database connection pooling

**Why**: Performance & resource efficiency - reuse connection pool

**Code**:
```typescript
const globalForPrisma = global as unknown as { prisma: PrismaClient };

export const prisma = globalForPrisma.prisma || new PrismaClient({
  log: process.env.NODE_ENV === "development" ? ["query"] : [],
});

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
```

---

### API Route Files

#### [src/app/api/auth/login/route.ts](src/app/api/auth/login/route.ts)
**Endpoint**: `POST /api/auth/login`
**Purpose**: Authenticate user and create session

**Request**:
```json
{
  "email": "admin@ems.com",
  "password": "Admin@123"
}
```

**Response** (200):
```json
{
  "success": true,
  "message": "Login successful",
  "data": { "id": "...", "email": "...", "role": "ADMIN" }
}
```

**Error** (401):
```json
{
  "success": false,
  "error": "Invalid email or password"
}
```

**Flow**:
1. Validate input with Zod
2. Find user by email
3. Compare password hash
4. Generate JWT token
5. Set HttpOnly cookie
6. Return user data

---

#### [src/app/api/employees/route.ts](src/app/api/employees/route.ts)
**Endpoints**: 
- `GET /api/employees` - List with pagination, search, sort
- `POST /api/employees` - Create new employee

**GET Response** (200):
```json
{
  "success": true,
  "message": "Employees retrieved successfully",
  "data": [...],
  "pagination": { "page": 1, "limit": 10, "total": 5, "totalPages": 1 }
}
```

**POST Response** (201):
```json
{
  "success": true,
  "message": "Employee created successfully",
  "data": {...}
}
```

**How pagination works**:
```
limit=10 means 10 items per page
page=1 → items 1-10 (skip: 0)
page=2 → items 11-20 (skip: 10)
page=3 → items 21-30 (skip: 20)
skip = (page - 1) * limit
```

**Search implementation**:
```typescript
const where = search ? {
  OR: [
    { firstName: { contains: search, mode: "insensitive" } },
    { lastName: { contains: search, mode: "insensitive" } },
    { email: { contains: search, mode: "insensitive" } },
    { department: { contains: search, mode: "insensitive" } }
  ]
} : {}
```

---

#### [src/app/api/employees/[id]/route.ts](src/app/api/employees/[id]/route.ts)
**Endpoints**:
- `GET /api/employees/:id` - Get single employee
- `PUT /api/employees/:id` - Update employee (partial)
- `DELETE /api/employees/:id` - Delete employee

**Get Response** (200):
```json
{
  "success": true,
  "message": "Employee retrieved successfully",
  "data": {...}
}
```

**Update Request**:
```json
{
  "position": "Lead Engineer",
  "salary": 180000
}
```

**Optional Fields**: All fields are optional for PUT (partial update)

**Delete Response** (200):
```json
{
  "success": true,
  "message": "Employee deleted successfully",
  "data": null
}
```

---

### Frontend Files

#### Component Files
- **[EmployeeTable.tsx](src/components/EmployeeTable.tsx)** - Display employee list
- **[EmployeeFormDialog.tsx](src/components/EmployeeFormDialog.tsx)** - Create/Edit form
- **[DeleteConfirmDialog.tsx](src/components/DeleteConfirmDialog.tsx)** - Delete confirmation

#### Hook Files
- **[useApi.ts](src/hooks/useApi.ts)** - API request wrapper with loading/error states

---

## 🔄 DATA FLOW

### Creating an Employee

```
1. User fills form in UI
   ↓
2. Form validates locally (React Hook Form)
   ↓
3. User clicks submit
   ↓
4. POST /api/employees called with data
   ↓
5. Middleware checks auth + ADMIN role
   ↓
6. CreateEmployeeSchema validates input
   ↓
7. Check for duplicate email
   ↓
8. prisma.employee.create() in database
   ↓
9. Return employees.select() (exclude createdByUserId)
   ↓
10. UI updates list + shows toast notification
   ↓
11. Dialog closes, form resets
```

### Searching Employees

```
1. User types in search box
   ↓
2. useApi hook debounces request
   ↓
3. GET /api/employees?search=value
   ↓
4. Middleware validates auth
   ↓
5. EmployeeQuerySchema validates params
   ↓
6. WHERE clause built with OR conditions
   ↓
7. Prisma queries with insensitive search
   ↓
8. Results paginated and sorted
   ↓
9. Response sent with pagination metadata
   ↓
10. UI updates table with results
```

---

## ❌ COMMON ISSUES & SOLUTIONS

### 1. "Unauthorized - No authentication token provided"

**Symptom**: Getting 401 on API request
**Root Cause**: Missing or invalid auth cookie

**Solutions**:
```bash
# Ensure you're logged in
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@ems.com","password":"Admin@123"}' \
  -c cookies.txt

# Use saved cookies in subsequent requests
curl -X GET http://localhost:3000/api/employees \
  -b cookies.txt
```

---

### 2. "Employee with this email already exists"

**Symptom**: 409 Conflict when creating/updating employee
**Root Cause**: Email not unique

**Solutions**:
- Use a different email
- Check if employee exists: `GET /api/employees?search=email@example.com`
- If updating, ensure new email isn't used by another employee

---

### 3. "Validation failed" with empty details

**Symptom**: 400 error but details show errors object
**Root Cause**: Invalid input data

**Solutions**:
- Check all required fields are provided
- Verify email format is valid
- Ensure salary is positive number
- Check strings don't exceed max length

**Example**:
```json
{
  "success": false,
  "error": "Validation failed",
  "details": {
    "firstName": {
      "_errors": ["First name is required"]
    },
    "salary": {
      "_errors": ["Salary must be greater than 0"]
    }
  }
}
```

---

### 4. "Invalid email or password" (login failing)

**Symptom**: Can't login even with correct credentials
**Root Cause**: Wrong email/password or case sensitivity

**Solutions**:
- Email is case-insensitive (admin@ems.com = ADMIN@EMS.COM)
- Password IS case-sensitive (Admin@123 ≠ admin@123)
- Default credentials: `admin@ems.com` / `Admin@123`
- Check Caps Lock isn't on

---

### 5. "Pagination limit cannot exceed 100"

**Symptom**: 400 error when requesting more than 100 items
**Root Cause**: Security limit to prevent abuse

**Solutions**:
- Reduce limit to max 100
- Use search to narrow results
- Iterate through pages

---

### 6. Database connection fails

**Symptom**: Can't connect to database
**Root Cause**: DATABASE_URL not set or invalid

**Solutions**:
```bash
# Check .env.local exists
ls .env.local

# Verify DATABASE_URL
cat .env.local | grep DATABASE_URL

# Test connection
npx prisma db execute --stdin < /dev/null

# For Neon PostgreSQL, ensure:
# - Connection string includes ?sslmode=require
# - Firewall allows your IP
# - Database server is online
```

---

### 7. "Cannot find module @prisma/client"

**Symptom**: Prisma client not found
**Root Cause**: Prisma client not generated

**Solutions**:
```bash
# Generate Prisma client
npx prisma generate

# Or regenerate with migrations
npx prisma db push

# Or install and generate
npm install && npm run build
```

---

### 8. Next.js TypeScript errors

**Symptom**: Build fails with TS errors
**Root Cause**: Type mismatches

**Solutions**:
```bash
# Run type checker
npx tsc --noEmit

# Fix specific file
npx tsc src/app/api/employees/route.ts --noEmit

# Check tsconfig.json has strict mode
cat tsconfig.json | grep '"strict"'
```

---

### 9. "ENOENT: no such file or directory" on seed

**Symptom**: Seed script fails with file not found
**Root Cause**: Wrong script runner

**Solutions**:
```bash
# Use tsx (TypeScript executor)
npx tsx prisma/seed.ts

# Or use ts-node
npx ts-node prisma/seed.ts

# Or via npm script
npm run db:seed
```

---

### 10. JWT Token expired

**Symptom**: 401 after some time
**Root Cause**: Token expiration (default 7 days)

**Solutions**:
- Login again to get new token
- Extend JWT_EXPIRATION in .env.local
- Token automatically renewed on login

---

## ⚡ PERFORMANCE TIPS

### Database Optimization

```typescript
// ✅ GOOD: Use select to exclude unused fields
prisma.employee.findMany({
  select: {
    id: true,
    firstName: true,
    email: true,
    // Exclude data not needed
  }
});

// ❌ BAD: Fetching all fields when not needed
prisma.employee.findMany();

// ✅ GOOD: Use indexes for search
prisma.employee.findMany({
  where: {
    email: { contains: "search", mode: "insensitive" }
  }
});

// ✅ GOOD: Paginate large result sets
prisma.employee.findMany({
  skip: (page - 1) * limit,
  take: limit
});
```

### API Caching

```typescript
// Set cache headers for GET requests
return NextResponse.json(data, {
  headers: {
    'Cache-Control': 'public, max-age=60, s-maxage=60'
  }
});
```

### Query Optimization

```typescript
// ✅ GOOD: Single query
const total = prisma.employee.count({ where });
const employees = prisma.employee.findMany({ where, skip, take });

// Could be: Promise.all([...]) for parallel

// ❌ BAD: N+1 queries
employees.forEach(emp => {
  const user = prisma.user.findUnique({ where: { id: emp.createdByUserId } });
});
```

---

## 🔒 SECURITY BEST PRACTICES

### Authentication
- ✅ Use HttpOnly cookies (not localStorage)
- ✅ Set Secure flag in production
- ✅ Use SameSite=Lax for CSRF
- ✅ Hash passwords with bcrypt (10+ rounds)
- ✅ Validate JWT signature and expiration

### Input Validation
- ✅ Validate all inputs with Zod
- ✅ Check string length limits
- ✅ Verify number ranges
- ✅ Sanitize search queries

### API Security
- ✅ Check authentication on protected routes
- ✅ Verify ADMIN role
- ✅ Use proper HTTP status codes
- ✅ Don't return sensitive data in responses
- ✅ Log security events (not tokens)

### Database Security
- ✅ Use environment variables for credentials
- ✅ Enable SSL for connections
- ✅ Use prepared statements (Prisma does this)
- ✅ Have backups configured

---

## 📞 GETTING HELP

### Common Commands

```bash
# Development
npm run dev              # Start dev server
npm run build           # Create production build
npm start               # Run production build

# Database
npm run db:seed         # Seed with test data
npm run db:studio       # Open Prisma UI
npx prisma db push      # Push schema to DB
npx prisma generate     # Generate Prisma client

# Linting
npm run lint            # Run ESLint

# TypeScript
npx tsc --noEmit        # Check types
npx tsc --watch         # Watch mode
```

### Documentation Links
- [Next.js Docs](https://nextjs.org/docs)
- [Prisma Docs](https://prisma.io/docs)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Zod Documentation](https://zod.dev)
- [shadcn/ui](https://ui.shadcn.com)

---

Generated: 2026-02-22  
Status: ✅ Production Ready
