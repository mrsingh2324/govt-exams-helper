// src/pages/QuizPage.jsx
import { useState } from "react";
// import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom";

export default function QuizPage() {
  const { state } = useLocation();
  const navigate = useNavigate();
  const { questions = [], type = "general" } = state || {};
  const [current, setCurrent] = useState(0);
  const [answers, setAnswers] = useState({});

  if (!questions.length) {
    return <div className="text-center mt-20">No questions to display. Please start from Home.</div>;
  }

  const q = questions[current];

  const selectAnswer = (ans) => {
    setAnswers({ ...answers, [current]: ans });
  };

  const next = () => {
    if (current < questions.length - 1) setCurrent(current + 1);
  };
  const prev = () => {
    if (current > 0) setCurrent(current - 1);
  };

  const submitQuiz = () => {
    let correct = 0;
    questions.forEach((q, index) => {
      if (type === "mcq" && answers[index]) {
        const correctOpt = q.correctOption?.toUpperCase?.() || q.correct?.toUpperCase?.();
        const selected = answers[index]?.toUpperCase?.();
        if (selected === correctOpt) correct++;
      }
    });
  
    const result = {
      correct,
      total: questions.length,
      attempted: Object.keys(answers).length,
    };
  
    navigate("/quiz-result", { state: result });
  };

  return (
    <div className="max-w-xl mx-auto p-6 bg-white shadow rounded my-8">
      <div className="mb-4 flex justify-between items-center">
        <h2 className="text-lg font-semibold">{current + 1}. {q.question}</h2>
        <span className="text-sm text-gray-500">{current + 1} / {questions.length}</span>
      </div>

      {type === 'mcq' ? (
        <ul className="space-y-2">
          {q.options.map((opt, i) => (
            <li key={i}>
              <button
                onClick={() => selectAnswer(opt)}
                className={`w-full text-left px-4 py-2 border rounded ${
                  answers[current] === opt ? 'bg-indigo-600 text-white' : 'bg-gray-100'
                }`}
              >
                {opt}
              </button>
            </li>
          ))}
        </ul>
      ) : (
        <textarea
          rows={4}
          value={answers[current] || ""}
          onChange={(e) => selectAnswer(e.target.value)}
          className="w-full border px-3 py-2 rounded"
          placeholder="Type your answer here..."
        />
      )}

      <div className="mt-4 flex justify-between">
        <button disabled={current === 0} onClick={prev} className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300">Previous</button>
        {current < questions.length - 1 ? (
          <button disabled={!answers[current]} onClick={next} className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700">Next</button>
        ) : (
          <button disabled={Object.keys(answers).length < questions.length} onClick={submitQuiz} className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700">Submit</button>
        )}
      </div>

      <div className="mt-4">
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div className="bg-indigo-600 h-2 rounded-full" style={{ width: `${((current+1)/questions.length)*100}%` }} />
        </div>
      </div>
    </div>
  );
}
