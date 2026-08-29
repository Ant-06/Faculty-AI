import React, { useEffect, useState } from "react";
import { BarChart3 } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, PieChart, Pie, Cell, Legend } from "recharts";
import api from "../../services/api";
import { LoadingState } from "../../components/Ui";

const COLORS = ["#3f5ff5", "#6284fd", "#8fabff", "#b9cdff", "#dbe6ff", "#2c42e0", "#1f2a71", "#94a3b8"];

export default function AdminAnalytics() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get("/admin/analytics").then((res) => {
      setData(res.data);
      setLoading(false);
    });
  }, []);

  if (loading || !data) return <LoadingState label="Loading analytics..." />;

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div className="flex items-center gap-3">
        <div className="w-11 h-11 rounded-xl bg-brand-50 text-brand-600 flex items-center justify-center">
          <BarChart3 size={22} />
        </div>
        <div>
          <h1 className="font-display text-2xl font-bold">Analytics</h1>
          <p className="text-slate-500 text-sm">Adoption, engagement, and popular content.</p>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <div className="card p-5">
          <h3 className="font-display font-semibold mb-4">Most viewed / saved AI tools</h3>
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={data.popularTools} layout="vertical" margin={{ left: 20 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#eef2f7" />
              <XAxis type="number" tick={{ fontSize: 12 }} stroke="#94a3b8" />
              <YAxis dataKey="name" type="category" tick={{ fontSize: 12 }} stroke="#94a3b8" width={110} />
              <Tooltip />
              <Bar dataKey="saves" fill="#3f5ff5" radius={[0, 6, 6, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="card p-5">
          <h3 className="font-display font-semibold mb-4">Most completed lessons</h3>
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={data.popularModules} layout="vertical" margin={{ left: 20 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#eef2f7" />
              <XAxis type="number" tick={{ fontSize: 12 }} stroke="#94a3b8" />
              <YAxis dataKey="title" type="category" tick={{ fontSize: 11 }} stroke="#94a3b8" width={140} />
              <Tooltip />
              <Bar dataKey="completions" fill="#2c42e0" radius={[0, 6, 6, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="card p-5">
          <h3 className="font-display font-semibold mb-4">Popular categories</h3>
          <ResponsiveContainer width="100%" height={260}>
            <PieChart>
              <Pie data={data.popularCategories} dataKey="count" nameKey="name" cx="50%" cy="50%" outerRadius={90} label>
                {data.popularCategories.map((entry, i) => (
                  <Cell key={entry.name} fill={COLORS[i % COLORS.length]} />
                ))}
              </Pie>
              <Legend />
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="card p-5">
          <h3 className="font-display font-semibold mb-4">Faculty engagement trend (hrs/week)</h3>
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={data.engagementTrend}>
              <CartesianGrid strokeDasharray="3 3" stroke="#eef2f7" />
              <XAxis dataKey="week" tick={{ fontSize: 12 }} stroke="#94a3b8" />
              <YAxis tick={{ fontSize: 12 }} stroke="#94a3b8" />
              <Tooltip />
              <Bar dataKey="hours" fill="#6284fd" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
