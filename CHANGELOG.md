# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added
- New reporting functionality
  - Added Reports component to frontend
  - Implemented backend API for report generation and management
  - Created Report model for storing report metadata
  - Added unit tests for Reports component and backend controller
- Updated user documentation (UserInstructions.md and AdminInstructions.md) to reflect new reporting features
- Enhanced AdminPanel component to include report management options
- New Help and Support Portal
  - Added HelpSupportPortal component for users to access help documents, submit help requests, and view system updates
  - Implemented backend API for managing help documents and help requests
  - Updated Navigation component to include a link to the Help and Support Portal
  - Created HelpDocument and HelpRequest models for managing help content and user requests
  - Implemented AdminHelpPortal component for administrators to manage help documents and respond to user requests
  - Added notification system for new help requests and updates to existing requests
  - Integrated help request management into the admin dashboard
- Automated JWT Secret generation in setup process
- New section in AdminInstructions.md for configuring payment (Stripe) and SMTP settings
- Implemented SMTP settings management for both admins and tenants
  - Added SMTP settings fields to Tenant model
  - Created new route for updating SMTP settings
  - Implemented role-based access control for SMTP settings management
- Implemented Stripe settings management for admins
  - Added Stripe settings fields to Tenant model
  - Created new route for updating Stripe settings
  - Implemented admin-only access control for Stripe settings management
- Enhanced security for sensitive data
  - Implemented encryption for SMTP and Stripe credentials in the Tenant model
  - Added automatic generation of encryption key during setup
- Improved input validation using express-validator in tenant routes
- Added pagination for fetching all tenants
- Implemented SMTP settings validation when updating
- Added new belongsToTenant middleware for tenant-specific operations
- Improved error handling with custom AuthError class in authentication middleware
- Added logging for better debugging and error tracking
- Enhanced installation system (setup.sh):
  - Added cleanup function and trap to handle script interruptions and errors
  - Implemented logging function for consistent and timestamped log messages
  - Added version checks for Docker and Docker Compose
  - Implemented backup mechanism for existing .env file
  - Added MongoDB connection validation after container startup
  - Replaced npm install with npm ci for more reliable dependency installation
  - Added automatic installation of Node.js and npm if not present on the system

### Changed
- Updated Navigation component to include links to Reports section and Help & Support Portal
- Improved error handling and loading states in various components
- Enhanced UI/UX across multiple components:
  - Dashboard: Added collapsible menu and improved responsiveness
  - AssetManagement: Implemented confirmation dialogs for critical actions
  - Inventory: Added collapsible sections and improved mobile layout
  - Profile: Enhanced form layout and added success messages
  - SystemHealth: Improved data presentation and added collapsible sections
  - AdminPanel: Redesigned layout for better usability on mobile devices
- Improved accessibility features:
  - Added ARIA labels and roles to interactive elements
  - Implemented keyboard navigation support
  - Enhanced focus management for modal dialogs
- Updated AdminInstructions.md to include detailed information on managing the Help and Support Portal
- Enhanced UserInstructions.md with guidelines on using the new Help and Support Portal features
- Modified setup process to exclude payment and SMTP configuration, moving these to post-installation admin setup
- Updated README.md to reflect changes in the installation and setup process
- Enhanced role-based access control in authMiddleware
  - Added isTenantAdminOrSuperAdmin function for more granular access control
  - Updated existing routes to use appropriate middleware for access control
- Refactored tenant routes for better organization and error handling
- Updated setup.sh script:
  - Improved error handling and logging
  - Enhanced security considerations and warnings
  - Added more detailed progress information during installation
  - Automated MongoDB URI configuration, removing the need for user input
  - Added checks and installation for Node.js and npm dependencies

### Fixed
- Various bug fixes and performance improvements
- Improved error handling in authentication middleware and tenant routes
- Enhanced robustness and reliability of the installation process
- Resolved issue with missing npm command in setup script by adding Node.js and npm installation

## [1.0.0] - 2023-05-01

### Added
- Initial release of the SaaS IT Inventory Application
- Basic asset and license management functionality
- User authentication and authorization
- Tenant management for multi-tenant support
- System health monitoring
- Basic reporting capabilities

[Unreleased]: https://github.com/yourusername/saas-it-inventory/compare/v1.0.0...HEAD
[1.0.0]: https://github.com/yourusername/saas-it-inventory/releases/tag/v1.0.0
