// uploadRoutes.js
const express = require('express');
const router = express.Router();
const { uploadData,getDataFromRedis} = require('../controllers/uploadController');
const univMiddleware = require('../middleware/univMiddleware');

router.post('/upload', uploadData);

router.get('/fetch',univMiddleware,getDataFromRedis);

module.exports = router;
