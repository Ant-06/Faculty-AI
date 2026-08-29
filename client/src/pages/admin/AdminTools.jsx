import React, { useEffect, useState } from "react";
import { Wrench, Plus, Pencil, Trash2 } from "lucide-react";
import api from "../../services/api";
import { LoadingState, Pill, EmptyState, ErrorBanner } from "../../components/Ui";
import Modal from "../../components/Modal";
import { getIcon } from "../../utils/icons";

const CATEGORIES = ["Teaching", "Research", "Coding", "Productivity", "Content Creation", "Presentation", "Data Analysis", "Administration"];
const PRICING = ["Free", "Freemium", "Paid", "Institutional"];
const DIFFICULTY = ["Beginner", "Intermediate", "Advanced"];
const ICONS = ["Sparkles", "MessageSquare", "Star", "Search", "NotebookText", "Image", "Code2", "FileText", "BarChart3", "PresentationIcon"];

const EMPTY_FORM = {
  name: "", icon: "Sparkles", description: "", category: "Teaching", pricing: "Freemium",
  difficulty: "Beginner", bestUseCase: "", facultyRelevance: "", learningTimeMins: 15, website: "", institutional: false,
};

export default function AdminTools() {
  const [tools, setTools] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  function load() {
    setLoading(true);
    api.get("/tools").then((res) => {
      setTools(res.data);
      setLoading(false);
    });
  }
  useEffect(load, []);

  function openCreate() {
    setEditing(null);
    setForm(EMPTY_FORM);
    setError("");
    setModalOpen(true);
  }
  function openEdit(tool) {
    setEditing(tool);
    setForm({ ...tool });
    setError("");
    setModalOpen(true);
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setSaving(true);
    setError("");
    try {
      if (editing) {
        await api.put(`/tools/${editing.id}`, form);
      } else {
        await api.post("/tools", form);
      }
      setModalOpen(false);
      load();
    } catch (err) {
      setError(err.response?.data?.error || "Failed to save tool.");
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id) {
    if (!confirm("Delete this tool? This cannot be undone.")) return;
    await api.delete(`/tools/${id}`);
    load();
  }

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-xl bg-brand-50 text-brand-600 flex items-center justify-center">
            <Wrench size={22} />
          </div>
          <div>
            <h1 className="font-display text-2xl font-bold">AI Tools</h1>
            <p className="text-slate-500 text-sm">{tools.length} tools in the directory.</p>
          </div>
        </div>
        <button onClick={openCreate} className="btn-primary">
          <Plus size={16} /> Add Tool
        </button>
      </div>

      {loading ? (
        <LoadingState label="Loading tools..." />
      ) : tools.length === 0 ? (
        <EmptyState title="No tools yet" action={<button onClick={openCreate} className="btn-primary">Add your first tool</button>} />
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {tools.map((tool) => {
            const Icon = getIcon(tool.icon);
            return (
              <div key={tool.id} className="card p-5 flex flex-col gap-3">
                <div className="flex items-start justify-between">
                  <div className="w-10 h-10 rounded-xl bg-brand-50 text-brand-600 flex items-center justify-center">
                    <Icon size={18} />
                  </div>
                  <div className="flex gap-1">
                    <button onClick={() => openEdit(tool)} className="text-slate-400 hover:text-brand-600"><Pencil size={16} /></button>
                    <button onClick={() => handleDelete(tool.id)} className="text-slate-400 hover:text-rose-600"><Trash2 size={16} /></button>
                  </div>
                </div>
                <div>
                  <h3 className="font-display font-semibold">{tool.name}</h3>
                  <p className="text-sm text-slate-500 line-clamp-2 mt-1">{tool.description}</p>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  <Pill tone="slate">{tool.category}</Pill>
                  <Pill tone="brand">{tool.pricing}</Pill>
                  {tool.institutional && <Pill tone="green">Institutional</Pill>}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {modalOpen && (
        <Modal title={editing ? "Edit Tool" : "Add Tool"} onClose={() => setModalOpen(false)} wide>
          <form onSubmit={handleSubmit} className="space-y-4">
            <ErrorBanner message={error} />
            <div className="grid sm:grid-cols-2 gap-4">
              <Field label="Tool name">
                <input required className="input" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
              </Field>
              <Field label="Icon">
                <select className="input" value={form.icon} onChange={(e) => setForm({ ...form, icon: e.target.value })}>
                  {ICONS.map((i) => <option key={i} value={i}>{i}</option>)}
                </select>
              </Field>
            </div>
            <Field label="Description">
              <textarea required rows={2} className="input" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
            </Field>
            <div className="grid sm:grid-cols-3 gap-4">
              <Field label="Category">
                <select className="input" value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })}>
                  {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
                </select>
              </Field>
              <Field label="Pricing">
                <select className="input" value={form.pricing} onChange={(e) => setForm({ ...form, pricing: e.target.value })}>
                  {PRICING.map((c) => <option key={c} value={c}>{c}</option>)}
                </select>
              </Field>
              <Field label="Difficulty">
                <select className="input" value={form.difficulty} onChange={(e) => setForm({ ...form, difficulty: e.target.value })}>
                  {DIFFICULTY.map((c) => <option key={c} value={c}>{c}</option>)}
                </select>
              </Field>
            </div>
            <Field label="Best use case">
              <input required className="input" value={form.bestUseCase} onChange={(e) => setForm({ ...form, bestUseCase: e.target.value })} />
            </Field>
            <Field label="Faculty relevance">
              <input required className="input" value={form.facultyRelevance} onChange={(e) => setForm({ ...form, facultyRelevance: e.target.value })} />
            </Field>
            <div className="grid sm:grid-cols-2 gap-4">
              <Field label="Learning time (minutes)">
                <input type="number" min={1} className="input" value={form.learningTimeMins} onChange={(e) => setForm({ ...form, learningTimeMins: e.target.value })} />
              </Field>
              <Field label="Website">
                <input className="input" value={form.website} onChange={(e) => setForm({ ...form, website: e.target.value })} placeholder="https://..." />
              </Field>
            </div>
            <label className="flex items-center gap-2 text-sm text-slate-600">
              <input type="checkbox" checked={form.institutional} onChange={(e) => setForm({ ...form, institutional: e.target.checked })} />
              Available through institutional access
            </label>
            <div className="flex justify-end gap-2 pt-2">
              <button type="button" onClick={() => setModalOpen(false)} className="btn-secondary">Cancel</button>
              <button type="submit" disabled={saving} className="btn-primary">{saving ? "Saving..." : editing ? "Save changes" : "Add tool"}</button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
}

function Field({ label, children }) {
  return (
    <div>
      <label className="text-sm font-medium text-slate-700 mb-1.5 block">{label}</label>
      {children}
    </div>
  );
}
