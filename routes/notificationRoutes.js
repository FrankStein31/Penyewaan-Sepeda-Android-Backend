const express = require('express');
const router = express.Router();
const { 
    getUserNotifications,
    markNotificationRead,
    getUnreadCount
} = require('../controllers/notificationController');

router.get('/notifications/user/:user_id', getUserNotifications);
router.put('/notifications/:id/read', markNotificationRead);
router.get('/notifications/user/:user_id/unread', getUnreadCount);

module.exports = router; 