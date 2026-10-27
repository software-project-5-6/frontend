import React, { createContext, useContext, useState, useEffect } from "react";
import { supabase } from "../supabaseClient";
import { useLocation } from "react-router-dom";
import api from "../api/axiosConfig";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const location = useLocation();
  const [user, setUser] = useState(null);
  const [dbUser, setDbUser] = useState(null);
  const [userRole, setUserRole] = useState(null);
  const [userAttributes, setUserAttributes] = useState(null);
  const [authTime, setAuthTime] = useState(null);
  const [loading, setLoading] = useState(true);
  const [hasCheckedAuth, setHasCheckedAuth] = useState(false);

  useEffect(() => {
    const publicRoutes = [
      "/login",
      "/signup",
      "/forgot-password",
      "/confirm-signup",
      "/reset-password",
    ];

    const isPublicRoute = publicRoutes.some((route) =>
      location.pathname.startsWith(route)
    );

    if (!isPublicRoute && !hasCheckedAuth) {
      checkAuth().finally(() => setHasCheckedAuth(true));
    } else if (isPublicRoute) {
      setLoading(false);
    }
  }, []);

  const checkAuth = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        setUser(null);
        setDbUser(null);
        setUserRole(null);
        setUserAttributes(null);
        setAuthTime(null);
        return { role: null };
      }

      const { data: { user: supabaseUser } } = await supabase.auth.getUser();

      setUser(supabaseUser);
      setUserAttributes({
        sub: supabaseUser.id,
        name: supabaseUser.user_metadata?.full_name || supabaseUser.email,
        email: supabaseUser.email,
      });

      const loginTime =
        supabaseUser.last_sign_in_at || new Date().toISOString();
      setAuthTime(loginTime);

      let role = "APP_USER";
      let databaseUser = null;
      try {
        const { data: profile } = await api.get("/users/me");
        role = profile?.globalRole || "APP_USER";
        databaseUser = profile || null;
        console.debug("[AuthContext] resolved role from backend:", role);
      } catch (err) {
        console.error(
          "[AuthContext] /users/me failed — role defaults to APP_USER:",
          err?.response?.status,
          err?.message
        );
        databaseUser = {
          fullName:
            supabaseUser.user_metadata?.full_name || supabaseUser.email,
          email: supabaseUser.email,
          globalRole: "APP_USER",
          createdAt: supabaseUser.created_at,
        };
      }
      setDbUser(databaseUser);
      setUserRole(role);
      return { role };
    } catch (error) {
      console.error("Auth check failed:", error);
      setUser(null);
      setDbUser(null);
      setUserRole(null);
      setUserAttributes(null);
      setAuthTime(null);
      return { role: null };
    } finally {
      setLoading(false);
    }
  };

  const hasRole = (requiredRole) => userRole === requiredRole;
  const hasAnyRole = (roles) => roles.includes(userRole);
  const isAdmin = () => userRole === "APP_ADMIN";
  const isUser = () => userRole === "APP_USER";

  const value = {
    user,
    dbUser,
    userRole,
    userAttributes,
    authTime,
    loading,
    hasRole,
    hasAnyRole,
    isAdmin,
    isUser,
    refreshAuth: checkAuth,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
