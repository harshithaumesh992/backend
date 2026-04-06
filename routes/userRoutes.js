const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

router.post('/register', userController.registerUser);
router.post('/login', userController.loginUser);
router.get("/", userController.getUsers);        // Get all users
router.post("/", userController.addUser);        // Add user
router.put("/:id", userController.updateUser);   // Update user
router.delete("/:id", userController.deleteUser);// Delete user

module.exports = router;