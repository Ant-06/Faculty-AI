import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Users, Wrench, BookOpen, Clock, TrendingUp, ArrowRight } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";
import api from "../../services/api";
import { LoadingState } from "../../components/Ui";

export default function AdminDashboard() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get("/admin/analytics").then((res) => {
      setData(res.data);
      setLoading(false);
    });
  }, []);

  if (loading || !data) return <LoadingState label="Loading admin overview..." />;

  const { overview } = data;

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div>
        <h1 className="font-display text-2xl font-bold text-slate-900">Admin Overview</h1>
        <p className="text-slate-500 mt-1">Faculty adoption and platform health at a glance.</p>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-4">
        <StatCard icon={Users} label="Total Faculty" value={overview.totalFaculty} />
        <StatCard icon={TrendingUp} label="Active Faculty" value={overview.activeFaculty} />
        <StatCard icon={Wrench} label="AI Tools" value={overview.totalTools} />
        <StatCard icon={BookOpen} label="Learning Modules" value={overview.totalModules} />
        <StatCard icon={Clock} label="Avg Monthly Learning" value={`${overview.avgMonthlyHours} hrs`} />
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <div className="card p-5">
          <h3 className="font-display font-semibold mb-4">Weekly engagement (hours)</h3>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={data.engagementTrend}>
              <CartesianGrid strokeDasharray="3 3" stroke="#eef2f7" />
              <XAxis dataKey="week" tick={{ fontSize: 12 }} stroke="#94a3b8" />
              <YAxis tick={{ fontSize: 12 }} stroke="#94a3b8" />
              <Tooltip />
              <Bar dataKey="hours" fill="#3f5ff5" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="card p-5">
          <h3 className="font-display font-semibold mb-4">Most saved tools</h3>
          <div className="space-y-3">
            {data.popularTools.map((t) => (
              <div key={t.id} className="flex items-center justify-between text-sm">
                <span className="text-slate-700 font-medium">{t.name}</span>
                <span className="text-slate-400">{t.saves} saves</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="flex flex-wrap gap-3">
        <Link to="/admin/tools" className="btn-secondary">Manage AI Tools <ArrowRight size={15} /></Link>
        <Link to="/admin/learning" className="btn-secondary">Manage Learning Modules <ArrowRight size={15} /></Link>
        <Link to="/admin/analytics" className="btn-secondary">View Full Analytics <ArrowRight size={15} /></Link>
      </div>
    </div>
  );
}

function StatCard({ icon: Icon, label, value }) {
  return (
    <div className="card p-5">
      <div className="w-9 h-9 rounded-lg bg-brand-50 text-brand-600 flex items-center justify-center mb-3">
        <Icon size={18} />
      </div>
      <p className="font-display text-2xl font-bold text-slate-900">{value}</p>
      <p className="text-xs text-slate-400">{label}</p>
    </div>
  );
}
