# 🧪 EMS API TESTING GUIDE

Complete testing examples for all API endpoints with real requests and responses.

---

## 📋 BASE URL

```
http://localhost:3000/api
```

All examples use relative paths from base URL.

---

## 🔐 AUTHENTICATION FLOW

### 1. Login (Get Auth Cookie)

```http
POST http://localhost:3000/api/auth/login
Content-Type: application/json

{
  "email": "admin@ems.com",
  "password": "Admin@123"
}
```

**Success Response (200)**
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "id": "clmx1y2z3a4b5c6d7e8f9g",
    "email": "admin@ems.com",
    "role": "ADMIN"
  }
}
```

**Header Set by Server**
```
Set-Cookie: auth_token=eyJhbGciOiJIUzI1NiJ9...; HttpOnly; Secure; SameSite=Lax; Path=/; Max-Age=604800
```

**Error Responses**

Invalid email (401)
```json
{
  "success": false,
  "error": "Invalid email or password"
}
```

Invalid password (401)
```json
{
  "success": false,
  "error": "Invalid email or password"
}
```

Missing email (400)
```json
{
  "success": false,
  "error": "Validation failed",
  "details": {
    "email": {
      "_errors": ["Invalid email address"]
    },
    "password": {
      "_errors": []
    }
  }
}
```

---

### 2. Logout (Clear Auth Cookie)

```http
POST http://localhost:3000/api/auth/logout
Cookie: auth_token=eyJhbGciOiJIUzI1NiJ9...
```

**Success Response (200)**
```json
{
  "success": true,
  "message": "Logout successful",
  "data": null
}
```

**Side Effect**: `auth_token` cookie deleted

---

## 👥 EMPLOYEE ENDPOINTS

### 1. List All Employees (with Pagination)

```http
GET http://localhost:3000/api/employees?page=1&limit=10
Cookie: auth_token=eyJhbGciOiJIUzI1NiJ9...
```

**Success Response (200)**
```json
{
  "success": true,
  "message": "Employees retrieved successfully",
  "data": [
    {
      "id": "clmx1y2z3a4b5c6d7e8f9g",
      "firstName": "John",
      "lastName": "Doe",
      "email": "john.doe@example.com",
      "phone": "+1-555-0101",
      "department": "Engineering",
      "position": "Senior Software Engineer",
      "salary": 150000,
      "status": "ACTIVE",
      "createdAt": "2026-02-22T10:30:00Z",
      "updatedAt": "2026-02-22T10:30:00Z"
    },
    {
      "id": "clmx1y2z3a4b5c6d7e8f9h",
      "firstName": "Jane",
      "lastName": "Smith",
      "email": "jane.smith@example.com",
      "phone": "+1-555-0102",
      "department": "Product",
      "position": "Product Manager",
      "salary": 140000,
      "status": "ACTIVE",
      "createdAt": "2026-02-22T10:30:00Z",
      "updatedAt": "2026-02-22T10:30:00Z"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 5,
    "totalPages": 1
  }
}
```

---

### 2. Search Employees

```http
GET http://localhost:3000/api/employees?search=John&limit=10
Cookie: auth_token=eyJhbGciOiJIUzI1NiJ9...
```

**Success Response (200)**
```json
{
  "success": true,
  "message": "Employees retrieved successfully",
  "data": [
    {
      "id": "clmx1y2z3a4b5c6d7e8f9g",
      "firstName": "John",
      "lastName": "Doe",
      "email": "john.doe@example.com",
      "phone": "+1-555-0101",
      "department": "Engineering",
      "position": "Senior Software Engineer",
      "salary": 150000,
      "status": "ACTIVE",
      "createdAt": "2026-02-22T10:30:00Z",
      "updatedAt": "2026-02-22T10:30:00Z"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 1,
    "totalPages": 1
  }
}
```

---

### 3. Sort Employees

```http
GET http://localhost:3000/api/employees?sortBy=salary&sortOrder=desc&limit=10
Cookie: auth_token=eyJhbGciOiJIUzI1NiJ9...
```

Valid `sortBy` values: `firstName`, `lastName`, `email`, `department`, `createdAt`

---

### 4. Create New Employee

```http
POST http://localhost:3000/api/employees
Content-Type: application/json
Cookie: auth_token=eyJhbGciOiJIUzI1NiJ9...

{
  "firstName": "Alice",
  "lastName": "Cooper",
  "email": "alice.cooper@example.com",
  "phone": "+1-555-0106",
  "department": "Marketing",
  "position": "Marketing Manager",
  "salary": 110000
}
```

**Success Response (201)**
```json
{
  "success": true,
  "message": "Employee created successfully",
  "data": {
    "id": "clmx1y2z3a4b5c6d7e8f9i",
    "firstName": "Alice",
    "lastName": "Cooper",
    "email": "alice.cooper@example.com",
    "phone": "+1-555-0106",
    "department": "Marketing",
    "position": "Marketing Manager",
    "salary": 110000,
    "status": "ACTIVE",
    "createdAt": "2026-02-22T11:00:00Z",
    "updatedAt": "2026-02-22T11:00:00Z"
  }
}
```

**Error: Duplicate Email (409)**
```json
{
  "success": false,
  "error": "Employee with this email already exists"
}
```

**Error: Validation Failed (400)**
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

**Error: Unauthorized (401)** (No auth token)
```json
{
  "success": false,
  "error": "Unauthorized - No authentication token provided"
}
```

---

### 5. Get Single Employee

```http
GET http://localhost:3000/api/employees/clmx1y2z3a4b5c6d7e8f9g
Cookie: auth_token=eyJhbGciOiJIUzI1NiJ9...
```

**Success Response (200)**
```json
{
  "success": true,
  "message": "Employee retrieved successfully",
  "data": {
    "id": "clmx1y2z3a4b5c6d7e8f9g",
    "firstName": "John",
    "lastName": "Doe",
    "email": "john.doe@example.com",
    "phone": "+1-555-0101",
    "department": "Engineering",
    "position": "Senior Software Engineer",
    "salary": 150000,
    "status": "ACTIVE",
    "createdAt": "2026-02-22T10:30:00Z",
    "updatedAt": "2026-02-22T10:30:00Z"
  }
}
```

**Error: Not Found (404)**
```json
{
  "success": false,
  "error": "Employee not found"
}
```

---

### 6. Update Employee

```http
PUT http://localhost:3000/api/employees/clmx1y2z3a4b5c6d7e8f9g
Content-Type: application/json
Cookie: auth_token=eyJhbGciOiJIUzI1NiJ9...

{
  "position": "Lead Senior Software Engineer",
  "salary": 175000,
  "department": "Engineering"
}
```

**Note**: All fields are optional for PUT request

**Success Response (200)**
```json
{
  "success": true,
  "message": "Employee updated successfully",
  "data": {
    "id": "clmx1y2z3a4b5c6d7e8f9g",
    "firstName": "John",
    "lastName": "Doe",
    "email": "john.doe@example.com",
    "phone": "+1-555-0101",
    "department": "Engineering",
    "position": "Lead Senior Software Engineer",
    "salary": 175000,
    "status": "ACTIVE",
    "createdAt": "2026-02-22T10:30:00Z",
    "updatedAt": "2026-02-22T11:15:00Z"
  }
}
```

**Error: Duplicate Email (409)**
```json
{
  "success": false,
  "error": "Employee with this email already exists"
}
```

---

### 7. Delete Employee

```http
DELETE http://localhost:3000/api/employees/clmx1y2z3a4b5c6d7e8f9g
Cookie: auth_token=eyJhbGciOiJIUzI1NiJ9...
```

**Success Response (200)**
```json
{
  "success": true,
  "message": "Employee deleted successfully",
  "data": null
}
```

**Error: Not Found (404)**
```json
{
  "success": false,
  "error": "Employee not found"
}
```

---

## 🧪 TEST SCENARIOS

### Scenario 1: Complete CRUD Workflow

```bash
# 1. Login
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@ems.com","password":"Admin@123"}' \
  -c cookies.txt

# 2. List employees
curl -X GET "http://localhost:3000/api/employees?page=1&limit=10" \
  -b cookies.txt

# 3. Create employee
curl -X POST http://localhost:3000/api/employees \
  -H "Content-Type: application/json" \
  -b cookies.txt \
  -d '{
    "firstName":"Bob",
    "lastName":"Builder",
    "email":"bob@example.com",
    "phone":"+1-555-0107",
    "department":"IT",
    "position":"System Admin",
    "salary":95000
  }'

# 4. Get single employee
curl -X GET http://localhost:3000/api/employees/EMPLOYEE_ID \
  -b cookies.txt

# 5. Update employee
curl -X PUT http://localhost:3000/api/employees/EMPLOYEE_ID \
  -H "Content-Type: application/json" \
  -b cookies.txt \
  -d '{"salary":100000}'

# 6. Delete employee
curl -X DELETE http://localhost:3000/api/employees/EMPLOYEE_ID \
  -b cookies.txt

# 7. Logout
curl -X POST http://localhost:3000/api/auth/logout \
  -b cookies.txt
```

---

### Scenario 2: Error Handling

```bash
# Test unauthorized access (no cookie)
curl -X GET http://localhost:3000/api/employees

# Test invalid token
curl -X GET http://localhost:3000/api/employees \
  -H "Cookie: auth_token=invalid_token"

# Test duplicate email
curl -X POST http://localhost:3000/api/employees \
  -H "Content-Type: application/json" \
  -b cookies.txt \
  -d '{
    "firstName":"John",
    "lastName":"Duplicate",
    "email":"john.doe@example.com",
    "phone":"+1-555-0108",
    "department":"Engineering",
    "position":"Developer",
    "salary":120000
  }'

# Test invalid email format
curl -X POST http://localhost:3000/api/employees \
  -H "Content-Type: application/json" \
  -b cookies.txt \
  -d '{
    "firstName":"Test",
    "lastName":"User",
    "email":"not-an-email",
    "phone":"+1-555-0109",
    "department":"IT",
    "position":"Dev",
    "salary":100000
  }'

# Test missing required field
curl -X POST http://localhost:3000/api/employees \
  -H "Content-Type: application/json" \
  -b cookies.txt \
  -d '{
    "firstName":"Test",
    "lastName":"User",
    "phone":"+1-555-0109"
  }'

# Test negative salary
curl -X POST http://localhost:3000/api/employees \
  -H "Content-Type: application/json" \
  -b cookies.txt \
  -d '{
    "firstName":"Test",
    "lastName":"User",
    "email":"test@example.com",
    "phone":"+1-555-0109",
    "department":"IT",
    "position":"Dev",
    "salary":-5000
  }'
```

---

## 🔍 VALIDATION RULES

### Login Input
```javascript
{
  email: "Must be valid email",
  password: "Min 6 characters, max 255"
}
```

### Create Employee Input
```javascript
{
  firstName: "Required, 1-100 chars",
  lastName: "Required, 1-100 chars",
  email: "Required, valid email format, unique",
  phone: "Optional, max 20 chars",
  department: "Required, 1-100 chars",
  position: "Required, 1-100 chars",
  salary: "Required, positive number, max 999999999"
}
```

### Update Employee Input
```javascript
{
  // All fields optional (partial)
  firstName: "1-100 chars",
  lastName: "1-100 chars",
  email: "Must be unique if provided",
  phone: "Max 20 chars",
  department: "1-100 chars",
  position: "1-100 chars",
  salary: "Positive number"
}
```

### Pagination Query
```javascript
{
  page: "Positive integer, default: 1",
  limit: "Integer 1-100, default: 10",
  search: "String, searches firstName, lastName, email, department",
  sortBy: "firstName | lastName | email | department | createdAt",
  sortOrder: "asc | desc, default: asc"
}
```

---

## 📊 EXPECTED RESPONSE TIMES

| Operation | Time | Notes |
|-----------|------|-------|
| Login | 100-300ms | Password hashing + JWT generation |
| List Employees (10 items) | 50-150ms | Database query + pagination |
| Search Employees | 100-200ms | Full-text search on indexed fields |
| Create Employee | 150-300ms | Validation + DB write + index update |
| Update Employee | 100-250ms | Validation + DB update |
| Delete Employee | 50-150ms | DB delete |

---

## 🔒 SECURITY HEADERS

All responses include:
```
Set-Cookie: auth_token=...; HttpOnly; Secure; SameSite=Lax
  ├─ HttpOnly: Prevents JavaScript access
  ├─ Secure: Only sent over HTTPS in production
  └─ SameSite=Lax: CSRF protection
```

---

## ✅ COMPLETE TEST CHECKLIST

- [ ] Login with valid credentials
- [ ] Login with invalid email
- [ ] Login with invalid password
- [ ] List employees without auth
- [ ] List employees (page 1, limit 10)
- [ ] Search employees by name
- [ ] Sort employees by department
- [ ] Create valid employee
- [ ] Create duplicate email (409)
- [ ] Create with missing field (400)
- [ ] Create with invalid salary (400)
- [ ] Get existing employee
- [ ] Get non-existent employee (404)
- [ ] Update employee salary
- [ ] Update employee with invalid email (409)
- [ ] Delete existing employee
- [ ] Delete non-existent employee (404)
- [ ] Logout
- [ ] Access protected route without auth (401)
- [ ] Pagination with page > totalPages
- [ ] Pagination limit > 100 (400)

---

Generated: 2026-02-22  
Last Updated: Production Ready
