import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Bookmark } from "lucide-react";
import api from "../services/api";
import ToolCard from "../components/ToolCard";
import { LoadingState, EmptyState } from "../components/Ui";

export default function SavedTools() {
  const [tools, setTools] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get("/saved-tools").then((res) => {
      setTools(res.data);
      setLoading(false);
    });
  }, []);

  function handleToggle(toolId, isSaved) {
    if (!isSaved) {
      setTools((prev) => prev.filter((t) => t.id !== toolId));
    }
  }

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div className="flex items-center gap-3">
        <div className="w-11 h-11 rounded-xl bg-brand-50 text-brand-600 flex items-center justify-center">
          <Bookmark size={22} />
        </div>
        <div>
          <h1 className="font-display text-2xl font-bold">Saved Tools</h1>
          <p className="text-slate-500 text-sm">Tools you've bookmarked to come back to.</p>
        </div>
      </div>

      {loading ? (
        <LoadingState label="Loading saved tools..." />
      ) : tools.length === 0 ? (
        <EmptyState
          title="No saved tools yet"
          description="Bookmark tools from the directory to build your personal shortlist."
          action={<Link to="/tools" className="btn-primary">Browse AI Tools</Link>}
        />
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {tools.map((t) => (
            <ToolCard key={t.id} tool={t} onToggleSave={handleToggle} />
          ))}
        </div>
      )}
    </div>
  );
}
