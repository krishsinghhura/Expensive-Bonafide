const { ethers } = require('ethers');
const redis = require('../redis/redisClient'); // Redis client instance
const abi = require('../abi.json'); // Smart contract ABI
const Data = require("../model/data")
const generateCertificate = require('../services/generateTemplate');
const nodemailer = require('nodemailer');
const path = require('path');
require('dotenv').config();

const claimCertificate = async (req, res) => {
  //get the email from cookie
  const token = req.cookies.token;
  if (!token) return res.status(401).send('Unauthorized: No token');

  //get the email from the token 
  const decoded = jwt.verify(token, process.env.SECRET_KEY);
  const studentId = decoded._id;

  //find the student 
  const student = await Data.findOne({
    _id: studentId,
  })

  const { name, department, registrationNumber, cgpa } = student;

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

  db.Data.updateOne(
    {_id : studentId},
    { $set: { claimed : "True" } }
  )
}

module.exports = {
  claimCertificate,
};