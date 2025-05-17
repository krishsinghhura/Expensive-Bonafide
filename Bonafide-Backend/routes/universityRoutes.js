const express = require('express');
const router = express.Router();
const { registerUniversity,loginUniversity } = require('../controllers/universityController');

router.post('/register', registerUniversity);

router.post("/login",loginUniversity)

module.exports = router;
