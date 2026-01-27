const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const Teacher = require('../models/Teacher');
const Ngo = require('../models/Ngo');

// 1. REGISTER
router.post('/register', async (req, res) => {
  try {
    const { username, password, schoolName, area } = req.body;

    // Check if user exists
    const existing = await Teacher.findOne({ username });
    if (existing) return res.status(400).json({ error: "Username already taken" });

    // Hash Password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Generate Unique Code (e.g., T-4923)
    const uniqueCode = "T-" + Math.floor(1000 + Math.random() * 9000);

    const newTeacher = new Teacher({
      username,
      password: hashedPassword,
      schoolName,
      area,
      teacherCode: uniqueCode
    });

    await newTeacher.save();
    
    // Send back the new ID so frontend can show it
    res.json({ success: true, teacherCode: uniqueCode });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 2. LOGIN
router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;

    // Find Teacher
    const teacher = await Teacher.findOne({ username });
    if (!teacher) return res.status(400).json({ error: "User not found" });

    // Check Password
    const isMatch = await bcrypt.compare(password, teacher.password);
    if (!isMatch) return res.status(400).json({ error: "Invalid credentials" });

    // Success: Return the profile (excluding password)
    res.json({
      username: teacher.username,
      teacherCode: teacher.teacherCode,
      schoolName: teacher.schoolName
    });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});



// --- NGO REGISTRATION ---
router.post('/ngo/register', async (req, res) => {
  try {
    const { username, password, orgName, region } = req.body;

    // Check if exists
    const existing = await Ngo.findOne({ username });
    if (existing) return res.status(400).json({ error: "NGO Username taken" });

    // Hash Password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newNgo = new Ngo({
      username,
      password: hashedPassword,
      orgName,
      region
    });

    await newNgo.save();
    res.json({ success: true, message: "NGO Registered" });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// --- NGO LOGIN ---
router.post('/ngo/login', async (req, res) => {
  try {
    const { username, password } = req.body;

    const ngo = await Ngo.findOne({ username });
    if (!ngo) return res.status(400).json({ error: "NGO not found" });

    const isMatch = await bcrypt.compare(password, ngo.password);
    if (!isMatch) return res.status(400).json({ error: "Invalid credentials" });

    // Return NGO Profile
    res.json({
      username: ngo.username,
      orgName: ngo.orgName,
      role: 'ngo' // Frontend uses this to show the Dashboard
    });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;