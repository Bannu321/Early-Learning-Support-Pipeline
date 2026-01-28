require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
const PORT = 5000; // Local Port

// Standard Local CORS
app.use(cors({
  origin: 'http://localhost:5173', // Only allow your Vite Frontend
  credentials: true
}));

app.use(express.json());

// Force Local MongoDB
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/els-pipeline';

mongoose.connect(MONGO_URI)
  .then(() => console.log("✅ Local MongoDB Connected"))
  .catch(err => console.error("❌ DB Connection Error:", err));

const apiRoutes = require('./routes/api');
const authRoutes = require('./routes/auth');

app.use('/api', apiRoutes);
app.use('/api/auth', authRoutes);

app.listen(PORT, () => console.log(`🚀 Local Server running on port ${PORT}`));