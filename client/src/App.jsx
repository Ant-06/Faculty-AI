import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";

import Landing from "./pages/Landing";
import Login from "./pages/Login";
import Register from "./pages/Register";
import AdminLogin from "./pages/AdminLogin";
import Onboarding from "./pages/Onboarding";

import FacultyLayout from "./layouts/FacultyLayout";
import Dashboard from "./pages/Dashboard";
import AIRadar from "./pages/AIRadar";
import ToolDirectory from "./pages/ToolDirectory";
import ToolDetail from "./pages/ToolDetail";
import QuickLearning from "./pages/QuickLearning";
import LessonDetail from "./pages/LessonDetail";
import MyLearning from "./pages/MyLearning";
import SavedTools from "./pages/SavedTools";
import Assistant from "./pages/Assistant";
import InstitutionalAccess from "./pages/InstitutionalAccess";
import Announcements from "./pages/Announcements";
import Profile from "./pages/Profile";

import AdminLayout from "./layouts/AdminLayout";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminFaculty from "./pages/admin/AdminFaculty";
import AdminTools from "./pages/admin/AdminTools";
import AdminLearning from "./pages/admin/AdminLearning";
import AdminUpdates from "./pages/admin/AdminUpdates";
import AdminAnnouncements from "./pages/admin/AdminAnnouncements";
import AdminAnalytics from "./pages/admin/AdminAnalytics";

import ProtectedRoute from "./components/ProtectedRoute";

export default function App() {
  return (
    <Routes>
      {/* Public */}
      <Route path="/" element={<Landing />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/admin-login" element={<AdminLogin />} />
      <Route
        path="/onboarding"
        element={
          <ProtectedRoute role="FACULTY">
            <Onboarding />
          </ProtectedRoute>
        }
      />

      {/* Faculty */}
      <Route
        element={
          <ProtectedRoute role="FACULTY">
            <FacultyLayout />
          </ProtectedRoute>
        }
      >
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/ai-radar" element={<AIRadar />} />
        <Route path="/tools" element={<ToolDirectory />} />
        <Route path="/tools/:id" element={<ToolDetail />} />
        <Route path="/quick-learning" element={<QuickLearning />} />
        <Route path="/quick-learning/:id" element={<LessonDetail />} />
        <Route path="/my-learning" element={<MyLearning />} />
        <Route path="/saved-tools" element={<SavedTools />} />
        <Route path="/assistant" element={<Assistant />} />
        <Route path="/institutional-access" element={<InstitutionalAccess />} />
        <Route path="/announcements" element={<Announcements />} />
        <Route path="/profile" element={<Profile />} />
      </Route>

      {/* Admin */}
      <Route
        element={
          <ProtectedRoute role="ADMIN">
            <AdminLayout />
          </ProtectedRoute>
        }
      >
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/admin/faculty" element={<AdminFaculty />} />
        <Route path="/admin/tools" element={<AdminTools />} />
        <Route path="/admin/learning" element={<AdminLearning />} />
        <Route path="/admin/updates" element={<AdminUpdates />} />
        <Route path="/admin/announcements" element={<AdminAnnouncements />} />
        <Route path="/admin/analytics" element={<AdminAnalytics />} />
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
