const express = require('express');
const router = express.Router();
const { testConnection } = require('../controllers/testController');

router.get('/test-connection', testConnection);

module.exports = router; 