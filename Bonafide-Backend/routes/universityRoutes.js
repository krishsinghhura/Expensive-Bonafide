const express = require('express');
const router = express.Router();
const { registerUniversity,loginUniversity,verifyOtp} = require('../controllers/universityController');

router.post('/register', registerUniversity);

router.post("/login",loginUniversity)

router.post("/verify-otp",verifyOtp);

module.exports = router;
