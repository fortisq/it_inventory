#!/bin/bash

set -e

# Function to log messages
log() {
    echo "[$(date +'%Y-%m-%d %H:%M:%S')] $1"
}

# Function to handle errors
handle_error() {
    log "Error occurred in line $1"
    exit 1
}

# Set up error handling
trap 'handle_error $LINENO' ERR

log "Starting MongoDB setup..."

# Add the libssl1.1 repository
log "Adding libssl1.1 repository..."
echo "deb http://security.ubuntu.com/ubuntu focal-security main" | sudo tee /etc/apt/sources.list.d/focal-security.list

# Update package lists
log "Updating package lists..."
sudo apt-get update

# Install libssl1.1
log "Installing libssl1.1..."
sudo apt-get install -y libssl1.1

# Import the MongoDB public GPG key
log "Importing MongoDB GPG key..."
wget -qO - https://www.mongodb.org/static/pgp/server-5.0.asc | sudo apt-key add -

# Verify the key has been added
if sudo apt-key list | grep -q "MongoDB 5.0"; then
    log "MongoDB GPG key successfully imported."
else
    log "Error: Failed to import MongoDB GPG key."
    exit 1
fi

# Add MongoDB repository
log "Adding MongoDB repository..."
echo "deb [ arch=amd64,arm64 ] https://repo.mongodb.org/apt/ubuntu focal/mongodb-org/5.0 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-5.0.list

# Update package lists again
log "Updating package lists..."
if ! sudo apt-get update; then
    log "Error: Failed to update package lists. Check your internet connection and repository configuration."
    exit 1
fi

# Install MongoDB
log "Installing MongoDB..."
if ! sudo apt-get install -y mongodb-org; then
    log "Error: Failed to install MongoDB. Please check the above output for more details."
    exit 1
fi

# Start MongoDB service
log "Starting MongoDB service..."
sudo systemctl start mongod
sudo systemctl enable mongod

# Check MongoDB status
log "Checking MongoDB status..."
if sudo systemctl is-active --quiet mongod; then
    log "MongoDB is running."
else
    log "Error: MongoDB is not running. Please check the logs for more information."
    exit 1
fi

log "MongoDB setup completed successfully."
