# Styling Rules

Load this when working with CSS, Tailwind, responsive design, or theming.

## CSS Strategy

### Tailwind CSS (primary)
```tsx
// Good: Use Tailwind utility classes
export function Button({ variant = 'primary', children }: ButtonProps) {
  const baseClasses = 'px-4 py-2 rounded font-semibold transition-colors';
  const variantClasses = {
    primary: 'bg-blue-600 text-white hover:bg-blue-700',
    secondary: 'bg-gray-200 text-gray-800 hover:bg-gray-300',
  };
  
  return (
    <button className={`${baseClasses} ${variantClasses[variant]}`}>
      {children}
    </button>
  );
}
```

### CSS Modules (for isolated styles)
```tsx
// Good: Scoped CSS
import styles from './Button.module.css';

export function Button({ children }: ButtonProps) {
  return <button className={styles.button}>{children}</button>;
}
```

```css
/* Button.module.css */
.button {
  padding: 8px 16px;
  border-radius: 4px;
  font-weight: 600;
}

.button:hover {
  background-color: #007bff;
}
```

### Avoid global styles for component-specific styling
```css
/* Bad: Global styles cause conflicts */
button {
  padding: 8px 16px;
}

/* Good: Use BEM or scoped CSS */
.button {
  padding: 8px 16px;
}

.button__primary {
  background-color: #007bff;
}
```

## Responsive Design

### Mobile-first approach
```tsx
// Good: Start with mobile, enhance for larger screens
export function Layout() {
  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
      <Card />
      <Card />
      <Card />
    </div>
  );
}

// 1 column on mobile, 2 on tablet (md:), 3 on desktop (lg:)
```

### Breakpoints
```ts
// Standard Tailwind breakpoints
sm: 640px   // Small phones
md: 768px   // Tablets
lg: 1024px  // Laptops
xl: 1280px  // Desktops
2xl: 1536px // Large screens
```

### Container queries (for component-level responsiveness)
```tsx
// Good: Component responds to container, not viewport
<div className="@container">
  <div className="grid grid-cols-1 @md:grid-cols-2 @lg:grid-cols-3">
    {/* Adjusts based on container width, not viewport */}
  </div>
</div>
```

## Theming

### CSS Variables for theme
```tsx
// Good: Theme with CSS variables
<div style={{
  '--color-primary': isDark ? '#2563eb' : '#3b82f6',
  '--color-bg': isDark ? '#1f2937' : '#ffffff',
} as React.CSSProperties}>
  <div className="bg-[var(--color-bg)] text-[var(--color-primary)]">
    Themed content
  </div>
</div>
```

### Tailwind color customization
```js
// tailwind.config.js
module.exports = {
  theme: {
    extend: {
      colors: {
        primary: 'var(--color-primary)',
        secondary: 'var(--color-secondary)',
      },
    },
  },
};
```

## Dark Mode

### System preference detection
```tsx
// Good: Respect system preference
export function usePrefersDark(): boolean {
  const [prefersDark, setPrefersDark] = React.useState(
    window.matchMedia('(prefers-color-scheme: dark)').matches
  );
  
  React.useEffect(() => {
    const media = window.matchMedia('(prefers-color-scheme: dark)');
    const handler = (e: MediaQueryListEvent) => setPrefersDark(e.matches);
    media.addEventListener('change', handler);
    return () => media.removeEventListener('change', handler);
  }, []);
  
  return prefersDark;
}
```

### Tailwind dark mode
```tsx
// Good: Use Tailwind's dark mode class
<div className="bg-white dark:bg-gray-900 text-black dark:text-white">
  Content that adapts to dark mode
</div>
```

## Animation

### CSS animations (preferred)
```tsx
// Good: Use CSS for performance-critical animations
export function LoadingSpinner() {
  return (
    <div className="animate-spin h-8 w-8 border-t-2 border-blue-500 rounded-full" />
  );
}
```

### Framer Motion for complex animations
```tsx
// Good: Use Framer Motion for complex sequences
import { motion } from 'framer-motion';

export function OrderAnimation() {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.8 }}
    >
      Order confirmed!
    </motion.div>
  );
}
```

## Accessibility

### Color contrast
```tsx
// Good: Sufficient contrast (WCAG AA 4.5:1)
<button className="bg-blue-600 text-white">Click me</button> {/* ✓ Good contrast */}

// Bad: Insufficient contrast
<button className="bg-blue-100 text-blue-200">Click me</button> {/* ✗ Bad contrast */}
```

### Focus states
```tsx
// Good: Visible focus indicator
export function Button(props: ButtonProps) {
  return (
    <button
      className="px-4 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
      {...props}
    />
  );
}
```

### Semantic HTML
```tsx
// Good: Use semantic elements
<header>Navigation</header>
<main>Content</main>
<aside>Sidebar</aside>
<footer>Footer</footer>

// Avoid
<div id="header">Navigation</div>
<div id="main">Content</div>
```

## Performance

### Minimize CSS sent to browser
```bash
# Purge unused styles
npm run build  # Tailwind automatically removes unused CSS
```

### Critical CSS
```tsx
// Good: Inline critical CSS for above-the-fold content
<style>{`
  body { margin: 0; font-family: sans-serif; }
  .header { background: #007bff; }
`}</style>

<header className="header">Navigation</header>
```

## Verification

```bash
pnpm lint          # Check CSS linting
npm run build      # Verify CSS is purged properly
npm run lighthouse # Check accessibility scores
```
