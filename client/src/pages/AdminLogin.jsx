import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ShieldCheck, LogIn } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { ErrorBanner } from "../components/Ui";

export default function AdminLogin() {
  const { login, loading } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  async function handleSubmit(event) {
    event.preventDefault();

    setError("");

    try {
      const user = await login(email, password);

      if (!user || user.role !== "ADMIN") {
        setError("This account does not have admin access.");
        return;
      }

      navigate("/admin");
    } catch (err) {
      console.error("Admin login error:", err);

      const message =
        err.response?.data?.error ||
        err.response?.data?.message ||
        err.message ||
        "Something went wrong. Please try again.";

      setError(message);
    }
  }

  return (
    <div className="auth-page auth-page-admin min-h-screen flex items-center justify-center px-4">
      <div className="auth-shell w-full max-w-sm">

        <Link
          to="/"
          className="flex items-center gap-2 justify-center mb-8"
        >
          <div className="brand-mark w-9 h-9 rounded-lg flex items-center justify-center">
            <ShieldCheck size={18} />
          </div>

          <span className="font-display font-bold text-lg">
            FacultyAI Hub Admin
          </span>
        </Link>

        <div className="auth-glass auth-glass-admin rounded-2xl p-7">

          <h1 className="font-display text-xl font-semibold mb-1">
            Admin login
          </h1>

          <p className="text-sm text-slate-500 mb-6">
            Manage tools, learning modules, and analytics.
          </p>

          <form
            onSubmit={handleSubmit}
            className="space-y-4"
          >

            <ErrorBanner message={error} />

            <div>
              <label className="text-sm font-medium text-slate-700">
                Email
              </label>

              <input
                type="email"
                required
                autoComplete="email"
                className="input mt-1.5"
                value={email}
                onChange={(event) =>
                  setEmail(event.target.value)
                }
                placeholder="admin@university.edu"
              />
            </div>

            <div>
              <label className="text-sm font-medium text-slate-700">
                Password
              </label>

              <input
                type="password"
                required
                autoComplete="current-password"
                className="input mt-1.5"
                value={password}
                onChange={(event) =>
                  setPassword(event.target.value)
                }
                placeholder="••••••••"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full"
            >
              <LogIn size={16} />

              {loading
                ? "Signing in..."
                : "Sign in"}
            </button>

          </form>

        </div>

        <p className="text-sm text-slate-500 text-center mt-6">
          <Link
            to="/login"
            className="hover:text-slate-700"
          >
            ← Faculty login
          </Link>
        </p>

      </div>
    </div>
  );
}