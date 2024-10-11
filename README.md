# SaaS IT Inventory Application

This application consists of a frontend, backend, and database for managing IT inventory with a subscription-based billing system.

## Features

- IT asset and license management
- Multi-tenant architecture
- Role-based access control
- Subscription-based billing system
- Email notifications for subscription events

## Prerequisites

- A Linux-based system (Ubuntu recommended)
- A Stripe account for payment processing
- An SMTP server for sending emails

## Installation

1. Clone this repository to your server:
   ```
   git clone https://github.com/your-repo/saas-it-inventory.git
   cd saas-it-inventory
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

## Billing System

The application uses Stripe for payment processing and subscription management. The billing system includes:

- Subscription plans (Basic, Pro, Enterprise)
- Usage-based limits on users and assets
- Automatic renewal and cancellation handling

## Email Notifications

The application sends email notifications for the following events:

- Subscription changes
- Approaching usage limits
- Upcoming renewals

## Scheduled Tasks

The application uses node-cron to run scheduled tasks, including:

- Sending upcoming renewal notifications

These tasks are automatically started when the server runs.

## Troubleshooting

If you encounter any issues during the installation or running of the application, please check the following:

1. Ensure all environment variables are correctly set in the .env file.
2. Check the Docker logs for any error messages:
   ```
   docker-compose logs
   ```
3. Verify that the Stripe webhook is correctly set up and the secret is properly configured.
4. Ensure your SMTP settings are correct and the email server is accessible.

## Contributing

Please read CONTRIBUTING.md for details on our code of conduct and the process for submitting pull requests.

## License

This project is licensed under the MIT License - see the LICENSE.md file for details.
