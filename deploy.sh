#!/bin/bash

# Exit on error
set -e

echo "Deploying IT Inventory Management System..."

# Pull latest changes
git pull origin main

# Install backend dependencies
echo "Installing backend dependencies..."
cd saas-it-inventory
npm install

# Install frontend dependencies
echo "Installing frontend dependencies..."
cd ../saas-it-inventory-frontend
npm install

# Build frontend
echo "Building frontend..."
npm run build

# Copy frontend build to backend public folder
echo "Copying frontend build to backend..."
rm -rf ../saas-it-inventory/public
cp -r build ../saas-it-inventory/public

# Start or restart backend server using PM2
echo "Starting/restarting backend server..."
cd ../saas-it-inventory
pm2 restart server.js || pm2 start server.js --name "it-inventory-backend"

echo "Deployment completed successfully!"
