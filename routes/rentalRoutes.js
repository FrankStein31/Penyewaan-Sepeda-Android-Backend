const express = require('express');
const router = express.Router();
const { 
    getAllRentals,
    getRentalById,
    createRental,
    returnRental,
    stopRental
} = require('../controllers/rentalController');

router.get('/rentals', getAllRentals);
router.get('/rentals/:id', getRentalById);
router.post('/rentals', createRental);
router.put('/rentals/:id/return', returnRental);
router.put('/rentals/:id/stop', stopRental);

module.exports = router; 