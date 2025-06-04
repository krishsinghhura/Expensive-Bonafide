const mongoose = require("mongoose");
const Data = require("../model/data");
const Student = require("../model/Student")
const redisClient = require("../redis/redisClient");
const University = require("../model/University");

const getDataForUser = async (req, res) => {
  try {
    const univId = req.user.id;
    
    let data = [];
    let fromRedis = false;

    // Try to get data from Redis first
    const redisData = await redisClient.get("excel_data");

    if (redisData) {
      try {
        const parsedData = JSON.parse(redisData);        
        // Safely filter and normalize data for the current university
        data = parsedData
          .filter((entry) => {
            if (!entry || !entry.university) return false;
            const entryUnivId = entry.university.toString
              ? entry.university.toString()
              : String(entry.university);
            return entryUnivId === univId;
          })
          .map(normalizeRedisData); // Normalize each entry
          
        fromRedis = true;
      } catch (parseError) {
        console.error("Error parsing Redis data:", parseError);
      }
    }
    
    
    // If not found in Redis or empty results, query database
    if (!fromRedis || data.length === 0) {
      data = await Data.find({
        university: new mongoose.Types.ObjectId(univId),
      });
    }

    res.json({
      data,
      meta: {
        source: fromRedis ? "redis" : "database",
      },
    });
  } catch (err) {
    console.error("Error fetching data:", err);
    res.status(500).json({
      message: "Server error",
      error: process.env.NODE_ENV === "development" ? err.message : undefined,
    });
  }
};

// Helper function to normalize Redis data to match MongoDB schema
function normalizeRedisData(redisEntry) {
  return {
    university: redisEntry.university,
    name: redisEntry.NAME || redisEntry.name,
    email: redisEntry.EMAIL || redisEntry.email,
    aadhar_number: redisEntry['AADHAR NUMBER'] || redisEntry.aadhar_number,
    registration_number: redisEntry['REGISTRATION NUMBER'] || redisEntry.registration_number,
    walletAddress: redisEntry.walletAddress,
    CertificateUrl: redisEntry.CertificateUrl,
    JsonUrl: redisEntry.JSONUrl || redisEntry.JsonUrl,
    department: redisEntry.DEPARTMENT || redisEntry.department,
    cgpa: redisEntry.CGPA || redisEntry.cgpa,
    blockchainTxnHash: redisEntry.blockchainTxnHash,
    claimed: redisEntry.claimed || false,
    createdAt: redisEntry.createdAt || new Date(),
    updatedAt: redisEntry.updatedAt || new Date(),
    // Add any other fields that might be in your MongoDB schema
  };
}

const getAuthenticatedUserDetails = async (req,res) => {
  const id = req.user.id;
  console.log("id for the authenticated user" , id);
  
  if(!id) return res.status(404).json('No id found for the authenticated user');

  const student = await Student.findById(id);
  if(student){
    res.json({
      student
    })
  }
  else{
    const university = await University.findById(id);
    if(!university){
      return res.status(404).json('Authenticated user not found');
    }
    res.json({
      university
    })
  }
}

module.exports = { getDataForUser , getAuthenticatedUserDetails };
