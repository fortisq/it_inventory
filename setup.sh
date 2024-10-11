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

# Check if running as root
if [ "$(id -u)" = "0" ]; then
    error "This script should not be run as root. Please run as a normal user."
fi

# Update and upgrade the system
echo "Updating and upgrading the system..."
sudo apt-get update && sudo apt-get upgrade -y || error "Failed to update and upgrade the system"

# Install Docker
if ! command_exists docker; then
    echo "Installing Docker..."
    sudo apt-get install -y docker.io || error "Failed to install Docker"
else
    echo "Docker is already installed."
fi

# Install Docker Compose
if ! command_exists docker-compose; then
    echo "Installing Docker Compose..."
    sudo curl -L "https://github.com/docker/compose/releases/download/1.29.2/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose || error "Failed to download Docker Compose"
    sudo chmod +x /usr/local/bin/docker-compose || error "Failed to make Docker Compose executable"
else
    echo "Docker Compose is already installed."
fi

# Start Docker service
echo "Starting Docker service..."
sudo systemctl start docker || error "Failed to start Docker service"
sudo systemctl enable docker || error "Failed to enable Docker service"

# Add current user to docker group
echo "Adding current user to docker group..."
sudo usermod -aG docker $USER || error "Failed to add user to docker group"

# Navigate to the project root directory
cd "$(dirname "$0")" || error "Failed to navigate to the project directory"

# Function to prompt for environment variables
prompt_env_var() {
    read -p "Enter $2 ($1): " value
    value=${value:-$3}
    echo "$1=$value" >> .env
}

# Create and configure .env file
echo "Configuring environment variables..."
rm -f .env
touch .env

prompt_env_var "MONGODB_URI" "MongoDB URI" "mongodb://mongo:27017/it_inventory"
prompt_env_var "JWT_SECRET" "JWT Secret" "$(openssl rand -base64 32)"
prompt_env_var "STRIPE_SECRET_KEY" "Stripe Secret Key"
prompt_env_var "STRIPE_PUBLISHABLE_KEY" "Stripe Publishable Key"
prompt_env_var "STRIPE_WEBHOOK_SECRET" "Stripe Webhook Secret"
prompt_env_var "SMTP_HOST" "SMTP Host"
prompt_env_var "SMTP_PORT" "SMTP Port" "587"
prompt_env_var "SMTP_USER" "SMTP User"
prompt_env_var "SMTP_PASS" "SMTP Password"
prompt_env_var "EMAIL_FROM" "From Email Address"

# Copy .env to frontend directory
echo "Copying .env to frontend directory..."
cp .env saas-it-inventory-frontend/.env || error "Failed to copy .env to frontend directory"

# Build and start the containers
echo "Building and starting Docker containers..."
docker-compose up -d --build || error "Failed to build and start Docker containers"

echo "Setup complete. Please log out and log back in for the docker group changes to take effect."
echo "Your application should now be running. Access the frontend at http://localhost"

# Provide instructions for Stripe webhook setup
echo ""
echo "Important: Set up Stripe webhook"
echo "1. Go to your Stripe Dashboard: https://dashboard.stripe.com/webhooks"
echo "2. Click 'Add endpoint'"
echo "3. Enter the following URL: http://your-domain.com/api/subscriptions/webhook"
echo "4. Select the following events:"
echo "   - customer.subscription.updated"
echo "   - customer.subscription.deleted"
echo "   - customer.created"
echo "5. Click 'Add endpoint'"
echo "6. Copy the 'Signing secret' and update the STRIPE_WEBHOOK_SECRET in your .env file"

# Prompt to run database seeding script
read -p "Do you want to seed the database with initial data? (y/n) " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]
then
    docker-compose exec backend npm run seed || error "Failed to seed the database"
fi

echo "Setup and configuration complete. Your SaaS IT Inventory Application is ready to use!"
echo "Please review the README.md file for additional configuration steps and usage instructions."
