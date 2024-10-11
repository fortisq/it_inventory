# SaaS IT Inventory Application

This application consists of a frontend, backend, and database for managing IT inventory.

## Deployment Instructions

### Option 1: Using setup.sh (for fresh Linux installs)

1. Clone this repository to your server.
2. Navigate to the project root directory.
3. Make the setup script executable: `chmod +x setup.sh`
4. Run the setup script: `./setup.sh`

### Option 2: Manual deployment with Docker Compose

If you already have Docker and Docker Compose installed:

1. Clone this repository to your server.
2. Navigate to the project root directory.
3. Run `docker-compose up -d --build`

The application will be available at:
- Frontend: http://localhost
- Backend API: http://localhost:3000

## Development

To run the application in development mode:

1. Navigate to the backend directory: `cd saas-it-inventory`
2. Install dependencies: `npm install`
3. Start the backend: `npm run dev`

4. In a new terminal, navigate to the frontend directory: `cd saas-it-inventory-frontend`
5. Install dependencies: `npm install`
6. Start the frontend: `npm start`

The frontend development server will be available at http://localhost:3000
