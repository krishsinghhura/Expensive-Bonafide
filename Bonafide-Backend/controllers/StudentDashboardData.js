const data = require("../model/Data");
const Student = require("../model/Student");
const redisClient = require("../redis/redisClient");

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
    const studentEmail = student.email.toLowerCase(); // Normalize email case
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
      redisRecords = parsedData.filter(item => 
        item.EMAIL && item.EMAIL.toLowerCase() === studentEmail
      ).map(redisItem => ({
        // Transform Redis data to match MongoDB format
        name: redisItem.NAME,
        email: redisItem.EMAIL,
        aadhar_number: redisItem['AADHAR NUMBER'],
        registration_number: redisItem['REGISTRATION NUMBER'],
        department: redisItem.DEPARTMENT,
        cgpa: redisItem.CGPA,
        university: redisItem.university,
        source: 'redis' // Add source marker
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