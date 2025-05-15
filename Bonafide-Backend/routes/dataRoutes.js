const { getDataForUser } = require('../controllers/dataController');
const express = require('express');
const univMiddleware = require('../middleware/middleware');
const router = express.Router();

// Route to sync data to the blockchain
router.get('/data', univMiddleware ,  getDataForUser);

module.exports = router;
