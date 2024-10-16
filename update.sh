#!/bin/bash

# Function to check if a command exists
command_exists() {
    command -v "$1" >/dev/null 2>&1
}

# Check if git is installed
if ! command_exists git; then
    echo "Error: git is not installed. Please install git and try again."
    exit 1
fi

# Navigate to the project directory
cd "$(dirname "$0")" || exit

# Fetch the latest changes from the remote repository
echo "Fetching latest changes from the remote repository..."
git fetch origin

# Check if there are any updates
if [ "$(git rev-parse HEAD)" != "$(git rev-parse @{u})" ]; then
    echo "Updates are available. Pulling latest changes..."
    git pull origin main

    # Check if npm is installed
    if command_exists npm; then
        echo "Updating npm packages..."
        npm install

        # Update frontend packages
        if [ -d "saas-it-inventory-frontend" ]; then
            echo "Updating frontend packages..."
            cd saas-it-inventory-frontend || exit
            npm install
            cd ..
        fi
    else
        echo "Warning: npm is not installed. Skipping package updates."
    fi

    # Restart services (you may need to modify this based on your setup)
    echo "Restarting services..."
    docker-compose down
    docker-compose up -d

    echo "Update completed successfully!"
else
    echo "Your project is already up to date."
fi
