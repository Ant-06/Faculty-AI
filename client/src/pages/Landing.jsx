import React from "react";
import { Link } from "react-router-dom";
import {
  Sparkles,
  Radar,
  Zap,
  Building2,
  Compass,
  BrainCircuit,
  Rocket,
  ArrowRight,
  MessageSquare,
  NotebookText,
  Code2,
} from "lucide-react";

const FEATURES = [
  { icon: Radar, title: "AI Radar", desc: "See what's actually new in AI this week — in minutes, not hours of scattered searching." },
  { icon: Zap, title: "Quick Learning", desc: "5–15 minute micro-lessons built for a full teaching schedule, not a semester-long course." },
  { icon: Compass, title: "Personalized picks", desc: "Recommendations based on your role, interest area, and how much time you actually have." },
  { icon: Building2, title: "Institutional Access", desc: "Pooled access to premium AI tools, so you're not paying for five subscriptions yourself." },
];

const TOOLS_PREVIEW = [
  { icon: MessageSquare, name: "ChatGPT", tag: "Productivity" },
  { icon: Sparkles, name: "Claude", tag: "Research" },
  { icon: NotebookText, name: "NotebookLM", tag: "Research" },
  { icon: Code2, name: "GitHub Copilot", tag: "Coding" },
];

export default function Landing() {
  return (
    <div className="landing-shell bg-white text-slate-900">
      {/* Nav */}
      <header className="sticky top-0 z-30 bg-white/90 backdrop-blur border-b border-slate-100">
        <div className="max-w-6xl mx-auto flex items-center justify-between h-16 px-4 sm:px-6">
          <div className="flex items-center gap-2">
            <div className="brand-mark w-8 h-8 rounded-lg flex items-center justify-center" aria-hidden="true">
              <Sparkles size={16} />
            </div>
            <span className="font-display font-bold">FacultyAI Hub</span>
          </div>
          <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-600">
            <a href="#problem" className="hover:text-slate-900">The Problem</a>
            <a href="#how" className="hover:text-slate-900">How It Works</a>
            <a href="#features" className="hover:text-slate-900">Features</a>
            <a href="#institutional" className="hover:text-slate-900">Institutional Access</a>
          </nav>
          <div className="flex items-center gap-3">
            <Link to="/login" className="btn-ghost text-sm">Faculty Login</Link>
            <Link to="/register" className="btn-primary text-sm">Get Started</Link>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 pt-16 pb-20 grid lg:grid-cols-2 gap-12 items-center">
        <div>
          <span className="badge bg-brand-50 text-brand-700 mb-5">Built for AI & Data Science faculty</span>
          <h1 className="font-display text-4xl sm:text-5xl font-bold leading-tight tracking-tight">
            Keep up with AI.
            <br />
            Without spending hours on it.
          </h1>
          <p className="text-lg text-slate-600 mt-5 max-w-lg">
            FacultyAI Hub helps educators discover relevant AI tools, learn them in minutes, and apply them to
            teaching, research, and academic work.
          </p>
          <div className="flex flex-wrap gap-3 mt-8">
            <Link to="/register" className="btn-primary text-base px-5 py-3">
              Get Started <ArrowRight size={16} />
            </Link>
            <Link to="/login" className="btn-secondary text-base px-5 py-3">
              View Demo
            </Link>
          </div>
          <p className="text-xs text-slate-400 mt-4">
            Demo faculty login: <span className="font-mono">faculty@demo.com</span> / <span className="font-mono">Faculty@123</span>
          </p>
        </div>

        <div className="card p-6 relative">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-display font-semibold">Your week, right-sized</h3>
            <span className="badge bg-emerald-50 text-emerald-700">Live preview</span>
          </div>
          <div className="rounded-xl bg-brand-50/60 border border-brand-100 p-4 mb-4">
            <p className="text-sm text-brand-900 font-medium">You have 20 minutes available this week.</p>
          </div>
          <div className="space-y-3">
            {[
              { t: "NotebookLM basics", m: "7 min" },
              { t: "Prompt Engineering Essentials", m: "8 min" },
              { t: "AI Lesson Planning", m: "5 min" },
            ].map((r) => (
              <div key={r.t} className="flex items-center justify-between rounded-xl border border-slate-100 px-4 py-3">
                <span className="text-sm font-medium text-slate-700">{r.t}</span>
                <span className="text-xs text-slate-400">{r.m}</span>
              </div>
            ))}
          </div>
          <div className="mt-4 pt-4 border-t border-slate-100 text-sm text-slate-500">
            Estimated time saved this month: <span className="font-semibold text-slate-800">4.5 hours</span>
          </div>
        </div>
      </section>

      {/* Problem */}
      <section id="problem" className="bg-slate-50 border-y border-slate-100">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-16">
          <div className="max-w-2xl">
            <span className="badge bg-slate-200 text-slate-600 mb-4">The problem</span>
            <h2 className="font-display text-3xl font-bold">
              AI changes weekly. Teaching schedules don't leave room for that.
            </h2>
            <p className="text-slate-600 mt-4">
              Faculty members need an easier and less time-consuming way to stay updated with rapidly evolving AI
              technologies and tools, because continuous self-learning competes with an already full teaching and
              administrative workload — including accreditation work like NBA documentation.
            </p>
          </div>
          <div className="grid sm:grid-cols-3 gap-5 mt-10">
            {[
              { icon: BrainCircuit, stat: "Rapid change", label: "New AI tools appear faster than faculty can evaluate them." },
              { icon: Rocket, stat: "Limited time", label: "Self-learning has to compete with teaching and admin work." },
              { icon: Building2, stat: "Cost barrier", label: "Premium AI tools are often too expensive individually." },
            ].map((b) => (
              <div key={b.stat} className="card p-5">
                <b.icon className="text-brand-600 mb-3" size={22} />
                <h3 className="font-display font-semibold">{b.stat}</h3>
                <p className="text-sm text-slate-500 mt-1">{b.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section id="how" className="max-w-6xl mx-auto px-4 sm:px-6 py-16">
        <span className="badge bg-brand-50 text-brand-700 mb-4">How it works</span>
        <h2 className="font-display text-3xl font-bold mb-10">Discover → Learn → Apply</h2>
        <div className="grid sm:grid-cols-3 gap-6">
          {[
            { n: "1", t: "Discover", d: "See curated AI updates and tools relevant to your role, filtered from the noise." },
            { n: "2", t: "Learn", d: "Complete a 5–15 minute micro-lesson built around a real faculty task." },
            { n: "3", t: "Apply", d: "Use a ready-made prompt or workflow directly in your teaching, research, or admin work." },
          ].map((s) => (
            <div key={s.n} className="relative pl-14">
              <span className="absolute left-0 top-0 w-10 h-10 rounded-full bg-brand-600 text-white flex items-center justify-center font-display font-bold">
                {s.n}
              </span>
              <h3 className="font-display font-semibold text-lg">{s.t}</h3>
              <p className="text-sm text-slate-500 mt-1">{s.d}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section id="features" className="bg-slate-50 border-y border-slate-100">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-16">
          <span className="badge bg-brand-50 text-brand-700 mb-4">Features</span>
          <h2 className="font-display text-3xl font-bold mb-10">Everything faculty actually need, nothing they don't</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {FEATURES.map((f) => (
              <div key={f.title} className="card p-5">
                <div className="w-10 h-10 rounded-xl bg-brand-50 text-brand-600 flex items-center justify-center mb-3">
                  <f.icon size={19} />
                </div>
                <h3 className="font-display font-semibold">{f.title}</h3>
                <p className="text-sm text-slate-500 mt-1">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Tools preview */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 py-16">
        <span className="badge bg-brand-50 text-brand-700 mb-4">AI Tools</span>
        <h2 className="font-display text-3xl font-bold mb-10">A directory built for academic use cases</h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {TOOLS_PREVIEW.map((t) => (
            <div key={t.name} className="card p-5 flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-brand-50 text-brand-600 flex items-center justify-center shrink-0">
                <t.icon size={19} />
              </div>
              <div>
                <p className="font-medium text-sm">{t.name}</p>
                <p className="text-xs text-slate-400">{t.tag}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Institutional access */}
      <section id="institutional" className="bg-brand-600">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-16 text-white">
          <span className="badge bg-white/15 text-white mb-4">Institutional Access</span>
          <h2 className="font-display text-3xl font-bold max-w-xl">
            Your institution can pool access to premium AI tools.
          </h2>
          <p className="text-brand-100 mt-4 max-w-xl">
            So faculty don't have to individually purchase multiple subscriptions to stay current.
          </p>
          <Link to="/register" className="inline-flex items-center gap-2 bg-white text-brand-700 font-medium rounded-xl px-5 py-3 mt-6">
            Get Started <ArrowRight size={16} />
          </Link>
        </div>
      </section>

      <footer className="max-w-6xl mx-auto px-4 sm:px-6 py-10 flex flex-col sm:flex-row items-center justify-between gap-3 text-sm text-slate-400">
        <span>© {new Date().getFullYear()} FacultyAI Hub.</span>
        <Link to="/admin-login" className="hover:text-slate-600">Admin Login</Link>
      </footer>
    </div>
  );
}
