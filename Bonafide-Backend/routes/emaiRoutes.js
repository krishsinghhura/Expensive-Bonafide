const { syncDataToBlockchain,cancelSync } = require('../controllers/emailController');
const express = require('express');
const router = express.Router();

// Route to sync data to the blockchain
router.get('/upload-email',syncDataToBlockchain);
router.post('/cancel',cancelSync);

module.exports = router;
