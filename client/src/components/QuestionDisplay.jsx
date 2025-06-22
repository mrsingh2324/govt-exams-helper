import React from 'react';

function QuestionDisplay({ questions, type }) {
    return (
      <div className="bg-white shadow p-4 rounded">
        <h2 className="text-lg font-semibold mb-3">
          {type === "mcq" ? "📘 MCQ Questions" : "📝 Interview Questions"}
        </h2>
        {questions.map((q, index) => (
          <div key={index} className="mb-4 p-4 border border-gray-200 rounded">
            <p className="font-medium mb-2">
              {index + 1}. {q.question}
            </p>
            {type === "mcq" ? (
              <ul className="list-disc pl-6">
                {q.options.map((opt, i) => (
                  <li
                    key={i}
                    className={opt === q.correctOption ? "text-green-600 font-semibold" : ""}
                  >
                    {opt}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-gray-500">Type: {q.type}</p>
            )}
          </div>
        ))}
      </div>
    );
  }
  
  export default QuestionDisplay;
  