# Frequently Asked Questions (FAQ) for SaaS IT Inventory Application

## General Questions

### Q: What is the SaaS IT Inventory Application?
A: It's a cloud-based solution for managing IT assets and software subscriptions, designed for businesses of all sizes. It helps track hardware, software licenses, and provides reporting and analytics features.

### Q: How secure is my data?
A: We use industry-standard encryption and security practices to protect your data. All data is encrypted at rest and in transit. We also employ regular security audits and follow best practices for data protection.

## Installation and Setup

### Q: How do I set up the application?
A: Follow the instructions in the README.md file. Run the setup.sh script, which will guide you through the installation process, including database setup and JWT secret generation.

### Q: Where do I configure payment and SMTP settings?
A: After the initial setup, administrators can configure payment (Stripe) and SMTP settings in the admin panel. Refer to the AdminInstructions.md file for detailed steps.

### Q: Is the JWT secret automatically generated?
A: Yes, the setup script now automatically generates a secure JWT secret for you. Make sure to save this secret securely, as you'll need it for admin configuration.

## Account Management

### Q: How do I reset my password?
A: Click on the "Forgot Password" link on the login page and follow the instructions sent to your email. If you're logged in, you can change your password in the "My Profile" section.

### Q: Can I change my email address?
A: Yes, you can change your email address in the "My Profile" section. An admin may need to approve this change depending on your organization's settings.

### Q: How do I update my profile information?
A: Navigate to the "My Profile" section from the main menu. Here you can update your personal information, change your password, and manage notification preferences.

## Asset Management

### Q: How do I add a new asset?
A: Navigate to the "Asset Management" section, click "Add Asset", fill in the required information, and click "Add Asset" to save.

### Q: Can I import assets in bulk?
A: Yes, we support bulk import via CSV files. Go to the "Asset Management" section and click on "Bulk Import". Follow the instructions to upload your CSV file.

### Q: How do I edit or delete an asset?
A: In the "Asset Management" section, find the asset in the list. Click the "Edit" button to modify the asset's information or the "Delete" button to remove it. You'll be asked to confirm before deleting an asset.

## Software Subscription Management

### Q: How do I track software license usage?
A: Each software subscription entry allows you to input the number of licenses and track assignments to users or devices. You can view this information in the "Software Subscriptions" section.

### Q: Does the system send reminders for expiring subscriptions?
A: Yes, the system sends email notifications for upcoming subscription renewals and expirations. You can configure these notifications in the "My Profile" section.

## Reporting and Analytics

### Q: What types of reports are available?
A: We offer various reports including asset summaries, subscription status, cost analysis, usage trends, and custom reports. You can access these in the "Reports" section.

### Q: Can I schedule regular reports?
A: Yes, you can set up scheduled reports in the "Reports" section. Choose the report type, frequency, and recipients, and the system will automatically generate and send the reports.

### Q: Can I create custom reports?
A: Yes, we offer a custom report builder in the "Reports" section. You can select the data points you want to include and customize the layout of your report.

## System Health and Performance

### Q: How can I check the system's health?
A: Administrators can access the "System Health" section from the Admin Panel. This provides real-time information about system performance, database health, and other key metrics.

### Q: What should I do if I notice performance issues?
A: If you notice any performance issues, please contact your system administrator or our support team. Administrators can check the "System Health" dashboard for potential causes.

## Billing and Subscription

### Q: How is the service billed?
A: We offer monthly and annual subscription plans. Billing is based on the number of assets and users in your account. You can view your current plan and usage in the "Subscription" section.

### Q: Can I upgrade or downgrade my subscription?
A: Yes, you can change your subscription plan at any time. Changes will be reflected in your next billing cycle. To make changes, go to the "Subscription" section and select "Change Plan".

### Q: How do I set up Stripe for payments?
A: Administrators can set up Stripe in the admin panel under "Payment Settings". You'll need to enter your Stripe API keys and configure your subscription plans. Detailed instructions are available in the AdminInstructions.md file.

### Q: Can I use a different payment processor?
A: Currently, the application is set up to use Stripe. If you need to use a different payment processor, please contact our support team for assistance.

## Email Notifications

### Q: How do I configure email notifications?
A: Administrators can set up SMTP settings in the admin panel under "Email Settings". You'll need to provide your SMTP server details. Refer to the AdminInstructions.md file for step-by-step instructions.

### Q: What types of email notifications does the system send?
A: The system sends notifications for subscription changes, approaching usage limits, upcoming renewals, warranty expirations, and software subscription expirations. Users can manage their notification preferences in their profile settings.

## Accessibility

### Q: Is the application accessible for users with disabilities?
A: Yes, we've designed our application with accessibility in mind. We support keyboard navigation, screen readers, and offer a high contrast mode. If you have specific accessibility needs, please contact our support team.

## Technical Support

### Q: What do I do if I encounter an error?
A: First, check this FAQ and the user documentation. If the issue persists, contact our support team through the in-app support chat or email support@example.com. For critical issues, administrators can check the "System Logs" in the Admin Panel.

### Q: Is there a mobile app available?
A: Currently, we offer a responsive web application that works on mobile devices. A dedicated mobile app is in our product roadmap.

## Help and Support Portal

### Q: What is the Help and Support Portal?
A: The Help and Support Portal is a centralized platform where users can access help documents, submit support requests, and view system updates. It's designed to provide quick assistance and improve user experience.

### Q: How do I access the Help and Support Portal?
A: You can access the Help and Support Portal by clicking on the "Help & Support" link in the main navigation menu.

### Q: Can I search for specific help topics?
A: Yes, the Help and Support Portal includes a search function that allows you to find specific help documents or topics quickly.

### Q: How do I submit a help request?
A: In the Help and Support Portal, click on "Submit New Request", fill out the form with your question or issue details, and click "Submit". Our support team will respond to your request as soon as possible.

### Q: How can I check the status of my help request?
A: In the Help and Support Portal, click on "My Requests" to view a list of all your submitted requests and their current status.

### Q: Will I be notified of updates to my help request?
A: Yes, you'll receive notifications when there are updates to your help requests. These notifications will appear in the application and may also be sent via email, depending on your notification settings.

### Q: Can I view system updates and announcements in the Help and Support Portal?
A: Yes, the Help and Support Portal includes a section for system updates and announcements. This keeps you informed about new features, maintenance schedules, and other important information.

## SMTP and Stripe Settings Management

### Q: Can tenants configure their own Stripe settings?
A: No, Stripe settings can only be configured by administrators. This ensures consistent payment processing across the platform. Tenants can view their billing information, but cannot modify payment settings directly.

### Q: How are Stripe settings managed for individual tenants?
A: Administrators can manage Stripe settings for individual tenants through the "Tenant Management" section in the admin panel. This allows for customized billing configurations when necessary.

### Q: Can tenants configure their own SMTP settings?
A: Yes, tenants can configure their own SMTP settings. These tenant-specific settings will override the global SMTP settings for that particular tenant.

### Q: How do tenant-specific SMTP settings work?
A: When a tenant configures their own SMTP settings, all email notifications for that tenant will be sent using their specific SMTP server. This allows for greater customization and control over email communications.

### Q: What happens if a tenant doesn't configure SMTP settings?
A: If a tenant doesn't configure their own SMTP settings, the system will use the global SMTP settings configured by the administrator.

### Q: Can administrators see or modify tenant-specific SMTP settings?
A: Yes, administrators have access to view and modify SMTP settings for all tenants through the "Tenant Management" section in the admin panel.

### Q: How are Stripe API keys and SMTP credentials kept secure?
A: We use industry-standard encryption to store sensitive information like API keys and credentials. Access to this information is strictly limited and all actions are logged for security auditing.

### Q: Are tenant-specific SMTP settings isolated from other tenants?
A: Yes, each tenant's SMTP settings are securely isolated. One tenant cannot access or use another tenant's SMTP configuration.

### Q: How can I monitor SMTP and Stripe integration health?
A: Administrators can monitor the health of SMTP and Stripe integrations through the "System Health" section in the admin panel. This includes checking for failed email deliveries or payment processing issues.

### Q: What should I do if there are issues with SMTP or Stripe integrations?
A: If you encounter issues, first check the system logs in the admin panel. For SMTP issues, verify the configuration settings. For Stripe issues, ensure your API keys are correct and your Stripe account is in good standing. If problems persist, contact our support team.

If you have any questions not covered here, please don't hesitate to contact our support team.
