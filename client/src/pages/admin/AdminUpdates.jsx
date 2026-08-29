import React, { useEffect, useState } from "react";
import { Radar } from "lucide-react";
import api from "../../services/api";
import { LoadingState, Pill, EmptyState } from "../../components/Ui";

export default function AdminUpdates() {
  const [updates, setUpdates] = useState([]);
  const [loading, setLoading] = useState(true);

  function load() {
    setLoading(true);
    api.get("/updates").then((res) => {
      setUpdates(res.data);
      setLoading(false);
    });
  }
  useEffect(load, []);

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-xl bg-brand-50 text-brand-600 flex items-center justify-center">
            <Radar size={22} />
          </div>
          <div>
            <h1 className="font-display text-2xl font-bold">AI Updates</h1>
            <p className="text-slate-500 text-sm">Content shown to faculty on the AI Radar page.</p>
          </div>
        </div>
      </div>

      {loading ? (
        <LoadingState label="Loading updates..." />
      ) : updates.length === 0 ? (
        <EmptyState title="No updates yet" />
      ) : (
        <div className="card overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-slate-400 border-b border-slate-100">
                <th className="px-5 py-3 font-medium">Title</th>
                <th className="px-5 py-3 font-medium">Section</th>
                <th className="px-5 py-3 font-medium">Category</th>
                <th className="px-5 py-3 font-medium">Relevance</th>
              </tr>
            </thead>
            <tbody>
              {updates.map((u) => (
                <tr key={u.id} className="border-b border-slate-50 last:border-0">
                  <td className="px-5 py-3 font-medium text-slate-800 max-w-xs">{u.title}</td>
                  <td className="px-5 py-3"><Pill tone="slate">{u.section}</Pill></td>
                  <td className="px-5 py-3"><Pill tone="brand">{u.category}</Pill></td>
                  <td className="px-5 py-3 text-slate-500">{u.relevanceScore}%</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      <p className="text-xs text-slate-400">
        AI Radar content is seeded via the database seed script for this prototype. Extend the API with
        POST/PUT/DELETE routes on <code className="font-mono">/api/updates</code> to make this fully editable.
      </p>
    </div>
  );
}
