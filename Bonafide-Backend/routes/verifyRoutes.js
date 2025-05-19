
const express = require('express');
const { verifyStudent,getCertificate } = require('../controllers/verifyController');
const router = express.Router();

// Route to sync data to the blockchain
router.post('/verify', verifyStudent);

router.get('/verify', verifyStudent);

module.exports = router;

