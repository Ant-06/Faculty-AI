import React, { useEffect, useState } from "react";
import { Radar } from "lucide-react";
import api from "../services/api";
import UpdateCard from "../components/UpdateCard";
import { LoadingState, EmptyState } from "../components/Ui";

const SECTIONS = [
  "New This Week",
  "Trending AI Tools",
  "AI for Teaching",
  "AI for Research",
  "AI for Administration",
];

export default function AIRadar() {
  const [updates, setUpdates] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get("/updates").then((res) => {
      setUpdates(res.data);
      setLoading(false);
    });
  }, []);

  if (loading) return <LoadingState label="Scanning the AI landscape..." />;

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      <div className="flex items-center gap-3">
        <div className="w-11 h-11 rounded-xl bg-brand-50 text-brand-600 flex items-center justify-center">
          <Radar size={22} />
        </div>
        <div>
          <h1 className="font-display text-2xl font-bold">AI Radar</h1>
          <p className="text-slate-500 text-sm">What's changing in AI, without the hours of searching.</p>
        </div>
      </div>

      {SECTIONS.map((section) => {
        const items = updates.filter((u) => u.section === section);
        if (!items.length) return null;
        return (
          <section key={section}>
            <h2 className="font-display font-semibold text-lg mb-3">{section}</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {items.map((u) => (
                <UpdateCard key={u.id} update={u} />
              ))}
            </div>
          </section>
        );
      })}

      {updates.length === 0 && (
        <EmptyState title="No updates yet" description="Check back soon — new AI developments are added regularly." />
      )}
    </div>
  );
}
