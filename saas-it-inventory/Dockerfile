# Build stage
FROM node:18 AS builder

# Set the working directory
WORKDIR /usr/src/app

# Install system dependencies for canvas
RUN apt-get update && apt-get install -y \
    build-essential \
    libcairo2-dev \
    libpango1.0-dev \
    libjpeg-dev \
    libgif-dev \
    librsvg2-dev \
    && rm -rf /var/lib/apt/lists/*

# Print Node.js and npm versions
RUN echo "Node.js version: $(node -v)" && echo "npm version: $(npm -v)"

# Copy package.json and package-lock.json
COPY package*.json ./

# Print package.json contents
RUN echo "Contents of package.json:" && cat package.json

# Install dependencies
RUN npm ci --verbose

# Print installed packages
RUN echo "Installed packages:" && npm list --depth=0

# Copy the rest of the application code
COPY . .

# Print list of files
RUN echo "Files in the current directory:" && ls -la

# Production stage
FROM node:18

# Set the working directory
WORKDIR /usr/src/app

# Install system dependencies and build tools for canvas
RUN apt-get update && apt-get install -y \
    build-essential \
    libcairo2-dev \
    libpango1.0-dev \
    libjpeg-dev \
    libgif-dev \
    librsvg2-dev \
    python3 \
    && rm -rf /var/lib/apt/lists/*

# Copy package.json and package-lock.json
COPY package*.json ./

# Install production dependencies and run postinstall script
RUN npm ci --only=production --verbose && npm run postinstall

# Copy built node modules and compiled code from the build stage
COPY --from=builder /usr/src/app .

# Create a non-root user
RUN groupadd -g 1001 nodejs
RUN useradd -u 1001 -g nodejs -s /bin/bash -m nodejs

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
