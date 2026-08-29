import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Clock, ArrowRight, Timer } from "lucide-react";
import api from "../services/api";
import { useAuth } from "../context/AuthContext";
import ToolCard from "../components/ToolCard";
import ModuleCard from "../components/ModuleCard";
import UpdateCard from "../components/UpdateCard";
import { LoadingState, ProgressBar } from "../components/Ui";

function greeting() {
  const h = new Date().getHours();
  if (h < 12) return "Good morning";
  if (h < 17) return "Good afternoon";
  return "Good evening";
}

const INTEREST_TO_CATEGORY = {
  TEACHING: "Teaching",
  RESEARCH: "Research",
  CODING: "Coding",
  ADMINISTRATION: "Administration",
  CONTENT_CREATION: "Content Creation",
};

export default function Dashboard() {
  const { user, refreshProfile } = useAuth();
  const [profile, setProfile] = useState(null);
  const [updates, setUpdates] = useState([]);
  const [tools, setTools] = useState([]);
  const [modules, setModules] = useState([]);
  const [stats, setStats] = useState({ completedCount: 0, startedCount: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    async function load() {
      setLoading(true);
      const [profileRes, updatesRes, toolsRes, modulesRes] = await Promise.all([
        api.get("/profile"),
        api.get("/updates", { params: { section: "New This Week" } }),
        api.get("/tools"),
        api.get("/learning"),
      ]);
      if (!mounted) return;
      setProfile(profileRes.data.profile);
      setStats(profileRes.data.stats);
      setUpdates(updatesRes.data.slice(0, 3));

      const interestCategory = INTEREST_TO_CATEGORY[profileRes.data.profile?.primaryInterest] || "Teaching";
      const recommended = toolsRes.data
        .filter((t) => t.category === interestCategory || t.popularityScore > 85)
        .slice(0, 4);
      setTools(recommended.length ? recommended : toolsRes.data.slice(0, 4));

      const weeklyTime = profileRes.data.profile?.weeklyTimeMinutes || 30;
      const quick = modulesRes.data
        .filter((m) => m.durationMins <= Math.max(weeklyTime, 15) && !m.userProgress?.completed)
        .slice(0, 3);
      setModules(quick.length ? quick : modulesRes.data.slice(0, 3));
      setLoading(false);
    }
    load();
    return () => (mounted = false);
  }, []);

  if (loading) return <LoadingState label="Loading your dashboard..." />;

  const progressPct = stats.startedCount > 0 ? Math.round((stats.completedCount / Math.max(stats.startedCount, 8)) * 100) : 0;
  const displayPct = Math.min(100, Math.max(progressPct, stats.completedCount > 0 ? 30 : 0));

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div>
        <h1 className="font-display text-2xl font-bold text-slate-900">
          {greeting()}, {user?.name?.split(" ")[0] === "Dr." ? user.name : `Professor ${user?.name?.split(" ").pop()}`}.
        </h1>
        <p className="text-slate-500 mt-1">Here's what's worth your time today.</p>
      </div>

      {/* Time available banner */}
      <div className="card p-5 sm:p-6 bg-gradient-to-r from-brand-600 to-brand-700 text-white border-none">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-xl bg-white/15 flex items-center justify-center shrink-0">
              <Timer size={22} />
            </div>
            <div>
              <p className="font-display font-semibold">
                You have {profile?.weeklyTimeMinutes || 30} minutes available this week.
              </p>
              <p className="text-sm text-brand-100">Recommended modules below fit your schedule.</p>
            </div>
          </div>
          <Link to="/quick-learning" className="btn-secondary bg-white/95 border-none shrink-0">
            View Quick Learning <ArrowRight size={16} />
          </Link>
        </div>
      </div>

      {/* Updates */}
      <section>
        <div className="flex items-center justify-between mb-3">
          <h2 className="font-display font-semibold text-lg">{updates.length} important AI developments this week</h2>
          <Link to="/ai-radar" className="text-sm font-medium text-brand-600 flex items-center gap-1">
            Open AI Radar <ArrowRight size={14} />
          </Link>
        </div>
        <div className="grid md:grid-cols-3 gap-4">
          {updates.map((u) => (
            <UpdateCard key={u.id} update={u} />
          ))}
        </div>
      </section>

      {/* Recommended tools */}
      <section>
        <div className="flex items-center justify-between mb-3">
          <h2 className="font-display font-semibold text-lg">Recommended for you</h2>
          <Link to="/tools" className="text-sm font-medium text-brand-600 flex items-center gap-1">
            Browse all tools <ArrowRight size={14} />
          </Link>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {tools.map((t) => (
            <ToolCard key={t.id} tool={t} />
          ))}
        </div>
      </section>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Quick learning */}
        <section className="lg:col-span-2">
          <div className="flex items-center justify-between mb-3">
            <h2 className="font-display font-semibold text-lg">10-Minute Learning</h2>
            <Link to="/quick-learning" className="text-sm font-medium text-brand-600 flex items-center gap-1">
              See all <ArrowRight size={14} />
            </Link>
          </div>
          <div className="grid sm:grid-cols-2 gap-4">
            {modules.map((m) => (
              <ModuleCard key={m.id} mod={m} />
            ))}
          </div>
        </section>

        {/* Progress + time saved */}
        <section className="space-y-4">
          <div className="card p-5">
            <h3 className="font-display font-semibold mb-3">Your AI learning progress</h3>
            <ProgressBar value={displayPct} />
            <div className="flex items-center justify-between mt-2 text-sm text-slate-500">
              <span>{stats.completedCount} lessons completed</span>
              <span>{displayPct}%</span>
            </div>
          </div>
          <div className="card p-5">
            <div className="flex items-center gap-2 text-brand-600 mb-2">
              <Clock size={18} />
              <h3 className="font-display font-semibold text-slate-900">Time saved</h3>
            </div>
            <p className="text-sm text-slate-600">
              This month you saved approximately{" "}
              <span className="font-semibold text-slate-900">{profile?.timeSavedHoursMonth ?? 0} hours</span> using
              FacultyAI Hub.
            </p>
          </div>
        </section>
      </div>
    </div>
  );
}
