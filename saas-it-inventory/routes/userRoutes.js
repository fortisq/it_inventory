const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { authMiddleware, isTenantAdminOrSuperAdmin, isSuperAdmin } = require('../middleware/authMiddleware');

// User routes
router.get('/', authMiddleware, isTenantAdminOrSuperAdmin, userController.getUsers);
router.post('/', authMiddleware, isTenantAdminOrSuperAdmin, userController.addUser);
router.put('/:id', authMiddleware, isTenantAdminOrSuperAdmin, userController.updateUser);
router.delete('/:id', authMiddleware, isTenantAdminOrSuperAdmin, userController.deleteUser);

// Super Admin only routes
router.post('/superadmin', authMiddleware, isSuperAdmin, userController.addUser);

module.exports = router;
