#!/bin/bash

set -e

# Function to display error messages
error() {
    echo "Error: $1" >&2
    exit 1
}

# Function to check if a command exists
command_exists() {
    command -v "$1" >/dev/null 2>&1
}

# Check if Docker is running
if ! docker info >/dev/null 2>&1; then
    error "Docker is not running. Please start Docker and try again."
fi

# Check if the application containers are running
if ! docker-compose ps | grep -q "Up"; then
    error "Application containers are not running. Please run 'docker-compose up -d' and try again."
fi

# Test backend API
echo "Testing backend API..."
if curl -sSf "http://localhost:3000/api/health" > /dev/null; then
    echo "Backend API is accessible."
else
    error "Backend API is not accessible. Please check the logs and try again."
fi

# Test frontend
echo "Testing frontend..."
if curl -sSf "http://localhost" > /dev/null; then
    echo "Frontend is accessible."
else
    error "Frontend is not accessible. Please check the logs and try again."
fi

# Test database connection
echo "Testing database connection..."
if docker-compose exec -T mongo mongo --eval "db.runCommand({ping:1})" >/dev/null; then
    echo "Database connection successful."
else
    error "Database connection failed. Please check the MongoDB container and connection settings."
fi

# Test email configuration
echo "Testing email configuration..."
if docker-compose exec -T backend npm run test:email; then
    echo "Email configuration is correct."
else
    error "Email configuration test failed. Please check your SMTP settings in the .env file."
fi

# Test Stripe configuration
echo "Testing Stripe configuration..."
if docker-compose exec -T backend npm run test:stripe; then
    echo "Stripe configuration is correct."
else
    error "Stripe configuration test failed. Please check your Stripe API keys in the .env file."
fi

echo "All tests passed successfully!"
echo "Your SaaS IT Inventory Application is installed and configured correctly."
echo "You can now start using the application at http://localhost"
