#!/bin/bash

set -e

# Trap for cleanup
trap cleanup EXIT

# Logging function
log() {
    echo "[$(date +'%Y-%m-%d %H:%M:%S')] $1"
}

# Error logging function
error_log() {
    echo "[$(date +'%Y-%m-%d %H:%M:%S')] ERROR: $1" >&2
}

# Cleanup function
cleanup() {
    log "Cleaning up..."
    docker-compose down --remove-orphans
}

# Function to display error messages and exit
error() {
    error_log "$1"
    exit 1
}

# Function to check if a command exists
command_exists() {
    command -v "$1" >/dev/null 2>&1
}

# Function to compare versions
version_ge() {
    test "$(echo "$@" | tr " " "\n" | sort -rV | head -n 1)" == "$1"
}

# Function to retry commands
retry() {
    local retries=$1
    shift
    local count=0
    until "$@"; do
        exit=$?
        count=$((count + 1))
        if [ $count -lt $retries ]; then
            log "Command failed. Attempt $count/$retries:"
            sleep 5
        else
            error "The command has failed after $retries attempts."
        fi
    done
    return 0
}

# Function to check and create necessary directories
ensure_directories() {
    local dirs=("saas-it-inventory" "saas-it-inventory-frontend")
    for dir in "${dirs[@]}"; do
        if [ ! -d "$dir" ]; then
            log "Creating directory: $dir"
            mkdir -p "$dir"
        fi
    done
}

# Function to check and install system dependencies
install_system_dependencies() {
    log "Checking and installing system dependencies..."
    sudo apt-get update
    sudo apt-get install -y curl wget git build-essential
}

# Function to check Docker daemon status
check_docker_daemon() {
    if ! docker info >/dev/null 2>&1; then
        log "Docker daemon is not running. Attempting to start..."
        sudo systemctl start docker
        sleep 5
        if ! docker info >/dev/null 2>&1; then
            error "Failed to start Docker daemon. Please check Docker installation."
        fi
    fi
}

# Function to debug Docker issues
debug_docker() {
    log "Debugging Docker issues..."
    docker version
    docker info
    docker network ls
    docker volume ls
}

# Function to check container logs
check_container_logs() {
    local container=$1
    log "Checking logs for $container container..."
    docker-compose logs $container
}

# Main setup function
main_setup() {
    # Check if running as root
    if [ "$(id -u)" = "0" ]; then
        error "This script should not be run as root. Please run as a normal user."
    fi

    # Install system dependencies
    install_system_dependencies

    # Check if user is in docker group
    if ! groups | grep -q docker; then
        log "Adding current user to docker group..."
        sudo usermod -aG docker $USER
        log "You have been added to the docker group. Please log out and log back in for the changes to take effect."
        log "After logging back in, please run this script again."
        exit 0
    fi

    # Check Docker daemon status
    check_docker_daemon

    # Update and upgrade the system
    log "Updating and upgrading the system..."
    sudo apt-get update && sudo apt-get upgrade -y || error "Failed to update and upgrade the system"

    # Check Node.js version
    if command_exists node; then
        node_version=$(node --version | cut -d 'v' -f 2)
        npm_version=$(npm --version)
        log "Node.js version: $node_version"
        log "npm version: $npm_version"
        if version_ge "$node_version" "16.0.0"; then
            log "Node.js version is 16.x or higher. Proceeding with installation."
        else
            log "Node.js version is below 16.x. Attempting to install Node.js 16.x..."
            curl -fsSL https://deb.nodesource.com/setup_16.x | sudo -E bash -
            sudo apt-get install -y nodejs || error "Failed to install Node.js 16.x"
        fi
    else
        log "Node.js is not installed. Installing Node.js 16.x..."
        curl -fsSL https://deb.nodesource.com/setup_16.x | sudo -E bash -
        sudo apt-get install -y nodejs || error "Failed to install Node.js 16.x"
    fi

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

    # Navigate to the project root directory
    cd "$(dirname "$0")" || error "Failed to navigate to the project directory"

    # Ensure necessary directories exist
    ensure_directories

    # Install frontend dependencies
    log "Installing frontend dependencies..."
    cd saas-it-inventory-frontend || error "Failed to navigate to frontend directory"
    retry 3 npm install || error "Failed to install frontend dependencies"
    cd ..

    # Regenerate package-lock.json for backend
    log "Regenerating package-lock.json for backend..."
    cd saas-it-inventory || error "Failed to navigate to saas-it-inventory directory"
    rm -f package-lock.json
    retry 3 npm install || error "Failed to regenerate package-lock.json for backend"
    cd ..

    # Regenerate package-lock.json for frontend
    log "Regenerating package-lock.json for frontend..."
    cd saas-it-inventory-frontend || error "Failed to navigate to saas-it-inventory-frontend directory"
    rm -f package-lock.json
    retry 3 npm install || error "Failed to regenerate package-lock.json for frontend"
    cd ..

    # Verify package.json content for backend
    log "Verifying backend package.json content..."
    if [ ! -f saas-it-inventory/package.json ]; then
        error "package.json not found in saas-it-inventory directory"
    fi
    cat saas-it-inventory/package.json || error "Failed to read backend package.json"

    # Verify package.json content for frontend
    log "Verifying frontend package.json content..."
    if [ ! -f saas-it-inventory-frontend/package.json ]; then
        error "package.json not found in saas-it-inventory-frontend directory"
    fi
    cat saas-it-inventory-frontend/package.json || error "Failed to read frontend package.json"

    # Backup existing .env file
    if [ -f .env ]; then
        log "Backing up existing .env file..."
        cp .env .env.backup.$(date +%Y%m%d%H%M%S)
    fi

    # Create and configure .env file
    log "Configuring environment variables..."
    rm -f .env
    touch .env

    # Configure MongoDB
    log "Configuring MongoDB..."
    echo "MONGODB_URI=mongodb://mongo:27017/it_inventory" >> .env
    log "MongoDB URI configured automatically"

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

    # Debug Docker setup
    debug_docker

    # Build and start the containers
    log "Building and starting Docker containers..."
    retry 3 docker-compose up -d --build || error "Failed to build and start Docker containers"

    log "Waiting for services to start..."
    sleep 60

    # Check container status
    log "Checking container status..."
    docker-compose ps

    # Check container logs
    log "Checking container logs..."
    check_container_logs frontend
    check_container_logs backend
    check_container_logs mongo

    # Validate MongoDB connection
    log "Validating MongoDB connection..."
    retry 3 docker-compose exec -T backend node -e "const mongoose = require('mongoose'); mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true }).then(() => console.log('Connected')).catch((err) => { console.error(err); process.exit(1); })" || error "Failed to connect to MongoDB. Please check your MongoDB configuration."

    # Run the initialization script to create the super admin
    log "Creating super admin..."
    retry 3 docker-compose exec -T backend node scripts/init.js || error "Failed to create super admin"

    log "Setup complete. Your application should now be running. Access the frontend at http://localhost"

    # Prompt to run database seeding script
    read -p "Do you want to seed the database with initial data? (y/n) " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]]
    then
        retry 3 docker-compose exec backend npm run seed || error "Failed to seed the database"
    fi

    log "Setup and configuration complete. Your SaaS IT Inventory Application is ready to use!"
    log "Please review the README.md file for additional configuration steps and usage instructions."
    log "Remember to configure payment and SMTP settings in the admin and tenant setup menus within the application."
}

# Run the main setup function
main_setup
