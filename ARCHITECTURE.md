# System Architecture Diagram

## High-Level Architecture

```
┌─────────────────────────────────────────────────────────────────────┐
│                      Client Browser (User)                          │
│                                                                       │
│  ┌─────────────────────────────────────────────────────────────┐   │
│  │                    React Components                          │   │
│  │  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐       │   │
│  │  │  Login Page  │  │  Dashboard   │  │  Employees   │       │   │
│  │  │              │  │  Page        │  │  Page        │       │   │
│  │  └──────────────┘  └──────────────┘  └──────────────┘       │   │
│  └─────────────────────────────────────────────────────────────┘   │
│                            ▲                                         │
│                            │ HTTP             ✅ Token in Cookie    │
│                            │ Requests         ✅ Automatic Headers  │
│                            ▼                                         │
└─────────────────────────────────────────────────────────────────────┘
                                │
                                │ HTTPS
                                │
        ┌───────────────────────▼───────────────────────┐
        │         Next.js Server (Node.js)              │
        │                                                │
        │  ┌──────────────────────────────────────────┐ │
        │  │         Middleware (src/middleware.ts)   │ │
        │  │  ✅ Verify JWT Token                    │ │
        │  │  ✅ Protect Routes                      │ │
        │  │  ✅ Role Check (ADMIN)                  │ │
        │  │  ✅ Attach User Headers                 │ │
        │  └──────────────────────────────────────────┘ │
        │                     │                          │
        │  ┌──────────────────▼──────────────────────┐  │
        │  │   API Routes (Handlers)                │  │
        │  │                                         │  │
        │  │  /api/auth/                            │  │
        │  │  ├─ login/route.ts                     │  │
        │  │  └─ logout/route.ts                    │  │
        │  │                                         │  │
        │  │  /api/employees/                       │  │
        │  │  ├─ route.ts (GET/POST)                │  │
        │  │  └─ [id]/route.ts (GET/PUT/DELETE)    │  │
        │  └──────────────────┬──────────────────────┘  │
        │                     │                          │
        │  ┌──────────────────▼──────────────────────┐  │
        │  │   Request Processing                   │  │
        │  │                                         │  │
        │  │  ┌─────────────────────────────────┐   │  │
        │  │  │ Zod Validation (validators.ts) │   │  │
        │  │  │ ✅ Input validation            │   │  │
        │  │  │ ✅ Type checking               │   │  │
        │  │  │ ✅ Error messages              │   │  │
        │  │  └─────────────────────────────────┘   │  │
        │  │                                         │  │
        │  │  ┌─────────────────────────────────┐   │  │
        │  │  │ Auth Processing (auth.ts)       │   │  │
        │  │  │ ✅ JWT signing/verification     │   │  │
        │  │  │ ✅ Password hashing (bcryptjs)  │   │  │
        │  │  │ ✅ Cookie management            │   │  │
        │  │  └─────────────────────────────────┘   │  │
        │  └──────────────────┬──────────────────────┘  │
        │                     │                          │
        │  ┌──────────────────▼──────────────────────┐  │
        │  │   Prisma Client (prisma.ts)            │  │
        │  │   ORM Queries to Database               │  │
        │  └──────────────────┬──────────────────────┘  │
        │                     │                          │
        └─────────────────────┼──────────────────────────┘
                              │
                              │ SQL Queries
                              │
        ┌─────────────────────▼──────────────────────┐
        │        PostgreSQL Database                │
        │                                            │
        │  ┌──────────────────────────────────────┐ │
        │  │  User Table                          │ │
        │  │  ├─ id (PK)                          │ │
        │  │  ├─ email (unique)                   │ │
        │  │  ├─ password (hashed)                │ │
        │  │  ├─ role (ADMIN)                     │ │
        │  │  ├─ createdAt                        │ │
        │  │  └─ updatedAt                        │ │
        │  └──────────────────────────────────────┘ │
        │                                            │
        │  ┌──────────────────────────────────────┐ │
        │  │  Employee Table                      │ │
        │  │  ├─ id (PK)                          │ │
        │  │  ├─ firstName                        │ │
        │  │  ├─ lastName                         │ │
        │  │  ├─ email (unique)                   │ │
        │  │  ├─ phone                            │ │
        │  │  ├─ department                       │ │
        │  │  ├─ position                         │ │
        │  │  ├─ salary                           │ │
        │  │  ├─ createdBy (FK to User)           │ │
        │  │  ├─ createdAt                        │ │
        │  │  └─ updatedAt                        │ │
        │  └──────────────────────────────────────┘ │
        │                                            │
        └────────────────────────────────────────────┘
```

## Request/Response Flow

### 1. Login Flow
```
User Browser                          Next.js Server                  Database
     │                                      │                              │
     ├─ POST /api/auth/login ────────────────────────────────────────────────►
     │  { email, password }                │                              │
     │                                      │                              │
     │                                      ├─ Validate input (Zod)        │
     │                                      │                              │
     │                                      ├─ Find user by email ─────────┤
     │                                      │◄─────────────────────────────┤
     │                                      │  User record                 │
     │                                      │                              │
     │                                      ├─ Compare password (bcryptjs) │
     │                                      │                              │
     │                                      ├─ Generate JWT ───────────────┤
     │                                      │                              │
     │                                      ├─ Set HttpOnly Cookie         │
     │                                      │                              │
     │◄─ 200 OK ────────────────────────────┤                              │
     │  { user, message }                   │                              │
     │  Set-Cookie: auth_token=jwt          │                              │
     │                                      │                              │
     ✓ Redirected to Dashboard             │                              │
```

### 2. Employee List Request Flow
```
User Browser                          Next.js Server                  Database
     │                                      │                              │
     ├─ GET /api/employees?page=1 ──────────────────────────────────────────►
     │  Cookie: auth_token=jwt              │                              │
     │                                      │                              │
     │                                      ├─ Middleware checks:          │
     │                                      │  ✅ Token exists              │
     │                                      │  ✅ Token is valid           │
     │                                      │  ✅ Role is ADMIN            │
     │                                      │                              │
     │                                      ├─ Validate query params (Zod) │
     │                                      │                              │
     │                                      ├─ Query employees ────────────┤
     │                                      │◄─────────────────────────────┤
     │                                      │  Employees array +           │
     │                                      │  Pagination info             │
     │                                      │                              │
     │◄─ 200 OK ────────────────────────────┤                              │
     │  { data: employees, pagination }     │                              │
     │                                      │                              │
     ✓ Render table with employees         │                              │
```

## Authentication Flow Diagram

```
                         ┌──────────────────┐
                         │   User Visits    │
                         │   Application    │
                         └────────┬─────────┘
                                  │
                                  ▼
                    ┌─────────────────────────┐
                    │ Check for auth_token    │
                    │ cookie in browser       │
                    └────────┬────────────────┘
                             │
                    ┌────────┴────────┐
                    │                 │
            Token Found         No Token
                    │                 │
                    ▼                 ▼
            ┌──────────────┐    ┌──────────────┐
            │ Verify JWT   │    │ Redirect to  │
            │ Valid?       │    │ /login       │
            └──────┬───────┘    └──────────────┘
                   │
         ┌─────────┴──────────┐
         │                    │
      Valid            Invalid/Expired
         │                    │
         ▼                    ▼
    ┌─────────┐         ┌──────────────┐
    │ Check   │         │ Clear cookie │
    │ Admin   │         │ Redirect to  │
    │ role    │         │ /login       │
    └────┬────┘         └──────────────┘
         │
    ┌────┴────┐
    │          │
  ADMIN     Other Role
    │          │
    ▼          ▼
┌────────┐  ┌──────────────┐
│ Allow  │  │ Redirect to  │
│ Access │  │ /login       │
└────────┘  └──────────────┘
```

## Component Hierarchy

```
App Layout
├── Providers
│   ├── TooltipProvider
│   └── Toaster (Sonner)
│
├── dashboard/layout.tsx
│   ├── Sidebar (Navigation)
│   ├── Top Bar (Header)
│   └── Main Content
│       │
│       ├── dashboard/page.tsx (Home)
│       │   ├── Stats Cards
│       │   └── Recent Employees
│       │
│       └── dashboard/employees/page.tsx
│           ├── Search Bar
│           ├── EmployeeTable
│           │   ├── TableHeader
│           │   └── TableBody (rows)
│           ├── Pagination
│           ├── EmployeeFormDialog
│           │   └── Form with validation
│           └── DeleteConfirmDialog
│
└── login/page.tsx
    ├── Card (Login Form)
    └── Input fields (email, password)
```

## Data Flow: Creating an Employee

```
┌─────────────────────────────────────────────────────────────────┐
│ 1. User clicks "Add Employee" button                            │
└────────────────────┬────────────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────────────┐
│ 2. EmployeeFormDialog opens with empty form                     │
└────────────────────┬────────────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────────────┐
│ 3. User fills in employee details:                              │
│    - firstName, lastName, email, phone, department, etc.        │
└────────────────────┬────────────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────────────┐
│ 4. User submits form                                            │
│    React Hook Form validates using ZodResolver                  │
└────────────────────┬────────────────────────────────────────────┘
                     │
          ┌──────────┴──────────┐
          │                     │
      Validation            Validation
      Success               Error
          │                     │
          ▼                     ▼
    ┌──────────┐        ┌─────────────────┐
    │ Show     │        │ Show error msg  │
    │ loading  │        │ in form         │
    └──┬───────┘        │ User can fix    │
       │                └─────────────────┘
       │
       ▼
┌─────────────────────────────────────────────────────────────────┐
│ 5. POST /api/employees with validated data                      │
│    with: auth_token cookie (from browser)                       │
└────────────────────┬────────────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────────────┐
│ 6. Server-side processing:                                      │
│    - Middleware verifies JWT token                              │
│    - Validates input with Zod schema                            │
│    - Checks for duplicate email                                 │
│    - Creates employee in database                               │
│    - Returns 201 with employee data                             │
└────────────────────┬────────────────────────────────────────────┘
                     │
          ┌──────────┴──────────┐
          │                     │
      Success              Error
          │                     │
          ▼                     ▼
    ┌──────────┐        ┌─────────────────┐
    │ Show     │        │ Show toast      │
    │ success  │        │ error message   │
    │ toast    │        │ User can retry  │
    └──┬───────┘        └─────────────────┘
       │
       ▼
┌─────────────────────────────────────────────────────────────────┐
│ 7. Close form dialog                                            │
└────────────────────┬────────────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────────────┐
│ 8. Refresh employee list (API call)                             │
│    - Fetch /api/employees                                       │
│    - Re-render table with new employee                          │
└─────────────────────────────────────────────────────────────────┘
```

## Database Schema Relationships

```
┌────────────────────────────────────┐
│           User (Admin)             │
├────────────────────────────────────┤
│ id (Primary Key)                   │
│ email (Unique)                     │
│ password (Hashed)                  │
│ role (ADMIN)                       │
│ createdAt                          │
│ updatedAt                          │
│ ┌ employees: Employee[] (1-to-many)│
└────────────────┬───────────────────┘
                 │
                 │ 1-to-many
                 │ Relationship
                 │ (Foreign Key: createdBy)
                 │
                 ▼
┌────────────────────────────────────┐
│           Employee                 │
├────────────────────────────────────┤
│ id (Primary Key)                   │
│ firstName                          │
│ lastName                           │
│ email (Unique)                     │
│ phone                              │
│ department                         │
│ position                           │
│ salary                             │
│ createdBy (Foreign Key to User)    │
│ createdAt                          │
│ updatedAt                          │
│ ◄─ user: User (relationship)       │
└────────────────────────────────────┘
```

## Security Layers

```
┌──────────────────────────────────────────────────────┐
│ Layer 1: Transport Security                          │
│ ✅ HTTPS (enforced in production)                    │
│ ✅ Secure cookies (HttpOnly, Secure, SameSite)      │
└──────────────────────────────────────────────────────┘
                         │
                         ▼
┌──────────────────────────────────────────────────────┐
│ Layer 2: Authentication                             │
│ ✅ JWT-based token system                           │
│ ✅ Token stored in HttpOnly cookie (can't be stolen)|
│ ✅ Automatic token expiration in 7 days             │
└──────────────────────────────────────────────────────┘
                         │
                         ▼
┌──────────────────────────────────────────────────────┐
│ Layer 3: Authorization (Middleware)                 │
│ ✅ Verify JWT token validity                        │
│ ✅ Check user role (ADMIN only)                     │
│ ✅ Protect routes from unauth access                │
└──────────────────────────────────────────────────────┘
                         │
                         ▼
┌──────────────────────────────────────────────────────┐
│ Layer 4: Input Validation (Zod)                     │
│ ✅ Validate all request data                        │
│ ✅ Type checking for all fields                     │
│ ✅ Consistent error messages                        │
└──────────────────────────────────────────────────────┘
                         │
                         ▼
┌──────────────────────────────────────────────────────┐
│ Layer 5: Database Security (Prisma ORM)             │
│ ✅ Parameterized queries (prevent SQL injection)    │
│ ✅ Type-safe database access                        │
│ ✅ Automatic relationship handling                  │
└──────────────────────────────────────────────────────┘
                         │
                         ▼
┌──────────────────────────────────────────────────────┐
│ Layer 6: Password Security (bcryptjs)               │
│ ✅ Passwords never stored in plain text             │
│ ✅ Salt rounds: 10 (strong hashing)                 │
│ ✅ Secure comparison for password verification      │
└──────────────────────────────────────────────────────┘
```

---

This architecture ensures:
- Clear separation of concerns
- Secure handling of authentication
- Proper data validation at every step
- Scalable and maintainable code structure
- Production-ready deployment options
