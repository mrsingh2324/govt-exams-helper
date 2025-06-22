import { useLocation, useNavigate } from "react-router-dom";

export default function QuizResultPage() {
  const { state } = useLocation();
  const navigate = useNavigate();
  const result = state || {};

  if (!result.correct && !result.total) {
    return (
      <div className="text-center mt-20">
        No result found. Go back to{" "}
        <button onClick={() => navigate('/')} className="text-blue-600 underline">
          Home
        </button>.
      </div>
    );
  }

  const scorePercentage = result.total > 0
    ? ((result.correct / result.total) * 100).toFixed(2)
    : "0.00";

  return (
    <div className="max-w-xl mx-auto p-6 bg-white shadow rounded my-8 space-y-4">
      <h2 className="text-2xl font-bold">Your Quiz Results</h2>
      <p>Total Questions: {result.total}</p>
      <p>Correct Answers: {result.correct}</p>
      <p>Score: <span className="font-semibold text-indigo-700">{scorePercentage}%</span></p>
      <div className="mt-4">
        <button
          onClick={() => navigate('/')}
          className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700"
        >
          Back to Home
        </button>
      </div>
    </div>
  );
}
