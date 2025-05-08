const redis = require('../redis/redisClient');
const Student = require('../model/data');

const pushDataToMongo = async () => {
  try {
    const rawData = await redis.get('excel_data');
    if (!rawData) {
      console.log('🛑 No data in Redis to push.');
      return;
    }

    const data = JSON.parse(rawData);

    const formatted = data.map(row => ({
      name: row.NAME,
      email: row.EMAIL,
      aadhar_number: row["AADHAR NUMBER"],
      registration_number: row["REGISTRATION NUMBER"],
      department: row.DEPARTMENT,
      cgpa: parseFloat(row.CGPA),
    }));

    await Student.insertMany(formatted);
    console.log('✅ Data successfully pushed to MongoDB!');
  } catch (err) {
    console.error('❌ Failed to push Redis data to MongoDB:', err);
  }
};

module.exports = pushDataToMongo;
