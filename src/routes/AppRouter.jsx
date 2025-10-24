import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Login from "../auth/Login.jsx";
import Signup from "../auth/Signup.jsx";
import ForgotPassword from "../auth/ForgotPassword.jsx";
import { Dashboard } from "../pages/Dashboard/Dashboard.jsx";
import ProjectList from "../pages/Projects/ProjectList.jsx";
import ProjectDetails from "../pages/Projects/ProjectDetails.jsx";
import RequireAuth from "../auth/RequireAuth.jsx";
import MainLayout from "../layouts/MainLayout.jsx";

export default function AppRouter() {
  return (
    <Routes>
      {/* Public routes */}
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />

      {/* Protected routes with Layout */}
      <Route
        path="/"
        element={
          <RequireAuth>
            <MainLayout>
              <Dashboard />
            </MainLayout>
          </RequireAuth>
        }
      />

      <Route
        path="/projects"
        element={
          <RequireAuth>
            <MainLayout>
              <ProjectList />
            </MainLayout>
          </RequireAuth>
        }
      />

      <Route
        path="/projects/:projectId"
        element={
          <RequireAuth>
            <MainLayout>
              <ProjectDetails />
            </MainLayout>
          </RequireAuth>
        }
      />

      <Route
        path="/users"
        element={
          <RequireAuth>
            <MainLayout>
              <div>Users Page - Coming Soon</div>
            </MainLayout>
          </RequireAuth>
        }
      />

      <Route
        path="/profile"
        element={
          <RequireAuth>
            <MainLayout>
              <div>Profile Page - Coming Soon</div>
            </MainLayout>
          </RequireAuth>
        }
      />

      {/* Redirect unknown routes */}
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
}
