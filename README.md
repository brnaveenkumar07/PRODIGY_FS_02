# Employee Management System (EMS)

A full-stack Employee Management System built with Next.js, TypeScript, Prisma, and PostgreSQL. The application provides secure admin authentication and a clean dashboard for managing employee records, including create, read, update, delete, search, and pagination workflows.

## Overview

This project is designed to help admins manage employee information from a single dashboard. It combines a modern React-based frontend with protected API routes, server-side validation, and database-backed persistence to deliver a practical and production-ready employee management solution.

## Features

- Secure admin login with JWT authentication and HttpOnly cookies
- Protected dashboard and API routes
- Employee CRUD operations
- Search and paginated employee listing
- Dashboard with employee and department insights
- Form validation with Zod
- Prisma ORM with PostgreSQL
- Responsive UI built with Tailwind CSS and shadcn/ui
- Seeded demo admin account and sample employee data

## Tech Stack

- Next.js 16 with App Router
- React 19
- TypeScript
- Tailwind CSS 4
- shadcn/ui and Radix UI
- Prisma ORM
- PostgreSQL
- Zod
- bcryptjs
- JWT-based authentication

## Main Modules

- `Admin Authentication`: Login and logout flow with secure cookie-based session handling
- `Dashboard`: Quick overview of total employees and department count
- `Employee Management`: Add, edit, delete, search, and browse employee records
- `Protected APIs`: Authenticated endpoints for employee operations with validation and structured responses

## Project Structure

```text
src/
├── app/
│   ├── api/                  # Auth and employee API routes
│   ├── dashboard/            # Protected dashboard pages
│   └── login/                # Admin login page
├── components/               # Reusable UI and feature components
├── hooks/                    # Custom hooks
├── lib/                      # Auth, Prisma, validators, API helpers
├── types/                    # Type definitions
├── utils/                    # Utility functions
└── constants/                # App constants

prisma/
├── schema.prisma             # Database schema
└── seed.ts                   # Seed script with demo data
```

## Getting Started

### Prerequisites

- Node.js 18+
- npm
- PostgreSQL

### Installation

```bash
npm install
```

### Environment Setup

Create a `.env.local` file and configure the required variables:

```env
DATABASE_URL="postgresql://ems_user:ems_password@localhost:5432/ems_db"
JWT_SECRET="your-super-secret-jwt-key-change-in-production"
JWT_EXPIRATION=7
NODE_ENV="development"
NEXT_PUBLIC_APP_URL="http://localhost:3000"
```

You can also use [.env.example](/c:/Users/navee/Desktop/Prodigy-Infotech/EMS/.env.example) as a reference.

### Database Setup

```bash
npm run db:push
npm run db:seed
```

### Run the App

```bash
npm run dev
```

Open `http://localhost:3000`.

## Demo Credentials

After running the seed script, use:

- Email: `admin@ems.com`
- Password: `Admin@123`

## Available Scripts

```bash
npm run dev        # Start development server
npm run build      # Generate Prisma client and create production build
npm run start      # Start production server
npm run lint       # Run ESLint
npm run db:push    # Push Prisma schema to the database
npm run db:seed    # Seed admin user and sample employees
npm run db:studio  # Open Prisma Studio
```

## API Summary

- `POST /api/auth/login` - Authenticate admin and set auth cookie
- `POST /api/auth/logout` - Clear auth cookie
- `GET /api/employees` - List employees with search and pagination
- `POST /api/employees` - Create a new employee
- `GET /api/employees/:id` - Get employee details
- `PUT /api/employees/:id` - Update an employee
- `DELETE /api/employees/:id` - Delete an employee

## Why This Project

This project demonstrates how to build a secure and scalable admin-facing management system using the modern Next.js app architecture. It is a solid example of combining frontend UI, backend APIs, authentication, validation, and database integration in one cohesive full-stack application.

Live Demo: https://ems-naveen.vercel.app/login
