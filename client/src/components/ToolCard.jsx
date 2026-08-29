import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Bookmark, BookmarkCheck, ArrowUpRight } from "lucide-react";
import { getIcon } from "../utils/icons";
import { Pill } from "./Ui";
import api from "../services/api";
import { useAuth } from "../context/AuthContext";

const pricingTone = { Free: "green", Freemium: "brand", Paid: "amber", Institutional: "slate" };

export default function ToolCard({ tool, onToggleSave }) {
  const { user } = useAuth();
  const Icon = getIcon(tool.icon);
  const [saved, setSaved] = useState(!!tool.isSaved);
  const [busy, setBusy] = useState(false);

  async function handleSave(e) {
    e.preventDefault();
    e.stopPropagation();
    if (!user) return;
    setBusy(true);
    try {
      if (saved) {
        await api.delete(`/saved-tools/${tool.id}`);
        setSaved(false);
      } else {
        await api.post(`/saved-tools/${tool.id}`);
        setSaved(true);
      }
      onToggleSave && onToggleSave(tool.id, !saved);
    } finally {
      setBusy(false);
    }
  }

  return (
    <Link
      to={`/tools/${tool.id}`}
      className="card p-5 flex flex-col gap-3 hover:shadow-card hover:-translate-y-0.5 transition-all group"
    >
      <div className="flex items-start justify-between">
        <div className="w-11 h-11 rounded-xl bg-brand-50 text-brand-600 flex items-center justify-center">
          <Icon size={20} />
        </div>
        {user?.role === "FACULTY" && (
          <button
            onClick={handleSave}
            disabled={busy}
            className="text-slate-300 hover:text-brand-600 transition-colors"
            aria-label={saved ? "Remove from saved tools" : "Save tool"}
          >
            {saved ? <BookmarkCheck size={20} className="text-brand-600" /> : <Bookmark size={20} />}
          </button>
        )}
      </div>

      <div>
        <h3 className="font-display font-semibold text-slate-900 flex items-center gap-1.5">
          {tool.name}
          <ArrowUpRight size={14} className="text-slate-300 group-hover:text-brand-500 transition-colors" />
        </h3>
        <p className="text-sm text-slate-500 mt-1 line-clamp-2">{tool.description}</p>
      </div>

      <div className="flex flex-wrap gap-1.5 mt-auto pt-1">
        <Pill tone="slate">{tool.category}</Pill>
        <Pill tone={pricingTone[tool.pricing] || "slate"}>{tool.pricing}</Pill>
        <Pill tone="slate">{tool.difficulty}</Pill>
      </div>

      <div className="text-xs text-slate-500 border-t border-slate-100 pt-3 flex items-center justify-between">
        <span>{tool.facultyRelevance}</span>
      </div>
    </Link>
  );
}
