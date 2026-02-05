import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";
import { useState } from "react";
import Dashboard from "./pages/Dashboard";
import Projects from "./pages/Projects";
import Issues from "./pages/Issues";
import "./App.css";

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading)
    return (
      <div className="h-screen w-screen bg-[#0f172a] flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );

  if (!user) return <Navigate to="/login" />;

  return children;
};

const LoginPage = () => {
  const { login } = useAuth();
  const [email, setEmail] = useState("john@example.com");
  const [password, setPassword] = useState("password123");
  const [error, setError] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      await login(email, password);
    } catch (err) {
      setError("Login failed. Make sure backend is running.");
    }
  };

  return (
    <div className="h-screen w-screen bg-[#0f172a] flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-800 p-8 rounded-2xl w-full max-w-md shadow-2xl">
        <h1 className="text-3xl font-bold text-white mb-2 text-center">
          Welcome Back
        </h1>
        <p className="text-slate-500 text-center mb-8">
          Sign in to manage your issues
        </p>

        {error && (
          <div className="mb-4 p-3 bg-red-500/10 border border-red-500/50 rounded-lg text-red-500 text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-slate-400 mb-2">
              Email Address
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
              placeholder="name@company.com"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-400 mb-2">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
              placeholder="••••••••"
            />
          </div>
          <button className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold transition-all shadow-lg shadow-blue-600/20 active:scale-[0.98]">
            Sign In
          </button>
        </form>
      </div>
    </div>
  );
};

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/projects"
            element={
              <ProtectedRoute>
                <Projects />
              </ProtectedRoute>
            }
          />
          <Route
            path="/issues"
            element={
              <ProtectedRoute>
                <Issues />
              </ProtectedRoute>
            }
          />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
