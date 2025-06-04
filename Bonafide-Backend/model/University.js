const mongoose = require('mongoose');

const universitySchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  email:{type:String, required:true},
  password: { type: String, required: true },
  privateKey: { type: String, required: true }, // New field
  isVerified:{type:Boolean, default:false},
  otp:{type:String},
  otpExpires:{type:Date, required:false}
}, { timestamps: true });

module.exports = mongoose.model('University', universitySchema);
