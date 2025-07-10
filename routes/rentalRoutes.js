const express = require('express');
const path = require('path');
const router = express.Router();
const { 
    getAllRentals,
    getRentalById,
    createRental,
    returnRental,
    getRentalReports,
    getUserNotifications,
    markNotificationRead,
    getRentalsByUserId
} = require('../controllers/rentalController');

router.get('/rentals', getAllRentals);
router.get('/rentals/:id', getRentalById);
router.post('/rentals', createRental);
router.put('/rentals/:id/return', returnRental);
router.get('/rental-reports', getRentalReports);
router.get('/notifications/user/:user_id', getUserNotifications);
router.put('/notifications/:id/read', markNotificationRead);
router.get('/rentals/user/:user_id', getRentalsByUserId);

// Serve damage proof images
router.use('/uploads/damage_proofs', express.static(path.join(__dirname, '../uploads/damage_proofs')));

module.exports = router; 