const mongoose = require('mongoose');

const universitySchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  email:{type:String, required:true},
  password: { type: String, required: true },
  privateKey: { type: String, required: true }, // New field
}, { timestamps: true });

module.exports = mongoose.model('University', universitySchema);
