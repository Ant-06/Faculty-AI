import React, { useState } from "react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  Radar,
  Wrench,
  Zap,
  BookOpen,
  Bookmark,
  Megaphone,
  User,
  LogOut,
  Menu,
  X,
  Search,
  Bell,
  Sparkles,
  Building2,
  MessageCircleMore,
} from "lucide-react";
import { useAuth } from "../context/AuthContext";

const NAV = [
  { to: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { to: "/ai-radar", label: "AI Radar", icon: Radar },
  { to: "/tools", label: "AI Tools", icon: Wrench },
  { to: "/quick-learning", label: "Quick Learning", icon: Zap },
  { to: "/my-learning", label: "My Learning", icon: BookOpen },
  { to: "/saved-tools", label: "Saved Tools", icon: Bookmark },
  { to: "/institutional-access", label: "Institutional Access", icon: Building2 },
  { to: "/assistant", label: "AI Assistant", icon: MessageCircleMore },
  { to: "/announcements", label: "Announcements", icon: Megaphone },
  { to: "/profile", label: "Profile", icon: User },
];

export default function FacultyLayout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);

  function handleLogout() {
    logout();
    navigate("/login");
  }

  return (
    <div className="faculty-shell min-h-screen bg-slate-50">
      {/* Header */}
      <header className="sticky top-0 z-30 bg-white/90 backdrop-blur border-b border-slate-100">
        <div className="flex items-center justify-between h-16 px-4 sm:px-6">
          <div className="flex items-center gap-3">
            <button
              className="lg:hidden text-slate-500"
              onClick={() => setMobileOpen((v) => !v)}
              aria-label="Toggle navigation"
            >
              {mobileOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
            <div className="flex items-center gap-2">
              <div className="brand-mark w-8 h-8 rounded-lg flex items-center justify-center" aria-hidden="true">
                <Sparkles size={16} />
              </div>
              <span className="font-display font-bold text-slate-900 hidden sm:block">FacultyAI Hub</span>
            </div>
          </div>

          <div className="hidden md:flex items-center flex-1 max-w-md mx-6">
            <div className="search-field-wrap relative w-full">
              <Search size={17} className="search-field-icon absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" aria-hidden="true" />
              <input
                className="input search-field bg-slate-50"
                placeholder="Search tools, lessons, updates..."
                onKeyDown={(e) => {
                  if (e.key === "Enter" && e.target.value.trim()) {
                    navigate(`/tools?q=${encodeURIComponent(e.target.value.trim())}`);
                  }
                }}
              />
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button className="relative text-slate-500 hover:text-slate-700" aria-label="Notifications">
              <Bell size={20} />
              <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-brand-500" />
            </button>
            <NavLink to="/profile" className="w-9 h-9 rounded-full bg-brand-100 text-brand-700 flex items-center justify-center font-semibold text-sm">
              {user?.name?.[0] || "F"}
            </NavLink>
            <button onClick={handleLogout} className="hidden sm:flex btn-ghost" aria-label="Logout">
              <LogOut size={16} /> Logout
            </button>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar - desktop */}
        <aside className="hidden lg:flex flex-col w-64 shrink-0 border-r border-slate-100 bg-white min-h-[calc(100vh-4rem)] px-3 py-5 gap-1">
          {NAV.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                  isActive ? "bg-brand-50 text-brand-700" : "text-slate-600 hover:bg-slate-50"
                }`
              }
            >
              <item.icon size={18} />
              {item.label}
            </NavLink>
          ))}
        </aside>

        {/* Sidebar - mobile drawer */}
        {mobileOpen && (
          <div className="lg:hidden fixed inset-0 z-40 flex">
            <div className="w-72 bg-white h-full px-3 py-5 flex flex-col gap-1 shadow-xl">
              <div className="flex items-center justify-between px-3 pb-4">
                <span className="font-display font-bold text-slate-900">Menu</span>
                <button onClick={() => setMobileOpen(false)} aria-label="Close menu">
                  <X size={20} className="text-slate-500" />
                </button>
              </div>
              {NAV.map((item) => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  onClick={() => setMobileOpen(false)}
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                      isActive ? "bg-brand-50 text-brand-700" : "text-slate-600 hover:bg-slate-50"
                    }`
                  }
                >
                  <item.icon size={18} />
                  {item.label}
                </NavLink>
              ))}
              <button onClick={handleLogout} className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-rose-600 hover:bg-rose-50 mt-2">
                <LogOut size={18} /> Logout
              </button>
            </div>
            <div className="flex-1 bg-slate-900/30" onClick={() => setMobileOpen(false)} />
          </div>
        )}

        {/* Main content */}
        <main className="flex-1 min-w-0 px-4 sm:px-6 py-6 max-w-full overflow-x-hidden">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
