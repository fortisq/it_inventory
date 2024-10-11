# SaaS IT Inventory Application

This application consists of a frontend, backend, and database for managing IT inventory with a subscription-based billing system.

## Features

- IT asset and license management
- Software subscription tracking
- Multi-tenant architecture
- Role-based access control
- Subscription-based billing system
- Email notifications for subscription events, warranty expirations, and software subscription renewals
- Reports and dashboards for asset and subscription insights

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

## Features

### Asset Management

The Asset Management feature allows users to:
- Add new assets with details such as name, type, serial number, and warranty expiry date
- Assign assets to specific users
- Track the status and location of assets
- Edit and delete existing assets

### Software Subscription Management

The Software Subscription Management feature enables users to:
- Add new software subscriptions with details like name, vendor, start date, and expiry date
- Track the number of seats/licenses for each subscription
- Monitor subscription status and renewal dates
- Edit and delete existing software subscriptions

### Reports and Dashboards

The Reports and Dashboards feature provides:
- Overview of total assets and software subscriptions
- Insights on assets with expiring warranties
- Information on upcoming software subscription renewals
- Visual representation of inventory data

## Billing System

The application uses Stripe for payment processing and subscription management. The billing system includes:

- Subscription plans (Basic, Pro, Enterprise)
- Usage-based limits on users and assets
- Automatic renewal and cancellation handling

### Setting up Stripe

1. Create a Stripe account at https://stripe.com
2. In the Stripe Dashboard, navigate to Developers > API keys
3. Copy the Publishable key and Secret key
4. Update these keys in your .env file

### Configuring Stripe Webhooks

1. In the Stripe Dashboard, go to Developers > Webhooks
2. Click "Add endpoint"
3. Enter your webhook URL (e.g., https://yourdomain.com/api/subscriptions/webhook)
4. Select the following events to listen for:
   - customer.subscription.updated
   - customer.subscription.deleted
   - customer.created
5. Click "Add endpoint"
6. Copy the Signing Secret and update it in your .env file

## Email Notifications

The application sends email notifications for the following events:

- Subscription changes
- Approaching usage limits
- Upcoming renewals
- Warranty expiration reminders
- Software subscription expiration reminders

To configure email notifications, ensure that the SMTP settings are correctly set in the .env file.

## Scheduled Tasks

The application uses node-cron to run scheduled tasks, including:

- Sending upcoming renewal notifications
- Checking for expiring warranties and sending notifications
- Monitoring software subscription expirations and sending reminders

These tasks are automatically started when the server runs.

## Testing

To thoroughly test the application:

1. Test asset management features:
   - Adding, editing, and deleting assets
   - Assigning assets to users
   - Filtering and searching assets

2. Test software subscription management features:
   - Adding, editing, and deleting software subscriptions
   - Tracking subscription renewals and expirations

3. Test the subscription flow:
   - New subscription sign-up
   - Subscription upgrade/downgrade
   - Subscription cancellation
   - Failed payment scenarios

4. Verify that appropriate email notifications are sent for each scenario
5. Check that usage limits are enforced correctly
6. Test the reports and dashboards functionality
7. Verify that scheduled tasks for notifications are working correctly

## Considerations for Larger-Scale Deployments

For larger-scale deployments, consider the following:

1. Use a more robust job scheduling system like Bull or Agenda, which use Redis for better scalability and reliability.
2. Implement a caching layer (e.g., Redis) to reduce database load and improve response times.
3. Set up a load balancer and multiple application servers to handle increased traffic.
4. Use a managed database service for better scalability and automatic backups.
5. Implement rate limiting to prevent API abuse.
6. Set up monitoring and alerting using tools like Prometheus and Grafana.
7. Use a Content Delivery Network (CDN) for serving static assets.
8. Implement database indexing and query optimization for better performance.

## Troubleshooting

If you encounter any issues during the installation or running of the application, please check the following:

1. Ensure all environment variables are correctly set in the .env file.
2. Check the Docker logs for any error messages:
   ```
   docker-compose logs
   ```
3. Verify that the Stripe webhook is correctly set up and the secret is properly configured.
4. Ensure your SMTP settings are correct and the email server is accessible.
5. Check the error logs in the `error.log` and `combined.log` files for any application-specific issues.

## Contributing

Please read CONTRIBUTING.md for details on our code of conduct and the process for submitting pull requests.

## License

This project is licensed under the MIT License - see the LICENSE.md file for details.
