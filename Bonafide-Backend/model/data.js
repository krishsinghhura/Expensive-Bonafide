const mongoose = require("mongoose");
const University=require("./University")

const studentSchema = new mongoose.Schema({
  university : {type : mongoose.Schema.Types.ObjectId , ref : University},
  name: { type: String, required: true },
  email: { type: String, required: true },
  aadhar_number: { type: String, required: true },
  registration_number: { type: String, required: true },
  department: { type: String, required: true },
  cgpa: { type: Number, required: true },
  blockchainTxnHash: { type: String, default: null },
}, { timestamps: true });

module.exports = mongoose.model("Data", studentSchema);
