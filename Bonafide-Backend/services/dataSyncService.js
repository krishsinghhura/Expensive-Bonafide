const redis = require('../redis/redisClient');
const Data = require('../model/data');
const University = require('../model/University');

const pushDataToMongo = async () => {
  try {
    const rawData = await redis.get('excel_data');
    if (!rawData) {
      console.log('🛑 No data in Redis to push.');
      return;
    }

    const data = JSON.parse(rawData);

    const formatted = data.map(row => ({
      university : row.univ_id,
      name: row.NAME,
      email: row.EMAIL,
      aadhar_number: row["AADHAR NUMBER"],
      registration_number: row["REGISTRATION NUMBER"],
      department: row.DEPARTMENT,
      cgpa: parseFloat(row.CGPA),
    }));

    await Data.insertMany(formatted);
    console.log('✅ Data successfully pushed to MongoDB!');

    await redis.del('excel_data');
    console.log('🗑️ Redis data deleted after successful push.');
  } catch (err) {
    console.error('❌ Failed to push Redis data to MongoDB:', err);
  }
};

module.exports = pushDataToMongo;
