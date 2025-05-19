const Data = require("../model/data"); // Adjust the path if needed
const Student = require("../model/Student");
const redis = require("../redis/redisClient");

const verifyStudent = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ error: 'Email is required' });
    }

    // 1. First try to find the student in Redis
    let student = null;
    let fromRedis = false;
    const redisData = await redis.get("excel_data");

    if (redisData) {
      const parsedData = JSON.parse(redisData);
      student = parsedData.find(entry => entry.EMAIL === email); // Note: using EMAIL (uppercase) to match your data structure
      fromRedis = true;
    }

    // 2. If not found in Redis, fall back to database
    if (!student) {
      student = await Data.findOne({ email });
      if (!student) {
        return res.status(404).json({ error: 'Student not found' });
      }
    }

    // Verify blockchain transaction
    if (!student.blockchainTxnHash) {
      return res.status(400).json({ error: 'Blockchain transaction not found for this student' });
    }

    // Get certificate URL
    let certificateUrl = null;
    if (fromRedis) {
      certificateUrl = student.CertificateUrl;
    } else {
      const studentWithCert = await Student.findOne({ email });
      certificateUrl = studentWithCert?.CertificateUrl || null;
    }

    // Prepare response
    const response = {
      status: 'OK',
      email: fromRedis ? student.EMAIL : student.email,
      transactionHash: student.blockchainTxnHash,
      certificateUrl: certificateUrl || undefined // Only include if exists
    };
    console.log("certificateUrl",certificateUrl);
    
    return res.status(200).json(response);

  } catch (error) {
    console.error('Verification error:', error.message);
    return res.status(500).json({ error: 'Internal server error' });
  }
};

module.exports = { verifyStudent };