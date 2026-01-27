const mongoose = require('mongoose');

const ObservationSchema = new mongoose.Schema({
  // Identity
  studentName: { type: String, required: true },
  studentId: { type: String, required: true },
  teacherId: { type: String, default: "T-GUEST" },
  schoolId: { type: String, default: "SCH-DEFAULT" },
  grade: String,

  // Input Data
  responses: { type: Object, required: true },
  
  // --- NEW: COMPLEX ANALYSIS FIELDS ---
  riskLevel: { type: String, enum: ['Low', 'Medium', 'High', 'Critical'], required: true },
  
  // Breakdown of scores (e.g., Focus: 12/15, Social: 4/15)
  categoryScores: {
    focus: Number,
    social: Number,
    academic: Number,
    emotional: Number
  },
  
  // The "Verbose" Paragraph
  detailedAnalysis: String, 
  
  strategies: [String],
  resources: [String],

  // --- NEW: NGO ACTIONS ---
  ngoStatus: { type: String, default: 'Pending' }, // Pending, In Progress, Resolved
  ngoActions: [{
    actionType: String, // "Funds", "Tutor", "Manual"
    timestamp: Date,
    note: String
  }],

  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Observation', ObservationSchema);