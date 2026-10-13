# Environment and Setup Rules

Load this when setting up Node environment, npm/pnpm/yarn issues, or troubleshooting installation.

## Activation & Setup

### Using pnpm (preferred for monorepos)
```bash
# Install (one-time)
pnpm install

# Activate shell
eval $(pnpm env use -g 18)

# Run dev server
pnpm dev
```

### Using npm
```bash
npm install
npm run dev
```

### Verify Node version
```bash
node --version  # Should be 18+
npm --version
```

## Virtual Environments (if using Python-based tools)
Not typically needed for Node.js projects. If using Python tools (e.g., Ruff for linting):
```bash
python -m venv venv
source venv/bin/activate  # Unix/Mac
# or
venv\Scripts\activate  # Windows
```

## Environment Variables

Check `.env.example` exists. Create `.env.local` for development:
```bash
cp .env.example .env.local
# Update VITE_APP_API_URL, other secrets
```

## Troubleshooting

| Issue | Fix |
|---|---|
| `node_modules` corrupted | `rm -rf node_modules pnpm-lock.yaml && pnpm install` |
| Port 5173 already in use | `pnpm dev -- --port 5174` |
| TypeScript errors not clearing | `pnpm exec tsc --noEmit` then restart IDE |
| Stale cache | `pnpm store prune && pnpm install` |
