const express = require('express');
const router = express.Router();
const { registerStudent,loginStudent } = require('../controllers/studentAuthController');
const {getStudentProfile }=require("../controllers/StudentDashboardData");
const verifyStudentToken = require("../middleware/StudentMiddleware");

router.post('/register', registerStudent);

router.post('/login', loginStudent);

router.get("/dashboard-data",verifyStudentToken,getStudentProfile);

module.exports = router;
