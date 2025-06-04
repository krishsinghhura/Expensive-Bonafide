const Data = require("../model/data"); // Adjust the path if needed
const Student = require("../model/Student"); // Assuming this is the student model
const redis = require("../redis/redisClient");

const verifyStudent = async (req, res) => {
  try {
    let email;

    // If user ID is present in the request, fetch student and get email
    if (req.user && req.user.id) {
      const studentRecord = await Student.findById(req.user.id);
      if (!studentRecord) {
        return res.status(404).json({ error: 'Student with given ID not found' });
      }
      email = studentRecord.email;
    } else {
      email = req.body.email;
    }

    if (!email) {
      return res.status(400).json({ error: 'Email is required' });
    }

    let student = null;
    let fromRedis = false;
    let claimed = false;

    const redisData = await redis.get("excel_data");

    if (redisData) {
      const parsedData = JSON.parse(redisData);
      student = parsedData.find(entry => entry.EMAIL === email);

      if (student) {
        fromRedis = true;
        claimed = student.claimed !== undefined ? student.claimed : false;
      }
    }

    if (!student) {
      student = await Data.findOne({ email });
      if (!student) {
        return res.status(404).json({ error: 'Student not found' });
      }
      claimed = student.claimed !== undefined ? student.claimed : false;
    }

    if (!student.blockchainTxnHash) {
      return res.status(400).json({ error: 'Blockchain transaction not found for this student' });
    }

    let name = null;
    let certificateUrl = null;
    let jsonUrl = null;

    if (fromRedis) {
      name = student.name || student.NAME;
      certificateUrl = student.CertificateUrl;
      jsonUrl = student.JSONUrl;
    } else {
      const studentWithCert = await Data.findOne({ email });
      name = studentWithCert?.name || null;
      certificateUrl = studentWithCert?.CertificateUrl || null;
      jsonUrl = studentWithCert?.JSONUrl || null;
    }

    const response = {
      status: 'OK',
      email: fromRedis ? student.EMAIL : student.email,
      name: name || undefined,
      transactionHash: student.blockchainTxnHash,
      certificateUrl: certificateUrl || undefined,
      jsonUrl: jsonUrl || undefined,
      claimed: claimed
    };

    return res.status(200).json(response);

  } catch (error) {
    console.error('Verification error:', error.message);
    return res.status(500).json({ error: 'Internal server error' });
  }
};

module.exports = { verifyStudent };
