// uploadController.js
const University = require('../model/University');
const redis = require('../redis/redisClient');
const jwt = require('jsonwebtoken');
const Data=require("../model/data");


const uploadData = async (req, res) => {
  try {
    const { data } = req.body;

    // console.log(data);

    if (!Array.isArray(data)) {
      return res.status(400).json({ error: 'Data must be an array of rows.' });
    }

    const univId = req.user.id;
    console.log("While uplaoding data to mongo ",univId);

    const finalData = data.map(row => ({
      ...row,
      university : univId,
    }))

    

    // Save to Redis with key 'excel_data'
    await redis.set('excel_data', JSON.stringify(finalData), 'EX', 3600); // Expires in 1 hour

    return res.status(200).json({ message: '✅ Data cached in Redis successfully!',data:JSON.stringify(data) });
  } catch (err) {
    console.error('Redis Error:', err);
    return res.status(500).json({ error: '❌ Failed to cache data in Redis.' });
  
  }

};


const getDataFromRedis = async (req, res) => {
  try {
    const univId = req.user.id;
    console.log("univId is ", univId);
    
    // First try to get data from Redis
    const redisData = await redis.get("excel_data");
    
    if (redisData) {
      return res.json({ data: JSON.parse(redisData), source: 'redis' });
    }
    
    // If not in Redis, fetch from MongoDB
    const mongoData = await Data.find({ userId: univId }); // Adjust query as needed
    
    // Store the data in Redis for future requests (optional)
    if (mongoData) {
      await redis.set("excel_data", JSON.stringify(mongoData));
      // You might want to set an expiration time
      // await redis.setex("excel_data", 3600, JSON.stringify(mongoData));
    }
    
    res.json({ data: mongoData || [], source: 'mongo' });
  } catch (err) {
    console.error('Error fetching data:', err);
    res.status(500).json({ error: 'Failed to fetch data' });
  }
};

module.exports = {
  uploadData,
  getDataFromRedis,
};
