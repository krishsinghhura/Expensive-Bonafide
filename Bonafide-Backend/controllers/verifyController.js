const Data = require("../model/data"); // Adjust the path if needed
const Student = require("../model/Student");

const verifyStudent = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ error: 'Email is required' });
    }


    const student = await Data.findOne({ email });

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

const getCertificate = async (req, res) => {
  try {
    const { email } = req.query;

    if (!email) {
      return res.status(400).json({ error: "Email is required" });
    }

    const student = await Student.findOne({ email });

    if (!student) {
      return res.status(404).json({ error: "Student not found" });
    }

    if (!student.CertificateUrl) {
      return res.status(404).json({ error: "Certificate not generated yet" });
    }

    return res.status(200).json({
      name: student.name,
      email: student.email,
      certificateUrl: student.CertificateUrl,
    });
  } catch (err) {
    console.error("❌ Error fetching certificate:", err);
    return res.status(500).json({ error: "Server error" });
  }
};

module.exports = { verifyStudent,getCertificate };