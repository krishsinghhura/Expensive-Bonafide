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

    // Get certificate URL and JSON URL
    let certificateUrl = null;
    let jsonUrl = null;
    
    if (fromRedis) {
      name=student.name;
      certificateUrl = student.CertificateUrl;
      jsonUrl = student.JSONUrl; // Get JSON URL from Redis data
    } else {
      const studentWithCert = await Student.findOne({ email });
      name=studentWithCert?.name;
      certificateUrl = studentWithCert?.CertificateUrl || null;
      jsonUrl = studentWithCert?.JSONUrl || null; // Get JSON URL from database
    }

    // Prepare response
    const response = {
      status: 'OK',
      email: fromRedis ? student.EMAIL : student.email,
      name:name,
      transactionHash: student.blockchainTxnHash,
      certificateUrl: certificateUrl || undefined, // Only include if exists
      jsonUrl: jsonUrl || undefined // Only include if exists
    };
    
    console.log("certificateUrl", certificateUrl);
    console.log("jsonUrl", jsonUrl);
    
    return res.status(200).json(response);

  } catch (error) {
    console.error('Verification error:', error.message);
    return res.status(500).json({ error: 'Internal server error' });
  }
};

module.exports = { verifyStudent };