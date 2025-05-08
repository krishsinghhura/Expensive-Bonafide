const { ethers } = require('ethers');
const redis = require('../redis/redisClient'); // Redis client instance
const abi = require('../abi.json'); // Smart contract ABI


require('dotenv').config();// Initialize Ethereum provider and signer
const provider = new ethers.JsonRpcProvider(process.env.ETHEREUM_PROVIDER_URL);
const signer = new ethers.Wallet(process.env.PRIVATE_KEY, provider);

// Smart contract instance
const contract = new ethers.Contract(
  process.env.BLOCKCHAIN_CONTRACT_ADDRESS,
  abi,
  signer
);

// Fetch student data from Redis
const fetchDataFromRedis = async () => {
  try {
    const rawData = await redis.get('excel_data'); // default Redis key
    if (!rawData) throw new Error('No data found in Redis under key "excel_data"');

    return JSON.parse(rawData); // Parse JSON string to object
  } catch (err) {
    throw new Error('Error fetching/parsing data from Redis: ' + err.message);
  }
};

// Push a single student's data to blockchain
const pushDataToBlockchain = async (EMAIL) => {
  try {
    console.log("Starting Transaction for ",EMAIL);
    
    // Modify according to your contract's expected input structure
    const tx = await contract.storeEmailHash(EMAIL); 
    const receipt = await tx.wait(); // Wait for mining confirmation

    console.log('✅ Transaction successful with hash:', receipt.hash);
  } catch (err) {
    console.error('❌ Blockchain write error:', err);
    throw new Error('Error pushing data to blockchain: ' + err.message);
  }
};

// Express controller function
const syncDataToBlockchain = async (req, res) => {
  try {
    // Fetch data
    const studentData = await fetchDataFromRedis();
    

    if (!Array.isArray(studentData) || studentData.length === 0) {
        return res.status(400).send('No valid student data available for synchronization.');
      }
      
      // Sync each student
      for (const student of studentData) {
        if (student.EMAIL) {
          await pushDataToBlockchain(student.EMAIL);
        }
      }
      
      

    res.status(200).send('✅ All student data successfully synchronized with the blockchain.');
  } catch (err) {
    console.error('❌ Sync process error:', err);
    res.status(500).send('Internal Server Error: ' + err.message);
  }
};

module.exports = {
  syncDataToBlockchain,
};
