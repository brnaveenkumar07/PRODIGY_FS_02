# 🚀 Quick Start Guide - EMS

Get your Employee Management System running in 10 minutes!

## ⏱️ 5-Minute Setup

### Step 1: Install Dependencies (2 min)
```bash
cd c:\Users\navee\Desktop\EMS
npm install
```

### Step 2: Setup Database (2 min)

**Option A: Docker (Easiest)**
```bash
docker-compose up -d
```

**Option B: PostgreSQL Local**
```bash
createdb ems_db
```

### Step 3: Environment Variables (1 min)
Copy and edit `.env.local`:
```env
DATABASE_URL="postgresql://ems_user:ems_password@localhost:5432/ems_db"
JWT_SECRET="your-secret-key-here"
JWT_EXPIRATION=7
```

### Step 4: Initialize Database (3 min)
```bash
npm run db:push
npm run db:seed
```

### Step 5: Start Server (1 min)
```bash
npm run dev
```

### ✅ Done!
- Open: http://localhost:3000
- Login: `admin@ems.com` / `Admin@123`

---

## 📋 Step-by-Step Detailed Guide

### Prerequisites
- Node.js 18+ ([Download](https://nodejs.org/))
- PostgreSQL 14+ ([Download](https://www.postgresql.org/download/)) OR Docker
- Git
- Text editor (VS Code recommended)

### Complete Setup Process

#### 1. Clone or Navigate to Project
```bash
cd c:\Users\navee\Desktop\EMS
```

#### 2. Install Dependencies
```bash
npm install
```

Expected output: `added XXX packages` ✅

#### 3. Setup Database

**Using Docker (Recommended for development):**

If Docker is not installed, [install it first](https://www.docker.com/products/docker-desktop).

```bash
# Start PostgreSQL container
docker-compose up -d

# Verify running
docker ps

# You should see 'ems-postgres' container running
```

**Using Local PostgreSQL:**

```bash
# Windows (in PowerShell as Admin)
psql -U postgres

# Create database
CREATE DATABASE ems_db;

# Exit psql
\q
```

#### 4. Create Environment File
```bash
# Windows
copy .env.example .env.local

# Or manually create .env.local file
```

Edit `.env.local`:
```env
DATABASE_URL="postgresql://ems_user:ems_password@localhost:5432/ems_db"
JWT_SECRET="generate-a-secure-random-string"
JWT_EXPIRATION=7
```

**Generate a secure JWT_SECRET:**
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

Copy the output to `JWT_SECRET` value.

#### 5. Initialize Database
```bash
# Push schema to database
npm run db:push

# Seed with admin user
npm run db:seed
```

Expected output:
```
✅ Admin user created successfully!
📧 Email: admin@ems.com
🔐 Password: Admin@123
```

#### 6. Start Development Server
```bash
npm run dev
```

Expected output:
```
  ▲ Next.js 16.1.6
  - Local:        http://localhost:3000
  - Environments: .env.local
```

#### 7. Access the Application
Open in browser:
```
http://localhost:3000
```

You'll be redirected to login page.

#### 8. Login
- Email: `admin@ems.com`
- Password: `Admin@123`

You should see the dashboard! 🎉

---

## 🎯 First Actions to Try

### 1. Add an Employee
1. Click "Employees" in sidebar
2. Click "Add Employee" button
3. Fill in the form:
   - First Name: John
   - Last Name: Doe
   - Email: john@company.com
   - Phone: +1 (555) 123-4567
   - Department: IT
   - Position: Developer
   - Salary: 75000
4. Click "Create"
5. ✅ Employee appears in the table!

### 2. Search Employees
1. In Employees page, type in search box
2. Try searching: "john", "developer", "it"
3. ✅ Results filter in real-time!

### 3. Edit an Employee
1. Click the edit icon (✏️) on any employee row
2. Modify any field
3. Click "Update"
4. ✅ Changes saved!

### 4. Delete an Employee
1. Click the trash icon (🗑️) on any employee row
2. Confirm deletion
3. ✅ Employee removed!

### 5. View Dashboard
1. Click "Dashboard" in sidebar
2. See total employees and departments stats
3. ✅ Dashboard shows overview!

---

## 🧪 Testing the API

### Using Browser Console

Open browser DevTools (F12) and paste:

```javascript
// Login
fetch('/api/auth/login', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    email: 'admin@ems.com',
    password: 'Admin@123'
  }),
  credentials: 'include'
}).then(r => r.json()).then(console.log);

// Get employees
fetch('/api/employees', {
  credentials: 'include'
}).then(r => r.json()).then(console.log);
```

### Using curl

```bash
# Login
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@ems.com","password":"Admin@123"}' \
  -c cookies.txt

# List employees (using saved cookies)
curl http://localhost:3000/api/employees \
  -b cookies.txt
```

### Using Postman

1. Import `EMS_API.postman_collection.json`
2. Set `base_url` variable to `http://localhost:3000`
3. Run "Login" request first
4. Run other requests ✅

---

## 🔑 Important Configuration

### Change Default Admin Password (REQUIRED for Production)

1. Login with `admin@ems.com` / `Admin@123`
2. You'll need to modify the database directly for now:

```bash
# Connect to database
psql -U ems_user -d ems_db

# Update password (use a new bcrypt hash)
# For now, keep default password for testing
```

Or wait for password change feature in future updates.

### Generate Strong JWT Secret (REQUIRED for Production)

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

Output example: `a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6q7r8s9t0u1v2w3x4y5z6`

Update `JWT_SECRET` in `.env.local`

---

## 📱 Useful Commands

```bash
# Development
npm run dev              # Start dev server
npm run build            # Build for production
npm run start            # Start production server
npm run lint             # Check code quality

# Database
npm run db:push          # Apply schema changes
npm run db:seed          # Seed admin user
npm run db:studio        # Open Prisma Studio (visual DB explorer)

# Docker
docker-compose up -d     # Start database
docker-compose down      # Stop database
docker-compose logs      # View database logs
```

---

## ❌ Troubleshooting

### Issue: `error in route handler handler` or `DATABASE_URL not set`

**Solution:**
```bash
# Check .env.local exists
ls .env.local

# Verify DATABASE_URL is set
cat .env.local

# Restart dev server
npm run dev
```

### Issue: `error: connect ECONNREFUSED 127.0.0.1:5432`

**Solution:**
```bash
# If using Docker, make sure it's running
docker ps
docker-compose up -d

# Or if using local PostgreSQL
psql -U postgres  # Test connection
```

### Issue: `P1008 Operations timed out`

**Solution:**
```bash
# Database might be slow, try:
npm run db:push

# Or reset (WARNING: deletes all data)
npx prisma migrate reset
npm run db:seed
```

### Issue: Login fails with "Invalid email or password"

**Solution:**
```bash
# Make sure password is exactly: Admin@123
# Or reseed the database
npm run db:seed

# Check user exists in database
psql -U ems_user -d ems_db
SELECT * FROM "User";
```

### Issue: Employee creation fails with "Invalid input data"

**Solution:**
```
Check form validation:
- Email must be valid format
- Email must be unique
- Salary must be a number > 0
- All required fields must be filled
```

---

## 🔐 Security Checklist

Before deploying to production:

- [ ] Change `JWT_SECRET` to a strong random string
- [ ] Change default admin password
- [ ] Enable HTTPS/SSL
- [ ] Set `NODE_ENV=production`
- [ ] Configure PostgreSQL authentication
- [ ] Enable database backups
- [ ] Set secure environment variables
- [ ] Review SETUP_GUIDE.md security section
- [ ] Test all API endpoints
- [ ] Enable monitoring/logging

---

## 📚 Next Steps

1. **Read Documentation**
   - [SETUP_GUIDE.md](./SETUP_GUIDE.md) - Detailed setup
   - [API_REFERENCE.md](./API_REFERENCE.md) - API docs
   - [ARCHITECTURE.md](./ARCHITECTURE.md) - System design

2. **Explore Code**
   - Check `src/app/api/` for API routes
   - Check `src/components/` for UI components
   - Check `src/lib/` for utilities

3. **Customize**
   - Add more fields to Employee model
   - Customize dashboard layout
   - Add additional validation rules
   - Integrate with external services

4. **Deploy**
   - Prepare for Vercel, Docker, or your platform
   - Follow deployment section in SETUP_GUIDE.md
   - Set up CI/CD pipeline

---

## 📞 Quick Help

| Problem | Command |
|---------|---------|
| Reinstall deps | `npm install` |
| Reset database | `npx prisma migrate reset` |
| View database | `npm run db:studio` |
| Check logs | `docker-compose logs -f` |
| Stop server | `Ctrl + C` |
| Clear cache | `rm -rf .next node_modules/.cache` |

---

## ✨ Features at a Glance

✅ Admin authentication with JWT
✅ Employee CRUD operations
✅ Search and pagination
✅ Real-time form validation
✅ Professional UI with shadcn/ui
✅ Secure database with Prisma
✅ TypeScript for type safety
✅ Production-ready code

---

## 🎓 Learning Resources

- [Next.js Tutorial](https://nextjs.org/learn)
- [Prisma Documentation](https://www.prisma.io/docs/)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Tailwind CSS Docs](https://tailwindcss.com/docs)

---

**You're all set! Happy coding! 🚀**

For more details, see the comprehensive [SETUP_GUIDE.md](./SETUP_GUIDE.md)
