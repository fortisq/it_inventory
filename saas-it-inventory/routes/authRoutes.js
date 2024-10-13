const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { authMiddleware } = require('../middleware/authMiddleware');

router.post('/login', authController.login);
router.post('/register', authController.register);
router.get('/current-user', authMiddleware, authController.getCurrentUser);
router.put('/update-profile', authMiddleware, authController.updateProfile);

module.exports = router;
