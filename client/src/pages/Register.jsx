import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Sparkles, UserPlus } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { ErrorBanner } from "../components/Ui";

export default function Register() {
  const { register, loading } = useAuth();
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  async function handleSubmit(event) {
    event.preventDefault();

    setError("");

    if (name.trim().length < 2) {
      setError("Please enter your full name.");
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }

    try {
      await register(
        name,
        email,
        password
      );

      navigate("/onboarding");
    } catch (err) {
      console.error("Registration error:", err);

      const message =
        err.response?.data?.error ||
        err.response?.data?.message ||
        err.message ||
        "Something went wrong. Please try again.";

      setError(message);
    }
  }

  return (
    <div className="auth-page auth-page-register min-h-screen flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-sm">

        <Link
          to="/"
          className="flex items-center gap-2 justify-center mb-8"
        >
          <div className="brand-mark w-9 h-9 rounded-lg flex items-center justify-center">
            <Sparkles size={18} />
          </div>

          <span className="font-display font-bold text-lg">
            FacultyAI Hub
          </span>
        </Link>

        <div className="auth-glass card p-7">

          <h1 className="font-display text-xl font-semibold mb-1">
            Create your faculty account
          </h1>

          <p className="text-sm text-slate-500 mb-6">
            Takes less than a minute.
          </p>

          <form
            onSubmit={handleSubmit}
            className="space-y-4"
          >

            <ErrorBanner message={error} />

            <div>
              <label className="text-sm font-medium text-slate-700">
                Full name
              </label>

              <input
                required
                autoComplete="name"
                className="input mt-1.5"
                value={name}
                onChange={(event) =>
                  setName(event.target.value)
                }
                placeholder="Dr. Jane Doe"
              />
            </div>

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
                placeholder="you@university.edu"
              />
            </div>

            <div>
              <label className="text-sm font-medium text-slate-700">
                Password
              </label>

              <input
                type="password"
                required
                autoComplete="new-password"
                className="input mt-1.5"
                value={password}
                onChange={(event) =>
                  setPassword(event.target.value)
                }
                placeholder="At least 6 characters"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full"
            >
              <UserPlus size={16} />

              {loading
                ? "Creating account..."
                : "Create account"}
            </button>

          </form>

        </div>

        <p className="text-sm text-slate-500 text-center mt-6">
          Already have an account?{" "}
          <Link
            to="/login"
            className="text-brand-600 font-medium"
          >
            Sign in
          </Link>
        </p>

      </div>
    </div>
  );
}