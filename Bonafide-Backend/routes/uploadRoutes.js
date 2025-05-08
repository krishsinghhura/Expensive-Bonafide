// uploadRoutes.js
const express = require('express');
const router = express.Router();
const { uploadData,getDataFromRedis} = require('../controllers/uploadController');

router.post('/upload', uploadData);

router.get('/fetch', getDataFromRedis);

module.exports = router;
