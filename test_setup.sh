#!/bin/bash

# Function to check if a string exists in the file
check_exists() {
    if grep -q "$1" setup.sh; then
        echo "[PASS] $2"
    else
        echo "[FAIL] $2"
        exit 1
    fi
}

# Check if setup.sh exists
if [ ! -f "setup.sh" ]; then
    echo "[FAIL] setup.sh file not found"
    exit 1
fi

# Check for syntax errors
bash -n setup.sh
if [ $? -ne 0 ]; then
    echo "[FAIL] Syntax error in setup.sh"
    exit 1
else
    echo "[PASS] No syntax errors found in setup.sh"
fi

# Check for necessary functions and commands
check_exists "function main_setup" "Main setup function exists"
check_exists "function install_system_dependencies" "System dependencies installation function exists"
check_exists "function install_mongodb" "MongoDB installation function exists"
check_exists "function check_docker_daemon" "Docker daemon check function exists"
check_exists "docker-compose" "Docker Compose command is used"
check_exists "npm install" "npm install command is used"
check_exists "JWT_SECRET=" "JWT_SECRET is set"
check_exists "ENCRYPTION_KEY=" "ENCRYPTION_KEY is set"
check_exists "MONGODB_URI=" "MONGODB_URI is set"
check_exists "NODE_ENV=" "NODE_ENV is set"
check_exists "PORT=" "PORT is set"
check_exists "REACT_APP_API_URL=" "REACT_APP_API_URL is set"

echo "All tests passed successfully!"
