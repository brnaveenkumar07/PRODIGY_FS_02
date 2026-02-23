# API Reference Guide

## Quick Start

### Login & Get Token
```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@ems.com",
    "password": "Admin@123"
  }'
```

The token will be set in an HttpOnly cookie automatically.

## Authentication Endpoints

### 🔐 POST /api/auth/login
Login with email and password.

**Request Body:**
```json
{
  "email": "admin@ems.com",
  "password": "Admin@123"
}
```

**Success Response (200):**
```json
{
  "message": "Login successful",
  "user": {
    "id": "clv8z9y8z",
    "email": "admin@ems.com",
    "role": "ADMIN"
  }
}
```

**Error Responses:**
- `400 Bad Request` - Invalid input
- `401 Unauthorized` - Invalid credentials

---

### 🚪 POST /api/auth/logout
Logout and clear authentication token.

**Request:** No body required
**Success Response (200):**
```json
{
  "message": "Logout successful"
}
```

---

## Employee Management Endpoints

### 📋 GET /api/employees
List all employees with pagination and search.

**Query Parameters:**
- `page` (default: 1) - Page number
- `limit` (default: 10) - Items per page
- `search` (optional) - Search by name, email, or department
- `sortBy` (optional) - Field to sort by: firstName, lastName, email, department
- `sortOrder` (default: asc) - Sort order: asc or desc

**Example:**
```bash
GET /api/employees?page=1&limit=10&search=john&sortBy=firstName&sortOrder=asc
```

**Success Response (200):**
```json
{
  "data": [
    {
      "id": "emp_001",
      "firstName": "John",
      "lastName": "Doe",
      "email": "john.doe@company.com",
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

**Error Responses:**
- `400 Bad Request` - Invalid query parameters
- `401 Unauthorized` - Not logged in

---

### ➕ POST /api/employees
Create a new employee.

**Request Body:**
```json
{
  "firstName": "Jane",
  "lastName": "Smith",
  "email": "jane.smith@company.com",
  "phone": "+1 (555) 987-6543",
  "department": "HR",
  "position": "HR Manager",
  "salary": 85000
}
```

**Validation Rules:**
- firstName: Required, max 100 characters
- lastName: Required, max 100 characters
- email: Required, must be unique, valid email format
- phone: Optional
- department: Required
- position: Required
- salary: Required, must be > 0

**Success Response (201):**
```json
{
  "message": "Employee created successfully",
  "data": {
    "id": "emp_002",
    "firstName": "Jane",
    "lastName": "Smith",
    "email": "jane.smith@company.com",
    "phone": "+1 (555) 987-6543",
    "department": "HR",
    "position": "HR Manager",
    "salary": 85000,
    "createdAt": "2025-02-22T11:45:00Z",
    "updatedAt": "2025-02-22T11:45:00Z"
  }
}
```

**Error Responses:**
- `400 Bad Request` - Validation error
- `401 Unauthorized` - Not logged in
- `403 Forbidden` - Not an admin
- `409 Conflict` - Email already exists

---

### 👤 GET /api/employees/:id
Get a single employee by ID.

**Example:**
```bash
GET /api/employees/emp_001
```

**Success Response (200):**
```json
{
  "data": {
    "id": "emp_001",
    "firstName": "John",
    "lastName": "Doe",
    "email": "john.doe@company.com",
    "phone": "+1 (555) 123-4567",
    "department": "IT",
    "position": "Senior Developer",
    "salary": 95000,
    "createdAt": "2025-02-22T10:30:00Z",
    "updatedAt": "2025-02-22T10:30:00Z"
  }
}
```

**Error Responses:**
- `401 Unauthorized` - Not logged in
- `404 Not Found` - Employee not found

---

### ✏️ PUT /api/employees/:id
Update an employee.

**Request Body (all fields optional):**
```json
{
  "firstName": "Jonathan",
  "position": "Lead Developer",
  "salary": 110000
}
```

**Success Response (200):**
```json
{
  "message": "Employee updated successfully",
  "data": {
    "id": "emp_001",
    "firstName": "Jonathan",
    "lastName": "Doe",
    "email": "john.doe@company.com",
    "phone": "+1 (555) 123-4567",
    "department": "IT",
    "position": "Lead Developer",
    "salary": 110000,
    "createdAt": "2025-02-22T10:30:00Z",
    "updatedAt": "2025-02-22T11:50:00Z"
  }
}
```

**Error Responses:**
- `400 Bad Request` - Validation error
- `401 Unauthorized` - Not logged in
- `404 Not Found` - Employee not found
- `409 Conflict` - Email already in use by another employee

---

### 🗑️ DELETE /api/employees/:id
Delete an employee.

**Example:**
```bash
DELETE /api/employees/emp_001
```

**Success Response (200):**
```json
{
  "message": "Employee deleted successfully"
}
```

**Error Responses:**
- `401 Unauthorized` - Not logged in
- `404 Not Found` - Employee not found

---

## Common Error Responses

All errors follow this format:

```json
{
  "error": "Error message describing what went wrong"
}
```

### Status Codes

| Code | Meaning |
|------|---------|
| 200 | OK - Request successful |
| 201 | Created - Resource created successfully |
| 400 | Bad Request - Invalid input/parameters |
| 401 | Unauthorized - Authentication required |
| 403 | Forbidden - Access denied (insufficient permissions) |
| 404 | Not Found - Resource not found |
| 409 | Conflict - Data conflict (e.g., duplicate email) |
| 500 | Internal Server Error - Server error |

---

## Important Notes

1. **Authentication**: All employee endpoints require authentication. Login first to receive a token.
2. **Authorization**: Only ADMIN users can manage employees.
3. **Rate Limiting**: Implement rate limiting in production.
4. **CORS**: Endpoints are configured for same-origin requests by default.
5. **Pagination**: Default page size is 10 items.
6. **Search**: Search is case-insensitive and searches firstName, lastName, email, and department.

---

## Testing with JavaScript Fetch

```javascript
// Login
const loginResponse = await fetch('/api/auth/login', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    email: 'admin@ems.com',
    password: 'Admin@123'
  }),
  credentials: 'include' // Important for cookies
});

// Get employees
const employeesResponse = await fetch('/api/employees?page=1&limit=10', {
  credentials: 'include'
});

// Create employee
const createResponse = await fetch('/api/employees', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    firstName: 'Jane',
    lastName: 'Smith',
    email: 'jane@company.com',
    department: 'HR',
    position: 'Manager',
    salary: 80000
  }),
  credentials: 'include'
});
```

---

## Environment Setup for Testing

Create a `.env.test` file:
```env
DATABASE_URL=postgresql://test:test@localhost:5432/ems_test
JWT_SECRET=test-secret-key
JWT_EXPIRATION=1
```

Then test with:
```bash
NODE_ENV=test npm run dev
```
