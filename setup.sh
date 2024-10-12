#!/bin/bash

set -e

# Trap for cleanup
trap cleanup EXIT

# Logging function
log() {
    echo "[$(date +'%Y-%m-%d %H:%M:%S')] $1"
}

# Cleanup function
cleanup() {
    log "Cleaning up..."
    # Add cleanup tasks here
}

# Function to display error messages
error() {
    log "Error: $1" >&2
    exit 1
}

# Function to check if a command exists
command_exists() {
    command -v "$1" >/dev/null 2>&1
}

# Check if running as root
if [ "$(id -u)" = "0" ]; then
    error "This script should not be run as root. Please run as a normal user."
fi

# Update and upgrade the system
log "Updating and upgrading the system..."
sudo apt-get update && sudo apt-get upgrade -y || error "Failed to update and upgrade the system"

# Install Docker
if ! command_exists docker; then
    log "Installing Docker..."
    sudo apt-get install -y docker.io || error "Failed to install Docker"
else
    log "Docker is already installed. Checking version..."
    docker_version=$(docker --version | awk '{print $3}' | cut -d',' -f1)
    if [[ "$docker_version" < "20.10.0" ]]; then
        error "Docker version 20.10.0 or higher is required. Current version: $docker_version"
    fi
fi

# Install Docker Compose
if ! command_exists docker-compose; then
    log "Installing Docker Compose..."
    sudo curl -L "https://github.com/docker/compose/releases/download/1.29.2/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose || error "Failed to download Docker Compose"
    sudo chmod +x /usr/local/bin/docker-compose || error "Failed to make Docker Compose executable"
else
    log "Docker Compose is already installed. Checking version..."
    compose_version=$(docker-compose --version | awk '{print $3}' | cut -d',' -f1)
    if [[ "$compose_version" < "1.29.2" ]]; then
        error "Docker Compose version 1.29.2 or higher is required. Current version: $compose_version"
    fi
fi

# Start Docker service
log "Starting Docker service..."
sudo systemctl start docker || error "Failed to start Docker service"
sudo systemctl enable docker || error "Failed to enable Docker service"

# Add current user to docker group
log "Adding current user to docker group..."
sudo usermod -aG docker $USER || error "Failed to add user to docker group"

# Navigate to the project root directory
cd "$(dirname "$0")" || error "Failed to navigate to the project directory"

# Backup existing .env file
if [ -f .env ]; then
    log "Backing up existing .env file..."
    cp .env .env.backup.$(date +%Y%m%d%H%M%S)
fi

# Function to prompt for environment variables
prompt_env_var() {
    read -p "Enter $2 ($1): " value
    value=${value:-$3}
    echo "$1=$value" >> .env
}

# Create and configure .env file
log "Configuring environment variables..."
rm -f .env
touch .env

# Configure MongoDB
log "Configuring MongoDB..."
prompt_env_var "MONGODB_URI" "MongoDB URI" "mongodb://mongo:27017/it_inventory"

# Generate and save JWT Secret
JWT_SECRET=$(openssl rand -base64 32)
echo "JWT_SECRET=$JWT_SECRET" >> .env
log "JWT Secret generated and saved to .env"
log "WARNING: Storing secrets in .env files can be a security risk. Consider using a secret management solution in production."

# Generate and save Encryption Key for sensitive data
ENCRYPTION_KEY=$(openssl rand -base64 32)
echo "ENCRYPTION_KEY=$ENCRYPTION_KEY" >> .env
log "Encryption Key generated and saved to .env"

# Copy .env to frontend directory
log "Copying .env to frontend directory..."
cp .env saas-it-inventory-frontend/.env || error "Failed to copy .env to frontend directory"

# Install dependencies
log "Installing dependencies..."
npm ci || error "Failed to install dependencies"

# Build and start the containers
log "Building and starting Docker containers..."
docker-compose up -d --build || error "Failed to build and start Docker containers"

log "Waiting for services to start..."
sleep 10

# Validate MongoDB connection
log "Validating MongoDB connection..."
if ! docker-compose exec -T backend node -e "const mongoose = require('mongoose'); mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true }).then(() => console.log('Connected')).catch((err) => { console.error(err); process.exit(1); })"; then
    error "Failed to connect to MongoDB. Please check your MongoDB URI."
fi

log "Setup complete. Please log out and log back in for the docker group changes to take effect."
log "Your application should now be running. Access the frontend at http://localhost"

# Prompt to run database seeding script
read -p "Do you want to seed the database with initial data? (y/n) " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]
then
    docker-compose exec backend npm run seed || error "Failed to seed the database"
fi

log "Setup and configuration complete. Your SaaS IT Inventory Application is ready to use!"
log "Please review the README.md file for additional configuration steps and usage instructions."
log "Remember to configure payment and SMTP settings in the admin and tenant setup menus within the application."
