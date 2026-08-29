import React, { useState } from "react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  Users,
  Wrench,
  BookOpen,
  Radar,
  Megaphone,
  BarChart3,
  Settings,
  LogOut,
  Menu,
  X,
  ShieldCheck,
} from "lucide-react";
import { useAuth } from "../context/AuthContext";

const NAV = [
  { to: "/admin", label: "Dashboard", icon: LayoutDashboard, end: true },
  { to: "/admin/faculty", label: "Faculty", icon: Users },
  { to: "/admin/tools", label: "AI Tools", icon: Wrench },
  { to: "/admin/learning", label: "Learning Modules", icon: BookOpen },
  { to: "/admin/updates", label: "AI Updates", icon: Radar },
  { to: "/admin/announcements", label: "Announcements", icon: Megaphone },
  { to: "/admin/analytics", label: "Analytics", icon: BarChart3 },
];

export default function AdminLayout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);

  function handleLogout() {
    logout();
    navigate("/admin-login");
  }

  return (
    <div className="admin-shell min-h-screen bg-slate-950">
      <header className="sticky top-0 z-30 bg-slate-950 border-b border-slate-800">
        <div className="flex items-center justify-between h-16 px-4 sm:px-6">
          <div className="flex items-center gap-3">
            <button className="lg:hidden text-slate-300" onClick={() => setMobileOpen((v) => !v)} aria-label="Toggle navigation">
              {mobileOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
            <div className="flex items-center gap-2">
              <div className="brand-mark w-8 h-8 rounded-lg flex items-center justify-center" aria-hidden="true">
                <ShieldCheck size={16} />
              </div>
              <span className="font-display font-bold text-white">FacultyAI Hub <span className="text-slate-400 font-medium">/ Admin</span></span>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <span className="hidden sm:block text-sm text-slate-300">{user?.name}</span>
            <button onClick={handleLogout} className="flex items-center gap-2 text-sm text-slate-300 hover:text-white">
              <LogOut size={16} /> Logout
            </button>
          </div>
        </div>
      </header>

      <div className="flex">
        <aside className="hidden lg:flex flex-col w-64 shrink-0 border-r border-slate-800 min-h-[calc(100vh-4rem)] px-3 py-5 gap-1">
          {NAV.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                  isActive ? "bg-brand-500/15 text-brand-300" : "text-slate-400 hover:bg-slate-900 hover:text-slate-200"
                }`
              }
            >
              <item.icon size={18} />
              {item.label}
            </NavLink>
          ))}
        </aside>

        {mobileOpen && (
          <div className="lg:hidden fixed inset-0 z-40 flex">
            <div className="w-72 bg-slate-950 h-full px-3 py-5 flex flex-col gap-1 border-r border-slate-800">
              {NAV.map((item) => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  end={item.end}
                  onClick={() => setMobileOpen(false)}
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                      isActive ? "bg-brand-500/15 text-brand-300" : "text-slate-400 hover:bg-slate-900 hover:text-slate-200"
                    }`
                  }
                >
                  <item.icon size={18} />
                  {item.label}
                </NavLink>
              ))}
            </div>
            <div className="flex-1 bg-black/40" onClick={() => setMobileOpen(false)} />
          </div>
        )}

        <main className="flex-1 min-w-0 px-4 sm:px-6 py-6 bg-slate-50 rounded-tl-3xl">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
