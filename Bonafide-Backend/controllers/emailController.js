// Required Packages
const { ethers } = require("ethers");
const redis = require("../redis/redisClient");
const abi = require("../abi.json");
const Data = require("../model/Data");
const Student = require("../model/Student");
const generateCertificate = require("../services/generateTemplate");
const nodemailer = require("nodemailer");
const path = require("path");
const supabase = require("../config/supabse");
require("dotenv").config();

// Initialize Ethereum provider and signer
const provider = new ethers.JsonRpcProvider(process.env.ETHEREUM_PROVIDER_URL);
const signer = new ethers.Wallet(process.env.PRIVATE_KEY, provider);

// Smart Contract Instance
const contract = new ethers.Contract(
  "0x89896597450A9241F716996e16838279d362ac54",
  abi,
  signer
);

// Fetch student data from Redis
const fetchDataFromRedis = async () => {
  try {
    const rawData = await redis.get("excel_data");
    if (!rawData) {
      throw new Error('No data found in Redis under key "excel_data"');
    }
    return JSON.parse(rawData);
  } catch (err) {
    throw new Error("Error fetching/parsing data from Redis: " + err.message);
  }
};

// Push individual student's data to blockchain
const pushDataToBlockchain = async (EMAIL) => {
  try {
    console.log(`🚀 Starting transaction for ${EMAIL}`);

    // 1. Write email hash to blockchain
    const tx = await contract.storeEmailHash(EMAIL);
    const receipt = await tx.wait();
    console.log(`✅ Blockchain transaction successful: ${receipt.hash}`);

    // 2. Load from Redis
    const redisData = await redis.get("excel_data");

    if (!redisData) {
      throw new Error("No data found in Redis");
    }

    const parsedData = JSON.parse(redisData);
    const index = parsedData.findIndex(entry => entry.EMAIL === EMAIL);

    if (index === -1) {
      throw new Error(`No student found with email: ${EMAIL}`);
    }

    // Update the entry with blockchain hash
    parsedData[index].blockchainTxnHash = receipt.hash;
    const studentData = parsedData[index];

    // Update Redis with the modified data
    await redis.set("excel_data", JSON.stringify(parsedData), "EX", 3600);
    console.log(`📝 Transaction hash updated in Redis for ${EMAIL}`);

    // 3. Generate certificate
    const { NAME, DEPARTMENT, REGISTRATION_NUMBER, CGPA } = studentData;
    const baseFileName = NAME.replace(/\s+/g, "_");
    
    // Generate unique identifier (timestamp + random string)
    const timestamp = Date.now();
    const randomString = Math.random().toString(36).substring(2, 8);
    const uniqueIdentifier = `${timestamp}_${randomString}`;
    
    const outputFileName = `${baseFileName}_${uniqueIdentifier}`;
    const certificateBuffer = await generateCertificate({
      name: NAME,
      department: DEPARTMENT,
      regNumber: REGISTRATION_NUMBER,
      cgpa: CGPA,
    });

    const imageFileName = `${outputFileName}.png`;

    // 4. Upload certificate to Supabase
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from("certificates")
      .upload(imageFileName, certificateBuffer, {
        contentType: "image/png",
        upsert: true,
      });

    if (uploadError) {
      console.error("❌ Supabase upload failed:", uploadError.message);
      throw new Error("Certificate upload failed.");
    }

    // 5. Get public URL of certificate
    const { data: publicUrlData, error: publicUrlError } = supabase.storage
      .from("certificates")
      .getPublicUrl(imageFileName);

    if (publicUrlError) {
      console.error("❌ Failed to get public URL:", publicUrlError.message);
      throw new Error("Failed to retrieve certificate public URL.");
    }

    const certURL = publicUrlData.publicUrl;

    // 5. Create NFT Metadata JSON
    const metadata = {
      name: NAME,
      description: `Degree Certificate for ${NAME}, Dept: ${DEPARTMENT}, CGPA: ${CGPA}`,
      image: certURL,
    };

    const metadataJSON = Buffer.from(JSON.stringify(metadata));
    const metadataFileName = `${outputFileName}.json`;

    // 6. Upload Metadata JSON to Supabase
    const { error: jsonUploadError } = await supabase.storage
      .from("metadata")
      .upload(metadataFileName, metadataJSON, {
        contentType: "application/json",
        upsert: true,
      });

    if (jsonUploadError) throw new Error("Metadata JSON upload failed");

    // 7. Get public URL of Metadata JSON
    const { data: metadataUrlData, error: metadataUrlError } = supabase.storage
      .from("metadata")
      .getPublicUrl(metadataFileName);

    if (metadataUrlError) throw new Error("Failed to retrieve metadata public URL");

    const tokenURI = metadataUrlData.publicUrl;

    // 8. Update certificate URL and JSON URL in Redis
    const updatedRedisData = await redis.get("excel_data");
    const updatedParsedData = JSON.parse(updatedRedisData);
    const updatedIndex = updatedParsedData.findIndex(entry => entry.EMAIL === EMAIL);

    if (updatedIndex !== -1) {
      updatedParsedData[updatedIndex].CertificateUrl = certURL;
      updatedParsedData[updatedIndex].JSONUrl = tokenURI;
      await redis.set("excel_data", JSON.stringify(updatedParsedData), "EX", 3600);
      console.log(`📝 Certificate URL updated in Redis for ${EMAIL}`);
    }

    // 9. Send certificate via email
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const mailOptions = {
      from: `"Centurion University" <${process.env.EMAIL_USER}>`,
      to: EMAIL,
      subject: "🎓 Your Degree Certificate",
      html: `
        <div>
          <p>Dear <b>${NAME}</b>,</p>
          <p>Congratulations! Please find attached your official Degree Certificate from Centurion University.</p>
          <p>Best regards,<br/>Centurion University</p>
        </div>
      `,
      attachments: [
        {
          filename: `${baseFileName}.png`, // Use the base filename without unique identifier for email
          content: certificateBuffer,
          cid: "degreeCert",
        },
      ],
    };

    await transporter.sendMail(mailOptions);
    console.log(`📧 Email sent successfully to ${EMAIL}`);
    console.log(`✅ Completed processing for ${EMAIL}`);

  } catch (err) {
    console.error("❌ Error processing student:", EMAIL, "-", err.message);
    throw new Error("Failed to process " + EMAIL + ": " + err.message);
  }
};



// Main sync function (Express controller)
const syncDataToBlockchain = async (req, res) => {
  try {
    const studentData = await fetchDataFromRedis();

    if (!Array.isArray(studentData) || studentData.length === 0) {
      return res
        .status(400)
        .send("No valid student data available for synchronization.");
    }

    for (const student of studentData) {
      if (student.EMAIL) {
        await pushDataToBlockchain(student.EMAIL);
      }
    }

    res.status(200).send("✅ All student data successfully synchronized with the blockchain.");
  } catch (err) {
    console.error("❌ Sync process error:", err.message);
    res.status(500).send("Internal Server Error: " + err.message);
  }
};

module.exports = {
  syncDataToBlockchain,
};
