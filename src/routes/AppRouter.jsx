import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Login from "../auth/Login.jsx";
import Signup from "../auth/Signup.jsx";
import ConfirmSignup from "../auth/ConfirmSignup.jsx";
import ForgotPassword from "../auth/ForgotPassword.jsx";
import { AIAssistant } from "../pages/AIAssistant/AIAssistant.jsx";
import ProjectList from "../pages/Projects/ProjectList.jsx";
import ProjectDetails from "../pages/Projects/ProjectDetails.jsx";
import UserList from "../pages/Users/UserList.jsx";
import InvitationAccept from "../pages/Invitation/InvitationAccept.jsx";
import RequireAuth from "../auth/RequireAuth.jsx";
import RequireRole from "../auth/RequireRole.jsx";
import MainLayout from "../layouts/MainLayout.jsx";
import AuthLayout from "../layouts/AuthLayout.jsx";
import { ROLES } from "../utils/roleUtils.js";

export default function AppRouter() {
  return (
    <Routes>
      {/* Public routes - Wrapped with AuthLayout */}
      <Route
        path="/login"
        element={
          <AuthLayout>
            <Login />
          </AuthLayout>
        }
      />
      <Route
        path="/signup"
        element={
          <AuthLayout>
            <Signup />
          </AuthLayout>
        }
      />
      <Route
        path="/confirm-signup"
        element={
          <AuthLayout>
            <ConfirmSignup />
          </AuthLayout>
        }
      />
      <Route
        path="/forgot-password"
        element={
          <AuthLayout>
            <ForgotPassword />
          </AuthLayout>
        }
      />

      {/* Invitation acceptance - requires authentication */}
      <Route
        path="/invite/accept"
        element={
          <RequireAuth>
            <InvitationAccept />
          </RequireAuth>
        }
      />

      {/* Protected routes - AI Assistant as home page */}
      <Route
        path="/"
        element={
          <RequireAuth>
            <MainLayout>
              <AIAssistant />
            </MainLayout>
          </RequireAuth>
        }
      />

      {/* Projects routes */}
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

      {/* Admin-only routes */}
      <Route
        path="/users"
        element={
          <RequireAuth>
            <RequireRole allowedRoles={[ROLES.ADMIN]}>
              <MainLayout>
                <UserList />
              </MainLayout>
            </RequireRole>
          </RequireAuth>
        }
      />

      <Route
        path="/settings"
        element={
          <RequireAuth>
            <RequireRole allowedRoles={[ROLES.ADMIN]}>
              <MainLayout>
                <div>Settings - Admin Only</div>
              </MainLayout>
            </RequireRole>
          </RequireAuth>
        }
      />

      {/* Profile - accessible by all authenticated users */}
      <Route
        path="/profile"
        element={
          <RequireAuth>
            <RequireRole allowedRoles={[ROLES.ADMIN, ROLES.USER]}>
              <MainLayout>
                <div>Profile Page</div>
              </MainLayout>
            </RequireRole>
          </RequireAuth>
        }
      />

      {/* Redirect unknown routes to home */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
