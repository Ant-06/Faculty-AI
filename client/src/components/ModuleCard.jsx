import React from "react";
import { Link } from "react-router-dom";
import { Clock, CheckCircle2, PlayCircle } from "lucide-react";
import { Pill } from "./Ui";

export default function ModuleCard({ mod }) {
  const completed = mod.userProgress?.completed;
  return (
    <Link
      to={`/quick-learning/${mod.id}`}
      className="card p-5 flex flex-col gap-3 hover:shadow-card hover:-translate-y-0.5 transition-all"
    >
      <div className="flex items-start justify-between gap-2">
        <Pill tone="brand">{mod.category}</Pill>
        {completed ? (
          <span className="flex items-center gap-1 text-xs font-medium text-emerald-600">
            <CheckCircle2 size={14} /> Completed
          </span>
        ) : (
          <span className="flex items-center gap-1 text-xs font-medium text-slate-400">
            <Clock size={14} /> {mod.durationMins} min
          </span>
        )}
      </div>
      <h3 className="font-display font-semibold text-slate-900">{mod.title}</h3>
      <p className="text-sm text-slate-500 line-clamp-2">{mod.description}</p>
      <div className="mt-auto pt-2 flex items-center justify-between text-xs">
        <Pill tone="slate">{mod.difficulty}</Pill>
        <span className="flex items-center gap-1 font-medium text-brand-600">
          <PlayCircle size={15} /> {completed ? "Review" : "Start"}
        </span>
      </div>
    </Link>
  );
}
