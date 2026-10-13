# Backend Integration Rules (Laravel API)

Load this when calling Laravel APIs, handling responses, authentication, or error management.

## API Configuration

### Base URL and environment
```ts
// Good: Centralized API client
const API_BASE_URL = import.meta.env.VITE_APP_API_URL || 'http://localhost:8000/api';

export const apiClient = {
  baseURL: API_BASE_URL,
  defaultHeaders: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
};
```

### Request interceptor for authentication
```ts
// Good: Auto-attach token to all requests
export async function apiCall<T>(
  endpoint: string,
  options?: RequestInit
): Promise<T> {
  const token = localStorage.getItem('authToken');
  
  const headers: HeadersInit = {
    ...apiClient.defaultHeaders,
    ...(options?.headers || {}),
  };
  
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }
  
  const response = await fetch(`${apiClient.baseURL}${endpoint}`, {
    ...options,
    headers,
  });
  
  if (response.status === 401) {
    localStorage.removeItem('authToken');
    window.location.href = '/login'; // Redirect to login
  }
  
  if (!response.ok) {
    throw new APIError(response.statusText, response.status, await response.text());
  }
  
  return response.json() as Promise<T>;
}
```

## Response Validation

### Use Zod for type safety
```ts
// Good: Validate API responses at boundary
import { z } from 'zod';

const OrderSchema = z.object({
  id: z.string().uuid(),
  total: z.number().min(0),
  status: z.enum(['pending', 'completed', 'cancelled']),
  items: z.array(z.object({
    id: z.string(),
    name: z.string(),
    price: z.number(),
  })),
});

type Order = z.infer<typeof OrderSchema>;

export async function fetchOrder(id: string): Promise<Order> {
  const data = await apiCall(`/orders/${id}`);
  return OrderSchema.parse(data); // Validates and returns typed data
}

// Graceful error handling
export async function fetchOrderSafe(id: string): Promise<Order | null> {
  try {
    return await fetchOrder(id);
  } catch (error) {
    if (error instanceof z.ZodError) {
      console.error('Invalid order data:', error.issues);
    }
    return null;
  }
}
```

### Custom error type
```ts
// Good: Typed errors
export class APIError extends Error {
  constructor(
    message: string,
    public statusCode: number,
    public responseText: string
  ) {
    super(message);
    this.name = 'APIError';
  }
}

// Usage
try {
  await apiCall('/orders');
} catch (error) {
  if (error instanceof APIError && error.statusCode === 404) {
    console.log('Order not found');
  }
}
```

## Common Patterns

### GET with caching
```ts
// Good: Cache GET responses
const cache = new Map<string, { data: unknown; timestamp: number }>();
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes

async function cachedGet<T>(endpoint: string): Promise<T> {
  const cached = cache.get(endpoint);
  const now = Date.now();
  
  if (cached && now - cached.timestamp < CACHE_TTL) {
    return cached.data as T;
  }
  
  const data = await apiCall<T>(endpoint);
  cache.set(endpoint, { data, timestamp: now });
  return data;
}
```

### POST with optimistic update
```ts
// Good: Optimistic UI update
export async function completeOrder(orderId: string) {
  // Optimistic update
  setOrder(prev => ({
    ...prev,
    status: 'completed',
  }));
  
  try {
    const result = await apiCall(`/orders/${orderId}/complete`, {
      method: 'POST',
    });
    setOrder(result); // Confirm with server response
  } catch (error) {
    // Rollback on error
    setOrder(prev => ({
      ...prev,
      status: 'pending',
    }));
    showError('Failed to complete order');
  }
}
```

### Retry logic for idempotent requests
```ts
// Good: Retry with exponential backoff (GET, PUT, DELETE)
async function apiCallWithRetry<T>(
  endpoint: string,
  options?: RequestInit,
  retries = 3
): Promise<T> {
  try {
    return await apiCall<T>(endpoint, options);
  } catch (error) {
    if (retries > 0 && isRetryableError(error)) {
      const delay = Math.pow(2, 3 - retries) * 1000; // 1s, 2s, 4s
      await new Promise(resolve => setTimeout(resolve, delay));
      return apiCallWithRetry<T>(endpoint, options, retries - 1);
    }
    throw error;
  }
}

function isRetryableError(error: unknown): boolean {
  if (!(error instanceof APIError)) return false;
  return [408, 429, 500, 502, 503, 504].includes(error.statusCode);
}
```

### Rate limiting user actions
```ts
// Good: Debounce rapid API calls
import { debounce } from 'lodash-es';

export function useDebounceApiCall<T>(
  asyncFn: () => Promise<T>,
  delay = 500
) {
  return React.useMemo(
    () => debounce(asyncFn, delay),
    [asyncFn, delay]
  );
}

// Usage
const handleSearch = useDebounceApiCall(async () => {
  const results = await apiCall<SearchResults>(`/search?q=${query}`);
  setResults(results);
});

<input onChange={(e) => { setQuery(e.currentTarget.value); handleSearch(); }} />
```

## Pagination

### Cursor-based (preferred for large datasets)
```ts
// Good: Cursor-based pagination
export async function fetchOrders(cursor?: string) {
  const params = new URLSearchParams();
  if (cursor) params.set('cursor', cursor);
  
  return apiCall<{ items: Order[]; nextCursor?: string }>(
    `/orders?${params}`
  );
}
```

### Offset-based (if Laravel uses this)
```ts
// Good: Offset-based pagination
export async function fetchOrders(page = 1, perPage = 20) {
  return apiCall<{
    data: Order[];
    total: number;
    per_page: number;
    current_page: number;
  }>(
    `/orders?page=${page}&per_page=${perPage}`
  );
}
```

## File Uploads

### Multipart form data
```ts
// Good: Handle file uploads
export async function uploadOrderReceipt(
  orderId: string,
  file: File
): Promise<{ url: string }> {
  const formData = new FormData();
  formData.append('receipt', file);
  
  const token = localStorage.getItem('authToken');
  
  const response = await fetch(
    `${apiClient.baseURL}/orders/${orderId}/receipt`,
    {
      method: 'POST',
      headers: {
        ...(token && { Authorization: `Bearer ${token}` }),
      },
      body: formData, // Don't set Content-Type; let browser handle multipart
    }
  );
  
  if (!response.ok) throw new APIError(response.statusText, response.status, '');
  
  return response.json();
}
```

## Error Logging

### Structured logging for debugging
```ts
// Good: Log API errors with context
function logAPIError(error: APIError, context: { endpoint: string; method: string }) {
  console.error({
    timestamp: new Date().toISOString(),
    error: error.message,
    statusCode: error.statusCode,
    context,
  });
}

// Usage
try {
  await apiCall('/orders');
} catch (error) {
  if (error instanceof APIError) {
    logAPIError(error, { endpoint: '/orders', method: 'GET' });
  }
}
```

## Verification

```bash
pnpm test                    # API integration tests
pnpm run build               # Check for unused API calls
```
