const express = require('express');
const router = express.Router();
const { login, getAllUsers, register, getUserById, updatePassword } = require('../controllers/loginController');

router.post('/login', login);
router.post('/register', register);
router.get('/users', getAllUsers);  // Idealnya ditambah middleware untuk cek admin
router.get('/users/:id', getUserById);  // Endpoint untuk mendapatkan user by ID
router.put('/users/:id/password', updatePassword);  // Endpoint untuk update password

module.exports = router;
