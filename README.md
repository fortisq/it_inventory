# IT Inventory Management System

## Overview

The IT Inventory Management System is a comprehensive SaaS solution designed to help organizations efficiently manage their IT assets, software subscriptions, and inventory.

## Features

- Asset Management
- Software Subscription Management
- Inventory Control
- User Management
- Reporting and Analytics
- Dashboard
- Data Visualization

## Prerequisites

- Ubuntu-based system (tested on Ubuntu 20.04 LTS)
- Sudo privileges

## Installation and Setup

1. Clone the repository:
   ```
   git clone https://github.com/your-organization/it-inventory-management.git
   cd it-inventory-management
   ```

2. Run the setup script:
   ```
   chmod +x setup.sh
   ./setup.sh
   ```

   This script will:
   - Check and install system dependencies
   - Install Docker and Docker Compose if not already present
   - Set up the necessary environment variables
   - Build and start the Docker containers
   - Create a super admin account
   - Optionally seed the database with initial data

3. After the script completes, you can access the application:
   - Locally: http://localhost
   - Network: http://<your-ip-address>

Note: The setup script automatically generates secure values for JWT_SECRET and ENCRYPTION_KEY environment variables. These are used in the docker-compose.yml file for enhanced security.

## Usage

1. Log in using the default super admin credentials:
   - Username: root
   - Password: root

2. Change the admin password immediately after first login.

3. Configure payment and SMTP settings in the admin and tenant setup menus within the application.

4. Start managing your IT inventory, assets, and software subscriptions.

## Development

For local development without Docker:

1. Install dependencies:
   ```
   cd saas-it-inventory && npm install
   cd ../saas-it-inventory-frontend && npm install
   ```

2. Set up environment variables as described in the setup.sh script.

3. Start the development servers:
   - Backend: `cd saas-it-inventory && npm run dev`
   - Frontend: `cd saas-it-inventory-frontend && npm start`

## Stopping and Restarting the Application

- To stop the application: `docker-compose down`
- To start the application again: `docker-compose up -d`

## Contributing

Please read [CONTRIBUTING.md](CONTRIBUTING.md) for details on our code of conduct and the process for submitting pull requests.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Support

For support, please open an issue in the GitHub repository or contact the maintainers at support@example.com.

## Additional Information

For more detailed information about specific components and usage instructions, please refer to the following files:

- [Admin Instructions](AdminInstructions.md)
- [Tenant Instructions](TenantInstructions.md)
- [User Instructions](UserInstructions.md)
- [API Documentation](docs/api-docs.md)
- [Changelog](CHANGELOG.md)
- [Security Policy](SECURITY.md)
- [FAQ](FAQ.md)
