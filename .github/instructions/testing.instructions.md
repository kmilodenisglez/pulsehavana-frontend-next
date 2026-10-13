# Testing Rules

Load this when writing unit/integration/E2E tests, setting up test environment, or troubleshooting test failures.

## Test Structure

### Unit tests (Vitest + React Testing Library)
```ts
// Good: Test component behavior, not implementation
import { render, screen, userEvent } from '@testing-library/react';
import { LoginForm } from './LoginForm';

describe('LoginForm', () => {
  it('submits form with email and password', async () => {
    const handleSubmit = vi.fn();
    
    render(<LoginForm onSubmit={handleSubmit} />);
    
    await userEvent.type(screen.getByRole('textbox', { name: /email/i }), 'test@example.com');
    await userEvent.type(screen.getByLabelText(/password/i), 'password123');
    await userEvent.click(screen.getByRole('button', { name: /login/i }));
    
    expect(handleSubmit).toHaveBeenCalledWith({
      email: 'test@example.com',
      password: 'password123',
    });
  });
  
  it('shows error message on invalid email', async () => {
    render(<LoginForm />);
    
    await userEvent.type(screen.getByRole('textbox', { name: /email/i }), 'invalid');
    await userEvent.click(screen.getByRole('button', { name: /login/i }));
    
    expect(screen.getByText(/invalid email/i)).toBeInTheDocument();
  });
});
```

### Component snapshot testing (use sparingly)
```ts
// OK: Snapshot for stable UI components (not frequently changing)
import { render } from '@testing-library/react';
import { Button } from './Button';

it('renders button correctly', () => {
  const { container } = render(<Button variant="primary">Click me</Button>);
  expect(container.firstChild).toMatchSnapshot();
});

// Avoid: Snapshots for components that change often (defeats purpose)
```

### Mock API responses
```ts
// Good: Mock API calls
import { vi } from 'vitest';

const mockApiCall = vi.fn();

vi.mock('./api', () => ({
  apiCall: mockApiCall,
}));

it('fetches and displays orders', async () => {
  mockApiCall.mockResolvedValue({
    items: [{ id: '1', name: 'Order 1' }],
  });
  
  render(<OrdersList />);
  
  expect(await screen.findByText('Order 1')).toBeInTheDocument();
});
```

## Test Coverage Goals

| Type | Coverage | Priority |
|---|---|---|
| Components with state/logic | 80%+ | HIGH |
| Custom hooks | 90%+ | HIGH |
| API integration | 70%+ | MEDIUM |
| Utility functions | 85%+ | MEDIUM |
| CSS/styling | N/A | LOW |

## E2E Tests (Playwright)

### Critical user journeys
```ts
// Good: E2E test for order flow
import { test, expect } from '@playwright/test';

test('complete order checkout flow', async ({ page }) => {
  // Navigate to product page
  await page.goto('/products');
  await page.click('[data-testid="add-to-cart-button"]');
  
  // Go to checkout
  await page.click('[data-testid="checkout-button"]');
  
  // Fill payment form
  await page.fill('[name="email"]', 'customer@example.com');
  await page.fill('[name="card"]', '4242424242424242');
  
  // Submit
  await page.click('[data-testid="submit-button"]');
  
  // Verify success
  expect(page).toHaveURL(/\/order-confirmation/);
  expect(page.locator('text=Order confirmed')).toBeVisible();
});
```

## Test Data & Mocking

### Factory functions for test data
```ts
// Good: Use factories for consistent test data
export function createOrder(overrides?: Partial<Order>): Order {
  return {
    id: 'order-123',
    status: 'pending',
    total: 99.99,
    items: [createOrderItem()],
    ...overrides,
  };
}

export function createOrderItem(overrides?: Partial<OrderItem>): OrderItem {
  return {
    id: 'item-1',
    name: 'Product',
    price: 99.99,
    quantity: 1,
    ...overrides,
  };
}

// Usage
it('renders completed order differently', () => {
  render(<OrderDetail order={createOrder({ status: 'completed' })} />);
  expect(screen.getByText(/completed/i)).toBeInTheDocument();
});
```

### Mock server responses
```ts
// Good: Use MSW (Mock Service Worker) for API mocking
import { rest } from 'msw';
import { setupServer } from 'msw/node';

const server = setupServer(
  rest.get('/api/orders/:id', (req, res, ctx) => {
    return res(ctx.json({
      id: req.params.id,
      status: 'pending',
      total: 99.99,
    }));
  })
);

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

it('fetches order data', async () => {
  render(<OrderDetail orderId="123" />);
  expect(await screen.findByText('$99.99')).toBeInTheDocument();
});
```

## Common Patterns

### Testing async operations
```ts
// Good: Wait for async results
it('shows loading state while fetching', async () => {
  render(<OrdersList />);
  
  // Initially shows loading
  expect(screen.getByRole('status', { name: /loading/i })).toBeInTheDocument();
  
  // Wait for data to load
  expect(await screen.findByText('Order 1')).toBeInTheDocument();
});
```

### Testing error states
```ts
// Good: Test error handling
it('shows error message when API fails', async () => {
  mockApiCall.mockRejectedValue(new Error('Network error'));
  
  render(<OrdersList />);
  
  expect(await screen.findByText(/failed to load/i)).toBeInTheDocument();
});
```

### Testing user interactions
```ts
// Good: Simulate user events
it('toggles order details on click', async () => {
  render(<OrderItem order={createOrder()} />);
  
  const detailsSection = screen.queryByText(/items/i);
  expect(detailsSection).not.toBeInTheDocument();
  
  await userEvent.click(screen.getByRole('button', { name: /show details/i }));
  
  expect(screen.getByText(/items/i)).toBeInTheDocument();
});
```

## Performance Testing

### Lighthouse metrics
```bash
# Check performance scores
npm run build -- --profile
npm run analyze
```

### Component render performance
```ts
// Good: Use React DevTools Profiler
it('renders OrderList efficiently', () => {
  const { container } = render(
    <OrderList orders={Array(1000).fill(createOrder())} />
  );
  
  // Expect virtualization to render only visible items
  expect(container.querySelectorAll('[data-testid="order-item"]').length).toBeLessThan(50);
});
```

## Running Tests

```bash
# Run all tests
pnpm test

# Watch mode
pnpm test --watch

# Single file
pnpm test LoginForm.test.ts

# Coverage
pnpm test --coverage

# E2E tests
pnpm exec playwright test

# Debug E2E
pnpm exec playwright test --debug
```

## Verification

```bash
pnpm test --coverage  # Check coverage against thresholds
pnpm lint             # Lint test files
```
