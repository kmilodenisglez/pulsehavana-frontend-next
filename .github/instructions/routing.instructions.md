# SPA Routing Rules

Load this when working with React Router, code splitting, navigation, or route-level state.

## Route Configuration (React Router v6)

### Root router setup
```ts
// Good: Lazy-loaded routes with Suspense
const HomePage = React.lazy(() => import('./pages/HomePage'));
const OrdersPage = React.lazy(() => import('./pages/OrdersPage'));
const NotFoundPage = React.lazy(() => import('./pages/NotFoundPage'));

export function App() {
  return (
    <BrowserRouter>
      <React.Suspense fallback={<LoadingPage />}>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/orders" element={<ProtectedRoute><OrdersPage /></ProtectedRoute>} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </React.Suspense>
    </BrowserRouter>
  );
}
```

### Protected routes
```ts
// Good: Check auth before rendering
interface ProtectedRouteProps {
  children: React.ReactNode;
}

export function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { isAuthenticated, isLoading } = useAuth();
  
  if (isLoading) return <LoadingPage />;
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  
  return children;
}
```

### Nested routes
```ts
// Good: Nested route structure
<Routes>
  <Route path="/orders" element={<OrdersLayout />}>
    <Route index element={<OrdersList />} />
    <Route path=":id" element={<OrderDetail />} />
  </Route>
</Routes>

// Corresponding component
export function OrdersLayout() {
  return (
    <div className="orders">
      <Sidebar />
      <Outlet /> {/* Renders nested route */}
    </div>
  );
}
```

## Code Splitting

### Lazy load heavy routes
```ts
// Good: Lazy routes for large pages
const DashboardPage = React.lazy(() => 
  import(/* webpackChunkName: "dashboard" */ './pages/DashboardPage')
);

// Preload on hover
<Link 
  to="/dashboard" 
  onMouseEnter={() => import('./pages/DashboardPage')}
>
  Dashboard
</Link>
```

### Fallback UI
```ts
// Good: Explicit loading state
<React.Suspense fallback={<PageLoader />}>
  <Outlet />
</React.Suspense>

// PageLoader shows skeleton or spinner
export function PageLoader() {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="animate-spin h-8 w-8 border-t-2 border-blue-500 rounded-full" />
    </div>
  );
}
```

## Route State Management

### Query string for UI state
```ts
// Good: Use query params for filters, pagination
const useQueryString = (key: string): [string, (value: string) => void] => {
  const [params, setParams] = useSearchParams();
  const value = params.get(key) ?? '';
  
  const setValue = (newValue: string) => {
    const newParams = new URLSearchParams(params);
    newParams.set(key, newValue);
    setParams(newParams);
  };
  
  return [value, setValue];
};

// Usage
export function OrdersList() {
  const [sortBy, setSortBy] = useQueryString('sort');
  const [page, setPage] = useQueryString('page');
  
  return (
    <div>
      <Select value={sortBy} onChange={(e) => setSortBy(e.currentTarget.value)}>
        <option value="date">Date</option>
        <option value="price">Price</option>
      </Select>
      <Pagination current={Number(page)} onChange={(p) => setPage(String(p))} />
    </div>
  );
}
```

### Route-level data loading (React Router 6.4+)
```ts
// Good: Use loaders to fetch data before rendering route
const orderLoader = async ({ params }: { params: { id: string } }) => {
  const order = await fetchOrder(params.id);
  if (!order) throw new Response('Order not found', { status: 404 });
  return order;
};

export const ordersRoutes = {
  path: '/orders',
  children: [
    {
      path: ':id',
      element: <OrderDetail />,
      loader: orderLoader,
    },
  ],
};

// In component
export function OrderDetail() {
  const order = useLoaderData() as Order;
  return <div>{order.id}</div>;
}
```

## Navigation Patterns

### Programmatic navigation
```ts
// Good: Use useNavigate hook
export function LoginForm() {
  const navigate = useNavigate();
  
  const handleSubmit = async (credentials) => {
    await login(credentials);
    navigate('/dashboard', { replace: true });
  };
  
  return <form onSubmit={handleSubmit}>...</form>;
}
```

### Scroll restoration
```ts
// Good: Reset scroll on route change
export function ScrollToTop() {
  const { pathname } = useLocation();
  
  React.useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  
  return null;
}

// Usage
<ScrollToTop />
<Routes>...</Routes>
```

### Breadcrumbs
```ts
// Good: Dynamic breadcrumbs from route
export function Breadcrumbs() {
  const location = useLocation();
  const segments = location.pathname.split('/').filter(Boolean);
  
  return (
    <nav>
      <Link to="/">Home</Link>
      {segments.map((segment, idx) => (
        <React.Fragment key={segment}>
          <span>/</span>
          <Link to={`/${segments.slice(0, idx + 1).join('/')}`}>
            {segment}
          </Link>
        </React.Fragment>
      ))}
    </nav>
  );
}
```

## Meta Management

### Document head (title, meta tags)
```ts
// Good: Update on route change
import { Helmet } from 'react-helmet-async';

export function OrderDetail() {
  const order = useLoaderData() as Order;
  
  return (
    <>
      <Helmet>
        <title>Order #{order.id} - YaVoy</title>
        <meta name="description" content={`Order details for ${order.id}`} />
      </Helmet>
      <div>{order.id}</div>
    </>
  );
}
```

## Performance Monitoring

```bash
# Check route performance
pnpm run build -- --profile  # Analyze bundle size per route
pnpm run analyze             # Check code splitting effectiveness
```

## Verification

```bash
pnpm test                    # Route tests (navigation, loaders)
pnpm lint                    # Route config linting
npm run build                # Check for warnings
```
