const express = require('express');
const router = express.Router();
const Observation = require('../models/Observation');

// --- THE LOGIC ENGINE ---
const calculateRisk = (responses) => {
  const score = Object.values(responses).reduce((a, b) => a + b, 0);
  
  let result = {
    riskLevel: 'Low',
    summary: "Student is generally on track.",
    strategies: ["Positive Reinforcement", "Peer Buddy"],
    resources: ["Video: Focus Games"]
  };

  if (score > 4) {
    result.riskLevel = 'Medium';
    result.summary = "Consistent struggle observed.";
    result.strategies = ["Visual Timers", "Chunking Instructions", "Seating Change"];
    result.resources = ["Video: Managing Distractions", "Tool: Schedule Maker"];
  }

  if (score > 7) {
    result.riskLevel = 'High';
    result.summary = "Immediate support recommended.";
    result.strategies = ["Parent Conference", "Counselor Referral", "IEP Meeting"];
    result.resources = ["Guide: Crisis Intervention", "Contact: Child Psychologist"];
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