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
    if [ "$?" -ne 0 ]; then
        log "An error occurred. Cleaning up..."
        if command_exists docker-compose; then
            docker-compose down --remove-orphans
        else
            log "docker-compose not found. Skipping container cleanup."
        fi
        rm -f .env saas-it-inventory-frontend/.env
        log "Cleanup complete. Please check the error messages above and try running the script again."
    fi
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

# Function to check for updates
check_for_updates() {
    log "Checking for updates..."
    if [ -f "update.sh" ]; then
        chmod +x update.sh
        ./update.sh
    else
        log "Update script not found. Skipping update check."
    fi
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

# Function to check available disk space
check_disk_space() {
    local required_space=5000000  # 5GB in KB
    local available_space=$(df . | awk 'NR==2 {print $4}')
    if [ $available_space -lt $required_space ]; then
        error "Not enough disk space. At least 5GB is required."
    fi
}

# Function to wait for backend to be healthy
wait_for_backend() {
    log "Waiting for backend to be healthy..."
    local max_attempts=30
    local attempt=1
    while [ $attempt -le $max_attempts ]; do
        if docker-compose exec backend node healthcheck.js; then
            log "Backend is healthy"
            return 0
        fi
        log "Backend not yet healthy. Attempt $attempt/$max_attempts"
        sleep 10
        attempt=$((attempt + 1))
    done
    error "Backend failed to become healthy after $max_attempts attempts"
}

# Function to clean and reinstall node modules
clean_and_reinstall_node_modules() {
    log "Cleaning and reinstalling node modules..."
    rm -rf node_modules package-lock.json
    npm install || error "Failed to reinstall node modules"
}

# Main setup function
main_setup() {
    # Check for updates
    check_for_updates

    # Check if running as root
    if [ "$(id -u)" = "0" ]; then
        error "This script should not be run as root. Please run as a normal user."
    fi

    # Check available disk space
    check_disk_space

    # Install system dependencies
    install_system_dependencies

    # Run MongoDB setup script
    log "Running MongoDB setup script..."
    if [ -f "mongodb_setup.sh" ]; then
        chmod +x mongodb_setup.sh
        if ! ./mongodb_setup.sh; then
            error "Failed to run MongoDB setup script. Please check the output above for more details."
        fi
    else
        error "MongoDB setup script not found. Please ensure mongodb_setup.sh is in the same directory as setup.sh"
    fi

    # Verify MongoDB installation
    log "Verifying MongoDB installation..."
    if ! command_exists mongod; then
        error "MongoDB installation failed. Please check the mongodb_setup.sh script for errors."
    fi
    log "MongoDB installation verified."

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

    # Install Node.js 18.x
    log "Installing Node.js 18.x..."
    curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
    sudo apt-get install -y nodejs || error "Failed to install Node.js 18.x"

    # Verify Node.js and npm versions
    node_version=$(node --version)
    npm_version=$(npm --version)
    log "Node.js version: $node_version"
    log "npm version: $npm_version"

    # Install Docker
    if ! command_exists docker; then
        log "Installing Docker..."
        sudo apt-get install -y docker.io || error "Failed to install Docker"
    else
        log "Docker is already installed. Checking version..."
        docker_version=$(docker --version | awk '{print $3}' | cut -d',' -f1)
        if version_ge "$docker_version" "20.10.0"; then
            log "Docker version is 20.10.0 or higher. Proceeding with installation."
        else
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
        if version_ge "$compose_version" "1.29.2"; then
            log "Docker Compose version is 1.29.2 or higher. Proceeding with installation."
        else
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

    # Clear npm cache
    log "Clearing npm cache..."
    npm cache clean --force

    # Install frontend dependencies
    log "Installing frontend dependencies..."
    cd saas-it-inventory-frontend || error "Failed to navigate to frontend directory"
    log "Current directory: $(pwd)"
    log "Contents of package.json:"
    cat package.json
    log "Installing dependencies..."
    npm install --verbose || error "Failed to install frontend dependencies"
    log "Installed packages:"
    npm list --depth=0
    cd ..

    # Install backend dependencies
    log "Installing backend dependencies..."
    cd saas-it-inventory || error "Failed to navigate to backend directory"
    log "Current directory: $(pwd)"
    log "Contents of package.json:"
    cat package.json
    log "Installing dependencies..."
    clean_and_reinstall_node_modules
    log "Installed packages:"
    npm list --depth=0
    cd ..

    # Create and configure .env file
    log "Configuring environment variables..."
    JWT_SECRET=$(openssl rand -base64 32)
    ENCRYPTION_KEY=$(openssl rand -base64 32)
    cat << EOF > .env
MONGODB_URI=mongodb://mongo:27017/it_inventory
JWT_SECRET=$JWT_SECRET
ENCRYPTION_KEY=$ENCRYPTION_KEY
NODE_ENV=production
PORT=3000
REACT_APP_API_URL=http://localhost:3000/api
EOF
    log "Environment variables configured"

    # Copy .env to frontend directory
    log "Copying .env to frontend directory..."
    cp .env saas-it-inventory-frontend/.env || error "Failed to copy .env to frontend directory"

    # Update docker-compose.yml with environment variables
    log "Updating docker-compose.yml with environment variables..."
    sed -i "s/JWT_SECRET=.*/JWT_SECRET=\${JWT_SECRET}/" docker-compose.yml
    sed -i "s/ENCRYPTION_KEY=.*/ENCRYPTION_KEY=\${ENCRYPTION_KEY}/" docker-compose.yml

    # Build and start the containers
    log "Building and starting Docker containers..."
    log "Contents of docker-compose.yml:"
    cat docker-compose.yml
    retry 3 docker-compose up -d --build || error "Failed to build and start Docker containers"

    log "Docker containers after build:"
    docker-compose ps

    log "Logs from frontend container:"
    docker-compose logs frontend

    log "Logs from backend container:"
    docker-compose logs backend

    log "Waiting for services to start..."
    sleep 30

    # Wait for backend to be healthy
    wait_for_backend

    # Check container status
    log "Checking container status..."
    docker-compose ps

    # Check if containers are running
    if [ $(docker-compose ps -q | wc -l) -eq 0 ]; then
        error "No containers are running. Please check the Docker logs for more information."
    fi

    # Run the initialization script to create the super admin
    log "Creating super admin..."
    retry 3 docker-compose exec -T backend node scripts/init.js || error "Failed to create super admin"

    # Prompt to run database seeding script
    read -p "Do you want to seed the database with initial data? (y/n) " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]]
    then
        retry 3 docker-compose exec backend npm run seed || error "Failed to seed the database"
    fi

    # Get the IP address
    IP_ADDRESS=$(hostname -I | awk '{print $1}')

    log "Setup and configuration complete. Your IT Inventory Application is now running!"
    log "Access the application:"
    log "- Local: http://localhost"
    log "- Network: http://$IP_ADDRESS"
    log "Login with the following credentials:"
    log "- Username: root"
    log "- Password: root"
    log ""
    log "To stop the application, run: docker-compose down"
    log "To start the application again, run: docker-compose up -d"
    log ""
    log "Please review the README.md file for additional configuration steps and usage instructions."
    log "Remember to configure payment and SMTP settings in the admin and tenant setup menus within the application."
}

# Run the main setup function
main_setup
