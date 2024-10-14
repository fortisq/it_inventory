const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

// User routes
router.get('/', (req, res) => userController.getUsers(req, res));
router.post('/', (req, res) => userController.addUser(req, res));
router.put('/:id', (req, res) => userController.updateUser(req, res));
router.delete('/:id', (req, res) => userController.deleteUser(req, res));

module.exports = router;
