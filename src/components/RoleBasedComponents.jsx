import React from "react";
import { useAuth } from "../context/AuthContext";

/**
 * Show content only if user has the required role
 * Usage: <ShowForRole role="APP_ADMIN">Admin Content</ShowForRole>
 */
export const ShowForRole = ({ role, children }) => {
  const { userRole } = useAuth();
  return userRole === role ? <>{children}</> : null;
};

/**
 * Show content if user has any of the specified roles
 * Usage: <ShowForRoles roles={["APP_ADMIN", "APP_USER"]}>Content</ShowForRoles>
 */
export const ShowForRoles = ({ roles, children }) => {
  const { userRole } = useAuth();
  return roles.includes(userRole) ? <>{children}</> : null;
};

/**
 * Show content only for admins
 * Usage: <ShowForAdmin>Admin Only Content</ShowForAdmin>
 */
export const ShowForAdmin = ({ children }) => {
  const { isAdmin } = useAuth();
  return isAdmin() ? <>{children}</> : null;
};

/**
 * Show content only for regular users (not admins)
 * Usage: <ShowForUser>User Only Content</ShowForUser>
 */
export const ShowForUser = ({ children }) => {
  const { isUser } = useAuth();
  return isUser() ? <>{children}</> : null;
};

/**
 * Hide content if user has the specified role
 * Usage: <HideForRole role="APP_USER">Hidden for users</HideForRole>
 */
export const HideForRole = ({ role, children }) => {
  const { userRole } = useAuth();
  return userRole !== role ? <>{children}</> : null;
};

/**
 * Hide content for admins
 * Usage: <HideForAdmin>Not visible to admins</HideForAdmin>
 */
export const HideForAdmin = ({ children }) => {
  const { isAdmin } = useAuth();
  return !isAdmin() ? <>{children}</> : null;
};
