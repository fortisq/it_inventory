# Function to check if a string exists in the file
function Check-Exists {
    param (
        [string]$pattern,
        [string]$description
    )
    if (Select-String -Path "setup.sh" -Pattern $pattern -Quiet) {
        Write-Host "[PASS] $description" -ForegroundColor Green
    } else {
        Write-Host "[FAIL] $description" -ForegroundColor Red
        exit 1
    }
}

# Check if setup.sh exists
if (-not (Test-Path "setup.sh")) {
    Write-Host "[FAIL] setup.sh file not found" -ForegroundColor Red
    exit 1
}

# Check for necessary functions and commands
Check-Exists "main_setup\s*\(\)" "Main setup function exists"
Check-Exists "install_system_dependencies\s*\(\)" "System dependencies installation function exists"
Check-Exists "install_mongodb\s*\(\)" "MongoDB installation function exists"
Check-Exists "check_docker_daemon\s*\(\)" "Docker daemon check function exists"
Check-Exists "docker-compose" "Docker Compose command is used"
Check-Exists "npm install" "npm install command is used"
Check-Exists "JWT_SECRET=" "JWT_SECRET is set"
Check-Exists "ENCRYPTION_KEY=" "ENCRYPTION_KEY is set"
Check-Exists "MONGODB_URI=" "MONGODB_URI is set"
Check-Exists "NODE_ENV=" "NODE_ENV is set"
Check-Exists "PORT=" "PORT is set"
Check-Exists "REACT_APP_API_URL=" "REACT_APP_API_URL is set"

# Check for new frontend dependencies
Check-Exists "chart\.js@\^3\.0\.0" "chart.js is installed"
Check-Exists "file-saver" "file-saver is installed"
Check-Exists "xlsx" "xlsx is installed"
Check-Exists "jspdf" "jspdf is installed"
Check-Exists "jspdf-autotable" "jspdf-autotable is installed"

Write-Host "All tests passed successfully!" -ForegroundColor Green
