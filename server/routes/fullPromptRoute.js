// routes/fullPromptRoute.js
const express = require("express");
const axios = require("axios");

const router = express.Router();

function generateFullPrompt({ contentType, examData, interviewData }) {
    let prompt = `
  Generate government exam questions STRICTLY in this format:
  [Question Number]. [Question Text]
  A) [Option 1]
  B) [Option 2]
  C) [Option 3]
  D) [Option 4]
  Correct: [Correct Option Letter]
  
  DO NOT include:
  - Any introductory text
  - Section headers
  - Explanations
  - Additional formatting
  - Any other content besides questions
  
  Generate for: ${contentType}
  `;
  
    if (contentType === "Exam Sample Paper" || contentType === "Both") {
      const ed = examData;
      prompt += `
  Exam: ${ed.examTitle}
  Year: ${ed.examYear}
  Sections: ${ed.sections.map(s => s.name).join(', ')}
  Total Questions: ${ed.totalQuestions}
  Difficulty: Mix of easy (40%), moderate (50%), hard (10%)
  `;
    }
  
    if (contentType === "Mock Interview Questions" || contentType === "Both") {
      const id = interviewData;
      prompt += `
  Job Role: ${id.jobRole}
  Question Types: GA (${id.generalAwareness}), Subject (${id.subjectKnowledge}), HR (${id.personality})
  `;
    }
  
    prompt += "\n\nBEGIN QUESTIONS:\n";
  
    return prompt.trim();
  }

router.post("/generate/full", async (req, res) => {
  const { contentType, examData, interviewData } = req.body;
  if (!contentType) {
    return res.status(400).json({ success: false, message: "contentType is required" });
  }

  const prompt = generateFullPrompt({ contentType, examData, interviewData });
  console.log("📤 Full prompt generated:\n", prompt);

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

    const content = aiResponse.data.choices?.[0]?.message?.content || "";
    console.log("✅ AI response:\n", content);
    res.status(200).json({ success: true, data: content });

  } catch (err) {
    console.error("❌ AI error:", err.message);
    res.status(500).json({ success: false, message: "AI generation failed" });
  }
});

module.exports = router;
