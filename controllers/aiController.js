const { GoogleGenerativeAI } = require("@google/generative-ai");
const {
  questionAnswerPrompt,
  conceptExplainPrompt,
} = require("../utils/prompts");

// 🔐 Debug: check API key presence
if (!process.env.GEMINI_API_KEY) {
  console.error("❌ GEMINI_API_KEY is missing in .env");
}

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const model = genAI.getGenerativeModel({
  model: "gemini-1.5-pro",
});

/**
 * Generate interview questions + answers
 */
const generateInterviewQuestions = async (req, res) => {
  try {
    const { role, experience, topicsToFocus, numberOfQuestions } = req.body;

    if (!role || !experience || !topicsToFocus || !numberOfQuestions) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const prompt = questionAnswerPrompt(
      role,
      experience,
      topicsToFocus,
      numberOfQuestions
    );

    const result = await model.generateContent(prompt);
    const text = result.response.text();

    // Debug log
    console.log("✅ Gemini raw response:", text);

    const parsed = JSON.parse(text);

    res.status(200).json(parsed);
  } catch (error) {
    console.error("❌ Gemini Question Error:", error.message);
    res.status(500).json({ message: "Failed to generate questions" });
  }
};

/**
 * Generate concept explanation
 */
const generateConceptExplanation = async (req, res) => {
  try {
    const { question } = req.body;

    if (!question) {
      return res.status(400).json({ message: "Question is required" });
    }

    const prompt = conceptExplainPrompt(question);

    const result = await model.generateContent(prompt);
    const text = result.response.text();

    // Debug log
    console.log("✅ Gemini explanation raw:", text);

    const parsed = JSON.parse(text);

    res.status(200).json(parsed);
  } catch (error) {
    console.error("❌ Gemini Explanation Error:", error.message);
    res.status(500).json({ message: "Failed to generate explanation" });
  }
};

module.exports = {
  generateInterviewQuestions,
  generateConceptExplanation,
};
