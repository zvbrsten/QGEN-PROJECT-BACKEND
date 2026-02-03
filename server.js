require("dotenv").config();
const express = require("express");
const cors = require("cors");
const path = require("path");
const connectDB = require("./config/db");

const cors = require("cors");

const corsOptions = {
  origin: "https://qgen-project.vercel.app", // your frontend origin (or use '*' if acceptable)
  methods: ["GET","POST","PUT","DELETE","OPTIONS"],
  allowedHeaders: ["Content-Type","Authorization"],
  credentials: true,
};

app.use(cors(corsOptions));
app.options("*", cors(corsOptions)); // ensure preflight handled

// fallback: respond to OPTIONS immediately
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", corsOptions.origin);
  res.header("Access-Control-Allow-Headers", corsOptions.allowedHeaders.join(", "));
  if (req.method === "OPTIONS") {
    res.header("Access-Control-Allow-Methods", corsOptions.methods.join(", "));
    return res.status(200).end();
  }
  next();
});

const authRoutes = require('./routes/authRoutes')
const sessionRoutes = require('./routes/sessionRoutes')
const questionRoutes = require('./routes/questionRoutes');
const { protect } = require("./middlewares/authMiddleware");
const { generateInterviewQuestions, generateConceptExplanation } = require("./controllers/aiController");

const app = express();
app.get('/', (req, res) => {
  res.send('API is running...');
});

// Middleware to handle CORS
app.use(
  cors({
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

connectDB()

// Middleware
app.use(express.json());

// Routes
app.use("/api/auth", authRoutes);
app.use('/api/sessions', sessionRoutes);
app.use('/api/questions', questionRoutes);

app.use("/api/ai/generate-questions", protect, generateInterviewQuestions);
app.use("/api/ai/generate-explanation", protect, generateConceptExplanation);

// Serve uploads folder
app.use("/uploads", express.static(path.join(__dirname, "uploads"), {}));

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
