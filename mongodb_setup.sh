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
wget -qO - https://www.mongodb.org/static/pgp/server-5.0.asc | sudo apt-key adv --keyserver keyserver.ubuntu.com --recv-keys 656408E390CFB1F5

# Add MongoDB repository
log "Adding MongoDB repository..."
echo "deb [ arch=amd64,arm64 ] https://repo.mongodb.org/apt/ubuntu focal/mongodb-org/5.0 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-5.0.list

# Update package lists again
log "Updating package lists..."
sudo apt-get update

log "MongoDB setup completed successfully."
