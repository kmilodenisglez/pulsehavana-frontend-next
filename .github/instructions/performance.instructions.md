# Performance Rules

Load this when optimizing bundle size, render performance, or investigating slow pages.

## Bundle Size Optimization

### Code splitting at route level
```ts
// Good: Lazy load routes to split bundle
const HomePage = React.lazy(() => import('./pages/HomePage'));
const OrdersPage = React.lazy(() => import('./pages/OrdersPage'));

// Creates separate chunks: home.js, orders.js
```

### Monitor bundle size
```bash
# Analyze what's in bundle
npm run build -- --profile

# Use source-map-explorer
pnpm add -D source-map-explorer
npm run build && npx source-map-explorer 'dist/**/*.js'
```

### Remove large dependencies
```ts
// Bad: Lodash pulls in 70KB
import { debounce } from 'lodash-es';

// Good: Use native or lightweight alternative
export function debounce<T extends (...args: unknown[]) => void>(
  func: T,
  delay: number
): T {
  let timeoutId: NodeJS.Timeout;
  return ((...args) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func(...args), delay);
  }) as T;
}

// Or use prebuilt lightweight library
import pDebounce from 'p-debounce'; // 500B vs lodash 70KB
```

### Tree-shaking friendly imports
```ts
// Good: Named imports (tree-shaking works)
import { Button, Input } from '@ui/components';

// Bad: Default import (entire module included)
import * as UI from '@ui/components';
const { Button, Input } = UI;
```

## Render Performance

### Memoization

#### React.memo for expensive components
```ts
// Good: Prevent re-render when props unchanged
interface OrderItemProps {
  order: Order;
}

export const OrderItem = React.memo(function OrderItem({ order }: OrderItemProps) {
  return <div>{order.id} - ${order.total}</div>;
});

// Only re-renders if order object reference changes
```

#### useMemo for derived state
```ts
// Good: Cache derived computations
const OrderList = ({ orders }: { orders: Order[] }) => {
  const activeOrders = React.useMemo(
    () => orders.filter(o => o.status === 'active'),
    [orders]
  );
  
  return <div>{activeOrders.length}</div>;
};
```

#### useCallback for stable callbacks
```ts
// Good: Stable callback reference across renders
const OrderList = ({ onSelectOrder }: { onSelectOrder: (id: string) => void }) => {
  const handleClick = React.useCallback((id: string) => {
    onSelectOrder(id);
  }, [onSelectOrder]);
  
  return (
    <div>
      {orders.map(order => (
        <button key={order.id} onClick={() => handleClick(order.id)}>
          {order.id}
        </button>
      ))}
    </div>
  );
};
```

### Virtualization for long lists

```ts
// Good: Render only visible items (50+ items)
import { FixedSizeList } from 'react-window';

export function OrdersList({ orders }: { orders: Order[] }) {
  return (
    <FixedSizeList
      height={600}
      itemCount={orders.length}
      itemSize={60}
      width="100%"
    >
      {({ index, style }) => (
        <div style={style}>
          {orders[index].id}
        </div>
      )}
    </FixedSizeList>
  );
}
```

### Suspense for data loading
```ts
// Good: Show fallback while loading
<React.Suspense fallback={<Skeleton />}>
  <OrderDetail orderId={id} />
</React.Suspense>

// OrderDetail component
function OrderDetail({ orderId }: { orderId: string }) {
  const order = use(fetchOrder(orderId)); // Throws promise while loading
  return <div>{order.id}</div>;
}
```

## Network Optimization

### Preload critical resources
```ts
// Good: Preload resources in head
<link rel="preload" href="/fonts/inter.woff2" as="font" type="font/woff2" crossOrigin />
<link rel="prefetch" href="/chunks/dashboard.js" />
```

### Resource hints for prefetch
```ts
// Good: Prefetch next likely route on hover
<Link
  to="/orders"
  onMouseEnter={() => {
    const link = document.createElement('link');
    link.rel = 'prefetch';
    link.href = '/chunks/orders.js';
    document.head.appendChild(link);
  }}
>
  Orders
</Link>
```

### Cache strategy
```ts
// Good: Implement service worker for offline
// See Workbox or react-pwa for setup
```

## CSS Performance

### Avoid unused CSS
```ts
// Good: Use Tailwind's content array to purge unused styles
// tailwind.config.js
module.exports = {
  content: ['./src/**/*.{jsx,tsx}'],
};
```

### CSS-in-JS with zero runtime
```ts
// Good: Use vanilla-extract or similar (no runtime)
import { style } from '@vanilla-extract/css';

export const buttonStyle = style({
  padding: '8px 16px',
  backgroundColor: '#007bff',
});

// Bad: Runtime CSS-in-JS adds 15-30KB
const buttonStyle = css`
  padding: 8px 16px;
`;
```

## Image Optimization

### Use modern formats with fallbacks
```tsx
// Good: Modern image formats
<picture>
  <source srcSet="/image.webp" type="image/webp" />
  <source srcSet="/image.jpg" type="image/jpeg" />
  <img src="/image.jpg" alt="Description" loading="lazy" />
</picture>
```

### Lazy load images
```tsx
// Good: Native lazy loading
<img src="/image.jpg" alt="Description" loading="lazy" />

// Or use Intersection Observer for custom behavior
```

## Monitoring

### Lighthouse CI
```bash
# Generate Lighthouse report
npm run build
npm run serve & 
npx lighthouse http://localhost:3000 --view
```

### Web Vitals tracking
```ts
// Good: Monitor Core Web Vitals
import { getCLS, getFID, getFCP, getLCP, getTTFB } from 'web-vitals';

getCLS(console.log); // Cumulative Layout Shift
getFID(console.log); // First Input Delay
getLCP(console.log); // Largest Contentful Paint
getTTFB(console.log); // Time to First Byte
```

### Performance timeline
```ts
// Good: Mark performance metrics
performance.mark('order-load-start');
// ... fetch data ...
performance.mark('order-load-end');
performance.measure('order-load', 'order-load-start', 'order-load-end');

const measure = performance.getEntriesByName('order-load')[0];
console.log(`Order load took ${measure.duration}ms`);
```

## Common Performance Issues

| Issue | Symptom | Fix |
|---|---|---|
| Large bundle | Slow initial load | Code split, remove dependencies |
| Unnecessary re-renders | Jank during interaction | React.memo, useMemo, useCallback |
| Unoptimized images | Slow pages | WebP, lazy loading, compression |
| Network waterfalls | Slow data fetching | Parallel requests, caching |
| Uncompressed JS | Large transfer | Enable gzip in server config |

## Verification

```bash
npm run build --profile       # Check bundle composition
npm run analyze               # Analyze bundle
npm run lighthouse            # Run Lighthouse audit
```

## Goals

| Metric | Target |
|---|---|
| First Contentful Paint (FCP) | < 1.8s |
| Largest Contentful Paint (LCP) | < 2.5s |
| Cumulative Layout Shift (CLS) | < 0.1 |
| Time to Interactive (TTI) | < 3.8s |
| JavaScript bundle (gzipped) | < 200KB per route |
| Performance score (Lighthouse) | 90+ |
