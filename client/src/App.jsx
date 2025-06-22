// src/App.jsx
import { NavLink, Outlet } from "react-router-dom";



function App() {
  return (
    <div className="min-h-screen w-screen bg-gray-50 text-gray-900 border border-black">
      <nav className="bg-indigo-700 text-white px-6 py-4 shadow-md flex items-center justify-between">
        <div className="text-xl font-bold tracking-wide">🧠 Sarkari AI Suite</div>
        <div className="flex space-x-6 text-sm font-medium">
          <NavLink
            to="/"
            className={({ isActive }) =>
              isActive ? "text-white underline" : "text-indigo-100 hover:text-white"
            }
          >
            Home
          </NavLink>
          <NavLink
            to="/ai-prompt-builder"
            className={({ isActive }) =>
              isActive ? "text-white underline" : "text-indigo-100 hover:text-white"
            }
          >
            Prompt Builder
          </NavLink>
        </div>
      </nav>

      <main className="px-4 sm:px-6 md:px-10 py-8 max-w-7xl mx-auto">
        <Outlet /> {/* current route renders here */}
      </main>
    </div>
  );
}

export default App;
