<<<<<<< HEAD
const Data = require("../model/data"); // Adjust the path if needed
=======
const Student = require('../models/student'); // Adjust the path if needed
>>>>>>> 8e2de42e3d34390e4219769c066ddb8c65b270fe

const verifyStudent = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ error: 'Email is required' });
    }

<<<<<<< HEAD
    const student = await Data.findOne({ email });
=======
    const student = await Student.findOne({ email });
>>>>>>> 8e2de42e3d34390e4219769c066ddb8c65b270fe

    if (!student) {
      return res.status(404).json({ error: 'Student not found' });
    }

    if (!student.blockchainTxnHash) {
      return res.status(400).json({ error: 'Blockchain transaction not found for this student' });
    }

    return res.status(200).json({
      status: 'OK',
      email: student.email,
      transactionHash: student.blockchainTxnHash,
    });

  } catch (error) {
    console.error('Verification error:', error.message);
    return res.status(500).json({ error: 'Internal server error' });
  }
};

<<<<<<< HEAD
module.exports = { verifyStudent };
=======
module.exports = { verifyStudent };
>>>>>>> 8e2de42e3d34390e4219769c066ddb8c65b270fe
