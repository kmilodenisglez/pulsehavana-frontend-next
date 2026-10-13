# State Management Rules

Load this when managing global state, using Zustand, Context, or component state.

## State Architecture Decision

### Use case → Solution mapping

| Use Case | Solution |
|---|---|
| Form input (temporary) | useState (component) |
| Complex form state | React Hook Form + useState |
| UI state (sidebar open, modal visible) | useState or Context |
| Async server state (orders, users) | React Query / SWR |
| Global app state (auth, theme) | Zustand or Context |
| Multiple deeply nested consumers | Context + Zustand |

## Zustand (recommended for global state)

### Store definition
```ts
// Good: Type-safe Zustand store
import { create } from 'zustand';

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isAuthenticated: false,
  
  login: async (email: string, password: string) => {
    const user = await apiCall('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
    set({ user, isAuthenticated: true });
  },
  
  logout: () => {
    set({ user: null, isAuthenticated: false });
  },
}));
```

### Store usage
```ts
// Good: Use store in components
export function Profile() {
  const { user, logout } = useAuthStore();
  
  if (!user) return <Redirect to="/login" />;
  
  return (
    <div>
      <p>{user.name}</p>
      <button onClick={logout}>Logout</button>
    </div>
  );
}
```

### Derived state with selectors
```ts
// Good: Memoize selectors to prevent re-renders
const selectUserEmail = (state: AuthState) => state.user?.email;

export function UserEmail() {
  const email = useAuthStore(selectUserEmail);
  return <p>{email}</p>;
}
```

## Context API (for simple cases)

### Context definition
```ts
// Good: Type-safe context
interface ThemeContextType {
  theme: 'light' | 'dark';
  toggleTheme: () => void;
}

export const ThemeContext = React.createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = React.useState<'light' | 'dark'>('light');
  
  const value: ThemeContextType = {
    theme,
    toggleTheme: () => setTheme(t => t === 'light' ? 'dark' : 'light'),
  };
  
  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme(): ThemeContextType {
  const context = React.useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within ThemeProvider');
  }
  return context;
}
```

## Server State (React Query)

### Query definition
```ts
// Good: Fetch and cache server data with React Query
import { useQuery } from '@tanstack/react-query';

export function OrdersList() {
  const { data: orders, isLoading, error } = useQuery({
    queryKey: ['orders'],
    queryFn: () => apiCall<Order[]>('/orders'),
  });
  
  if (isLoading) return <Skeleton />;
  if (error) return <ErrorMessage error={error} />;
  
  return (
    <div>
      {orders?.map(order => (
        <OrderRow key={order.id} order={order} />
      ))}
    </div>
  );
}
```

### Mutations
```ts
// Good: Handle updates with useMutation
import { useMutation, useQueryClient } from '@tanstack/react-query';

export function CompleteOrderButton({ orderId }: { orderId: string }) {
  const queryClient = useQueryClient();
  const { mutate, isPending } = useMutation({
    mutationFn: () => apiCall(`/orders/${orderId}/complete`, { method: 'POST' }),
    onSuccess: () => {
      // Invalidate cache to refetch orders
      queryClient.invalidateQueries({ queryKey: ['orders'] });
    },
  });
  
  return (
    <button onClick={() => mutate()} disabled={isPending}>
      {isPending ? 'Completing...' : 'Complete Order'}
    </button>
  );
}
```

## Local Component State

### Simple state with useState
```ts
// Good: Keep state close to components that use it
export function SearchOrders() {
  const [query, setQuery] = React.useState('');
  const [results, setResults] = React.useState<Order[]>([]);
  
  const handleSearch = async (searchQuery: string) => {
    setQuery(searchQuery);
    const data = await apiCall<Order[]>(`/orders/search?q=${searchQuery}`);
    setResults(data);
  };
  
  return (
    <div>
      <input value={query} onChange={(e) => handleSearch(e.currentTarget.value)} />
      {results.map(order => <OrderRow key={order.id} order={order} />)}
    </div>
  );
}
```

### Complex local state with useReducer
```ts
// Good: Use reducer for complex state logic
type FormState = {
  email: string;
  password: string;
  errors: Record<string, string>;
  isSubmitting: boolean;
};

type FormAction =
  | { type: 'SET_EMAIL'; payload: string }
  | { type: 'SET_PASSWORD'; payload: string }
  | { type: 'SET_ERROR'; payload: { field: string; message: string } }
  | { type: 'SET_SUBMITTING'; payload: boolean }
  | { type: 'RESET' };

function formReducer(state: FormState, action: FormAction): FormState {
  switch (action.type) {
    case 'SET_EMAIL':
      return { ...state, email: action.payload };
    case 'SET_PASSWORD':
      return { ...state, password: action.payload };
    case 'SET_ERROR':
      return {
        ...state,
        errors: { ...state.errors, [action.payload.field]: action.payload.message },
      };
    case 'SET_SUBMITTING':
      return { ...state, isSubmitting: action.payload };
    case 'RESET':
      return initialState;
    default:
      return state;
  }
}

const initialState: FormState = {
  email: '',
  password: '',
  errors: {},
  isSubmitting: false,
};

export function LoginForm() {
  const [state, dispatch] = React.useReducer(formReducer, initialState);
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    dispatch({ type: 'SET_SUBMITTING', payload: true });
    try {
      await apiCall('/auth/login', {
        method: 'POST',
        body: JSON.stringify({ email: state.email, password: state.password }),
      });
    } catch (error) {
      dispatch({
        type: 'SET_ERROR',
        payload: { field: 'password', message: 'Invalid credentials' },
      });
    } finally {
      dispatch({ type: 'SET_SUBMITTING', payload: false });
    }
  };
  
  return <form onSubmit={handleSubmit}>...</form>;
}
```

## Anti-patterns to avoid

```ts
// Bad: Prop drilling (passing through multiple levels)
<Parent orders={orders} onSelect={onSelect}>
  <Child orders={orders} onSelect={onSelect}>
    <GrandChild orders={orders} onSelect={onSelect} />
  </Child>
</Parent>

// Good: Use Context or store
const { orders, onSelect } = useOrderStore();

// Bad: State in wrong place
export function App() {
  const [formData, setFormData] = React.useState(''); // Should be in LoginForm
  return <LoginForm formData={formData} setFormData={setFormData} />;
}

// Good: Keep state close
export function LoginForm() {
  const [formData, setFormData] = React.useState('');
}

// Bad: Syncing state manually
export function OrderDetail() {
  const [order, setOrder] = React.useState<Order | null>(null);
  React.useEffect(() => {
    fetchOrder(id).then(setOrder); // Use React Query instead
  }, [id]);
}

// Good: Use React Query
const { data: order } = useQuery({
  queryKey: ['orders', id],
  queryFn: () => fetchOrder(id),
});
```

## Verification

```bash
pnpm test                   # Test state logic
npm run build -- --profile  # Check state bundle impact
```
