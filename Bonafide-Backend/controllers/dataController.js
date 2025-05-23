const mongoose = require("mongoose");
const Data = require("../model/Data");
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
        // Safely filter data for the current university
        data = parsedData.filter((entry) => {
          // Check if entry exists and has univ_token property
          if (!entry || !entry.univ_token) return false;

          // Compare university IDs
          const entryUnivId = entry.univ_token.toString
            ? entry.univ_token.toString()
            : String(entry.univ_token);

          return entryUnivId === univId;
        });
        fromRedis = true;
      } catch (parseError) {
        console.error("Error parsing Redis data:", parseError);
        // Continue with database query if Redis data is malformed
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
