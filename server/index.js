require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const authRoutes = require("./routes/auth");
const apiRoutes = require("./routes/api");

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors()); // Allow Frontend to talk to Backend
app.use(express.json()); // Parse JSON bodies

app.use("/api", apiRoutes);
app.use('/api/auth', authRoutes);

// DB Connection (Defaults to local MongoDB)
const MONGO_URI =
  process.env.MONGO_URI || "mongodb://localhost:27017/els-pipeline";

mongoose
  .connect(MONGO_URI)
  .then(() => console.log("✅ MongoDB Connected"))
  .catch((err) => console.error("❌ DB Connection Error:", err));


app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
