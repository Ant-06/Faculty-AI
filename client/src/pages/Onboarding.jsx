import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Sparkles, ArrowRight } from "lucide-react";
import api from "../services/api";
import { useAuth } from "../context/AuthContext";

const INTERESTS = [
  { value: "TEACHING", label: "Teaching" },
  { value: "RESEARCH", label: "Research" },
  { value: "CODING", label: "Coding" },
  { value: "ADMINISTRATION", label: "Administration" },
  { value: "CONTENT_CREATION", label: "Content Creation" },
];
const TIME_OPTIONS = [
  { value: 10, label: "10 minutes" },
  { value: 30, label: "30 minutes" },
  { value: 60, label: "1 hour" },
  { value: 120, label: "2+ hours" },
];
const SKILL_OPTIONS = [
  { value: "BEGINNER", label: "Beginner" },
  { value: "INTERMEDIATE", label: "Intermediate" },
  { value: "ADVANCED", label: "Advanced" },
];

export default function Onboarding() {
  const navigate = useNavigate();
  const { refreshProfile } = useAuth();
  const [step, setStep] = useState(0);
  const [interest, setInterest] = useState("TEACHING");
  const [time, setTime] = useState(30);
  const [skill, setSkill] = useState("BEGINNER");
  const [saving, setSaving] = useState(false);

  const steps = [
    { title: "What do you mainly use AI for?", render: () => (
      <Options options={INTERESTS} value={interest} onChange={setInterest} />
    )},
    { title: "How much time can you spend learning AI per week?", render: () => (
      <Options options={TIME_OPTIONS} value={time} onChange={setTime} />
    )},
    { title: "What's your current AI skill level?", render: () => (
      <Options options={SKILL_OPTIONS} value={skill} onChange={setSkill} />
    )},
  ];

  async function finish() {
    setSaving(true);
    try {
      await api.put("/profile", {
        primaryInterest: interest,
        weeklyTimeMinutes: time,
        skillLevel: skill,
        onboardingComplete: true,
      });
      await refreshProfile();
      navigate("/dashboard");
    } finally {
      setSaving(false);
    }
  }

  const isLast = step === steps.length - 1;

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="flex items-center gap-2 justify-center mb-8">
          <div className="w-9 h-9 rounded-lg bg-brand-600 text-white flex items-center justify-center">
            <Sparkles size={18} />
          </div>
          <span className="font-display font-bold text-lg">FacultyAI Hub</span>
        </div>

        <div className="card p-7">
          <div className="flex gap-1.5 mb-6">
            {steps.map((_, i) => (
              <div key={i} className={`h-1.5 flex-1 rounded-full ${i <= step ? "bg-brand-500" : "bg-slate-100"}`} />
            ))}
          </div>
          <h1 className="font-display text-lg font-semibold mb-5">{steps[step].title}</h1>
          {steps[step].render()}

          <div className="flex items-center justify-between mt-8">
            <button
              className="btn-ghost"
              disabled={step === 0}
              onClick={() => setStep((s) => Math.max(0, s - 1))}
            >
              Back
            </button>
            {isLast ? (
              <button className="btn-primary" onClick={finish} disabled={saving}>
                {saving ? "Setting up..." : "Finish setup"} <ArrowRight size={16} />
              </button>
            ) : (
              <button className="btn-primary" onClick={() => setStep((s) => s + 1)}>
                Next <ArrowRight size={16} />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function Options({ options, value, onChange }) {
  return (
    <div className="grid gap-2.5">
      {options.map((opt) => (
        <button
          key={opt.value}
          onClick={() => onChange(opt.value)}
          className={`text-left px-4 py-3 rounded-xl border text-sm font-medium transition-colors ${
            value === opt.value
              ? "border-brand-500 bg-brand-50 text-brand-700"
              : "border-slate-200 text-slate-600 hover:bg-slate-50"
          }`}
        >
          {opt.label}
        </button>
      ))}
    </div>
  );
}
