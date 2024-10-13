# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added
- Comprehensive setup script (setup.sh) for easier deployment
- Health check endpoints for backend and MongoDB services
- Additional documentation files: AdminInstructions.md, TenantInstructions.md, UserInstructions.md, and FAQ.md

### Changed
- Updated README.md with detailed setup and usage instructions
- Improved docker-compose.yml configuration for better security and reliability
- Enhanced environment variable handling in the deployment process

### Security
- Implemented automatic generation of JWT_SECRET and ENCRYPTION_KEY in setup script
- Updated docker-compose.yml to use environment variables for sensitive information

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
