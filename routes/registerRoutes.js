const express = require('express');
const router = express.Router();
const { register } = require('../controllers/registerController');

// Pastikan ini menggunakan registerController, bukan loginController
router.post('/register', register);

module.exports = router; 