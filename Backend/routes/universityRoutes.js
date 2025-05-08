const express = require('express');
const router = express.Router();
const { registerUniversity } = require('../controllers/universityController');

router.post('/register', registerUniversity);

module.exports = router;
