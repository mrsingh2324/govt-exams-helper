// src/pages/PromptBuilder.jsx
import { useState } from "react";
import axios from "axios";
import { useNavigate } from 'react-router-dom';

function PromptBuilder() {
  const navigate = useNavigate();
  const [contentType, setContentType] = useState("Mock Interview Questions");

  const [examData, setExamData] = useState({
    examTitle: "",
    examYear: "",
    specificPaperOrTier: "",
    totalQuestions: "",
    totalMarks: "",
    timeAllotted: "",
    negativeMarking: "Yes",
    negativeValue: "",
    unattemptedPenalty: "No",
    bilingual: "Yes",
    englishOnlySection: "",
    sections: [
      { name: "", questions: "", marks: "", topics: "", qType: "" }
    ]
  });

  const [interviewData, setInterviewData] = useState({
    jobRole: "",
    totalQuestions: 15,
    generalAwareness: 5,
    subjectKnowledge: 5,
    personality: 5
  });

  const [response, setResponse] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    setLoading(true);
    const payload = { contentType, examData, interviewData };
    const url = `${import.meta.env.VITE_API_BASE_URL || "http://localhost:5005"}/api/interview/generate/full`;

    console.group("🧠 AI Prompt Submission");
    console.log("📤 Target URL:", url);
    console.log("📝 Payload:", payload);

    try {
      const res = await axios.post(url, payload);
      console.log("✅ Response received successfully:");
      console.log(res.data.data);
      const aiRawResponseString = res.data.data;
      setResponse(aiRawResponseString);
      navigate('/test-paper', { state: { data: aiRawResponseString } });

    } catch (err) {
      console.error("❌ API Request Failed:", err);
      alert("Failed to generate. Please check input and try again.");
    } finally {
      console.groupEnd();
      setLoading(false);
    }
  };

  const updateSection = (index, field, value) => {
    const updated = [...examData.sections];
    updated[index][field] = value;
    setExamData({ ...examData, sections: updated });
  };

  return (
    <div className="p-6 max-w-5xl mx-auto text-gray-800">
      <h1 className="text-3xl font-bold mb-6 text-indigo-700 border-b pb-2">🧠 Advanced AI</h1>

      <div className="mb-6">
        <label className="block font-medium mb-2 text-lg">🗂️ Select Content Type</label>
        <select
          value={contentType}
          onChange={(e) => setContentType(e.target.value)}
          className="border border-indigo-300 px-4 py-2 rounded w-full shadow-sm focus:outline-none focus:ring focus:ring-indigo-200"
        >
          <option>Exam Sample Paper</option>
          <option>Mock Interview Questions</option>
          <option>Both</option>
        </select>
      </div>

      {["Mock Interview Questions", "Both"].includes(contentType) && (
        <div className="border border-indigo-200 p-5 rounded mb-6 bg-white shadow-sm">
          <h2 className="text-xl font-semibold mb-4 text-indigo-600">📋 Interview Settings</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {["jobRole", "totalQuestions", "generalAwareness", "subjectKnowledge", "personality"].map((field) => (
              <div key={field}>
                <label className="block text-sm font-medium capitalize mb-1">{field}</label>
                <input
                  type="text"
                  value={interviewData[field]}
                  onChange={(e) => setInterviewData({ ...interviewData, [field]: e.target.value })}
                  className="w-full border border-gray-300 px-3 py-2 rounded focus:outline-none focus:ring-1 focus:ring-indigo-300"
                />
              </div>
            ))}
          </div>
        </div>
      )}

      {["Exam Sample Paper", "Both"].includes(contentType) && (
        <div className="border border-indigo-200 p-5 rounded mb-6 bg-white shadow-sm">
          <h2 className="text-xl font-semibold mb-4 text-indigo-600">📘 Exam Paper Configuration</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {Object.entries(examData).map(([key, val]) =>
              key !== "sections" ? (
                <div key={key}>
                  <label className="block text-sm font-medium capitalize mb-1">{key}</label>
                  <input
                    type="text"
                    value={val}
                    onChange={(e) => setExamData({ ...examData, [key]: e.target.value })}
                    className="w-full border border-gray-300 px-3 py-2 rounded focus:outline-none focus:ring-1 focus:ring-indigo-300"
                  />
                </div>
              ) : null
            )}
          </div>

          <h3 className="text-md font-semibold mt-6 mb-2 text-indigo-500">📂 Sections</h3>
          {examData.sections.map((section, i) => (
            <div key={i} className="mb-4 border border-gray-200 p-3 rounded bg-gray-50">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {[
                  { key: "name", label: "Section Name (e.g., General Awareness)" },
                  { key: "questions", label: "No. of Questions" },
                  { key: "marks", label: "Total Marks for Section" },
                  { key: "topics", label: "Topics Covered (comma-separated)" },
                  { key: "qType", label: "Question Type (e.g., MCQ)" },
                ].map(({ key, label }) => (
                  <div key={key}>
                    <label className="text-xs block font-semibold mb-1">{label}</label>
                    <input
                      type="text"
                      value={section[key]}
                      onChange={(e) => updateSection(i, key, e.target.value)}
                      className="w-full border px-2 py-1 rounded focus:outline-none focus:ring-1 focus:ring-indigo-300"
                    />
                  </div>
                ))}
              </div>

              {examData.sections.length > 1 && (
                <button
                  onClick={() => {
                    const newSections = [...examData.sections];
                    newSections.splice(i, 1);
                    setExamData({ ...examData, sections: newSections });
                  }}
                  className="mt-2 text-red-600 hover:text-red-800 text-xs underline"
                >
                  🗑️ Delete Section
                </button>
              )}
            </div>
          ))}

          {examData.sections.length < 10 && (
            <button
              onClick={() =>
                setExamData({
                  ...examData,
                  sections: [...examData.sections, { name: "", questions: "", marks: "", topics: "", qType: "" }]
                })
              }
              className="mt-2 text-blue-600 hover:text-blue-800 text-sm underline"
            >
              ➕ Add Another Section
            </button>
          )}

        </div>
      )}

      <div className="flex justify-end mt-6">
        <button
          onClick={handleSubmit}
          disabled={loading}
          className="bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700 shadow disabled:opacity-50"
        >
          {loading ? "Generating..." : "🎯 Generate Question Paper"}
        </button>
      </div>

      {response && (
        <div className="mt-8 bg-white p-5 rounded shadow-md max-h-[600px] overflow-y-auto whitespace-pre-wrap text-sm border border-indigo-100">
          <h3 className="text-lg font-semibold mb-3 text-indigo-600">🧾 AI Generated Output</h3>
          <pre className="text-gray-800">{response}</pre>
        </div>
      )}
    </div>
  );
}

export default PromptBuilder;
