import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { BookOpen, Flame, Clock3, Award, CheckCircle2, PlayCircle } from "lucide-react";
import api from "../services/api";
import { LoadingState, Pill, EmptyState } from "../components/Ui";

export default function MyLearning() {
  const [profile, setProfile] = useState(null);
  const [modules, setModules] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([api.get("/profile"), api.get("/learning")]).then(([profileRes, modulesRes]) => {
      setProfile(profileRes.data);
      setModules(modulesRes.data);
      setLoading(false);
    });
  }, []);

  if (loading) return <LoadingState label="Loading your learning history..." />;

  const completed = modules.filter((m) => m.userProgress?.completed);
  const inProgress = modules.filter((m) => m.userProgress && !m.userProgress.completed);
  const skills = [...new Set(completed.map((m) => m.category))];

  const hours = Math.floor((profile.profile?.totalLearningMins || 0) / 60);
  const mins = (profile.profile?.totalLearningMins || 0) % 60;

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div className="flex items-center gap-3">
        <div className="w-11 h-11 rounded-xl bg-brand-50 text-brand-600 flex items-center justify-center">
          <BookOpen size={22} />
        </div>
        <div>
          <h1 className="font-display text-2xl font-bold">My Learning</h1>
          <p className="text-slate-500 text-sm">Your progress, streaks, and skills acquired so far.</p>
        </div>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard icon={CheckCircle2} label="Completed" value={completed.length} sub="lessons" tone="text-emerald-600 bg-emerald-50" />
        <StatCard icon={PlayCircle} label="Started" value={modules.filter((m) => m.userProgress).length} sub="lessons" tone="text-brand-600 bg-brand-50" />
        <StatCard icon={Flame} label="Current streak" value={profile.profile?.streakDays || 0} sub="days" tone="text-amber-600 bg-amber-50" />
        <StatCard icon={Clock3} label="Learning time" value={`${hours}h ${mins}m`} sub="total" tone="text-slate-600 bg-slate-100" />
      </div>

      <div className="card p-5">
        <div className="flex items-center gap-2 mb-3">
          <Award size={18} className="text-brand-600" />
          <h3 className="font-display font-semibold">Skills acquired</h3>
        </div>
        {skills.length === 0 ? (
          <p className="text-sm text-slate-400">Complete a lesson to start building your skills list.</p>
        ) : (
          <div className="flex flex-wrap gap-2">
            {skills.map((s) => (
              <Pill key={s} tone="brand">{s}</Pill>
            ))}
          </div>
        )}
      </div>

      {inProgress.length > 0 && (
        <section>
          <h2 className="font-display font-semibold text-lg mb-3">Continue learning</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {inProgress.map((m) => (
              <Link key={m.id} to={`/quick-learning/${m.id}`} className="card p-4 hover:shadow-card transition-all">
                <p className="font-medium text-sm text-slate-900">{m.title}</p>
                <p className="text-xs text-slate-400 mt-1">{m.category} · {m.durationMins} min</p>
              </Link>
            ))}
          </div>
        </section>
      )}

      <section>
        <h2 className="font-display font-semibold text-lg mb-3">Completed lessons</h2>
        {completed.length === 0 ? (
          <EmptyState title="No lessons completed yet" description="Start with a Quick Learning module — most take under 10 minutes." action={<Link to="/quick-learning" className="btn-primary">Browse Quick Learning</Link>} />
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {completed.map((m) => (
              <Link key={m.id} to={`/quick-learning/${m.id}`} className="card p-4 flex items-center justify-between hover:shadow-card transition-all">
                <div>
                  <p className="font-medium text-sm text-slate-900">{m.title}</p>
                  <p className="text-xs text-slate-400 mt-1">{m.category}</p>
                </div>
                <CheckCircle2 size={18} className="text-emerald-500 shrink-0" />
              </Link>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

function StatCard({ icon: Icon, label, value, sub, tone }) {
  return (
    <div className="card p-5">
      <div className={`w-9 h-9 rounded-lg flex items-center justify-center mb-3 ${tone}`}>
        <Icon size={18} />
      </div>
      <p className="font-display text-2xl font-bold text-slate-900">{value}</p>
      <p className="text-xs text-slate-400">{label} {sub}</p>
    </div>
  );
}
