// server/index.js
const express = require("express");
const cors = require("cors");
const axios = require("axios");
const morgan = require("morgan");
const NodeCache = require("node-cache");
require("dotenv").config();

const app = express();
const cache = new NodeCache({ stdTTL: 3 * 60 * 60 }); // 3 hours


const fullPromptRoute = require("./routes/fullPromptRoute");


// ✅ Middleware
// app.use(cors({ origin: process.env.FRONTEND_ORIGIN || "http://localhost:5173" }));
app.use(cors({
    origin: (origin, callback) => {
      const allowed = [
        "http://localhost:5173",
        "https://govt-exams-helper.vercel.app"
      ];
      if (!origin || allowed.includes(origin)) {
        return callback(null, true);
      }
      return callback(new Error("Not allowed by CORS"));
    },
    credentials: true
  }));

app.use(express.json());
app.use(morgan("dev")); // logs each request
app.use("/api/interview", fullPromptRoute);

console.log("🚀 API server initializing...");


// ✅ AI Prompt Generator
const generateGeneralQuestionsPrompt = (jobRole) => `
You are a government job interview expert.

Generate 15 mock interview questions for the role of "${jobRole}".

Split into:
- 5 General Awareness
- 5 Subject Knowledge
- 5 Personality/HR

Return only in JSON array format like:
[
  {
    "type": "General Awareness",
    "question": "What are the major issues faced by rural India?"
  },
  ...
]
`.trim();

const generateMcqTypeQuestionsPrompt = (jobRole) => `
You are an expert in preparing government exam MCQs.

Generate **10 multiple-choice questions** for the role of **${jobRole}** in the most optimized format for a mock test.

Each question should follow this exact format:
{
  "question": "What is the capital of India?",
  "options": ["Delhi", "Mumbai", "Kolkata", "Chennai"],
  "correctOption": "Delhi"
}

Return ONLY a valid JSON array.
Do NOT include any explanation or markdown formatting.
`.trim();


// ✅ Route
app.post("/api/interview/generate/general", async (req, res) => {
  const { jobRole } = req.body;
  if (!jobRole) {
    console.warn("⚠️ Job role missing in request body");
    return res.status(400).json({ success: false, message: "Job role is required" });
  }

  console.log(`📥 Generating interview for role: ${jobRole}`);

  const prompt = generateGeneralQuestionsPrompt(jobRole);

  try {
    const aiResponse = await axios.post(
      "https://openrouter.ai/api/v1/chat/completions",
      {
        model: "deepseek/deepseek-r1-0528:free",
        messages: [{ role: "user", content: prompt }],
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );

    let content = aiResponse.data.choices?.[0]?.message?.content || "[]";
    console.log("🧠 Raw AI response content:\n", content);


// 🧼 Remove Markdown wrappers if present
content = content.replace(/```json|```/g, "").trim();

let questions = [];
try {
  questions = JSON.parse(content);
  if (!Array.isArray(questions)) throw new Error("Not an array");
} catch (parseErr) {
  console.error("❌ JSON parsing failed:", parseErr.message);
  return res.status(500).json({ success: false, message: "AI returned invalid JSON" });
}


    console.log(`✅ Generated ${questions.length} questions for: ${jobRole}`);

    // 🔐 Store temporarily in cache
    const key = `interview-${Date.now()}`;
    cache.set(key, { jobRole, questions });

    res.status(201).json({ success: true, data: { key, questions } });

  } catch (err) {
    console.error("🔥 Error generating interview:", err.message);
    res.status(500).json({ success: false, message: "Something went wrong" });
  }
});

app.post("/api/interview/generate/mcq", async (req, res) => {
    const { jobRole } = req.body;
    if (!jobRole) {
      return res.status(400).json({ success: false, message: "Job role is required" });
    }
  
    console.log(`📤 Generating MCQs for: ${jobRole}`);
    const prompt = generateMcqTypeQuestionsPrompt(jobRole);
  
    try {
      const aiResponse = await axios.post(
        "https://openrouter.ai/api/v1/chat/completions",
        {
          model: "deepseek/deepseek-r1-0528:free",
          messages: [{ role: "user", content: prompt }],
        },
        {
          headers: {
            Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
            "Content-Type": "application/json",
          },
        }
      );
  
      let content = aiResponse.data.choices?.[0]?.message?.content || "[]";
      content = content.replace(/```json|```/g, "").trim();
  
      let mcqs = [];
      try {
        mcqs = JSON.parse(content);
      } catch (err) {
        console.error("❌ MCQ JSON parsing error:", err.message);
        return res.status(500).json({ success: false, message: "Failed to parse AI response" });
      }
  
      // Log each question for debug
      mcqs.forEach((q, idx) => {
        console.log(`\n${idx + 1}. ${q.question}`);
        q.options.forEach((opt, i) => console.log(`   ${String.fromCharCode(65 + i)}. ${opt}`));
        console.log(`   ✅ Correct: ${q.correctOption}`);
      });
  
      res.json({ success: true, data: mcqs });
  
    } catch (err) {
      console.error("🔥 MCQ API error:", err.message);
      res.status(500).json({ success: false, message: "Something went wrong generating MCQs" });
    }
  });
  

// ✅ Health check + monitor cache size
app.get("/api/interview/status", (req, res) => {
  res.json({ cacheKeys: cache.keys(), totalStored: cache.getStats().keys });
});

// ✅ Start server
const PORT = process.env.PORT || 5005;
app.listen(PORT, () => console.log(`🚀 Server running at http://localhost:${PORT}`));
