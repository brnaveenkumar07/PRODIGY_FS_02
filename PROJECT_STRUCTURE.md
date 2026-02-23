# EMS Project Structure

```
src/
├── app/                  # Next.js App Router pages & layouts
│   ├── layout.tsx
│   ├── page.tsx
│   └── ...
├── components/          # Reusable React components
│   ├── Button.tsx       # Example component
│   └── ...
├── hooks/              # Custom React hooks
│   ├── useToggle.ts    # Example hook
│   └── ...
├── lib/                # Utility libraries and helpers
│   ├── api.ts          # API client functions
│   └── ...
├── types/              # TypeScript type definitions
│   └── index.ts        # Example types
├── utils/              # Utility functions
│   ├── format.ts       # Example utilities
│   └── ...
└── constants/          # Application constants
    └── index.ts        # Example constants

public/
├── images/            # Public images
├── icons/             # Public icons
└── favicon.ico        # App favicon
```

## Key Directories

- **src/app/**: Contains Next.js App Router pages and layouts
- **src/components/**: Reusable UI components (follow feature-based organization)
- **src/hooks/**: Custom React hooks
- **src/lib/**: Utility libraries (API calls, database connections, etc.)
- **src/types/**: TypeScript type definitions
- **src/utils/**: Helper functions and utilities
- **src/constants/**: Application-wide constants
