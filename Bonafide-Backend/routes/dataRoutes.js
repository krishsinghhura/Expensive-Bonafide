
const express = require('express');
const univMiddleware = require('../middleware/middleware');
const verifyStudentToken = require('../middleware/StudentMiddleware');
const { getStudentProfile } = require('../controllers/StudentDashboardData');
const { getDataForUser, getAuthenticatedUserDetails } = require('../controllers/dataController');
const router = express.Router();

// Route to sync data to the blockchain
router.get('/data', univMiddleware ,  getDataForUser);
router.get('/details',univMiddleware,getAuthenticatedUserDetails)
router.get('/student',getStudentProfile);

module.exports = router;
