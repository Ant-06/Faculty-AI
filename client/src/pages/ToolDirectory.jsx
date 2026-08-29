import React, { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { Search, SlidersHorizontal } from "lucide-react";
import api from "../services/api";
import ToolCard from "../components/ToolCard";
import { LoadingState, EmptyState } from "../components/Ui";

const CATEGORIES = ["Teaching", "Research", "Coding", "Productivity", "Content Creation", "Presentation", "Data Analysis", "Administration"];
const PRICING = ["Free", "Freemium", "Paid", "Institutional"];
const DIFFICULTY = ["Beginner", "Intermediate", "Advanced"];

export default function ToolDirectory() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [tools, setTools] = useState([]);
  const [loading, setLoading] = useState(true);
  const [q, setQ] = useState(searchParams.get("q") || "");
  const [category, setCategory] = useState("");
  const [pricing, setPricing] = useState("");
  const [difficulty, setDifficulty] = useState("");
  const [sort, setSort] = useState("relevant");
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    setLoading(true);
    const params = {};
    if (q) params.q = q;
    if (category) params.category = category;
    if (pricing) params.pricing = pricing;
    if (difficulty) params.difficulty = difficulty;
    if (sort) params.sort = sort;
    api.get("/tools", { params }).then((res) => {
      setTools(res.data);
      setLoading(false);
    });
  }, [q, category, pricing, difficulty, sort]);

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div>
        <h1 className="font-display text-2xl font-bold">AI Tool Directory</h1>
        <p className="text-slate-500 text-sm">Search and filter tools by what actually matters for your work.</p>
      </div>

      <div className="card p-4 space-y-4">
        <div className="flex gap-3">
          <div className="relative flex-1">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              className="input pl-9"
              placeholder="Search tools by name or description..."
              value={q}
              onChange={(e) => {
                setQ(e.target.value);
                setSearchParams(e.target.value ? { q: e.target.value } : {});
              }}
            />
          </div>
          <button className="btn-secondary sm:hidden" onClick={() => setShowFilters((v) => !v)}>
            <SlidersHorizontal size={16} />
          </button>
        </div>

        <div className={`${showFilters ? "grid" : "hidden"} sm:grid grid-cols-2 sm:grid-cols-4 gap-3`}>
          <Select label="Category" value={category} onChange={setCategory} options={CATEGORIES} />
          <Select label="Pricing" value={pricing} onChange={setPricing} options={PRICING} />
          <Select label="Difficulty" value={difficulty} onChange={setDifficulty} options={DIFFICULTY} />
          <Select
            label="Sort"
            value={sort}
            onChange={setSort}
            options={["relevant", "popular", "recent"]}
            labels={{ relevant: "Most Relevant", popular: "Most Popular", recent: "Recently Added" }}
            allowEmpty={false}
          />
        </div>
      </div>

      {loading ? (
        <LoadingState label="Loading tools..." />
      ) : tools.length === 0 ? (
        <EmptyState title="No tools match your filters" description="Try clearing a filter or searching a different term." />
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {tools.map((t) => (
            <ToolCard key={t.id} tool={t} />
          ))}
        </div>
      )}
    </div>
  );
}

function Select({ label, value, onChange, options, labels, allowEmpty = true }) {
  return (
    <div>
      <label className="text-xs font-medium text-slate-500 mb-1 block">{label}</label>
      <select className="input" value={value} onChange={(e) => onChange(e.target.value)}>
        {allowEmpty && <option value="">All</option>}
        {options.map((o) => (
          <option key={o} value={o}>
            {labels?.[o] || o}
          </option>
        ))}
      </select>
    </div>
  );
}
