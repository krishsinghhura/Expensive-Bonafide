const redis = require('../redis/redisClient');
const Data = require('../model/data');
const University = require('../model/University');

const pushDataToMongo = async () => {
  try {
    const rawData = await redis.get('excel_data');
    if (!rawData) {
      
      return;
    }

    const data = JSON.parse(rawData);
    console.log(data);
    
    const formatted = data.map(row => ({
      university: row.university,
      name: row.NAME,
      email: row.EMAIL,
      aadhar_number: row["AADHAR NUMBER"],
      registration_number: row["REGISTRATION NUMBER"],
      department: row.DEPARTMENT,
      cgpa: parseFloat(row.CGPA),
      walletAddress: row.walletAddress || '', // Add default if not present in Redis
      CertificateUrl: row.CertificateUrl || '', // Note: Fix typo if needed (CertificateUrl vs CertificateUrl)
      JsonUrl: row.JSONUrl || '',
      blockchainTxnHash: row.blockchainTxnHash || null,
      claimed: row.claimed || false // Default to false if not present
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
