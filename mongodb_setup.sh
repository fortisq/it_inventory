#!/bin/bash

set -e

# Function to log messages
log() {
    echo "[$(date +'%Y-%m-%d %H:%M:%S')] $1"
}

# Function to handle errors
handle_error() {
    log "Error occurred: $1"
    exit 1
}

# Set up error handling
trap 'handle_error "$LINENO: $BASH_SOURCE[1]:${FUNCNAME[0]}: $1"' ERR

log "Starting MongoDB setup..."

# Add the libssl1.1 repository
log "Adding libssl1.1 repository..."
echo "deb http://security.ubuntu.com/ubuntu focal-security main" | sudo tee /etc/apt/sources.list.d/focal-security.list || handle_error "Failed to add libssl1.1 repository"

# Update package lists
log "Updating package lists..."
sudo apt-get update || handle_error "Failed to update package lists"

# Install libssl1.1
log "Installing libssl1.1..."
sudo apt-get install -y libssl1.1 || handle_error "Failed to install libssl1.1"

# Import the MongoDB public GPG key using gpg
log "Importing MongoDB GPG key..."
KEYRING_PATH="/usr/share/keyrings/mongodb-archive-keyring.gpg"
mkdir -p /usr/share/keyrings
wget -qO - https://www.mongodb.org/static/pgp/server-5.0.asc | sudo gpg --dearmor > "$KEYRING_PATH" || handle_error "Failed to import MongoDB GPG key"

# Add MongoDB repository with explicit keyring
log "Adding MongoDB repository..."
sudo sh -c 'echo "deb [ arch=amd64,arm64 signed-by="/usr/share/keyrings/mongodb-archive-keyring.gpg" ] https://repo.mongodb.org/apt/ubuntu focal/mongodb-org/5.0 multiverse" > /etc/apt/sources.list.d/mongodb-org-5.0.list' || handle_error "Failed to add MongoDB repository"

# Update package lists again
log "Updating package lists..."
sudo apt-get update || handle_error "Failed to update package lists"

# Install MongoDB
log "Installing MongoDB..."
sudo apt-get install -y mongodb-org || handle_error "Failed to install MongoDB"

# Start MongoDB service
log "Starting MongoDB service..."
sudo systemctl start mongod || handle_error "Failed to start MongoDB service"
sudo systemctl enable mongod || handle_error "Failed to enable MongoDB service"

# Check MongoDB status
log "Checking MongoDB status..."
if sudo systemctl is-active --quiet mongod; then
    log "MongoDB is running."
else
    log "Error: MongoDB is not running. Please check the logs for more information."
    exit 1
fi

log "MongoDB setup completed successfully."
