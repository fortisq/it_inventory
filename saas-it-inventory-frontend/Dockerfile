# Build stage
FROM node:20-alpine AS build

# Set working directory
WORKDIR /app

# Set environment variable for legacy OpenSSL provider
ENV NODE_OPTIONS=--openssl-legacy-provider

# Update npm to the latest version and print versions
RUN npm install -g npm@latest && \
    echo "Node.js version: $(node -v)" && \
    echo "npm version: $(npm -v)"

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install
RUN npm install @types/node

# Copy the rest of the application code
COPY . .

# Build the application with verbose output
ARG REACT_APP_API_URL
ENV REACT_APP_API_URL=$REACT_APP_API_URL
RUN npm run build -- --verbose

# Production stage
FROM nginx:1.21-alpine

# Copy nginx configuration
COPY nginx.conf /etc/nginx/nginx.conf

# Copy the build output to replace the default nginx contents
COPY --from=build /app/build /usr/share/nginx/html

# Create necessary directories and set permissions
RUN mkdir -p /var/log/nginx /var/cache/nginx && \
    chown -R nginx:nginx /var/log/nginx /var/cache/nginx /usr/share/nginx/html && \
    chmod -R 755 /var/log/nginx /var/cache/nginx /usr/share/nginx/html

# Switch to non-root user
USER nginx

# Expose port 80
EXPOSE 80

# Start nginx
CMD ["nginx", "-g", "daemon off;"]
