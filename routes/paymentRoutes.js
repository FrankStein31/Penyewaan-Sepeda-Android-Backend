const express = require('express');
const router = express.Router();
const { 
    createPayment,
    createPenaltyPayment,
    handleNotification,
    getPaymentStatus,
    updatePaymentStatus,
    getPenaltyPaymentStatus
} = require('../controllers/paymentController');

// Route untuk pembayaran rental
router.post('/rentals/:rental_id/payment', createPayment);

// Route untuk pembayaran denda
router.post('/rentals/:rental_id/penalty/payment', createPenaltyPayment);

// Route notifikasi dan status
router.post('/payment/notification', handleNotification);
router.get('/rentals/:rental_id/payment', getPaymentStatus);
router.get('/rentals/:rental_id/penalty/payment/status', getPenaltyPaymentStatus);

// Route update status pembayaran
router.put('/rentals/:rental_id/status', updatePaymentStatus);
router.put('/rentals/:rental_id/penalty/payment/status', updatePaymentStatus);  // Route untuk update status denda

module.exports = router;
