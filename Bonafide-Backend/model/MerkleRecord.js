const mongoose = require('mongoose');

const MerkleRecordSchema = new mongoose.Schema({
  AADHAR_NUMBER: {
    type: String,
    required: true
  },
  studentData: {
    type: Object,
    required: true
  },
  hashedAadhaar: {
    type: String,
    required: true
  },
  merkleProof: {
    type: [
      {
        position: { type: String, enum: ['left', 'right'], required: true },
        data: { type: String, required: true }
      }
    ],
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('MerkleRecord', MerkleRecordSchema);
