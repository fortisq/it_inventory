# Build stage
FROM node:18-alpine AS builder

# Set the working directory
WORKDIR /usr/src/app

# Install build dependencies
RUN apk add --no-cache build-base cairo-dev pango-dev jpeg-dev giflib-dev librsvg-dev python3 make g++

# Print Node.js and npm versions
RUN echo "Node.js version: $(node -v)" && echo "npm version: $(npm -v)"

# Copy package.json and package-lock.json
COPY package*.json ./

# Print package.json contents
RUN echo "Contents of package.json:" && cat package.json

# Install dependencies
RUN npm install --verbose

# Print installed packages
RUN echo "Installed packages:" && npm list --depth=0

# Copy the rest of the application code
COPY . .

# Print list of files
RUN echo "Files in the current directory:" && ls -la

# Production stage
FROM node:18-alpine

# Set the working directory
WORKDIR /usr/src/app

# Install runtime dependencies
RUN apk add --no-cache cairo pango jpeg giflib librsvg

# Copy package.json and package-lock.json
COPY package*.json ./

# Install production dependencies
RUN npm ci --only=production --verbose

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

# Start the application with logging
CMD echo "Starting server..." && \
    echo "Environment variables:" && \
    env && \
    echo "Current directory contents:" && \
    ls -la && \
    node server.js
