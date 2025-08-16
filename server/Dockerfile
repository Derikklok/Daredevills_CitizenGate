# Use Node.js 20 Alpine as base image
FROM node:20-alpine AS base

# Install pnpm globally
RUN npm install -g pnpm

# Set working directory
WORKDIR /app

# Copy package files
COPY package.json pnpm-lock.yaml ./

# Install dependencies
RUN pnpm install --frozen-lockfile

# Copy source code
COPY . .

# Build stage
FROM base AS build

# Build the application
RUN pnpm run build

# Production stage
FROM node:20-alpine AS production

# Install pnpm globally
RUN npm install -g pnpm

# Create app directory
WORKDIR /app

# Copy package files
COPY package.json pnpm-lock.yaml ./

# Install only production dependencies
RUN pnpm install --frozen-lockfile --prod

# Copy built application from build stage
COPY --from=build /app/dist ./dist

# Create non-root user
RUN addgroup -g 1001 -S nodejs
RUN adduser -S nestjs -u 1001

# Change ownership of the app directory
RUN chown -R nestjs:nodejs /app
USER nestjs

# Expose port 3000
EXPOSE 3000

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD node healthcheck.js

# Start the application
CMD ["pnpm", "run", "start:prod"]

# Development stage
FROM base AS development

# Expose port 3000
EXPOSE 3000

# Start development server
CMD ["pnpm", "run", "start:dev"]
