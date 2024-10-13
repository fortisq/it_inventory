#!/bin/bash

# URL of your health check endpoint
HEALTH_CHECK_URL="http://localhost:3000/health"

# Make a GET request to the health check endpoint
response=$(curl -s -o /dev/null -w "%{http_code}" $HEALTH_CHECK_URL)

if [ $response = "200" ]; then
    echo "Health check passed. Application is running."
    exit 0
else
    echo "Health check failed. HTTP status code: $response"
    exit 1
fi
