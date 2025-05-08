const Student = require('../models/student'); // Adjust the path if needed

const verifyStudent = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ error: 'Email is required' });
    }

    const student = await Student.findOne({ email });

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

module.exports = { verifyStudent };
