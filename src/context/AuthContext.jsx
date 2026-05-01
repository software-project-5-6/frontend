import React, { createContext, useContext, useState, useEffect } from "react";
import {
  getCurrentUser,
  fetchAuthSession,
  fetchUserAttributes,
} from "aws-amplify/auth";
import { useLocation } from "react-router-dom";
import { getAllUsers } from "../api/userApi";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const location = useLocation();
  const [user, setUser] = useState(null);
  const [dbUser, setDbUser] = useState(null);
  const [userRole, setUserRole] = useState(null);
  const [userAttributes, setUserAttributes] = useState(null);
  const [authTime, setAuthTime] = useState(null); // ADDED THIS STATE
  const [loading, setLoading] = useState(true);
  const [hasCheckedAuth, setHasCheckedAuth] = useState(false); // Prevent rechecking

  useEffect(() => {
    const publicRoutes = [
      "/login",
      "/signup",
      "/forgot-password",
      "/confirm-signup",
    ];

    const isPublicRoute = publicRoutes.some((route) =>
      location.pathname.startsWith(route)
    );

    if (!isPublicRoute && !hasCheckedAuth) {
      checkAuth().finally(() => {
        setHasCheckedAuth(true);
      });
    } else if (isPublicRoute) {
      setLoading(false); // Avoid blocking login/signup with spinner
    }
  }, []); 

  const checkAuth = async () => {
    try {
      const currentUser = await getCurrentUser();
      const session = await fetchAuthSession();
      const attributes = await fetchUserAttributes();

      const idToken = session.tokens?.idToken;
      const role =
        idToken?.payload["custom:role"] ||
        idToken?.payload["cognito:groups"]?.[0] ||
        "APP_USER";

      // EXTRACT THE EXACT LOGIN TIME FROM COGNITO
      const loginTime = idToken?.payload?.auth_time 
        ? new Date(idToken.payload.auth_time * 1000).toISOString() 
        : null;

      let databaseUser = null;
      try {
        if (attributes?.email) {
          if (role === "APP_ADMIN") {
            const allUsers = await getAllUsers();
            databaseUser = allUsers.find(u => u.email === attributes.email) || null;
          }
        }
      } catch (dbError) {
        console.warn("Could not fetch database user profile.");
      }

      setUser(currentUser);
      setDbUser(databaseUser);
      setUserRole(role);
      setUserAttributes(attributes);
      setAuthTime(loginTime); // SAVE THE LOGIN TIME

    } catch (error) {
      if (error.name !== "UserUnAuthenticatedException") {
        console.error("Auth check failed:", error);
      }
      setUser(null);
      setDbUser(null);
      setUserRole(null);
      setUserAttributes(null);
      setAuthTime(null);
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
    authTime, // EXPORT IT SO PROFILEPAGE CAN USE IT
    loading,
    hasRole,
    hasAnyRole,
    isAdmin,
    isUser,
    refreshAuth: checkAuth, // Allow manual refresh (e.g., after login)
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