const mongoose = require('mongoose');

const studentSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  blockchainTxnHash: { type: String, default: null },
}, { timestamps: true });

// Check if the model is already defined
module.exports = mongoose.models.Student || mongoose.model('Student', studentSchema);