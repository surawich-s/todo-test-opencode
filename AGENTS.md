# AGENTS.md - Next.js Todo App Development Guidelines

This document provides comprehensive guidelines for agentic coding assistants working on this Next.js todo application. The app features a basic todo list with localStorage persistence, responsive design using Tailwind CSS, and a comfortable, modern UI.

## Build/Lint/Test Commands

### Development
- `npm run dev` - Start Next.js development server on localhost:3000
- `npm run build` - Create production build
- `npm run start` - Start production server
- `npm run lint` - Run ESLint for code quality checks

### Type Checking
- `npm run typecheck` or `npx tsc --noEmit` - TypeScript type checking

### Testing Commands
- `npm test` - Run all tests
- `npm run test:watch` - Run tests in watch mode
- `npm test -- --testNamePattern="should add new todo"` - Run single test by name
- `npm test -- --testPathPattern="TodoList.test.tsx"` - Run tests for specific file
- `npm test -- --coverage` - Run tests with coverage report
- `npm test -- --testPathPattern="TodoList.test.tsx" --testNamePattern="should add new todo"` - Run specific test in specific file

## Project Structure Guidelines

### Next.js App Router Structure
```
app/
├── layout.tsx          # Root layout
├── page.tsx           # Home page
├── globals.css        # Global styles
└── components/        # App-specific components

components/
├── client/            # Client components ('use client')
├── server/            # Server components (default)
└── ui/               # Reusable UI components

hooks/
└── useLocalStorage.ts # Custom storage hooks

lib/
└── utils.ts          # Utility functions

public/               # Static assets
```

### File Organization Rules
- Use private folders (`_folderName`) for internal utilities
- Use route groups (`(group)`) for logical organization
- Mark client-only components with `'use client'` directive
- Keep server components as default (no directive needed)

## Code Style Guidelines

### TypeScript Configuration
- Strict TypeScript enabled (`strict: true`)
- Path aliases: `@/*` maps to `./src/*` or `./*`
- Explicit return types for functions
- Interface definitions for component props and state

### Import Organization
```typescript
// 1. React imports
import React, { useState, useEffect } from 'react';

// 2. Third-party libraries
import { v4 as uuidv4 } from 'uuid';

// 3. Local imports (components, hooks, utils)
import { Button } from '@/components/ui/Button';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { formatDate } from '@/lib/utils';
```

### Component Patterns
- Functional components with hooks
- TypeScript interfaces for props
- `'use client'` directive for client components
- Custom hooks for reusable logic

### Tailwind CSS Conventions
- Utility-first approach
- Responsive design: `sm:`, `md:`, `lg:`, `xl:` prefixes
- Consistent spacing scale: `p-2`, `m-4`, `gap-3`
- Dark mode support: `dark:` prefix
- Custom component classes in `globals.css` when needed

### localStorage Usage - SSR-Safe Implementation

#### Recommended Hook Pattern
```typescript
'use client';

import { useState, useEffect } from 'react';

function useLocalStorage<T>(key: string, initialValue: T) {
  // Initialize with initialValue to prevent SSR mismatch
  const [value, setValue] = useState<T>(initialValue);
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    // Only access localStorage after component mounts (client-side)
    if (typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem(key);
        setValue(saved ? JSON.parse(saved) : initialValue);
      } catch (error) {
        console.warn(`localStorage error for key "${key}":`, error);
      }
    }
    setIsHydrated(true);
  }, [key, initialValue]);

  useEffect(() => {
    // Only save to localStorage after hydration and on client-side
    if (isHydrated && typeof window !== 'undefined') {
      try {
        localStorage.setItem(key, JSON.stringify(value));
      } catch (error) {
        console.warn(`Failed to save to localStorage for key "${key}":`, error);
      }
    }
  }, [key, value, isHydrated]);

  return [value, setValue] as const;
}
```

#### Usage Example
```typescript
const TodoApp = () => {
  const [todos, setTodos] = useLocalStorage('todos', []);
  // Todos persist across page refreshes and SSR cycles
};
```

### Error Handling Patterns
- Try-catch blocks around async operations
- Graceful fallbacks for localStorage failures
- User-friendly error messages in UI
- Console warnings for debugging (not errors)

### Naming Conventions
- **Components**: PascalCase (`TodoList`, `TodoItem`)
- **Hooks**: camelCase with `use` prefix (`useLocalStorage`)
- **Functions/Variables**: camelCase (`handleSubmit`, `isCompleted`)
- **Types/Interfaces**: PascalCase (`TodoItem`, `TodoListProps`)
- **Constants**: UPPER_SNAKE_CASE (`STORAGE_KEY`)
- **Files**: kebab-case (`todo-list.tsx`, `use-local-storage.ts`)

### Testing Patterns
- Jest + React Testing Library setup
- `describe` blocks for component/feature groups
- `it` statements describing behavior
- Mock external dependencies
- Test custom hooks with `renderHook`
- Accessibility testing with `getByRole`

#### Example Test Structure
```typescript
import { render, screen, fireEvent } from '@testing-library/react';
import { TodoList } from '@/components/TodoList';

describe('TodoList', () => {
  it('should add new todo when form is submitted', () => {
    render(<TodoList />);

    const input = screen.getByPlaceholderText('Add a new todo...');
    const button = screen.getByRole('button', { name: /add/i });

    fireEvent.change(input, { target: { value: 'Test todo' } });
    fireEvent.click(button);

    expect(screen.getByText('Test todo')).toBeInTheDocument();
  });

  it('should persist todos to localStorage', () => {
    const { result } = renderHook(() => useLocalStorage('todos', []));

    act(() => {
      result.current[1]([{ id: 1, text: 'Persisted todo', completed: false }]);
    });

    expect(localStorage.setItem).toHaveBeenCalledWith(
      'todos',
      JSON.stringify([{ id: 1, text: 'Persisted todo', completed: false }])
    );
  });
});
```

## Tooling Setup

### ESLint Configuration
- Next.js recommended rules
- TypeScript integration
- React hooks rules
- Import sorting

### Prettier Configuration
- Consistent formatting
- Tailwind class sorting
- Import organization

### Development Tools
- VS Code extensions: TypeScript, Tailwind CSS IntelliSense
- Pre-commit hooks with Husky
- Git hooks for automated linting and testing

## Additional Guidelines

### Performance Considerations
- Use React.memo for expensive components
- Optimize re-renders with proper dependency arrays
- Lazy load heavy components
- Minimize localStorage read/write operations

### Accessibility
- Semantic HTML elements
- ARIA labels where needed
- Keyboard navigation support
- Screen reader friendly

### Security
- Sanitize user input
- Avoid XSS in dynamic content
- Secure localStorage usage (no sensitive data)

### Code Quality
- Single responsibility principle
- DRY (Don't Repeat Yourself)
- Clean code principles
- Comprehensive test coverage

This document ensures consistent code quality and development practices across the todo application. Follow these guidelines to maintain a high-quality, maintainable codebase.