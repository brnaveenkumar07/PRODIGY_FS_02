# 🏢 Employee Management System (EMS)

> A modern, production-ready Employee Management System built with Next.js, TypeScript, Prisma, and PostgreSQL.

![Next.js](https://img.shields.io/badge/Next.js-16.1.6-black?style=flat-square&logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?style=flat-square&logo=typescript)
![Prisma](https://img.shields.io/badge/Prisma-7.4.1-blue?style=flat-square&logo=prisma)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-16-336791?style=flat-square&logo=postgresql)
![License](https://img.shields.io/badge/License-MIT-green?style=flat-square)

## ✨ Features

### 🔐 Authentication & Security
- ✅ JWT-based authentication
- ✅ Secure password hashing with bcryptjs
- ✅ HttpOnly cookie storage
- ✅ Role-based access control (ADMIN)
- ✅ Middleware-based route protection
- ✅ CSRF protection
- ✅ Input validation with Zod

### 👥 Employee Management
- ✅ Create, read, update, delete employees
- ✅ Employee search functionality
- ✅ Pagination support
- ✅ Sorting by multiple fields
- ✅ Real-time validation
- ✅ Duplicate email prevention

### 💻 Frontend
- ✅ Modern responsive UI with shadcn/ui
- ✅ Professional admin dashboard
- ✅ Data table with actions
- ✅ Add/Edit employee modal
- ✅ Delete confirmation dialog
- ✅ Toast notifications
- ✅ Loading and error states

### 🔧 Technical Excellence
- ✅ TypeScript strict mode
- ✅ Prisma ORM with migrations
- ✅ Server components where applicable
- ✅ API route handlers
- ✅ Consistent error handling
- ✅ Logging infrastructure
- ✅ Production-ready architecture

## 📋 Requirements

- Node.js 18+ 
- npm 9+
- PostgreSQL 14+
- Git

## 🚀 Quick Start

### 1️⃣ Clone & Setup
```bash
# Clone repository (if cloning)
git clone <repository-url>
cd EMS

# Install dependencies
npm install
```

### 2️⃣ Database Setup

**Option A: Using Docker (Recommended)**
```bash
docker-compose up -d

# Set DATABASE_URL in .env.local
DATABASE_URL="postgresql://ems_user:ems_password@localhost:5432/ems_db"
```

**Option B: Local PostgreSQL**
```bash
createdb ems_db
```

### 3️⃣ Environment Variables
```bash
# Copy example file
cp .env.example .env.local

# Edit .env.local with your values
nano .env.local
```

Required variables:
```env
DATABASE_URL="postgresql://user:password@localhost:5432/ems_db"
JWT_SECRET="your-secret-key-here"
JWT_EXPIRATION=7
```

### 4️⃣ Database Initialization
```bash
# Run migrations
npm run db:push

# Seed database with admin user
npm run db:seed
```

### 5️⃣ Start Development Server
```bash
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000)

**Default Login:**
- Email: `admin@ems.com`
- Password: `Admin@123`

## 📁 Project Structure

```
src/
├── app/                          # Next.js App Router
│   ├── api/
│   │   ├── auth/                # Authentication endpoints
│   │   │   ├── login/route.ts
│   │   │   └── logout/route.ts
│   │   └── employees/           # Employee CRUD endpoints
│   │       ├── route.ts         # List & Create
│   │       └── [id]/route.ts    # Get, Update, Delete
│   ├── dashboard/               # Dashboard layout & pages
│   │   ├── layout.tsx
│   │   ├── page.tsx
│   │   └── employees/
│   │       └── page.tsx
│   ├── login/
│   │   └── page.tsx             # Login page
│   ├── globals.css
│   ├── layout.tsx               # Root layout
│   └── page.tsx                 # Home (redirects to dashboard)
├── components/
│   ├── ui/                      # shadcn/ui components
│   ├── EmployeeFormDialog.tsx  # Add/Edit modal
│   ├── EmployeeTable.tsx       # Data table
│   ├── DeleteConfirmDialog.tsx # Delete confirmation
│   └── Providers.tsx            # Client providers
├── hooks/
│   ├── useApi.ts               # API call hook
│   └── useToggle.ts            # Toggle state hook
├── lib/
│   ├── prisma.ts               # Prisma client singleton
│   ├── auth.ts                 # Auth utilities
│   └── validators.ts           # Zod schemas
├── types/
│   └── index.ts                # TypeScript types
├── utils/
│   └── format.ts               # Utility functions
└── middleware.ts               # Auth middleware

prisma/
├── schema.prisma               # Database schema
└── seed.ts                     # Seed script

docs/
├── SETUP_GUIDE.md             # Detailed setup guide
└── API_REFERENCE.md           # API documentation
```

## 🔌 API Endpoints

### Authentication
- `POST /api/auth/login` - Login
- `POST /api/auth/logout` - Logout

### Employees
- `GET /api/employees` - List employees (paginated)
- `POST /api/employees` - Create employee
- `GET /api/employees/:id` - Get employee
- `PUT /api/employees/:id` - Update employee
- `DELETE /api/employees/:id` - Delete employee

See [API_REFERENCE.md](./API_REFERENCE.md) for detailed documentation.

## 🧪 Testing

### Manual API Testing
```bash
# Login
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@ems.com","password":"Admin@123"}'

# List employees
curl http://localhost:3000/api/employees

# Create employee
curl -X POST http://localhost:3000/api/employees \
  -H "Content-Type: application/json" \
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
Import `EMS_API.postman_collection.json` into Postman.

## 📚 Documentation

- [SETUP_GUIDE.md](./SETUP_GUIDE.md) - Complete setup instructions
- [API_REFERENCE.md](./API_REFERENCE.md) - API documentation
- [DATABASE.md](./docs/DATABASE.md) - Database schema details

## 🔐 Security Features

✅ **Implemented Security Measures:**
- Password hashing with bcryptjs (salt rounds: 10)
- JWT authentication with HttpOnly cookies
- CORS configuration
- Input validation with Zod
- SQL injection prevention (Prisma ORM)
- CSRF protection (Same-Site cookies)
- Secure headers configuration
- No sensitive data in responses
- Rate limiting ready

## 🚀 Deployment

### Vercel (Recommended)
```bash
git push origin main
# Automatically deploys to Vercel
```

Set environment variables in Vercel dashboard:
- `DATABASE_URL`
- `JWT_SECRET`
- `JWT_EXPIRATION`

### Docker
```bash
docker build -t ems-app .
docker run -p 3000:3000 \
  -e DATABASE_URL="..." \
  -e JWT_SECRET="..." \
  ems-app
```

### Railway, Render, or Other Platforms
Follow the documentation for your selected platform and set the environment variables.

## 📦 Available Scripts

```bash
npm run dev         # Start development server
npm run build       # Build for production
npm run start       # Start production server
npm run lint        # Run ESLint
npm run db:push     # Push schema changes to DB
npm run db:seed     # Seed database with admin
npm run db:studio   # Open Prisma Studio
```

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| **Frontend** | React 19, Next.js 16 |
| **Styling** | Tailwind CSS 4 |
| **Components** | shadcn/ui |
| **Language** | TypeScript 5 |
| **Backend** | Next.js API Routes |
| **Database** | PostgreSQL 16 |
| **ORM** | Prisma 7 |
| **Validation** | Zod |
| **Auth** | JWT + bcryptjs |
| **State** | React Hooks |
| **Forms** | React Hook Form |

## 📝 Database Schema

### User Model
```
- id: String (unique)
- email: String (unique)
- password: String (hashed)
- role: "ADMIN"
- createdAt: DateTime
- updatedAt: DateTime
- employees: Employee[] (1-to-many)
```

### Employee Model
```
- id: String (unique)
- firstName: String
- lastName: String
- email: String (unique)
- phone: String?
- department: String
- position: String
- salary: Float
- createdBy: String (User reference)
- createdAt: DateTime
- updatedAt: DateTime
```

## 🐛 Troubleshooting

### Database Connection Error
```bash
# Check PostgreSQL is running
psql -U ems_user -d ems_db

# Verify DATABASE_URL in .env.local
```

### Build Errors
```bash
# Clear cache
rm -rf .next node_modules
npm install
npm run build
```

### Migrations Issues
```bash
# Reset database (⚠️ deletes all data)
npx prisma migrate reset
```

See [SETUP_GUIDE.md](./SETUP_GUIDE.md#-troubleshooting) for more troubleshooting.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 💡 Future Enhancements

- [ ] Employee photo/avatar uploads
- [ ] Multi-user authentication
- [ ] Department management
- [ ] Salary reviews history
- [ ] Employee documents storage
- [ ] Email notifications
- [ ] Bulk employee import/export
- [ ] Advanced analytics dashboard
- [ ] Audit logs
- [ ] API rate limiting

## 📞 Support

For issues and questions, please create an issue in the repository or refer to the documentation files.

---

**Built with ❤️ using Next.js, Prisma, and PostgreSQL**
