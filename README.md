# IT Inventory

## Table of Contents
1. [Overview](#overview)
2. [Features](#features)
3. [System Requirements](#system-requirements)
4. [Prerequisites](#prerequisites)
5. [Installation and Setup](#installation-and-setup)
6. [Updating the Application](#updating-the-application)
7. [Usage](#usage)
8. [Development](#development)
9. [Stopping and Restarting the Application](#stopping-and-restarting-the-application)
10. [Troubleshooting](#troubleshooting)
11. [Security Considerations](#security-considerations)
12. [Backups and Data Management](#backups-and-data-management)
13. [Customization and Extending the Application](#customization-and-extending-the-application)
14. [Contributing](#contributing)
15. [License](#license)
16. [Support](#support)
17. [Additional Information](#additional-information)
18. [Recent Updates](#recent-updates)

## Overview

IT Inventory is a comprehensive solution designed to help organizations efficiently manage their IT assets, software subscriptions, and inventory.

## Features

- Asset Management: Track and manage all IT assets, including hardware and software.
- Software Subscription Management: Monitor software licenses, expiration dates, and usage.
- Inventory Control: Maintain real-time inventory levels and automate reordering processes.
- User Management: Manage user accounts, roles, and permissions.
- Reporting and Analytics: Generate custom reports and gain insights into asset utilization and costs.
- Dashboard: Get a quick overview of key metrics and alerts.
- Data Visualization: Visualize inventory data, asset distribution, and trends using interactive charts.
- Pagination: Efficiently navigate through large datasets in inventory, assets, and software subscriptions lists.
- Search Functionality: Quickly find specific items in inventory, assets, and software subscriptions.
- PDF and Excel Export: Generate and download reports in PDF and Excel formats.

## System Requirements

- CPU: 2 cores or more
- RAM: 4GB minimum, 8GB recommended
- Storage: 20GB of free disk space
- Operating System: Ubuntu 20.04 LTS or later
- Internet Connection: Broadband internet connection

## Prerequisites

- Ubuntu-based system (tested on Ubuntu 20.04 LTS)
- Sudo privileges
- Git

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
   - Check for sufficient disk space (minimum 5GB required)
   - Check and install system dependencies
   - Install Docker (version 20.10.0 or higher) and Docker Compose (version 1.29.2 or higher) if not already present
   - Set up the necessary environment variables
   - Build and start the Docker containers
   - Create a super admin account
   - Optionally seed the database with initial data
   - Install additional frontend dependencies for PDF generation, Excel export, and charting

   The script includes progress indicators for long-running operations and improved error handling.

3. During the setup process:
   - If you're not in the docker group, the script will add you and prompt you to log out and log back in.
   - You'll be asked if you want to seed the database with initial data. This is recommended for new installations.

4. After the script completes, you can access the application:
   - Locally: http://localhost:3000
   - Network: http://<your-ip-address>:3000

Note: The setup script automatically generates secure values for JWT_SECRET and ENCRYPTION_KEY environment variables. These are used in the docker-compose.yml file for enhanced security.

If the setup process is interrupted or fails, you can safely run the script again. It includes cleanup procedures to ensure a fresh start.

## Updating the Application

The application now includes an automatic update mechanism to keep your installation up-to-date with the latest changes from the GitHub repository. Here's how it works:

1. Automatic updates:
   Every time you run the `setup.sh` script, it will automatically check for updates before proceeding with the setup process. This ensures that your installation is always using the latest version of the application.

2. Manual updates:
   You can manually check for updates at any time by running:
   ```
   ./update.sh
   ```
   This script will:
   - Fetch the latest changes from the GitHub repository
   - Update the local files
   - Restart the services if necessary

Important notes:
- Before running an update, make sure to commit and push any local changes you want to keep, as the update process may overwrite local modifications.
- The update process will update both the backend and frontend code, as well as any configuration files or scripts.
- If you encounter any issues after an update, you can refer to the [Troubleshooting](#troubleshooting) section or contact support.

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
- Check the application logs for any error messages: `docker-compose logs -f`

## Security Considerations

- Regularly update all dependencies and Docker images
- Use strong, unique passwords for all accounts
- Enable two-factor authentication for admin accounts
- Regularly review and audit user access and permissions
- Keep your host system and Docker installation up to date
- Implement network security measures (firewalls, VPNs) to protect the application

## Backups and Data Management

- Regular backups are crucial. Set up automated backups of the MongoDB database
- Store backups securely, preferably in an off-site location
- Regularly test the restoration process to ensure backups are valid
- Implement a data retention policy in compliance with relevant regulations

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

## Recent Updates

The setup process has been updated to include additional dependencies for generating PDFs, Excel documents, and charts. The following changes have been made:

1. Added installation of frontend dependencies:
   - chart.js (version 3.0.0 or higher)
   - file-saver
   - xlsx
   - jspdf
   - jspdf-autotable

2. Updated the test_setup.ps1 script to verify the presence of these new dependencies.

3. Implemented an automatic update mechanism to keep the application up-to-date with the latest changes from the GitHub repository.

### Testing the Updated Setup

To test the updated setup process:

1. Run the setup script:
   ```
   ./setup.sh
   ```

2. After the setup is complete, run the test script:
   ```
   powershell -ExecutionPolicy Bypass -File test_setup.ps1
   ```

3. Verify that all tests pass successfully, including checks for the new dependencies.

4. Access the application and test the functionality related to generating reports, charts, and exporting data to ensure the new dependencies are working correctly.

5. Test the update mechanism by running:
   ```
   ./update.sh
   ```

If you encounter any issues during the setup, testing, or update process, please refer to the troubleshooting section in this README or contact the development team for assistance.
