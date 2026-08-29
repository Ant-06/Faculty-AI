import React, { useState } from "react";
import { Clock, TrendingUp } from "lucide-react";
import { Pill } from "./Ui";

export default function UpdateCard({ update }) {
  const [expanded, setExpanded] = useState(false);
  return (
    <div className="card p-5 flex flex-col gap-2.5">
      <div className="flex items-center justify-between">
        <Pill tone="brand">{update.category}</Pill>
        <span className="flex items-center gap-1 text-xs text-slate-400">
          <Clock size={13} /> {update.readTimeMins} min read
        </span>
      </div>
      <h3 className="font-display font-semibold text-slate-900 leading-snug">{update.title}</h3>
      <p className="text-sm text-slate-600">{update.summary}</p>

      {expanded && (
        <div className="text-sm bg-brand-50/60 border border-brand-100 rounded-xl px-3.5 py-3 text-brand-900">
          <span className="font-medium">Why it matters: </span>
          {update.whyItMatters}
        </div>
      )}

      <div className="flex items-center justify-between pt-2 mt-auto">
        <span className="flex items-center gap-1 text-xs text-slate-400">
          <TrendingUp size={13} /> {update.relevanceScore}% relevant to your role
        </span>
        <button
          onClick={() => setExpanded((v) => !v)}
          className="text-sm font-medium text-brand-600 hover:text-brand-700"
        >
          {expanded ? "Show less" : "Learn More"}
        </button>
      </div>
    </div>
  );
}
