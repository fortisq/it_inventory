# Project Structure

```
.
├── README.md
├── setup.sh
├── test_setup.sh
├── test_setup.ps1
├── tree.md
│
├── saas-it-inventory/
│   ├── models/
│   │   ├── Asset.js
│   │   ├── Inventory.js
│   │   ├── Subscription.js
│   │   └── User.js
│   ├── controllers/
│   │   ├── assetController.js
│   │   ├── authController.js
│   │   ├── configurationController.js
│   │   ├── reportController.js
│   │   └── subscriptionController.js
│   ├── routes/
│   │   ├── assetRoutes.js
│   │   ├── authRoutes.js
│   │   ├── configurationRoutes.js
│   │   ├── dashboardRoutes.js
│   │   ├── inventoryRoutes.js
│   │   ├── reportRoutes.js
│   │   ├── softwareSubscriptionRoutes.js
│   │   └── subscriptionRoutes.js
│   ├── middleware/
│   │   ├── authMiddleware.js
│   │   └── isAdminMiddleware.js
│   ├── scripts/
│   │   └── updateUserPasswords.js
│   ├── server.js
│   └── temp_query_subscriptions.js
│
└── saas-it-inventory-frontend/
    ├── src/
    │   ├── components/
    │   │   ├── AssetManagement.js
    │   │   ├── Assets.js
    │   │   ├── Assets.css
    │   │   ├── ConfigurationHelpers.js
    │   │   ├── ConfigurationManagement.js
    │   │   ├── ConfigurationManagement.css
    │   │   ├── Inventory.js
    │   │   ├── Login.js
    │   │   ├── Navigation.js
    │   │   ├── Navigation.css
    │   │   ├── Profile.js
    │   │   ├── Profile.css
    │   │   ├── Reports.js
    │   │   ├── Reports.css
    │   │   ├── SubscriptionManagement.js
    │   │   ├── SubscriptionManagement.css
    │   │   ├── Subscriptions.js
    │   │   ├── Subscriptions.css
    │   │   ├── UserManagement.js
    │   │   └── UserManagement.css
    │   ├── context/
    │   │   ├── AuthContext.js
    │   │   └── ConfigurationContext.js
    │   ├── utils/
    │   │   ├── chartGenerator.js
    │   │   ├── ConfigurationManager.js
    │   │   └── reportDownload.js
    │   └── App.js
    └── ...
