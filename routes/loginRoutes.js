const express = require('express');
const path = require('path');
const router = express.Router();
const { login, getUserById, updateProfile } = require('../controllers/loginController');

router.post('/login', login);
router.get('/users/:id', getUserById);
router.put('/users/:id/profile', updateProfile);

// Serve KTP images
router.use('/uploads/ktp', express.static(path.join(__dirname, '../uploads/ktp')));

module.exports = router;
