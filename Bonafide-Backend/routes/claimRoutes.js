const { updateClaimData } = require('../controllers/claimCertificate');
const express = require('express');
const router = express.Router();

// Route to sync data to the blockchain
router.post('/claim',updateClaimData);

module.exports = router;
