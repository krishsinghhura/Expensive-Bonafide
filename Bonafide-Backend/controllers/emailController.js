const { ethers } = require('ethers');
const redis = require('../redis/redisClient'); // Redis client instance
const abi = require('../abi.json'); // Smart contract ABI
const Data=require("../model/data")
const generateCertificate = require('../services/generateTemplate');
const nodemailer = require('nodemailer');
const path = require('path');


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
    console.log("Starting Transaction for ", EMAIL);

    // Blockchain transaction
    const tx = await contract.storeEmailHash(EMAIL);
    const receipt = await tx.wait();

    console.log('✅ Transaction successful with hash:', receipt.hash);

    // Update MongoDB with the transaction hash
    const updated = await Data.findOneAndUpdate(

      { email: EMAIL },
      { blockchainTxnHash: receipt.hash },
      { new: true }
    );

    if (!updated) {
      console.warn(`⚠️ No student found with email ${EMAIL} to update with txn hash.`);
      return;

    } else {
      console.log(`📝 Transaction hash saved to DB for ${EMAIL}`);
    }

    // Generate certificate with student data
    const { name, department, registrationNumber, cgpa } = updated;

    const outputFileName = name.replace(/\s+/g, '_');
    const certPath = await generateCertificate({
      name,
      department,
      regNumber: registrationNumber,
      cgpa,
      outputFileName: name.replace(/\s+/g, '_')
    });

    console.log(`🎓 Certificate generated at: ${certPath}`);
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const mailOptions = {
      from: `"Centurion University" <${process.env.EMAIL_USER}>`,
      to: EMAIL,
      subject: '🎓 Your Degree Certificate',
      html: `
        <p>Dear <b>${name}</b>,</p>
        <p>Congratulations! Please find attached your official Degree Certificate from Centurion University.</p>
        <p>Best regards,<br/>Centurion University</p>
      `,
      attachments: [
        {
          filename: `${outputFileName}.png`,
          path: certPath,
          cid: 'degreeCert' // optional if you want to embed it in HTML later
        }
      ]
    };

    await transporter.sendMail(mailOptions);
    console.log(`📧 Email sent successfully to ${EMAIL}`);
    console.log(`Completed for ${EMAIL}`);
    
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
