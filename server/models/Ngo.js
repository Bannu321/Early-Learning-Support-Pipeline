const mongoose = require('mongoose');

const NgoSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  orgName: { type: String, required: true },
  region: { type: String, required: true }, // e.g., "North District"
  role: { type: String, default: 'ngo' }    // Identifying tag
});

module.exports = mongoose.model('Ngo', NgoSchema);