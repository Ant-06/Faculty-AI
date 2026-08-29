import React, { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { Bookmark, BookmarkCheck, ExternalLink, ArrowLeft, CheckCircle2 } from "lucide-react";
import api from "../services/api";
import { getIcon } from "../utils/icons";
import { Pill, LoadingState } from "../components/Ui";
import { useAuth } from "../context/AuthContext";

const USE_CASES = [
  "Creating lecture plans",
  "Summarizing research papers",
  "Generating quizzes",
  "Creating presentations",
  "Coding assistance",
  "Research brainstorming",
  "Data analysis",
];

export default function ToolDetail() {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [tool, setTool] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saved, setSaved] = useState(false);
  const [started, setStarted] = useState(false);

  useEffect(() => {
    api.get(`/tools/${id}`).then((res) => {
      setTool(res.data);
      setSaved(res.data.isSaved);
      setLoading(false);
    });
  }, [id]);

  if (loading) return <LoadingState label="Loading tool details..." />;
  if (!tool) return null;

  const Icon = getIcon(tool.icon);

  async function toggleSave() {
    if (!user) return navigate("/login");
    if (saved) {
      await api.delete(`/saved-tools/${tool.id}`);
      setSaved(false);
    } else {
      await api.post(`/saved-tools/${tool.id}`);
      setSaved(true);
    }
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <Link to="/tools" className="inline-flex items-center gap-1 text-sm text-slate-500 hover:text-slate-700">
        <ArrowLeft size={15} /> Back to directory
      </Link>

      <div className="card p-6 sm:p-8">
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
          <div className="flex items-start gap-4">
            <div className="w-14 h-14 rounded-2xl bg-brand-50 text-brand-600 flex items-center justify-center shrink-0">
              <Icon size={26} />
            </div>
            <div>
              <h1 className="font-display text-2xl font-bold">{tool.name}</h1>
              <div className="flex flex-wrap gap-1.5 mt-2">
                <Pill tone="slate">{tool.category}</Pill>
                <Pill tone="brand">{tool.pricing}</Pill>
                <Pill tone="slate">{tool.difficulty}</Pill>
              </div>
            </div>
          </div>
          <div className="flex gap-2 shrink-0">
            <button onClick={toggleSave} className="btn-secondary">
              {saved ? <BookmarkCheck size={16} className="text-brand-600" /> : <Bookmark size={16} />}
              {saved ? "Saved" : "Save"}
            </button>
            <a href={tool.website} target="_blank" rel="noreferrer" className="btn-secondary">
              Visit <ExternalLink size={14} />
            </a>
          </div>
        </div>

        <p className="text-slate-600 mt-6">{tool.description}</p>

        <div className="grid sm:grid-cols-2 gap-4 mt-6">
          <div className="rounded-xl bg-slate-50 border border-slate-100 p-4">
            <h3 className="text-sm font-semibold text-slate-700 mb-1">Why should you learn this?</h3>
            <p className="text-sm text-slate-500">{tool.facultyRelevance}</p>
          </div>
          <div className="rounded-xl bg-slate-50 border border-slate-100 p-4">
            <h3 className="text-sm font-semibold text-slate-700 mb-1">Best use case</h3>
            <p className="text-sm text-slate-500">{tool.bestUseCase}</p>
          </div>
        </div>

        <div className="mt-6">
          <h3 className="text-sm font-semibold text-slate-700 mb-2">Best use cases for faculty</h3>
          <div className="flex flex-wrap gap-2">
            {USE_CASES.map((u) => (
              <span key={u} className="badge bg-slate-100 text-slate-600">{u}</span>
            ))}
          </div>
        </div>

        <div className="mt-8 rounded-2xl border border-brand-100 bg-brand-50/60 p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-display font-semibold text-slate-900">Learning path</h3>
            <span className="text-sm text-brand-700 font-medium">Estimated time: {tool.learningTimeMins} minutes</span>
          </div>
          <ol className="space-y-3">
            {[
              "Understand the tool",
              "Learn 5 useful prompts",
              "Complete a faculty-specific task",
              "Apply it to your work",
            ].map((step, i) => (
              <li key={step} className="flex items-center gap-3 text-sm">
                <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-semibold shrink-0 ${
                  started && i === 0 ? "bg-emerald-500 text-white" : "bg-white border border-brand-200 text-brand-700"
                }`}>
                  {started && i === 0 ? <CheckCircle2 size={14} /> : `Step ${i + 1}`.replace("Step ", "")}
                </span>
                <span className="text-slate-700">{step}</span>
              </li>
            ))}
          </ol>
          <button
            onClick={() => setStarted(true)}
            className="btn-primary mt-5 w-full sm:w-auto"
          >
            {started ? "Learning started — nice work" : `Start ${tool.learningTimeMins}-Minute Learning`}
          </button>
        </div>
      </div>
    </div>
  );
}
