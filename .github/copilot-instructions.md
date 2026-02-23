# EMS Project - Development Guide

## Project Overview

EMS is a professional Next.js application with TypeScript, Tailwind CSS, and modern development tools configured for production-ready development.

## Technology Stack

- **Framework**: Next.js 16.1.6 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS 4
- **Linting**: ESLint 9
- **Package Manager**: npm

## File Organization

```
src/
├── app/              # Next.js App Router pages and layouts
├── components/       # Reusable React components
├── hooks/           # Custom React hooks
├── lib/             # Utility libraries and helpers
├── types/           # TypeScript type definitions
├── utils/           # Helper functions and utilities
└── constants/       # Application constants
```

## Development Standards

### TypeScript First
- Always use TypeScript for type safety
- Define interfaces in `src/types/`
- Avoid using `any` type

### Components
- Place reusable components in `src/components/`
- Use 'use client' directive for interactive components
- Provide proper TypeScript props interfaces

### Hooks
- Custom hooks go in `src/hooks/`
- Follow naming convention: `useXxx`
- Export as named exports

### Utilities
- Place helper functions in `src/utils/` or `src/lib/`
- Document complex functions with JSDoc comments
- Keep functions pure and testable

### Styling
- Use Tailwind CSS for styling
- Prefer utility classes over custom CSS
- Use CSS modules only when necessary

## Available Commands

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

## Environment Variables

Create `.env.local` for environment-specific configuration:

```env
NEXT_PUBLIC_API_URL=<your-api-url>
```

## Style Guide

- Use functional components with React hooks
- Prefer immutability
- Keep component files focused and single-purpose
- Export components as named exports
- Use TypeScript strict mode

## Resources

- [Next.js Docs](https://nextjs.org/docs)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Tailwind CSS Docs](https://tailwindcss.com/docs)
- [React Docs](https://react.dev)

