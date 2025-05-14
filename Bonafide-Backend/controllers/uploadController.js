// uploadController.js
const University = require('../model/University');
const redis = require('../redis/redisClient');
const jwt = require('jsonwebtoken');

const uploadData = async (req, res) => {
  try {
    const { data } = req.body;
    //Add the university id to the data too

  
    if (!Array.isArray(data)) {
      return res.status(400).json({ error: 'Data must be an array of rows.' });
    }

    const univId = req.user.id;


    const finalData = data.map(row => ({
      ...row,
      univ_id : univId,
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
    const data = await redis.get("excel_data");

    res.json({ data: JSON.parse(data || '[]') });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch from Redis' });
  }
};

module.exports = {
  uploadData,
  getDataFromRedis,
};
