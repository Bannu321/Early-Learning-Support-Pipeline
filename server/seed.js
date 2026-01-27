require("dotenv").config();
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

// Import Models
const Teacher = require("./models/Teacher");
const Ngo = require("./models/Ngo");
const Observation = require("./models/Observation");

// Connection Config
const MONGO_URI =
  process.env.MONGO_URI || "mongodb://localhost:27017/els-pipeline";

const seedDatabase = async () => {
  try {
    // 1. Connect to DB
    await mongoose.connect(MONGO_URI);
    console.log("🌱 Connected to MongoDB...");

    // 2. Clear Existing Data (Clean Slate)
    await Teacher.deleteMany({});
    await Ngo.deleteMany({});
    await Observation.deleteMany({});
    console.log("🧹 Old data cleared.");

    // 3. Hash a default password for everyone
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash("password123", salt);

    // 4. Create Teachers
    const teachers = await Teacher.insertMany([
      {
        username: "anita_sharma",
        password: passwordHash,
        schoolName: "Govt Primary School, Block A",
        area: "Bangalore North",
        teacherCode: "T-1001",
      },
      {
        username: "rahul_verma",
        password: passwordHash,
        schoolName: "Saraswati Vidya Mandir",
        area: "Mysore Rural",
        teacherCode: "T-1002",
      },
    ]);
    console.log("👩‍🏫 Teachers created: anita_sharma, rahul_verma");

    // 5. Create NGO Admin
    await Ngo.create({
      username: "admin_ngo",
      password: passwordHash,
      orgName: "Vidya Support Foundation",
      region: "Karnataka State",
      role: "ngo",
    });
    console.log("🏛  NGO created: admin_ngo");

    // 6. Create Observation Data (Linked to Teachers)
    await Observation.insertMany([
      // High Risk Case
      {
        studentName: "Rohan Gupta",
        studentId: "ST-2024-05",
        teacherId: "T-1001", // Linked to Anita
        schoolId: "Govt Primary School, Block A",
        grade: "3rd",
        responses: { q1: 3, q2: 3, q3: 3 }, // High scores
        riskLevel: "High",
        summary:
          "Significant challenges detected. Immediate support recommended.",
        strategies: ["Referral to Counselor", "IEP Meeting"],
        resources: ["PDF: Crisis Guide"],
        createdAt: new Date("2024-01-10"),
      },
      // Medium Risk Case
      {
        studentName: "Priya Singh",
        studentId: "ST-2024-08",
        teacherId: "T-1001",
        schoolId: "Govt Primary School, Block A",
        grade: "3rd",
        responses: { q1: 2, q2: 2, q3: 1 },
        riskLevel: "Medium",
        summary: "Student shows consistent signs of struggle.",
        strategies: ["Visual Timers", "Seating Rearrangement"],
        resources: ["Video: Focus Drills"],
        createdAt: new Date("2024-01-12"),
      },
      // Low Risk Case
      {
        studentName: "Arjun K",
        studentId: "ST-2024-12",
        teacherId: "T-1002", // Linked to Rahul
        schoolId: "Saraswati Vidya Mandir",
        grade: "5th",
        responses: { q1: 1, q2: 1, q3: 1 },
        riskLevel: "Low",
        summary: "Student is on track.",
        strategies: ["Positive Reinforcement"],
        resources: [],
        createdAt: new Date("2024-01-15"),
      },
    ]);
    console.log("📝 Observations created.");

    console.log(
      "✅ SEEDING COMPLETE! Press Ctrl+C to exit if it doesn't close automatically.",
    );
    process.exit();
  } catch (err) {
    console.error("❌ Seeding Error:", err);
    process.exit(1);
  }
};

seedDatabase();
