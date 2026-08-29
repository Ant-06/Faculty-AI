import React, { useEffect, useState } from "react";
import { Megaphone } from "lucide-react";
import api from "../services/api";
import { LoadingState, EmptyState } from "../components/Ui";

export default function Announcements() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get("/announcements").then((res) => {
      setItems(res.data);
      setLoading(false);
    });
  }, []);

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="flex items-center gap-3">
        <div className="w-11 h-11 rounded-xl bg-brand-50 text-brand-600 flex items-center justify-center">
          <Megaphone size={22} />
        </div>
        <div>
          <h1 className="font-display text-2xl font-bold">Announcements</h1>
          <p className="text-slate-500 text-sm">Updates from your department and platform admins.</p>
        </div>
      </div>

      {loading ? (
        <LoadingState label="Loading announcements..." />
      ) : items.length === 0 ? (
        <EmptyState title="No announcements yet" description="Check back soon." />
      ) : (
        <div className="space-y-3">
          {items.map((a) => (
            <div key={a.id} className="card p-5">
              <div className="flex items-center justify-between mb-1">
                <h3 className="font-display font-semibold text-slate-900">{a.title}</h3>
                <span className="text-xs text-slate-400 shrink-0 ml-3">
                  {new Date(a.createdAt).toLocaleDateString()}
                </span>
              </div>
              <p className="text-sm text-slate-600">{a.body}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
