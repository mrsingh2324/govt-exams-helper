// src/main.jsx
import React, { Suspense, lazy } from "react";
import ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import App from "./App.jsx";
import "./index.css"; // Import global styles

// Lazy loaded components
const Home = lazy(() => import("./pages/Home.jsx"));
const PromptBuilder = lazy(() => import("./pages/PromptBuilder.jsx"));
const QuizPage = lazy(() => import('./pages/QuizPage.jsx'));
const QuizResultPage = lazy(() => import('./pages/QuizResultPage.jsx'));
const TestPaperViewer = lazy(() => import('./pages/TestPaperViewer.jsx'));


const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      { index: true, element: <Home /> },
      { path: "ai-prompt-builder", element: <PromptBuilder /> },
      { path: "quiz", element: <QuizPage /> },
      { path: "quiz-result", element: <QuizResultPage /> },
      { path: "test-paper", element: <TestPaperViewer /> },

    ],
  },
]);

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <Suspense fallback={<div className="p-6 text-center">⏳ Loading...</div>}>
      <RouterProvider router={router} />
    </Suspense>
  </React.StrictMode>
);
