import React, { useEffect, useState } from "react";
import { Building2, CheckCircle2, Clock } from "lucide-react";
import api from "../services/api";
import { getIcon } from "../utils/icons";
import { LoadingState } from "../components/Ui";

export default function InstitutionalAccess() {
  const [tools, setTools] = useState([]);
  const [loading, setLoading] = useState(true);
  const [requested, setRequested] = useState({});

  useEffect(() => {
    api.get("/tools").then((res) => {
      setTools(res.data.filter((t) => t.institutional));
      setLoading(false);
    });
  }, []);

  function requestAccess(id) {
    setRequested((prev) => ({ ...prev, [id]: true }));
  }

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div className="flex items-center gap-3">
        <div className="w-11 h-11 rounded-xl bg-brand-50 text-brand-600 flex items-center justify-center">
          <Building2 size={22} />
        </div>
        <div>
          <h1 className="font-display text-2xl font-bold">Institutional AI Access</h1>
          <p className="text-slate-500 text-sm">Pooled access so you don't have to buy every subscription yourself.</p>
        </div>
      </div>

      <div className="card p-5 bg-brand-50/60 border-brand-100">
        <p className="text-sm text-brand-900">
          Your institution can provide pooled access to premium AI tools so faculty don't have to individually
          purchase multiple subscriptions. Request access below — an administrator will review and enable it for
          your account.
        </p>
      </div>

      {loading ? (
        <LoadingState label="Loading institutional tools..." />
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {tools.map((tool) => {
            const Icon = getIcon(tool.icon);
            const isRequested = requested[tool.id];
            return (
              <div key={tool.id} className="card p-5 flex flex-col gap-3">
                <div className="w-11 h-11 rounded-xl bg-brand-50 text-brand-600 flex items-center justify-center">
                  <Icon size={20} />
                </div>
                <div>
                  <h3 className="font-display font-semibold">{tool.name}</h3>
                  <p className="text-sm text-slate-500 mt-1 line-clamp-2">{tool.description}</p>
                </div>
                <div className="flex items-center gap-1.5 text-xs text-emerald-600 font-medium">
                  <CheckCircle2 size={14} /> Available through institution
                </div>
                <button
                  onClick={() => requestAccess(tool.id)}
                  disabled={isRequested}
                  className={isRequested ? "btn-secondary mt-1" : "btn-primary mt-1"}
                >
                  {isRequested ? (
                    <>
                      <Clock size={15} /> Request pending
                    </>
                  ) : (
                    "Request Access"
                  )}
                </button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
