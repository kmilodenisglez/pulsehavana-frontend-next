# React Component Rules

Load this when creating or refactoring React components, hooks, or managing component state.

## Component Structure

### Keep components under 200 lines
If component exceeds 200 lines, split into smaller components:
```ts
// Bad: 400+ line monolithic component
export function OrderPage() { /* everything here */ }

// Good: Composed of smaller focused components
export function OrderPage() {
  return (
    <div>
      <OrderHeader />
      <OrderItems />
      <OrderSummary />
    </div>
  );
}
```

### Functional components with hooks only
```ts
// Good
export function UserCard({ userId }: { userId: string }) {
  const [user, setUser] = React.useState<User | null>(null);
  
  React.useEffect(() => {
    fetchUser(userId).then(setUser);
  }, [userId]);
  
  return <div>{user?.name}</div>;
}

// Avoid
class UserCard extends React.Component { }
```

## Props & State

### Avoid prop drilling; use Context or stores
```ts
// Bad: Prop drilling
<Header user={user} onLogout={onLogout} />
  <Sidebar user={user} />
    <Profile user={user} onLogout={onLogout} />

// Good: Context or Zustand
const useAuth = () => useContext(AuthContext);
// or
const useAuth = store.useAuth;

export function Profile() {
  const { user, logout } = useAuth();
  return <div>{user.name}</div>;
}
```

### Keep state close to where it's used
```ts
// Good: Form state in form component
export function LoginForm() {
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  
  return <form>...</form>;
}

// Bad: Form state in parent component
export function App() {
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  
  return <LoginForm email={email} setEmail={setEmail} />;
}
```

### Use TypeScript interfaces for props
```ts
// Good
interface ButtonProps extends React.ComponentProps<'button'> {
  variant?: 'primary' | 'secondary';
  isLoading?: boolean;
}

export function Button({ variant = 'primary', isLoading, ...rest }: ButtonProps) {
  return <button className={`btn btn--${variant}`} disabled={isLoading} {...rest} />;
}

// Avoid
export function Button(props) { }
```

## Hooks

### Custom hooks for reusable logic
```ts
// Good: Extract hook
export function useQueryString(key: string): [string, (value: string) => void] {
  const [searchParams, setSearchParams] = useSearchParams();
  
  const value = searchParams.get(key) ?? '';
  const setValue = (newValue: string) => {
    const params = new URLSearchParams(searchParams);
    params.set(key, newValue);
    setSearchParams(params);
  };
  
  return [value, setValue];
}

// Usage
const [sortBy, setSortBy] = useQueryString('sort');
```

### Dependencies array discipline
```ts
// Good: Explicit dependencies
React.useEffect(() => {
  fetchData(userId);
}, [userId]); // Re-run only if userId changes

// Bad: Missing dependency
React.useEffect(() => {
  fetchData(userId);
}, []); // userId might change; side effect won't re-run
```

### Memoize expensive operations
```ts
// Good: Memoize selector
const selectActiveOrders = React.useMemo(
  () => orders.filter(o => o.status === 'active'),
  [orders]
);

// Good: Memoize callback
const handleClick = React.useCallback(() => {
  onComplete(orderId);
}, [orderId, onComplete]);

// Good: Memoize component to prevent re-renders
const OrderItem = React.memo(function OrderItem({ order }: { order: Order }) {
  return <div>{order.id}</div>;
});
```

## Performance

### Code splitting at route level
```ts
// Good: Lazy load routes
const OrderPage = React.lazy(() => import('./pages/OrderPage'));
const SettingsPage = React.lazy(() => import('./pages/SettingsPage'));

export function Routes() {
  return (
    <React.Suspense fallback={<LoadingSpinner />}>
      <Switch>
        <Route path="/orders" component={OrderPage} />
        <Route path="/settings" component={SettingsPage} />
      </Switch>
    </React.Suspense>
  );
}
```

### Preload on route change
```ts
// Good: Preload critical resource
const handleNavigate = async (path: string) => {
  const component = await import(/* webpackChunkName: "orders" */ './pages/OrderPage');
  navigate(path);
};
```

### Virtual lists for large data
```ts
// Good: Virtualize long lists (50+ items)
import { FixedSizeList } from 'react-window';

export function OrderList({ orders }: { orders: Order[] }) {
  return (
    <FixedSizeList height={600} itemCount={orders.length} itemSize={60}>
      {({ index, style }) => (
        <OrderRow order={orders[index]} style={style} />
      )}
    </FixedSizeList>
  );
}
```

## Best Practices

### Use controlled components for forms
```ts
// Good: Controlled component
export function UserForm() {
  const [name, setName] = React.useState('');
  
  return (
    <input value={name} onChange={(e) => setName(e.currentTarget.value)} />
  );
}

// Avoid
export function UserForm() {
  const inputRef = React.useRef<HTMLInputElement>(null);
  
  return <input ref={inputRef} />;
}
```

### Error boundaries for graceful degradation
```ts
// Good: Catch rendering errors
export class ErrorBoundary extends React.Component<{ children: React.ReactNode }> {
  state = { hasError: false };
  
  static getDerivedStateFromError() {
    return { hasError: true };
  }
  
  render() {
    if (this.state.hasError) return <ErrorFallback />;
    return this.props.children;
  }
}
```

### Fragment for multiple elements
```ts
// Good
return (
  <>
    <Header />
    <Main />
    <Footer />
  </>
);

// Avoid
return (
  <div>
    <Header />
    <Main />
    <Footer />
  </div>
);
```

## Verification

```bash
pnpm lint               # ESLint + React plugin rules
pnpm test               # Component tests
npm run build           # Check for warnings
```
