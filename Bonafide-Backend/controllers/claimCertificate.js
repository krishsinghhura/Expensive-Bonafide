const DataModel = require("../model/data"); // Your Mongoose model
const redisClient = require("../redis/redisClient");

async function updateClaimData(req,res) {
  const { email, walletAddress } = req.body;
  

  try {
    // 1. Check Redis first
    const redisData = await redisClient.get('excel_data'); 
    
    if (redisData) {
      const dataArray = JSON.parse(redisData);
      const emailIndex = dataArray.findIndex(item => item.EMAIL === email);
      
      if (emailIndex !== -1) {
        // Update only walletAddress in Redis
        dataArray[emailIndex].walletAddress = walletAddress;
        dataArray[emailIndex].claimed=true;
        await redisClient.set('excel_data', JSON.stringify(dataArray));
        
        return { 
          success: true, 
          updatedIn: 'redis',
          email,
          walletAddress,
          clamied:true
        };
      }
    }

    // 2. If not in Redis, update MongoDB
    const updatedDoc = await DataModel.findOneAndUpdate(
      { email },
      { 
        walletAddress,
        claimed: true,
      },
      { new: true, upsert: true }
    );    

     res.status(200).send("Updated in Mongo");

  } catch (error) {
    console.error("Update error:", error);
    return {
      success: false,
      error: error.message
    };
  }
}

module.exports = {
  updateClaimData
};