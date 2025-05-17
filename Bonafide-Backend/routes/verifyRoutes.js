
const express = require('express');
const { verifyStudent,getCertificate } = require('../controllers/verifyController');
const router = express.Router();

// Route to sync data to the blockchain
router.post('/verify', verifyStudent);

module.exports = router;
router.get('/verify', verifyStudent);

router.get("/get-certificate",getCertificate)

module.exports = router;

