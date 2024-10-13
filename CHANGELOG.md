# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added
- Comprehensive setup script (setup.sh) for easier deployment
- Health check endpoints for backend and MongoDB services
- Data visualization component for reports
- Responsive design for mobile devices
- Dropdown menu in navigation for user-related actions
- Protected routes for authenticated users
- Loading component for asynchronous operations
- Not Found (404) page for unmatched routes

### Changed
- Updated server.js to include all new routes
- Refactored setup.sh script for better dependency management and error handling
- Improved docker-compose configuration for more robust deployments
- Enhanced Navigation component with icons and responsive design
- Updated README.md with comprehensive project information and instructions
- Improved error handling and logging across the application
- Implemented pagination for data retrieval in backend APIs

### Security
- Implemented automatic generation of JWT_SECRET and ENCRYPTION_KEY in setup script
- Updated docker-compose.yml to use environment variables for sensitive information
- Added input validation for API endpoints to prevent injection attacks

## [0.1.0] - 2023-05-15
### Added
- Initial project setup
- Backend API with Express.js
- Frontend UI with React.js
- Asset management functionality
- Software subscription management
- Inventory control features
- User management system
- Reporting and analytics
- Dashboard with key metrics
- Data visualization components

### Security
- Implemented JWT for authentication
- Added role-based access control
