import React, { useEffect, useState } from "react";
import { Megaphone, Plus, Trash2 } from "lucide-react";
import api from "../../services/api";
import { LoadingState, EmptyState, ErrorBanner } from "../../components/Ui";
import Modal from "../../components/Modal";

export default function AdminAnnouncements() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  function load() {
    setLoading(true);
    api.get("/announcements").then((res) => {
      setItems(res.data);
      setLoading(false);
    });
  }
  useEffect(load, []);

  async function handleSubmit(e) {
    e.preventDefault();
    setSaving(true);
    setError("");
    try {
      await api.post("/announcements", { title, body });
      setModalOpen(false);
      setTitle("");
      setBody("");
      load();
    } catch (err) {
      setError(err.response?.data?.error || "Failed to post announcement.");
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id) {
    if (!confirm("Delete this announcement?")) return;
    await api.delete(`/announcements/${id}`);
    load();
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-xl bg-brand-50 text-brand-600 flex items-center justify-center">
            <Megaphone size={22} />
          </div>
          <div>
            <h1 className="font-display text-2xl font-bold">Announcements</h1>
            <p className="text-slate-500 text-sm">Posted to all faculty on the Announcements page.</p>
          </div>
        </div>
        <button onClick={() => setModalOpen(true)} className="btn-primary">
          <Plus size={16} /> New Announcement
        </button>
      </div>

      {loading ? (
        <LoadingState label="Loading announcements..." />
      ) : items.length === 0 ? (
        <EmptyState title="No announcements yet" action={<button onClick={() => setModalOpen(true)} className="btn-primary">Post one now</button>} />
      ) : (
        <div className="space-y-3">
          {items.map((a) => (
            <div key={a.id} className="card p-5 flex items-start justify-between gap-4">
              <div>
                <h3 className="font-display font-semibold text-slate-900">{a.title}</h3>
                <p className="text-sm text-slate-600 mt-1">{a.body}</p>
                <p className="text-xs text-slate-400 mt-2">{new Date(a.createdAt).toLocaleString()}</p>
              </div>
              <button onClick={() => handleDelete(a.id)} className="text-slate-400 hover:text-rose-600 shrink-0"><Trash2 size={18} /></button>
            </div>
          ))}
        </div>
      )}

      {modalOpen && (
        <Modal title="New Announcement" onClose={() => setModalOpen(false)}>
          <form onSubmit={handleSubmit} className="space-y-4">
            <ErrorBanner message={error} />
            <div>
              <label className="text-sm font-medium text-slate-700 mb-1.5 block">Title</label>
              <input required className="input" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="e.g. Faculty AI workshop on Friday" />
            </div>
            <div>
              <label className="text-sm font-medium text-slate-700 mb-1.5 block">Message</label>
              <textarea required rows={4} className="input" value={body} onChange={(e) => setBody(e.target.value)} />
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <button type="button" onClick={() => setModalOpen(false)} className="btn-secondary">Cancel</button>
              <button type="submit" disabled={saving} className="btn-primary">{saving ? "Posting..." : "Post announcement"}</button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
}
