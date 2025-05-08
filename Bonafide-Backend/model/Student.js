const mongoose = require('mongoose');

const studentSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
}, { timestamps: true });

// Check if the model is already defined
module.exports = mongoose.models.Student || mongoose.model('Students', studentSchema);
