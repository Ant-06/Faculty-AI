import React, { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { ArrowLeft, Clock, CheckCircle2, Lightbulb } from "lucide-react";
import api from "../services/api";
import { Pill, LoadingState } from "../components/Ui";

export default function LessonDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [mod, setMod] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState(null);
  const [submitted, setSubmitted] = useState(false);
  const [completing, setCompleting] = useState(false);

  useEffect(() => {
    api.get(`/learning/${id}`).then((res) => {
      setMod(res.data);
      setLoading(false);
      setSubmitted(!!res.data.userProgress?.completed);
    });
  }, [id]);

  if (loading) return <LoadingState label="Loading lesson..." />;
  if (!mod) return null;

  const completed = mod.userProgress?.completed || submitted;
  const isCorrect = selected === mod.quizAnswerIndex;

  async function handleComplete() {
    setCompleting(true);
    try {
      await api.post(`/learning/${id}/complete`);
      setSubmitted(true);
    } finally {
      setCompleting(false);
    }
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <Link to="/quick-learning" className="inline-flex items-center gap-1 text-sm text-slate-500 hover:text-slate-700">
        <ArrowLeft size={15} /> Back to Quick Learning
      </Link>

      <div className="card p-6 sm:p-8">
        <div className="flex items-center justify-between mb-4">
          <Pill tone="brand">{mod.category}</Pill>
          <span className="flex items-center gap-1 text-sm text-slate-400">
            <Clock size={14} /> {mod.durationMins} minutes
          </span>
        </div>
        <h1 className="font-display text-2xl font-bold">{mod.title}</h1>
        <p className="text-slate-500 mt-1">{mod.description}</p>

        <div className="mt-6 rounded-xl bg-brand-50/60 border border-brand-100 p-4">
          <h3 className="text-sm font-semibold text-brand-900 mb-1">Learning objective</h3>
          <p className="text-sm text-brand-800">{mod.learningObjective}</p>
        </div>

        <div className="mt-6 prose-sm">
          <h3 className="text-sm font-semibold text-slate-700 mb-2">What you need to know</h3>
          <p className="text-sm text-slate-600 leading-relaxed">{mod.content}</p>
        </div>

        {mod.examples?.length > 0 && (
          <div className="mt-6">
            <h3 className="text-sm font-semibold text-slate-700 mb-2">Examples</h3>
            <ul className="space-y-1.5">
              {mod.examples.map((e, i) => (
                <li key={i} className="text-sm text-slate-600 flex gap-2">
                  <span className="text-brand-500 mt-0.5">•</span> {e}
                </li>
              ))}
            </ul>
          </div>
        )}

        {mod.facultyExamples?.length > 0 && (
          <div className="mt-6">
            <h3 className="text-sm font-semibold text-slate-700 mb-2">Faculty-specific examples</h3>
            <div className="space-y-2">
              {mod.facultyExamples.map((e, i) => (
                <div key={i} className="rounded-xl bg-slate-50 border border-slate-100 p-3 text-sm text-slate-600">
                  {e}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Mini quiz */}
        {mod.quizQuestion && (
          <div className="mt-6 rounded-2xl border border-slate-200 p-5">
            <h3 className="font-display font-semibold text-slate-900 mb-3">Mini quiz</h3>
            <p className="text-sm text-slate-700 mb-3">{mod.quizQuestion}</p>
            <div className="space-y-2">
              {mod.quizOptions.map((opt, i) => (
                <button
                  key={i}
                  onClick={() => setSelected(i)}
                  className={`w-full text-left px-4 py-2.5 rounded-xl border text-sm transition-colors ${
                    selected === i
                      ? isCorrect
                        ? "border-emerald-400 bg-emerald-50 text-emerald-800"
                        : "border-rose-300 bg-rose-50 text-rose-700"
                      : "border-slate-200 text-slate-600 hover:bg-slate-50"
                  }`}
                >
                  {opt}
                </button>
              ))}
            </div>
            {selected !== null && (
              <p className={`text-sm mt-3 font-medium ${isCorrect ? "text-emerald-600" : "text-rose-600"}`}>
                {isCorrect ? "Correct!" : `Not quite — the correct answer is: ${mod.quizOptions[mod.quizAnswerIndex]}`}
              </p>
            )}
          </div>
        )}

        {mod.samplePrompt && (
          <div className="mt-6 rounded-2xl bg-slate-900 text-slate-100 p-5">
            <div className="flex items-center gap-2 mb-2 text-brand-300">
              <Lightbulb size={16} /> <span className="text-sm font-semibold">Try it yourself</span>
            </div>
            <p className="text-sm font-mono leading-relaxed text-slate-200">{mod.samplePrompt}</p>
          </div>
        )}

        <div className="mt-8 flex items-center justify-between">
          {completed ? (
            <span className="flex items-center gap-2 text-emerald-600 font-medium text-sm">
              <CheckCircle2 size={18} /> Lesson completed
            </span>
          ) : (
            <span className="text-sm text-slate-400">Mark this lesson complete when you're done.</span>
          )}
          <button
            onClick={handleComplete}
            disabled={completed || completing}
            className="btn-primary"
          >
            {completed ? "Completed" : completing ? "Saving..." : "Mark as Complete"}
          </button>
        </div>
      </div>
    </div>
  );
}
