import React, { createContext, useContext, useState, useEffect } from "react";
import {
  getCurrentUser,
  fetchAuthSession,
  fetchUserAttributes,
} from "aws-amplify/auth";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [userRole, setUserRole] = useState(null);
  const [userAttributes, setUserAttributes] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const currentUser = await getCurrentUser();
      const session = await fetchAuthSession();
      const attributes = await fetchUserAttributes();

      // Extract role from JWT token
      const idToken = session.tokens?.idToken;
      const role =
        idToken?.payload["custom:role"] ||
        idToken?.payload["cognito:groups"]?.[0] ||
        "APP_USER";

      setUser(currentUser);
      setUserRole(role);
      setUserAttributes(attributes);
    } catch (error) {
      console.error("Auth check failed:", error);
      setUser(null);
      setUserRole(null);
      setUserAttributes(null);
    } finally {
      setLoading(false);
    }
  };

  const hasRole = (requiredRole) => {
    return userRole === requiredRole;
  };

  const hasAnyRole = (roles) => {
    return roles.includes(userRole);
  };

  const isAdmin = () => {
    return userRole === "APP_ADMIN";
  };

  const isUser = () => {
    return userRole === "APP_USER";
  };

  const value = {
    user,
    userRole,
    userAttributes,
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
