// src/Home.jsx
import { useState } from "react";
import axios from "axios";
import QuestionDisplay from "../components/QuestionDisplay.jsx";
import { useNavigate } from 'react-router-dom';

function Home() {
  const [jobRole, setJobRole] = useState("");
  const [questionType, setQuestionType] = useState("general");
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const generateInterview = async () => {
    if (!jobRole.trim()) {
      alert("Please enter a valid job role");
      return;
    }
  
    setLoading(true);
    const endpoint =
      questionType === "general"
        ? "/api/interview/generate/general"
        : "/api/interview/generate/mcq";
  
    const url = `${import.meta.env.VITE_API_BASE_URL || "http://localhost:5005"}${endpoint}`;
    console.log(`📤 Sending request to ${url} for jobRole="${jobRole}"`);
  
    try {
      const res = await axios.post(url, { jobRole });
      const received = res?.data?.data?.questions || res?.data?.data;
  
      if (!Array.isArray(received)) throw new Error("Invalid API response");
      console.log(`✅ Received ${received.length} questions`);
  
      setQuestions(received); // Optional for debug viewing
      navigate('/quiz', { state: { questions: received, type: questionType } });
  
    } catch (err) {
      console.error("❌ API Error:", err);
      alert("Failed to generate interview questions. Try again later.");
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div className="min-h-screen bg-gray-100 p-6 flex flex-col items-center">
      <h1 className="text-2xl font-bold mb-6 text-blue-700">
        🎯 AI Sarkari Mock Interview
      </h1>

      <div className="w-full max-w-md bg-white shadow p-4 rounded-lg">
        <input
          type="text"
          placeholder="Enter Job Role (e.g. IAS Officer)"
          className="w-full px-3 py-2 border border-gray-300 rounded mb-3"
          value={jobRole}
          onChange={(e) => setJobRole(e.target.value)}
        />
        <select
          className="w-full mb-3 px-3 py-2 border border-gray-300 rounded"
          value={questionType}
          onChange={(e) => setQuestionType(e.target.value)}
        >
          <option value="general">🧠 General Interview Questions</option>
          <option value="mcq">📘 Objective (MCQ) Questions</option>
        </select>
        <button
          onClick={generateInterview}
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 disabled:opacity-70"
          disabled={loading}
        >
          {loading ? "Generating..." : "Generate Questions"}
        </button>
      </div>

      {questions.length > 0 && (
        <div className="mt-6 w-full max-w-2xl">
          <QuestionDisplay questions={questions} type={questionType} />
        </div>
      )}
    </div>
  );
}

export default Home;
