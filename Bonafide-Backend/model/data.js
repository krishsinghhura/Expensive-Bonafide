const mongoose = require("mongoose");
const University=require("./University")


const studentSchema = new mongoose.Schema({
  university : {type : mongoose.Schema.Types.ObjectId , ref : University},
  name: { type: String, required: true },
  email: { type: String, required: true },
  aadhar_number: { type: String, required: true },
  registration_number: { type: String, required: true },
  walletAddress:{type:String},
  CertificateUrl:{type:String},
  JsonUrl:{type:String},
  department: { type: String, required: true },
  cgpa: { type: Number, required: true },
  blockchainTxnHash: { type: String, default: null },
  claimed : {type : Boolean , default : false},
}, { timestamps: true });

module.exports = mongoose.models.Data || mongoose.model("Data", studentSchema);

