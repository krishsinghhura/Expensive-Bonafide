const data = require("../model/data");
const Student = require("../model/Student");
const redisClient = require("../redis/redisClient");
const University=require("../model/University");

const getStudentProfile = async (req, res) => {
  try {
    const studentId = req.user.id;
    console.log("Student ID:", studentId);
    
    if (!studentId) {
      return res.status(404).json({ error: "Student ID not found" });
    }

    // Get student email from Student collection
    const student = await Student.findById(studentId);
    if (!student || !student.email) {
      return res.status(404).json({ error: "Student email not found" });
    }
    const studentEmail = student.email.toLowerCase();
    console.log("Searching for records with email:", studentEmail);

    // Check BOTH MongoDB and Redis in parallel
    const [mongoRecords, redisData] = await Promise.all([
      data.find({ email: studentEmail }).populate("university"),
      redisClient.get("excel_data")
    ]);

    // Process Redis data if it exists
    let redisRecords = [];
    if (redisData) {
      const parsedData = JSON.parse(redisData);
      const redisItems = parsedData.filter(item => 
        item.EMAIL && item.EMAIL.toLowerCase() === studentEmail
      );
      
      // Get all unique university IDs from Redis data
      const universityIds = [...new Set(redisItems.map(item => item.university))];
      
      // Fetch all universities in one query
      const universities = await University.find({ 
        _id: { $in: universityIds } 
      });
      
      // Create a map for quick lookup
      const universityMap = new Map();
      universities.forEach(univ => universityMap.set(univ._id.toString(), univ));
      
      // Transform Redis data with populated universities
      redisRecords = redisItems.map(redisItem => ({
        name: redisItem.NAME,
        email: redisItem.EMAIL,
        aadhar_number: redisItem['AADHAR NUMBER'],
        registration_number: redisItem['REGISTRATION NUMBER'],
        department: redisItem.DEPARTMENT,
        cgpa: redisItem.CGPA,
        university: universityMap.get(redisItem.university) || null,
        blockchainTxnHash: redisItem.blockchainTxnHash,
        CertificateUrl: redisItem.CertificateUrl,
        JSONUrl: redisItem.JSONUrl,
        claimed: redisItem.claimed,
        walletAddress: redisItem.walletAddress,
        source: 'redis'
      }));
      console.log(`Found ${redisRecords.length} Redis records`);
    }

    console.log(`Found ${mongoRecords.length} MongoDB records`);

    // Add source marker to MongoDB records
    const markedMongoRecords = mongoRecords.map(record => ({
      ...record.toObject(),
      source: 'mongodb'
    }));

    // Combine results
    const combinedRecords = [...markedMongoRecords, ...redisRecords];
    
    if (combinedRecords.length === 0) {
      return res.status(404).json({ error: "No records found for this student" });
    }

    res.status(200).json({
      message: "Student records retrieved successfully",
      sources: {
        mongodb: markedMongoRecords.length,
        redis: redisRecords.length
      },
      data: combinedRecords
    });

  } catch (err) {
    console.error("Error fetching student profile:", err);
    res.status(500).json({ error: "Server error" });
  }
};

module.exports = { getStudentProfile };