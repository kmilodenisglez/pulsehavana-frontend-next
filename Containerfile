# syntax=docker/dockerfile:1

# ============================================================================
#  Pulse Havana Center Cell — frontend production image
#  Stack: Node 22 + Next.js, served with `next start` behind an Nginx reverse
#  proxy (see deploy/nginx.conf). Build: `podman build -t phc-frontend .`
#  NOTE: this app is verified on Netlify with `cacheComponents`, so we do NOT
#  set `output: "standalone"` here. Once Netlify is retired, standalone is the
#  recommended follow-up (smaller image, run `node server.js`).
# ============================================================================

# --- deps: full install (dev deps are required to build) --------------------
FROM node:22-alpine AS deps
WORKDIR /app
RUN apk add --no-cache libc6-compat
COPY package.json package-lock.json ./
RUN npm ci

# --- build: compile the Next.js app -----------------------------------------
FROM node:22-alpine AS build
WORKDIR /app
RUN apk add --no-cache libc6-compat
ENV NEXT_TELEMETRY_DISABLED=1
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npm run build

# --- runner: lean production image running `next start` ---------------------
FROM node:22-alpine AS runner
WORKDIR /app
RUN apk add --no-cache libc6-compat

ENV NODE_ENV=production \
    NEXT_TELEMETRY_DISABLED=1 \
    PORT=3000 \
    HOSTNAME=0.0.0.0

# Run as a non-root user.
RUN addgroup -g 1001 -S nodejs && adduser -S nextjs -u 1001

# Production dependencies only.
COPY package.json package-lock.json ./
RUN npm ci --omit=dev && npm cache clean --force

# Build output + runtime config.
COPY --from=build --chown=nextjs:nodejs /app/.next ./.next
COPY --from=build --chown=nextjs:nodejs /app/public ./public
COPY --from=build --chown=nextjs:nodejs /app/next.config.ts ./next.config.ts

USER nextjs
EXPOSE 3000

CMD ["npm", "run", "start"]
