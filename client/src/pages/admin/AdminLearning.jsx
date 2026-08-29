import React, { useEffect, useState } from "react";
import { BookOpen, Plus, Pencil, Trash2, Eye, EyeOff } from "lucide-react";
import api from "../../services/api";
import { LoadingState, Pill, EmptyState, ErrorBanner } from "../../components/Ui";
import Modal from "../../components/Modal";

const CATEGORIES = ["AI Basics", "Prompt Engineering", "AI for Teaching", "AI for Research", "AI for Coding", "AI for Productivity", "AI for Administration"];
const DIFFICULTY = ["Beginner", "Intermediate", "Advanced"];

const EMPTY_FORM = {
  title: "", description: "", category: "AI Basics", durationMins: 10, difficulty: "Beginner",
  learningObjective: "", content: "", samplePrompt: "", published: true,
};

export default function AdminLearning() {
  const [modules, setModules] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  function load() {
    setLoading(true);
    api.get("/learning").then((res) => {
      setModules(res.data);
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
  function openEdit(mod) {
    setEditing(mod);
    setForm({ ...mod });
    setError("");
    setModalOpen(true);
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setSaving(true);
    setError("");
    try {
      if (editing) {
        await api.put(`/learning/${editing.id}`, form);
      } else {
        await api.post("/learning", form);
      }
      setModalOpen(false);
      load();
    } catch (err) {
      setError(err.response?.data?.error || "Failed to save module.");
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id) {
    if (!confirm("Delete this learning module?")) return;
    await api.delete(`/learning/${id}`);
    load();
  }

  async function togglePublish(mod) {
    await api.put(`/learning/${mod.id}`, { published: !mod.published });
    load();
  }

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-xl bg-brand-50 text-brand-600 flex items-center justify-center">
            <BookOpen size={22} />
          </div>
          <div>
            <h1 className="font-display text-2xl font-bold">Learning Modules</h1>
            <p className="text-slate-500 text-sm">{modules.length} modules total.</p>
          </div>
        </div>
        <button onClick={openCreate} className="btn-primary">
          <Plus size={16} /> Add Module
        </button>
      </div>

      {loading ? (
        <LoadingState label="Loading modules..." />
      ) : modules.length === 0 ? (
        <EmptyState title="No modules yet" action={<button onClick={openCreate} className="btn-primary">Add your first module</button>} />
      ) : (
        <div className="card overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-slate-400 border-b border-slate-100">
                <th className="px-5 py-3 font-medium">Title</th>
                <th className="px-5 py-3 font-medium">Category</th>
                <th className="px-5 py-3 font-medium">Duration</th>
                <th className="px-5 py-3 font-medium">Status</th>
                <th className="px-5 py-3 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {modules.map((m) => (
                <tr key={m.id} className="border-b border-slate-50 last:border-0">
                  <td className="px-5 py-3 font-medium text-slate-800">{m.title}</td>
                  <td className="px-5 py-3"><Pill tone="brand">{m.category}</Pill></td>
                  <td className="px-5 py-3 text-slate-500">{m.durationMins} min</td>
                  <td className="px-5 py-3">
                    <Pill tone={m.published ? "green" : "slate"}>{m.published ? "Published" : "Unpublished"}</Pill>
                  </td>
                  <td className="px-5 py-3">
                    <div className="flex justify-end gap-1">
                      <button onClick={() => togglePublish(m)} className="text-slate-400 hover:text-brand-600" title="Toggle publish">
                        {m.published ? <EyeOff size={16} /> : <Eye size={16} />}
                      </button>
                      <button onClick={() => openEdit(m)} className="text-slate-400 hover:text-brand-600"><Pencil size={16} /></button>
                      <button onClick={() => handleDelete(m.id)} className="text-slate-400 hover:text-rose-600"><Trash2 size={16} /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {modalOpen && (
        <Modal title={editing ? "Edit Module" : "Add Module"} onClose={() => setModalOpen(false)} wide>
          <form onSubmit={handleSubmit} className="space-y-4">
            <ErrorBanner message={error} />
            <Field label="Title">
              <input required className="input" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
            </Field>
            <Field label="Description">
              <textarea required rows={2} className="input" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
            </Field>
            <div className="grid sm:grid-cols-3 gap-4">
              <Field label="Category">
                <select className="input" value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })}>
                  {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
                </select>
              </Field>
              <Field label="Duration (min)">
                <input type="number" min={1} required className="input" value={form.durationMins} onChange={(e) => setForm({ ...form, durationMins: e.target.value })} />
              </Field>
              <Field label="Difficulty">
                <select className="input" value={form.difficulty} onChange={(e) => setForm({ ...form, difficulty: e.target.value })}>
                  {DIFFICULTY.map((c) => <option key={c} value={c}>{c}</option>)}
                </select>
              </Field>
            </div>
            <Field label="Learning objective">
              <input required className="input" value={form.learningObjective} onChange={(e) => setForm({ ...form, learningObjective: e.target.value })} />
            </Field>
            <Field label="Content">
              <textarea rows={4} className="input" value={form.content} onChange={(e) => setForm({ ...form, content: e.target.value })} />
            </Field>
            <Field label="Sample prompt (optional)">
              <input className="input" value={form.samplePrompt} onChange={(e) => setForm({ ...form, samplePrompt: e.target.value })} />
            </Field>
            <label className="flex items-center gap-2 text-sm text-slate-600">
              <input type="checkbox" checked={form.published} onChange={(e) => setForm({ ...form, published: e.target.checked })} />
              Published (visible to faculty)
            </label>
            <div className="flex justify-end gap-2 pt-2">
              <button type="button" onClick={() => setModalOpen(false)} className="btn-secondary">Cancel</button>
              <button type="submit" disabled={saving} className="btn-primary">{saving ? "Saving..." : editing ? "Save changes" : "Add module"}</button>
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
