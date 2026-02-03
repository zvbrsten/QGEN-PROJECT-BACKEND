const { GoogleGenAI } = require("@google/genai");
const {
  conceptExplainPrompt,
  questionAnswerPrompt,
} = require("../utils/prompts");

if (!process.env.GEMINI_API_KEY) {
  console.error("❌ GEMINI_API_KEY is missing");
}

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

const MODEL_NAME = "gemini-1.5-flash"; // STABLE + SAFE

/* -------------------------------------------------- */
/* Helper: Extract text safely from Gemini response   */
/* -------------------------------------------------- */
function extractText(response) {
  try {
    return response.candidates?.[0]?.content?.parts
      ?.map((p) => p.text)
      .join("") || "";
  } catch {
    return "";
  }
}

/* -------------------------------------------------- */
/* Generate Interview Questions                       */
/* -------------------------------------------------- */
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

    console.log("🤖 Generating interview questions...");

    const response = await ai.models.generateContent({
      model: MODEL_NAME,
      contents: prompt,
    });

    const text = extractText(response);

    if (!text) {
      throw new Error("Empty response from Gemini");
    }

    // Try JSON parse, fallback to raw text
    let parsed;
    try {
      parsed = JSON.parse(text);
    } catch {
      console.warn("⚠️ Gemini response was not valid JSON, returning text");
      parsed = { result: text };
    }

    res.status(200).json(parsed);
  } catch (error) {
    console.error("🔥 AI Questions Error:", error);

    res.status(500).json({
      message: "Failed to generate questions",
      error: error.message,
    });
  }
};

/* -------------------------------------------------- */
/* Generate Concept Explanation                       */
/* -------------------------------------------------- */
const generateConceptExplanation = async (req, res) => {
  try {
    const { question } = req.body;

    if (!question) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    console.log("🤖 Generating concept explanation...");

    const prompt = conceptExplainPrompt(question);

    const response = await ai.models.generateContent({
      model: MODEL_NAME,
      contents: prompt,
    });

    const text = extractText(response);

    if (!text) {
      throw new Error("Empty response from Gemini");
    }

    // 🔥 DO NOT JSON.parse explanations
    res.status(200).json({
      explanation: text,
    });
  } catch (error) {
    console.error("🔥 AI Explanation Error:", error);

    res.status(500).json({
      message: "Failed to generate explanation",
      error: error.message,
    });
  }
};

module.exports = {
  generateInterviewQuestions,
  generateConceptExplanation,
};
