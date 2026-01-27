const mongoose = require('mongoose');

const ObservationSchema = new mongoose.Schema({
  // Identity
  studentName: { type: String, required: true },
  studentId: { type: String, required: true },
  teacherId: { type: String, default: "T-GUEST" },
  schoolId: { type: String, default: "SCH-DEFAULT" },
  grade: String,

  // Input Data
  responses: { type: Object, required: true }, // Stores { q1: 1, q2: 3... }
  
  // Logic Engine Output
  riskLevel: { 
    type: String, 
    enum: ['Low', 'Medium', 'High'],
    required: true 
  },
  summary: String,
  strategies: [String],
  resources: [String],

  // Timestamp
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Observation', ObservationSchema);