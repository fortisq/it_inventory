# Build stage
FROM node:18-alpine AS build

# Set working directory
WORKDIR /app

# Print Node.js and npm versions
RUN echo "=== Node.js and npm versions ===" && \
    echo "Node.js version: $(node -v)" && \
    echo "npm version: $(npm -v)"

# Copy package.json and package-lock.json
COPY package*.json .npmrc ./

# Print package.json contents
RUN echo "=== Contents of package.json ===" && \
    cat package.json

# Print .npmrc contents
RUN echo "=== Contents of .npmrc ===" && \
    cat .npmrc

# Install dependencies with verbose output and error logging
RUN echo "=== Installing dependencies ===" && \
    npm install --verbose 2>&1 | tee npm_install.log || (echo "npm install failed. Log:" && cat npm_install.log && exit 1)

# Print installed packages
RUN echo "=== Installed packages ===" && \
    npm list --depth=0

# Copy the rest of the application code
COPY . .

# Print list of files in the current directory
RUN echo "=== Files in the current directory ===" && \
    ls -la

# Build the application with verbose output and error logging
ARG REACT_APP_API_URL
ENV REACT_APP_API_URL=$REACT_APP_API_URL
RUN echo "=== Building the application ===" && \
    echo "REACT_APP_API_URL: $REACT_APP_API_URL" && \
    npm run build --verbose 2>&1 | tee npm_build.log || (echo "npm build failed. Log:" && cat npm_build.log && exit 1)

# Print list of files in the build directory
RUN echo "=== Files in the build directory ===" && \
    ls -la build

# Production stage
FROM nginx:1.21-alpine

# Install curl for healthcheck and envsubst for environment variable substitution
RUN apk add --no-cache curl gettext

# Copy nginx configuration
COPY nginx.conf /etc/nginx/nginx.conf.template

# Print nginx configuration
RUN echo "=== Nginx configuration template ===" && \
    cat /etc/nginx/nginx.conf.template

# Copy the build output to replace the default nginx contents
COPY --from=build /app/build /usr/share/nginx/html

# Print list of files in the nginx html directory
RUN echo "=== Files in nginx html directory ===" && \
    ls -la /usr/share/nginx/html

# Create a healthcheck script
RUN echo '#!/bin/sh' > /healthcheck.sh && \
    echo 'curl -f http://localhost || exit 1' >> /healthcheck.sh && \
    chmod +x /healthcheck.sh

# Print healthcheck script
RUN echo "=== Healthcheck script ===" && \
    cat /healthcheck.sh

# Expose port 80
EXPOSE 80

# Use environment variable for backend URL with a default value
ENV BACKEND_URL=http://localhost:3000

# Start nginx and enable error logging
CMD /bin/sh -c "echo '=== Starting Nginx ===' && \
    envsubst '\$BACKEND_URL' < /etc/nginx/nginx.conf.template > /etc/nginx/nginx.conf && \
    echo '=== Final Nginx configuration ===' && \
    cat /etc/nginx/nginx.conf && \
    echo '=== Nginx error log ===' && \
    nginx -g 'daemon off; error_log /dev/stdout debug;'"

# Add healthcheck
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 CMD /healthcheck.sh
