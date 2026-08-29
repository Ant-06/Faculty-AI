import React, { useEffect, useState } from "react";
import { Zap } from "lucide-react";
import api from "../services/api";
import ModuleCard from "../components/ModuleCard";
import { LoadingState, EmptyState } from "../components/Ui";

const CATEGORIES = [
  "AI Basics",
  "Prompt Engineering",
  "AI for Teaching",
  "AI for Research",
  "AI for Coding",
  "AI for Productivity",
  "AI for Administration",
];

export default function QuickLearning() {
  const [modules, setModules] = useState([]);
  const [loading, setLoading] = useState(true);
  const [category, setCategory] = useState("");

  useEffect(() => {
    setLoading(true);
    api.get("/learning", { params: category ? { category } : {} }).then((res) => {
      setModules(res.data);
      setLoading(false);
    });
  }, [category]);

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div className="flex items-center gap-3">
        <div className="w-11 h-11 rounded-xl bg-brand-50 text-brand-600 flex items-center justify-center">
          <Zap size={22} />
        </div>
        <div>
          <h1 className="font-display text-2xl font-bold">Quick Learning</h1>
          <p className="text-slate-500 text-sm">Faculty don't have time for long courses — every lesson is 5–15 minutes.</p>
        </div>
      </div>

      <div className="flex gap-2 overflow-x-auto pb-1 -mx-1 px-1">
        <FilterChip active={category === ""} onClick={() => setCategory("")}>
          All
        </FilterChip>
        {CATEGORIES.map((c) => (
          <FilterChip key={c} active={category === c} onClick={() => setCategory(c)}>
            {c}
          </FilterChip>
        ))}
      </div>

      {loading ? (
        <LoadingState label="Loading lessons..." />
      ) : modules.length === 0 ? (
        <EmptyState title="No lessons in this category yet" description="Try a different category, or check back soon." />
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {modules.map((m) => (
            <ModuleCard key={m.id} mod={m} />
          ))}
        </div>
      )}
    </div>
  );
}

function FilterChip({ active, onClick, children }) {
  return (
    <button
      onClick={onClick}
      className={`shrink-0 px-3.5 py-1.5 rounded-full text-sm font-medium border transition-colors ${
        active ? "bg-brand-600 text-white border-brand-600" : "bg-white text-slate-600 border-slate-200 hover:bg-slate-50"
      }`}
    >
      {children}
    </button>
  );
}
