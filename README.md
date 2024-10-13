# IT Inventory

## Table of Contents
1. [Overview](#overview)
2. [Features](#features)
3. [System Requirements](#system-requirements)
4. [Prerequisites](#prerequisites)
5. [Installation and Setup](#installation-and-setup)
6. [Usage](#usage)
7. [Development](#development)
8. [Stopping and Restarting the Application](#stopping-and-restarting-the-application)
9. [Troubleshooting](#troubleshooting)
10. [Security Considerations](#security-considerations)
11. [Backups and Data Management](#backups-and-data-management)
12. [Customization and Extending the Application](#customization-and-extending-the-application)
13. [Contributing](#contributing)
14. [License](#license)
15. [Support](#support)
16. [Additional Information](#additional-information)

## Overview

IT Inventory is a comprehensive solution designed to help organizations efficiently manage their IT assets, software subscriptions, and inventory.

## Features

- Asset Management: Track and manage all IT assets, including hardware and software.
- Software Subscription Management: Monitor software licenses, expiration dates, and usage.
- Inventory Control: Maintain real-time inventory levels and automate reordering processes.
- User Management: Manage user accounts, roles, and permissions.
- Reporting and Analytics: Generate custom reports and gain insights into asset utilization and costs.
- Dashboard: Get a quick overview of key metrics and alerts.
- Data Visualization: Visualize inventory data, asset distribution, and trends.

## System Requirements

- CPU: 2 cores or more
- RAM: 4GB minimum, 8GB recommended
- Storage: 20GB of free disk space
- Operating System: Ubuntu 20.04 LTS or later
- Internet Connection: Broadband internet connection

## Prerequisites

- Ubuntu-based system (tested on Ubuntu 20.04 LTS)
- Sudo privileges

## Installation and Setup

1. Clone the repository:
   ```
   git clone https://github.com/fortisq/it_inventory.git
   cd it_inventory
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

## Troubleshooting

- If you encounter issues with Docker, ensure the Docker daemon is running: `sudo systemctl start docker`
- For database connection issues, check if MongoDB is running: `docker-compose ps`
- If the frontend is not accessible, verify that the REACT_APP_API_URL in the frontend .env file is correct

## Security Considerations

- Regularly update all dependencies and Docker images
- Use strong, unique passwords for all accounts
- Enable two-factor authentication for admin accounts
- Regularly review and audit user access and permissions
- Keep your host system and Docker installation up to date

## Backups and Data Management

- Regular backups are crucial. Set up automated backups of the MongoDB database
- Store backups securely, preferably in an off-site location
- Regularly test the restoration process to ensure backups are valid

## Customization and Extending the Application

- Backend customization: Add new routes in `saas-it-inventory/routes` and corresponding controllers in `saas-it-inventory/controllers`
- Frontend customization: Modify or add components in `saas-it-inventory-frontend/src/components`
- For major changes, consider forking the repository and submitting pull requests for review

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
