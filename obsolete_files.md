# Potentially Obsolete Files

The following files may no longer be part of the active project. They should be reviewed and potentially removed if they are no longer needed:

1. `saas-it-inventory/temp_query_subscriptions.js`
   - This file has "temp" in its name, suggesting it might be a temporary file that was not removed.

2. `saas-it-inventory/backend/models/Asset.js` and `saas-it-inventory/backend/routes/assets.js`
   - These files are in a `backend` directory, but the main structure uses `saas-it-inventory` as the backend. They might be duplicates or outdated.

3. `saas-it-inventory/controllers/reportController.test.js`
   - This is the only test file in the controllers directory. It might be an old test file or indicate that other controller tests are missing.

4. `saas-it-inventory/middleware/adminMiddleware.js` and `saas-it-inventory/middleware/isAdminMiddleware.js`
   - These files seem to serve similar purposes. One of them might be redundant.

5. `saas-it-inventory/scripts/updateRootPassword.js` and `saas-it-inventory/scripts/updateRootPasswordSimple.js`
   - These scripts appear to do similar things. One might be an older version that wasn't removed.

6. `saas-it-inventory-frontend/src/App.test.js` and `saas-it-inventory-frontend/src/setupTests.js`
   - These are the only test-related files in the src directory. If testing is not being actively done, these might be obsolete.

7. `saas-it-inventory-frontend/src/logo.svg` and `saas-it-inventory-frontend/src/reportWebVitals.js`
   - These files are often part of a default React setup and might not be used in the actual application.

8. `saas-it-inventory-frontend/src/components/Register.js`
   - If user registration is handled differently (e.g., by admins only), this component might not be used.

9. `scripts/healthCheck.sh`
   - This script is in a separate `scripts` directory at the root level, which doesn't align with the project structure. It might be outdated or misplaced.

Please review these files and remove them if they are no longer needed for the project. Always make sure to check for any dependencies before removing files.
