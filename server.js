/**
 * server.js
 * Vercel-compatible Express server with MongoDB + debugging
 */

require("dotenv").config();
const express = require("express");
const cors = require("cors");
const path = require("path");

// ---- Debug: Startup ----
console.log("🚀 Starting server initialization...");

const connectDB = require("./config/db");

// ---- Routes ----
const authRoutes = require("./routes/authRoutes");
const sessionRoutes = require("./routes/sessionRoutes");
const questionRoutes = require("./routes/questionRoutes");
const { protect } = require("./middlewares/authMiddleware");
const {
  generateInterviewQuestions,
  generateConceptExplanation,
} = require("./controllers/aiController");

const app = express();

// ---- Debug: App created ----
console.log("✅ Express app created");

// --------------------------------------------------
// CORS (SINGLE, CLEAN CONFIG)
// --------------------------------------------------
const FRONTEND_ORIGIN = "https://qgen-project.vercel.app";

app.use(
  cors({
    origin: FRONTEND_ORIGIN,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    credentials: true,
  })
);

console.log("✅ CORS configured for:", FRONTEND_ORIGIN);

// --------------------------------------------------
// Middleware
// --------------------------------------------------
app.use(express.json());

// Log every incoming request (VERY useful on Vercel)
app.use((req, res, next) => {
  console.log(`➡️  ${req.method} ${req.url}`);
  next();
});

// --------------------------------------------------
// MongoDB Connection (with debug + safety)
// --------------------------------------------------
(async () => {
  try {
    console.log("⏳ Attempting MongoDB connection...");
    await connectDB();
    console.log("✅ MongoDB connected successfully");
  } catch (err) {
    console.error("❌ MongoDB connection failed:");
    console.error(err);
  }
})();

// --------------------------------------------------
// Routes
// --------------------------------------------------
app.get("/", (req, res) => {
  res.send("API is running...");
});

app.use("/api/auth", authRoutes);
app.use("/api/sessions", sessionRoutes);
app.use("/api/questions", questionRoutes);

app.post(
  "/api/ai/generate-questions",
  protect,
  generateInterviewQuestions
);

app.post(
  "/api/ai/generate-explanation",
  protect,
  generateConceptExplanation
);

// --------------------------------------------------
// Static Files
// --------------------------------------------------
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// --------------------------------------------------
// Global Error Handler (CRITICAL FOR DEBUGGING)
// --------------------------------------------------
app.use((err, req, res, next) => {
  console.error("🔥 UNHANDLED ERROR:");
  console.error(err.stack || err);

  res.status(err.statusCode || 500).json({
    success: false,
    message: err.message || "Internal Server Error",
  });
});

// --------------------------------------------------
// IMPORTANT: DO NOT app.listen() ON VERCEL
// --------------------------------------------------
console.log("✅ Server setup complete (Vercel will handle execution)");

module.exports = app;
