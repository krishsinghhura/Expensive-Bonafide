const { syncDataToBlockchain } = require('../controllers/emailController');
const express = require('express');
const router = express.Router();

// Route to sync data to the blockchain
router.get('/upload-email', syncDataToBlockchain);

module.exports = router;
