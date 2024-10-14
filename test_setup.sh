#!/bin/bash

set -e

# Mock functions and commands
command_exists() {
    case "$1" in
        node|npm|docker|docker-compose)
            return 0
            ;;
        *)
            return 1
            ;;
    esac
}

docker() {
    echo "Mock Docker: $@"
}

docker-compose() {
    echo "Mock Docker Compose: $@"
}

apt-get() {
    echo "Mock apt-get: $@"
}

systemctl() {
    echo "Mock systemctl: $@"
}

# Mock environment variables
export MOCK_NODE_VERSION="16.0.0"
export MOCK_NPM_VERSION="7.0.0"
export MOCK_DOCKER_VERSION="20.10.0"
export MOCK_COMPOSE_VERSION="1.29.2"

# Source the setup script to get access to its functions
source ./setup.sh

# Test functions
test_check_disk_space() {
    echo "Testing check_disk_space function..."
    df() {
        echo "Filesystem     1K-blocks      Used Available Use% Mounted on"
        echo "/dev/sda1      10485760   5242880   5242880  50% /"
    }
    check_disk_space
    echo "check_disk_space test passed"
}

test_install_system_dependencies() {
    echo "Testing install_system_dependencies function..."
    install_system_dependencies
    echo "install_system_dependencies test passed"
}

test_check_docker_daemon() {
    echo "Testing check_docker_daemon function..."
    docker info() {
        return 0
    }
    check_docker_daemon
    echo "check_docker_daemon test passed"
}

test_ensure_directories() {
    echo "Testing ensure_directories function..."
    mkdir() {
        echo "Mock mkdir: $@"
    }
    ensure_directories
    echo "ensure_directories test passed"
}

# Run tests
test_check_disk_space
test_install_system_dependencies
test_check_docker_daemon
test_ensure_directories

echo "All tests completed successfully"
