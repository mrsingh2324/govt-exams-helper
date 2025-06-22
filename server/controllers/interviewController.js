const Interview = require("../models/Interview");
const generatePrompt = require("../utils/generateInterviewPrompt");

exports.generateInterview = async (req, res) => {
  const { jobRole } = req.body;

  if (!jobRole) {
    return res.status(400).json({ success: false, message: "Job role is required" });
  }

  const prompt = generatePrompt(jobRole);

  try {
    // TODO: Replace with OpenRouter + DeepSeek call
    const dummyQuestions = [
      {
        type: "General Awareness",
        question: "What are the key challenges in Indian rural education?",
      },
      {
        type: "Subject Knowledge",
        question: "Explain the role of RBI in inflation control.",
      },
      {
        type: "Personality",
        question: "Why do you want to become a civil servant?",
      },
    ];

    const interview = new Interview({
      jobRole,
      questions: dummyQuestions,
    });

    await interview.save();

    res.status(201).json({ success: true, data: interview });
  } catch (error) {
    console.error("❌ Interview Generation Error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};
