
const express = require('express');
const { verifyStudent } = require('../controllers/verifyController');
const router = express.Router();

// Route to sync data to the blockchain
<<<<<<< HEAD
router.post('/verify', verifyStudent);

module.exports = router;
=======
router.get('/verify', verifyStudent);

module.exports = router;
>>>>>>> 8e2de42e3d34390e4219769c066ddb8c65b270fe
