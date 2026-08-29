import React, { useEffect, useState } from "react";
import { Users } from "lucide-react";
import api from "../../services/api";
import { LoadingState, Pill, EmptyState } from "../../components/Ui";

export default function AdminFaculty() {
  const [faculty, setFaculty] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get("/admin/faculty").then((res) => {
      setFaculty(res.data);
      setLoading(false);
    });
  }, []);

  if (loading) return <LoadingState label="Loading faculty..." />;

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div className="flex items-center gap-3">
        <div className="w-11 h-11 rounded-xl bg-brand-50 text-brand-600 flex items-center justify-center">
          <Users size={22} />
        </div>
        <div>
          <h1 className="font-display text-2xl font-bold">Faculty</h1>
          <p className="text-slate-500 text-sm">{faculty.length} registered faculty members.</p>
        </div>
      </div>

      {faculty.length === 0 ? (
        <EmptyState title="No faculty registered yet" />
      ) : (
        <div className="card overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-slate-400 border-b border-slate-100">
                <th className="px-5 py-3 font-medium">Name</th>
                <th className="px-5 py-3 font-medium">Email</th>
                <th className="px-5 py-3 font-medium">Interest</th>
                <th className="px-5 py-3 font-medium">Skill</th>
                <th className="px-5 py-3 font-medium">Learning time</th>
                <th className="px-5 py-3 font-medium">Time saved</th>
              </tr>
            </thead>
            <tbody>
              {faculty.map((f) => (
                <tr key={f.id} className="border-b border-slate-50 last:border-0">
                  <td className="px-5 py-3 font-medium text-slate-800">{f.name}</td>
                  <td className="px-5 py-3 text-slate-500">{f.email}</td>
                  <td className="px-5 py-3">
                    <Pill tone="brand">{f.profile?.primaryInterest?.replace("_", " ") || "—"}</Pill>
                  </td>
                  <td className="px-5 py-3 text-slate-500">{f.profile?.skillLevel || "—"}</td>
                  <td className="px-5 py-3 text-slate-500">{f.profile?.totalLearningMins || 0} min</td>
                  <td className="px-5 py-3 text-slate-500">{f.profile?.timeSavedHoursMonth || 0} hrs</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
