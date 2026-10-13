# TypeScript Rules

Load this when working with types, generics, interfaces, or type-related errors.

## Strict Mode (enforced)

Always ensure `tsconfig.json` has:
```json
{
  "compilerOptions": {
    "strict": true,
    "noImplicitAny": true,
    "strictNullChecks": true,
    "strictFunctionTypes": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noImplicitReturns": true
  }
}
```

## Type Conventions

### Naming
- **Interfaces:** `PascalCase` with `I` prefix only for library exports; prefer type aliases for internal use
  ```ts
  // Good
  interface UserProfile { name: string; }
  type RequestConfig = { timeout: number; };
  
  // Avoid
  interface IUserProfile { }
  ```

- **Generic types:** `T`, `U`, `V` for simple cases; descriptive names for complex
  ```ts
  // Good
  function transform<T>(item: T): T { }
  function paginate<TItem, TMeta>(items: TItem[], meta: TMeta): Paginated<TItem, TMeta> { }
  
  // Avoid
  function transform<Thing>(item: Thing): Thing { }
  ```

### Discriminated Unions (for state machines)
```ts
// Good: Discriminated union for predictable state handling
type Result<T> = 
  | { status: 'loading' }
  | { status: 'success'; data: T }
  | { status: 'error'; error: string };
```

### Strict null checks
```ts
// Good
const user: User | null = getUser();
if (user) { console.log(user.name); }

// Avoid
const user: User = getUser(); // Assumes non-null, but getUser() might return null
```

### Use `satisfies` for runtime validation
```ts
// Good: Validates against type without widening
const colors = {
  primary: '#000',
  secondary: '#fff',
} satisfies Record<string, `#${string}`>;

// Avoid
const colors: Record<string, string> = { ... }; // Loses literal type info
```

### Generic Constraints
```ts
// Good: Constrains T to have 'id' property
function getById<T extends { id: string }>(items: T[], id: string): T | undefined {
  return items.find(item => item.id === id);
}

// Avoid
function getById<T>(items: T[], id: string): T | undefined { } // Too loose
```

### Const Assertions for Enums
```ts
// Good: Preserves literal types
export const PaymentStatus = {
  PENDING: 'pending',
  COMPLETED: 'completed',
} as const;

type PaymentStatusType = typeof PaymentStatus[keyof typeof PaymentStatus];

// Avoid
export const PaymentStatus = {
  PENDING: 'pending',
  COMPLETED: 'completed',
}; // Types as string, not literals
```

## Type Imports

Use `type` keyword for type-only imports to reduce bundle:
```ts
import type { User, Config } from './types';
import { validateUser } from './validators'; // Runtime value
```

## No `any` Rule

If you must use `any` (rare), add explanation:
```ts
// @ts-ignore: API returns untyped response; validated with Zod runtime parser
const data = response.json() as any;
```

## Zod for Runtime Validation

Use for API responses, form data:
```ts
import { z } from 'zod';

const UserSchema = z.object({
  id: z.string().uuid(),
  name: z.string().min(1),
  email: z.string().email(),
});

type User = z.infer<typeof UserSchema>;

// Validate at system boundary
const user = UserSchema.parse(apiResponse);
```

## Common Patterns

### Optional properties
```ts
// Good
type User = {
  id: string;
  name: string;
  nickname?: string; // Optional
  age?: number;
};

// Avoid
type User = {
  id: string;
  name: string;
  nickname: string | undefined;
};
```

### Error types
```ts
// Good: Custom error type
type AppError = {
  code: 'NETWORK' | 'VALIDATION' | 'UNAUTHORIZED';
  message: string;
  details?: Record<string, unknown>;
};

// Avoid
type AppError = any;
```

### Function overloads (sparingly)
```ts
// Good for different call signatures
export function fetch(url: string): Promise<unknown>;
export function fetch(url: string, options: FetchOptions): Promise<unknown>;
export function fetch(url: string, options?: FetchOptions) {
  // implementation
}
```

## Verification

After type changes:
```bash
pnpm exec tsc --noEmit  # Check for type errors
pnpm lint               # Run ESLint with type rules
pnpm test               # Run typed tests
```
