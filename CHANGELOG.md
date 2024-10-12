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

### Fixed
- Various bug fixes and performance improvements

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
