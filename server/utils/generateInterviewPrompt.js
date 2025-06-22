const generateInterviewPrompt = (jobRole) => {
    return `
  You are a professional government interview panelist.
  
  Generate 15 mock interview questions for the job role: "${jobRole}".
  
  - 5 General Awareness
  - 5 Subject Knowledge
  - 5 Personality-based HR questions
  
  Return only a JSON array in this format:
  [
    {
      "type": "General Awareness",
      "question": "What are the major highlights of Union Budget 2025?"
    },
    ...
  ]
  `.trim();
  };
  
  module.exports = generateInterviewPrompt;