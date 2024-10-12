# Build stage
FROM node:14.17.6-alpine AS builder

# Set the working directory
WORKDIR /usr/src/app

# Copy package.json and package-lock.json
COPY package*.json ./

# Debug: Display content of package.json
RUN cat package.json

# Install all dependencies (including devDependencies)
RUN npm ci

# Copy the rest of the application code
COPY . .

# Production stage
FROM node:14.17.6-alpine

# Set the working directory
WORKDIR /usr/src/app

# Copy built node modules and compiled code from the build stage
COPY --from=builder /usr/src/app .

# Create a non-root user
RUN addgroup -g 1001 -S nodejs
RUN adduser -S nodejs -u 1001

# Set ownership and permissions
RUN chown -R nodejs:nodejs /usr/src/app
RUN chmod -R 755 /usr/src/app

# Switch to non-root user
USER nodejs

# Expose the port the app runs on
EXPOSE 3000

# Add health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
    CMD node healthcheck.js

# Start the application
CMD ["node", "server.js"]
