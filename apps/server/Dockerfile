FROM node:20-alpine AS builder

WORKDIR /app

# Install pnpm
RUN npm install -g pnpm

# Copy root package files
COPY package.json pnpm-workspace.yaml pnpm-lock.yaml ./

# Copy all workspace packages
COPY packages/ packages/
COPY apps/server/ apps/server/

# Install dependencies
RUN pnpm install --frozen-lockfile

# Build shared packages first
WORKDIR /app/packages/types
RUN pnpm build

WORKDIR /app/packages/utils
RUN pnpm build

# Build the server
WORKDIR /app/apps/server
RUN pnpm build

# Production stage
FROM node:20-alpine

WORKDIR /app

# Install pnpm
RUN npm install -g pnpm

# Copy all necessary files for production
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/pnpm-workspace.yaml ./pnpm-workspace.yaml
COPY --from=builder /app/pnpm-lock.yaml ./pnpm-lock.yaml
COPY --from=builder /app/packages/types/package.json ./packages/types/package.json
COPY --from=builder /app/packages/types/dist ./packages/types/dist
COPY --from=builder /app/packages/utils/package.json ./packages/utils/package.json
COPY --from=builder /app/packages/utils/dist ./packages/utils/dist
COPY --from=builder /app/apps/server/package.json ./apps/server/package.json
COPY --from=builder /app/apps/server/dist ./apps/server/dist
COPY --from=builder /app/apps/server/drizzle.config.ts ./apps/server/drizzle.config.ts
COPY --from=builder /app/apps/server/src/schema.ts ./apps/server/src/schema.ts

# Install production dependencies only
RUN cd apps/server && pnpm install --prod --frozen-lockfile

WORKDIR /app/apps/server

EXPOSE 3000

CMD ["node", "dist/index.js"]
