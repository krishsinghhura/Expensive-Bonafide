const mongoose = require('mongoose');

const studentSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  claimed: { type: Boolean,default:false},
  walletAddress:{type:String},
  CertificateUrl:{type:String},
  JSONUrl : {type:String},
  aadhar_number: { type: String,default: null},
  registration_number: { type: String,default: null },
  department: { type: String,default: null},
  cgpa: { type: Number,default: null },
  blockchainTxnHash: { type: String, default: null },
}, { timestamps: true });

// Check if the model is already defined
module.exports = mongoose.models.Student || mongoose.model('Student', studentSchema);