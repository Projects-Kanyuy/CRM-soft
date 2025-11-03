const express = require('express');
const router = express.Router();
const { signupUser, loginUser } = require('../controllers/authController');

// Route for user registration
router.post('/signup', signupUser);

// Route for user login
router.post('/login', loginUser);

module.exports = router;