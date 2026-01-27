const express = require('express');
const router = express.Router();
const Observation = require('../models/Observation');

// --- THE LOGIC ENGINE ---
const calculateRisk = (responses) => {
  const score = Object.values(responses).reduce((a, b) => a + b, 0);
  
  // Logic updated for 20 Questions (Max Score 60)
  // Low: 20-35 | Medium: 36-48 | High: 49+
  
  let result = {
    riskLevel: 'Low',
    summary: "Student is performing within the typical range. Continue monitoring.",
    strategies: ["Positive Reinforcement", "Peer Buddy System"],
    resources: ["Video: Inclusive Classroom Games"]
  };

  if (score > 35) {
    result.riskLevel = 'Medium';
    result.summary = "Student shows emerging difficulties in specific areas (Focus/Social).";
    result.strategies = [
      "Visual Timers for Tasks", 
      "Seating near the teacher", 
      "Break tasks into smaller steps (Chunking)"
    ];
    result.resources = ["PDF: Classroom Accommodations Checklist", "Tool: Visual Schedule Maker"];
  }

  if (score > 48) {
    result.riskLevel = 'High';
    result.summary = "Significant challenges detected across multiple domains. Targeted support recommended.";
    result.strategies = [
      "Initiate Individualized Education Plan (IEP)", 
      "Schedule Parent Conference (Support-focused)", 
      "Referral to School Counselor/Specialist"
    ];
    result.resources = ["Guide: Crisis Intervention Protocols", "Contact: Local Child Development NGO"];
  }

  return result;
};

// --- ROUTES ---

// POST: Save new observation
router.post('/assess', async (req, res) => {
  try {
    const { details, responses } = req.body;
    
    // 1. Run Logic
    const analysis = calculateRisk(responses);

    // 2. Create DB Object
    const newObservation = new Observation({
      ...details,
      responses,
      ...analysis
    });

    // 3. Save to MongoDB
    const savedRecord = await newObservation.save();
    res.json(savedRecord);
    
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


router.get('/teacher/history', async (req, res) => {
  try {
    const { teacherCode } = req.query;
    
    if (!teacherCode) return res.status(400).json({ error: "Teacher Code required" });

    // Find observations where teacherId matches
    const history = await Observation.find({ teacherId: teacherCode }).sort({ createdAt: -1 });
    
    res.json(history);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


// GET: Fetch all for NGO Dashboard
router.get('/observations', async (req, res) => {
  try {
    // Return newest first
    const records = await Observation.find().sort({ createdAt: -1 });
    res.json(records);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;