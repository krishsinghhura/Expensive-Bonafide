
const express = require('express');
const { verifyStudent,getCertificate } = require('../controllers/verifyController');
const router = express.Router();
const univMiddleware = require('../middleware/univMiddleware');

// Route to sync data to the blockchain
router.post('/verify', verifyStudent);

router.get('/verify', univMiddleware,verifyStudent);

module.exports = router;

