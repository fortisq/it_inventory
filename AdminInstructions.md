# Admin Instructions for SaaS IT Inventory Application

## Accessing Admin Features

1. Log in with your admin account.
2. In the main navigation menu, click on "Admin" to access the admin panel.
3. The admin panel provides access to various administrative functions.

## Navigating the Admin Panel

1. The admin panel now features a collapsible menu for better mobile responsiveness.
2. On smaller screens, use the "Show/Hide Admin Menu" button to toggle the visibility of admin options.
3. Each admin function is represented by a card with a title and brief description.

## User Management

1. Navigate to "User Management" in the admin panel.
2. Here you can:
   - View all users
   - Add new users: Click "Add User" and fill in the required information.
   - Edit existing users: Click on a user's name and make necessary changes.
   - Deactivate user accounts: Toggle the "Active" status for a user.
3. Use the search and filter options to find specific users.
4. Confirmation dialogs have been added for critical actions like user deletion.

## Tenant Management

1. Go to "Tenant Management" in the admin panel.
2. In this section, you can:
   - View all tenants
   - Add new tenants: Click "Add Tenant" and provide the required details.
   - Edit existing tenants: Select a tenant from the list and make changes.
   - Manage tenant subscriptions and access levels.
3. The tenant list now features improved responsiveness for better viewing on mobile devices.

## System Health Monitoring

1. Access "System Health" in the admin panel.
2. The System Health dashboard now features collapsible sections for easier navigation.
3. It provides:
   - Current system status
   - Database health and statistics
   - Application performance metrics
   - Server resource utilization
4. Set up alerts for critical metrics to receive notifications when thresholds are exceeded.

## Subscription and Billing Management

1. Navigate to "Subscription Management" in the admin panel.
2. Here you can:
   - View and manage tenant subscriptions
   - Change a tenant's subscription plan
   - View billing history
   - Manage payment information
3. Generate reports on subscription status and revenue.
4. The subscription management interface has been optimized for mobile devices.

## Backup and Restore

1. Go to "Backup and Restore" in the admin panel.
2. To create a backup:
   - Click "Create Backup"
   - Choose backup options (full or partial)
   - Follow the prompts to complete the backup process
3. To restore from a backup:
   - Select the backup file
   - Click "Restore"
   - Confirm the restoration process
4. A new progress indicator has been added to show backup/restore status.

## System Updates

1. When a new update is available, you'll see a notification in the admin dashboard.
2. To apply an update:
   - Go to "System Updates" in the admin panel
   - Review the update details and changelog
   - Click "Apply Update"
   - Follow the prompts to complete the update process
3. Always ensure you have a recent backup before applying updates.
4. The update process now features a more detailed progress indicator.

## Payment and SMTP Configuration

After the initial setup, you need to configure the payment (Stripe) and SMTP settings in the admin panel.

### Configuring Stripe for Payments

1. Navigate to "Payment Settings" in the admin panel.
2. Enter your Stripe API keys:
   - Stripe Publishable Key
   - Stripe Secret Key
3. Configure your subscription plans:
   - Set up the pricing tiers
   - Define the features available in each plan
4. Save the changes.

### Setting up SMTP for Email Notifications

1. Go to "Email Settings" in the admin panel.
2. Enter your SMTP server details:
   - SMTP Host
   - SMTP Port
   - SMTP Username
   - SMTP Password
   - From Email Address
3. Test the email configuration by sending a test email.
4. Save the settings once the test is successful.

### Configuring Stripe Webhooks

1. In your Stripe Dashboard, go to Developers > Webhooks.
2. Click "Add endpoint" and enter your webhook URL (e.g., https://yourdomain.com/api/subscriptions/webhook).
3. Select the following events to listen for:
   - customer.subscription.updated
   - customer.subscription.deleted
   - customer.created
4. Copy the Webhook Signing Secret provided by Stripe.
5. In the admin panel, navigate to "Payment Settings" and enter the Webhook Signing Secret.

Remember to keep your API keys and SMTP credentials secure. Do not share them with unauthorized individuals.

## Reports and Analytics

1. Access "Reports and Analytics" in the admin panel.
2. Here you can:
   - View and manage all available report types
   - Create new report templates
   - Generate system-wide reports
   - View usage statistics and trends
   - Export data for further analysis
3. The reporting interface has been redesigned for improved usability on all devices.

### Managing Report Types

1. In the Reports and Analytics section, click on "Manage Report Types".
2. You can:
   - View existing report types
   - Create new report types: Click "Add Report Type" and define the report parameters
   - Edit existing report types: Click on a report type to modify its settings
   - Delete report types: Use the delete option, but be cautious as this may affect users
3. Confirmation dialogs have been added for critical actions like report type deletion.

### Generating Admin-level Reports

1. Click on "Generate Report" in the Reports and Analytics section.
2. Select the report type you want to generate.
3. Choose the parameters for your report (e.g., date range, specific tenants).
4. Click "Generate" to create the report.
5. View the generated report on screen or download it in various formats (CSV, PDF, etc.).
6. A new progress indicator has been added to show report generation status.

### Scheduling Reports

1. In the Reports and Analytics section, click on "Scheduled Reports".
2. Here you can:
   - Set up recurring reports to be generated automatically
   - Define the frequency (daily, weekly, monthly)
   - Specify recipients to receive the reports via email
3. The scheduling interface now features an improved calendar view for easier date selection.

## Accessibility Improvements

1. All interactive elements now have proper ARIA labels for improved screen reader support.
2. Keyboard navigation has been enhanced throughout the admin panel.
3. Color contrast has been improved for better readability.
4. A new "High Contrast" mode can be enabled in the user settings for users who need it.

## Help and Support Management

1. Navigate to "Help & Support Management" in the admin panel.
2. Here you can:
   - View and manage help documents
   - Respond to user help requests
   - Create and edit system update announcements

### Managing Help Documents

1. Click on "Manage Help Documents" in the Help & Support Management section.
2. You can:
   - View existing help documents
   - Create new help documents: Click "Add Document" and fill in the title, content, and category
   - Edit existing documents: Click on a document to modify its content
   - Delete documents: Use the delete option, but be cautious as this may affect users

### Responding to Help Requests

1. Click on "Manage Help Requests" in the Help & Support Management section.
2. You'll see a list of all help requests, sorted by status and priority.
3. Click on a request to view its details and respond.
4. You can:
   - Update the status of the request (Open, In Progress, Resolved, Closed)
   - Add internal notes visible only to admins
   - Respond to the user
   - Assign the request to a specific admin

### Creating System Update Announcements

1. Click on "Manage System Updates" in the Help & Support Management section.
2. You can:
   - Create new system update announcements
   - Edit existing announcements
   - Delete outdated announcements

### Notifications

- When there are new help requests, you'll see a red badge with a number on the "Admin" menu item.
- Click on "Help & Support Management" to view and manage these new requests.
- Respond to requests promptly to maintain good user support.

## Troubleshooting

1. Check the "System Logs" section for any error messages or warnings.
2. Use the "Diagnostics" tool to run system checks and identify potential issues.
3. Review the "Audit Log" to track important system events and user actions.
4. If you can't resolve an issue, please contact technical support.

## Best Practices

1. Regularly review user accounts and permissions to ensure proper access control.
2. Monitor system health and performance metrics to proactively address potential issues.
3. Keep the system updated to ensure security and optimal performance.
4. Regularly backup the system and test the restoration process.
5. Use strong, unique passwords and enable two-factor authentication for admin accounts.
6. Educate users about security best practices and acceptable use policies.
7. Regularly review and update report types to ensure they meet the evolving needs of the organization.
8. Analyze generated reports to identify trends, potential issues, or areas for improvement in IT asset management.
9. Familiarize yourself with the new responsive design to effectively manage the system on various devices.

Remember, as an administrator, you have significant control over the system. Always be cautious when making system-wide changes and consider the potential impact on all users and tenants.

## SMTP and Stripe Settings Management

### Managing SMTP Settings (Admin and Tenant)

1. Navigate to "Email Settings" in the admin panel.
2. Here you can view and update the global SMTP settings.
3. For tenant-specific SMTP settings:
   - Go to "Tenant Management"
   - Select the specific tenant
   - Click on "Email Settings" for that tenant
4. Tenants can configure their own SMTP settings, which will override the global settings for their specific tenant.

### Managing Stripe Settings (Admin Only)

1. Go to "Payment Settings" in the admin panel.
2. Here you can view and update the global Stripe settings.
3. To manage Stripe settings for individual tenants:
   - Navigate to "Tenant Management"
   - Select the specific tenant
   - Click on "Payment Settings" for that tenant
4. Only administrators can adjust Stripe settings. These settings apply globally or can be customized for each tenant.

### Best Practices for SMTP and Stripe Management

1. Regularly review and update SMTP and Stripe settings to ensure they are current and secure.
2. Use environment variables or secure vaults to store sensitive information like API keys and passwords.
3. Implement proper error handling and logging for SMTP and Stripe operations to quickly identify and resolve issues.
4. Provide clear instructions to tenants on how to configure their SMTP settings if they choose to use their own.
5. Regularly audit Stripe settings and transactions to ensure compliance with financial regulations and to detect any unusual activity.
