const express = require('express');
const router = express.Router();
const { 
    simulatePayment,
    getPaymentMethods
} = require('../controllers/simulationController');

router.post('/payment/simulate', simulatePayment);
router.get('/payment/methods', getPaymentMethods);

module.exports = router;
