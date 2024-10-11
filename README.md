# SaaS IT Inventory Application

This application consists of a frontend, backend, and database for managing IT inventory with a subscription-based billing system.

## Author

Dan Bressers, NIT Solutions Ltd
Date: 10/11/2024

## Features

- IT asset and license management
- Software subscription tracking
- Multi-tenant architecture
- Role-based access control
- Subscription-based billing system
- Email notifications for subscription events, warranty expirations, and software subscription renewals
- Reports and dashboards for asset and subscription insights
- System Health monitoring for administrators

## Prerequisites

- A Linux-based system (Ubuntu recommended)
- A Stripe account for payment processing
- An SMTP server for sending emails

## Installation

1. Clone this repository to your server:
   ```
   git clone https://github.com/fortisq/it_inventory.git
   cd it_inventory
   ```

2. Make the setup script executable:
   ```
   chmod +x setup.sh
   ```

3. Run the setup script:
   ```
   ./setup.sh
   ```

4. Follow the prompts to enter your configuration details, including:
   - MongoDB URI
   - JWT Secret
   - Stripe API keys
   - SMTP settings

5. After the script completes, set up the Stripe webhook as instructed in the terminal output.

6. Log out and log back in for the Docker group changes to take effect.

## Testing the Installation

After completing the installation process, you can run the test script to verify that everything is set up correctly:

1. Make the test script executable:
   ```
   chmod +x test.sh
   ```

2. Run the test script:
   ```
   ./test.sh
   ```

This script will check various components of the application to ensure they are functioning correctly.

## Usage

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

## Features

[... rest of the README content ...]

## License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details.

## Contact

For any inquiries, please contact Dan Bressers at NIT Solutions Ltd.
