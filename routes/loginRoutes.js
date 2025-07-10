const express = require('express');
const path = require('path');
const router = express.Router();
const { 
    login, 
    getUserById, 
    updateProfile,
    blacklistUser,
    removeBlacklist,
    getBlacklistedUsers,
    getAllUsers
} = require('../controllers/loginController');

router.post('/login', login);
router.get('/users/:id', getUserById);
router.put('/users/:id/profile', updateProfile);
router.put('/users/:id/blacklist', blacklistUser);
router.put('/users/:id/unblacklist', removeBlacklist);
router.get('/users/blacklisted', getBlacklistedUsers);
router.get('/users', getAllUsers);

// Serve KTP images
router.use('/uploads/ktp', express.static(path.join(__dirname, '../uploads/ktp')));

module.exports = router;
