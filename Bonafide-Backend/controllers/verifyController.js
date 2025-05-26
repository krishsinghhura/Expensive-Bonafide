const Data = require("../model/data"); // Adjust the path if needed
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
      student = parsedData.find(entry => entry.EMAIL === email);
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

    // Get all student details
    let name = null;
    let certificateUrl = null;
    let jsonUrl = null;
    
    if (fromRedis) {
      name = student.name || student.NAME; // Handle different capitalization
      certificateUrl = student.CertificateUrl;
      jsonUrl = student.JSONUrl;
    } else {
      const studentWithCert = await Data.findOne({ email });
      name = studentWithCert?.name || null;
      certificateUrl = studentWithCert?.CertificateUrl || null;
      jsonUrl = studentWithCert?.JSONUrl || null;
    }

    // Prepare response
    const response = {
      status: 'OK',
      email: fromRedis ? student.EMAIL : student.email,
      name: name || undefined, // Only include if exists
      transactionHash: student.blockchainTxnHash,
      certificateUrl: certificateUrl || undefined,
      jsonUrl: jsonUrl || undefined
    };
    
    return res.status(200).json(response);

  } catch (error) {
    console.error('Verification error:', error.message);
    return res.status(500).json({ error: 'Internal server error' });
  }
};

module.exports = { verifyStudent };