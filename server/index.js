require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
// Railway provides the PORT automatically
const PORT = process.env.PORT || 5000; 

// --- CORS CONFIGURATION ---
// This allows ANY frontend to talk to your backend. 
// For higher security later, replace '*' with your specific Vercel URL.
app.use(cors({
  origin: '*', 
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true
}));

app.use(express.json());

// DB Connection (Railway provides MONGO_URL)
const MONGO_URI = process.env.MONGO_URL || process.env.MONGO_URI || 'mongodb://localhost:27017/els-pipeline';

mongoose.connect(MONGO_URI)
  .then(() => console.log("✅ MongoDB Connected"))
  .catch(err => console.error("❌ DB Connection Error:", err));

// Routes
const apiRoutes = require('./routes/api');
const authRoutes = require('./routes/auth');

app.use('/api', apiRoutes);
app.use('/api/auth', authRoutes);

app.get('/', (req, res) => {
  res.send("Early Learning Pipeline API is Running 🚀");
});

app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));