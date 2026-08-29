import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ShieldCheck, LogIn } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { ErrorBanner } from "../components/Ui";

export default function AdminLogin() {
  const { login, loading } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("admin@facultyai.com");
  const [password, setPassword] = useState("Admin@123");
  const [error, setError] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    try {
      const user = await login(email, password);
      if (user.role !== "ADMIN") {
        setError("This account does not have admin access.");
        return;
      }
      navigate("/admin");
    } catch (err) {
      setError(err.response?.data?.error || "Something went wrong. Please try again.");
    }
  }

  return (
    <div className="auth-page auth-page-admin min-h-screen flex items-center justify-center px-4">
      <div className="auth-shell w-full max-w-sm">
        <Link to="/" className="flex items-center gap-2 justify-center mb-8">
          <div className="brand-mark w-9 h-9 rounded-lg flex items-center justify-center">
            <ShieldCheck size={18} />
          </div>
          <span className="font-display font-bold text-lg">FacultyAI Hub Admin</span>
        </Link>

        <div className="auth-glass auth-glass-admin rounded-2xl p-7">
          <h1 className="font-display text-xl font-semibold mb-1">Admin login</h1>
          <p className="text-sm text-slate-500 mb-6">Manage tools, learning modules, and analytics.</p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <ErrorBanner message={error} />
            <div>
              <label className="text-sm font-medium text-slate-700">Email</label>
              <input type="email" required className="input mt-1.5 bg-slate-800 border-slate-700 placeholder:text-slate-500" value={email} onChange={(e) => setEmail(e.target.value)} />
            </div>
            <div>
              <label className="text-sm font-medium text-slate-700">Password</label>
              <input type="password" required className="input mt-1.5 bg-slate-800 border-slate-700 placeholder:text-slate-500" value={password} onChange={(e) => setPassword(e.target.value)} />
            </div>
            <button type="submit" disabled={loading} className="btn-primary w-full">
              <LogIn size={16} /> {loading ? "Signing in..." : "Sign in"}
            </button>
          </form>

          <p className="text-xs text-slate-500 mt-5 text-center">
            Demo credentials: <span className="font-mono">admin@facultyai.com</span> / <span className="font-mono">Admin@123</span>
          </p>
        </div>
        <p className="text-sm text-slate-500 text-center mt-6">
          <Link to="/login" className="hover:text-slate-700">← Faculty login</Link>
        </p>
      </div>
    </div>
  );
}
