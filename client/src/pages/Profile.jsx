import React, { useEffect, useState } from "react";
import { User, Save, CheckCircle2 } from "lucide-react";
import api from "../services/api";
import { useAuth } from "../context/AuthContext";
import { LoadingState } from "../components/Ui";

const INTERESTS = ["TEACHING", "RESEARCH", "CODING", "ADMINISTRATION", "CONTENT_CREATION"];
const SKILLS = ["BEGINNER", "INTERMEDIATE", "ADVANCED"];
const TIMES = [10, 30, 60, 120];

export default function Profile() {
  const { user, setUser } = useAuth();
  const [form, setForm] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    api.get("/profile").then((res) => {
      setForm({
        name: res.data.name,
        department: res.data.profile?.department || "AI & Data Science Engineering",
        title: res.data.profile?.title || "Assistant Professor",
        primaryInterest: res.data.profile?.primaryInterest || "TEACHING",
        weeklyTimeMinutes: res.data.profile?.weeklyTimeMinutes || 30,
        skillLevel: res.data.profile?.skillLevel || "BEGINNER",
      });
      setLoading(false);
    });
  }, []);

  if (loading || !form) return <LoadingState label="Loading profile..." />;

  async function handleSave(e) {
    e.preventDefault();
    setSaving(true);
    setSaved(false);
    try {
      await api.put("/profile", form);
      const updated = { ...user, name: form.name };
      localStorage.setItem("fah_user", JSON.stringify(updated));
      setUser(updated);
      setSaved(true);
      setTimeout(() => setSaved(false), 2500);
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="flex items-center gap-3">
        <div className="w-11 h-11 rounded-xl bg-brand-50 text-brand-600 flex items-center justify-center">
          <User size={22} />
        </div>
        <div>
          <h1 className="font-display text-2xl font-bold">Profile</h1>
          <p className="text-slate-500 text-sm">Keep your preferences up to date for better recommendations.</p>
        </div>
      </div>

      <form onSubmit={handleSave} className="card p-6 space-y-5">
        <Field label="Full name">
          <input className="input" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
        </Field>
        <Field label="Department">
          <input className="input" value={form.department} onChange={(e) => setForm({ ...form, department: e.target.value })} />
        </Field>
        <Field label="Title">
          <input className="input" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
        </Field>
        <Field label="Primary interest">
          <select className="input" value={form.primaryInterest} onChange={(e) => setForm({ ...form, primaryInterest: e.target.value })}>
            {INTERESTS.map((i) => (
              <option key={i} value={i}>{i.replace("_", " ")}</option>
            ))}
          </select>
        </Field>
        <Field label="Weekly learning time">
          <select className="input" value={form.weeklyTimeMinutes} onChange={(e) => setForm({ ...form, weeklyTimeMinutes: Number(e.target.value) })}>
            {TIMES.map((t) => (
              <option key={t} value={t}>{t >= 60 ? `${t / 60} hour${t > 60 ? "+" : ""}` : `${t} minutes`}</option>
            ))}
          </select>
        </Field>
        <Field label="Skill level">
          <select className="input" value={form.skillLevel} onChange={(e) => setForm({ ...form, skillLevel: e.target.value })}>
            {SKILLS.map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
        </Field>

        <div className="flex items-center gap-3 pt-2">
          <button type="submit" disabled={saving} className="btn-primary">
            <Save size={16} /> {saving ? "Saving..." : "Save changes"}
          </button>
          {saved && (
            <span className="flex items-center gap-1 text-sm text-emerald-600">
              <CheckCircle2 size={16} /> Saved
            </span>
          )}
        </div>
      </form>
    </div>
  );
}

function Field({ label, children }) {
  return (
    <div>
      <label className="text-sm font-medium text-slate-700 mb-1.5 block">{label}</label>
      {children}
    </div>
  );
}
