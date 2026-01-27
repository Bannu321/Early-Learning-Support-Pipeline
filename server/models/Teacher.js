const mongoose = require('mongoose');

const TeacherSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true }, // We will hash this
  schoolName: { type: String, required: true },
  area: { type: String, required: true },
  
  // The Unique Identity
  teacherCode: { type: String, unique: true } 
});

module.exports = mongoose.model('Teacher', TeacherSchema);