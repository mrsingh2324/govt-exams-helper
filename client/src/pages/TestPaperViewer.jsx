import { useLocation, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";

function parseRawQuestions(text) {
  const blocks = text.trim().split(/\n(?=\d+\.)/);
  return blocks.map((block) => {
    const lines = block.trim().split("\n");
    const questionText = lines[0].replace(/^\d+\.\s*/, "").trim();
    const options = lines.slice(1, 5).map(line => line.replace(/^[A-D]\)\s*/, "").trim());
    const correctMatch = lines.find(l => l.startsWith("Correct:")) || "";
    const correctOption = correctMatch.split(":")[1]?.trim();
    return { question: questionText, options, correctOption };
  });
}

export default function TestPaperViewer() {
  const { state } = useLocation();
  const navigate = useNavigate();
  const [current, setCurrent] = useState(0);
  const [parsedQuestions, setParsedQuestions] = useState([]);
  const [answers, setAnswers] = useState({});

  useEffect(() => {
    if (!state?.data) return;
    const parsed = parseRawQuestions(state.data);
    setParsedQuestions(parsed);
  }, [state]);

  const selectOption = (value) => {
    setAnswers({ ...answers, [current]: value });
  };

  const handleSubmit = () => {
    let correct = 0;
    parsedQuestions.forEach((q, i) => {
      if (answers[i] === q.correctOption) correct++;
    });
    navigate('/quiz-result', {
      state: {
        total: parsedQuestions.length,
        correct,
        attempted: Object.keys(answers).length
      }
    });
  };

  const q = parsedQuestions[current];
  if (!q) return <div className="p-6 text-center">📥 Loading questions...</div>;

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white shadow rounded mt-6">
      <div className="mb-4">
        <h2 className="text-lg font-bold mb-2">{current + 1}. {q.question}</h2>
        <ul className="space-y-2">
          {q.options.map((opt, i) => {
            const label = String.fromCharCode(65 + i);
            return (
              <li key={i}>
                <button
                  className={`w-full text-left px-4 py-2 border rounded ${
                    answers[current] === label
                      ? "bg-indigo-600 text-white"
                      : "bg-gray-100 hover:bg-gray-200"
                  }`}
                  onClick={() => selectOption(label)}
                >
                  {label}) {opt}
                </button>
              </li>
            );
          })}
        </ul>
      </div>

      <div className="flex justify-between mt-4">
        <button
          onClick={() => setCurrent((prev) => Math.max(prev - 1, 0))}
          disabled={current === 0}
          className="bg-gray-200 px-4 py-2 rounded"
        >
          ← Previous
        </button>

        {current < parsedQuestions.length - 1 ? (
          <button
            onClick={() => setCurrent((prev) => prev + 1)}
            disabled={!answers[current]}
            className="bg-indigo-600 text-white px-4 py-2 rounded"
          >
            Next →
          </button>
        ) : (
          <button
            onClick={handleSubmit}
            className="bg-green-600 text-white px-4 py-2 rounded"
          >
            ✅ Submit Test
          </button>
        )}
      </div>
    </div>
  );
}
