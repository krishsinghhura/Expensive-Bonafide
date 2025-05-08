
const express = require('express');
const { verifyStudent } = require('../controllers/verifyController');
const router = express.Router();

// Route to sync data to the blockchain
router.get('/verify', verifyStudent);

module.exports = router;
